import ApiError from "~/utils/ApiError";
import { comparePassword, hashPassword } from "~/utils/crypto";
import { StatusCodes } from "http-status-codes";
import { MODELS } from "~/models/initModels";

const getAllUsers = async () => {
  try {
    const findAllUsers = await MODELS.UserModel.findAll();
    if (!findAllUsers) {
      throw new ApiError(404, "No users found");
    }
    return findAllUsers;
  } catch (error) {
    throw new ApiError(500, "Failed to retrieve users");
  }
};

const createUser = async (userData) => {
  try {
    const existingUser = await MODELS.UserModel.findOne({
      where: { username: userData.username },
    });
    if (existingUser) {
      throw new ApiError(409, "User with this username already exists");
    }
    userData.password = hashPassword(userData.password);

    // Generate user_id if not provided
    if (!userData.user_id) {
      const latestUser = await MODELS.UserModel.findOne({
        order: [["user_id", "DESC"]],
      });
      let nextId = 1;
      if (latestUser) {
        const latestId = parseInt(latestUser.user_id.substring(2));
        nextId = latestId + 1;
      }
      userData.user_id = `US${nextId.toString().padStart(6, "0")}`;
    }

    const now = new Date();
    userData.created_at = now;
    userData.updated_at = now;
    if (!userData.role) userData.role = "user";
    if (!userData.status) userData.status = 1;

    const newUser = await MODELS.UserModel.create(userData);
    if (!newUser) {
      throw new ApiError(500, "Failed to create user");
    }
    return newUser;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Failed to create user");
  }
};

const updateUser = async (userId, userData) => {
  try {
    const existingUser = await MODELS.UserModel.findOne({
      where: { user_id: userId },
    });
    if (!existingUser) {
      throw new ApiError(404, "Không tìm thấy người dùng");
    }
    if (userData.password) {
      delete userData.password;
    }
    userData.updated_at = new Date();
    await MODELS.UserModel.update(userData, { where: { user_id: userId } });
    const updatedUser = await MODELS.UserModel.findOne({
      where: { user_id: userId },
    });
    if (!updatedUser) {
      throw new ApiError(500, "Cập nhật thông tin không thành công");
    }
    console.log("updatee user", updatedUser);
    return updatedUser;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Cập nhật thông tin không thành công");
  }
};

const changePassword = async (userId, { currentPassword, newPassword }) => {
  try {
    const user = await MODELS.UserModel.findOne({ where: { user_id: userId } });
    if (!user) {
      throw new ApiError(404, "Không tìm thấy người dùng");
    }
    const isMatch = comparePassword(currentPassword, user.password);
    if (!isMatch) {
      throw new ApiError(400, "Mật khẩu hiện tại không đúng");
    }
    const hashedPassword = hashPassword(newPassword);
    await MODELS.UserModel.update(
      { password: hashedPassword, updated_at: new Date() },
      { where: { user_id: userId } }
    );
    return true;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Đổi mật khẩu không thành công");
  }
};

const getUserProfile = async (userId) => {
  try {
    console.log("Finding user with ID:", userId);
    const user = await MODELS.UserModel.findOne({ where: { user_id: userId } });
    console.log("User found:", user ? "Yes" : "No");
    if (!user) {
      throw {
        statusCode: StatusCodes.NOT_FOUND,
        message: `Không tìm thấy thông tin người dùng với ID: ${userId}`,
      };
    }
    const userProfile = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      birthday: user.birthday,
      avatar: user.avatar,
      address: user.address,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      status: user.status,
    };
    return userProfile;
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    throw error.statusCode
      ? error
      : {
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          message: "Lỗi khi lấy thông tin người dùng: " + (error.message || ""),
        };
  }
};

const getServicesByUserId = async (user_id) => {
  try {
    const order = await MODELS.OrderModel.findAll({
      where: { user_id: user_id },
    });
    if (!order) {
      throw new ApiError(404, "Không tìm thấy dịch vụ");
    }
    return order;
  } catch (error) {
    throw new ApiError(500, "Lỗi khi lấy dịch vụ");
  }
};

const cancelAppointment = async (appointmentId, userId) => {
  try {
    const appointment = await MODELS.AppointmentModel.findOne({
      where: {
        appointment_id: appointmentId,
        user_id: userId,
      },
    });

    if (!appointment) {
      throw new ApiError(
        404,
        "Không tìm thấy cuộc hẹn hoặc bạn không có quyền hủy cuộc hẹn này"
      );
    }

    if (
      appointment.status === "completed" ||
      appointment.status === "rejected"
    ) {
      throw new ApiError(
        400,
        "Không thể hủy cuộc hẹn đã hoàn thành hoặc đã bị từ chối"
      );
    }

    await appointment.update({
      status: "rejected",
      updated_at: new Date(),
    });

    if (appointment.timeslot_id) {
      await MODELS.TimeslotModel.update(
        { status: "available" },
        {
          where: { timeslot_id: appointment.timeslot_id },
        }
      );
    }

    return {
      appointment_id: appointmentId,
      status: "rejected",
      cancelled_at: new Date(),
    };
  } catch (error) {
    console.error("Error in cancelAppointment service:", error);
    throw error;
  }
};

const getUserTestAppointments = async (userId) => {
  try {
    if (!userId) {
      throw new ApiError(400, "User ID is required");
    }

    const user = await MODELS.UserModel.findOne({
      where: { user_id: userId },
      attributes: ["user_id", "first_name", "last_name", "email", "phone"],
    });

    if (!user) {
      throw new ApiError(404, `Không tìm thấy người dùng với ID: ${userId}`);
    }

    const orders = await MODELS.OrderModel.findAll({
      where: { user_id: userId },
      order: [["created_at", "DESC"]],
    });

    if (!orders || orders.length === 0) {
      return {
        user,
        orders: [],
        totalAmount: 0,
      };
    }

    const ordersWithDetails = [];
    let totalAmount = 0;

    for (const order of orders) {
      const orderDetails = await MODELS.OrderDetailModel.findAll({
        where: { order_id: order.order_id },
        include: [
          {
            model: MODELS.ServiceTestModel,
            as: "service",
            attributes: [
              "service_id",
              "name",
              "price",
              "description",
              "preparation_guidelines",
            ],
          },
        ],
      });

      let orderTotal = 0;
      orderDetails.forEach((detail) => {
        if (detail.service?.price) {
          const price = parseFloat(detail.service.price) || 0;
          orderTotal += price;
          totalAmount += price;
        }
      });

      ordersWithDetails.push({
        order: {
          ...order.toJSON(),
          total_amount: orderTotal,
        },
        services: orderDetails.map((detail) => detail.service),
      });
    }

    return {
      user,
      orders: ordersWithDetails,
      totalAmount,
    };
  } catch (error) {
    console.error("Error in getUserTestAppointments service:", error);
    throw error;
  }
};

const getAllOrders = async () => {
  try {
    const orders = await MODELS.OrderModel.findAll({
      order: [["created_at", "DESC"]],
      include: [
        {
          model: MODELS.UserModel,
          as: "user",
          attributes: ["user_id", "first_name", "last_name", "email", "phone"],
        },
      ],
    });

    const ordersWithDetails = [];
    let totalAmount = 0;

    for (const order of orders) {
      const orderDetails = await MODELS.OrderDetailModel.findAll({
        where: { order_id: order.order_id },
        attributes: ["order_detail_id", "exam_date", "exam_time"],
        include: [
          {
            model: MODELS.ServiceTestModel,
            as: "service",
            attributes: [
              "service_id",
              "name",
              "price",
              "description",
              "result_wait_time",
            ],
          },
        ],
      });

      let orderTotal = 0;
      orderDetails.forEach((detail) => {
        if (detail.service?.price) {
          const price = parseFloat(detail.service.price) || 0;
          orderTotal += price;
          totalAmount += price;
        }
      });

      ordersWithDetails.push({
        order: {
          ...order.toJSON(),
          total_amount: orderTotal,
        },
        details: orderDetails.map((detail) => ({
          order_detail_id: detail.order_detail_id,
          exam_date: detail.exam_date,
          exam_time: detail.exam_time,
          service: detail.service,
        })),
        services: orderDetails.map((detail) => detail.service),
      });
    }

    return {
      orders: ordersWithDetails,
      total_orders: orders.length,
      total_amount: totalAmount,
    };
  } catch (error) {
    console.error("Error in getAllOrders service:", error);
    throw error;
  }
};

const getTestResults = async (userId, orderId = null) => {
  try {
    const user = await MODELS.UserModel.findOne({
      where: { user_id: userId },
      attributes: ["user_id", "first_name", "last_name", "email", "phone"],
    });

    if (!user) {
      throw new ApiError(404, `Không tìm thấy người dùng với ID: ${userId}`);
    }

    const whereClause = { user_id: userId };
    if (orderId) {
      whereClause.order_id = orderId;
    }

    const orders = await MODELS.OrderModel.findAll({
      where: whereClause,
      order: [["created_at", "DESC"]],
    });

    if (!orders || orders.length === 0) {
      return {
        user,
        results: [],
      };
    }

    const testResults = [];

    for (const order of orders) {
      const orderDetails = await MODELS.OrderDetailModel.findAll({
        where: { order_id: order.order_id },
        attributes: [
          "order_detail_id",
          "exam_date",
          "exam_time",
          "testresult_id",
        ],
        include: [
          {
            model: MODELS.ServiceTestModel,
            as: "service",
            attributes: [
              "service_id",
              "name",
              "description",
              "result_wait_time",
            ],
          },
        ],
      });

      for (const detail of orderDetails) {
        if (detail.testresult_id) {
          try {
            const testResult = await MODELS.TestResultMySqlModel.findOne({
              where: { testresult_id: detail.testresult_id },
              attributes: [
                "testresult_id",
                "result",
                "conclusion",
                "normal_range",
                "recommendations",
                "created_at",
              ],
            });

            if (testResult) {
              testResults.push({
                order_id: order.order_id,
                order_detail_id: detail.order_detail_id,
                testresult_id: detail.testresult_id,
                service: detail.service,
                exam_date: detail.exam_date,
                exam_time: detail.exam_time,
                result: {
                  ...testResult.toJSON(),
                },
                created_at: order.created_at,
              });
            }
          } catch (resultError) {
            console.error(
              `Error fetching test result ${detail.testresult_id}:`,
              resultError
            );
          }
        }
      }
    }

    return {
      user,
      results: testResults,
    };
  } catch (error) {
    console.error("Error in getTestResults service:", error);
    throw error instanceof ApiError
      ? error
      : new ApiError(500, "Lỗi khi lấy kết quả xét nghiệm");
  }
};

const getUserById = async (userId) => {
  try {
    console.log("Finding user with ID:", userId);
    const user = await MODELS.UserModel.findOne({ where: { user_id: userId } });
    console.log("User found:", user ? "Yes" : "No");
    if (!user) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        `Không tìm thấy thông tin người dùng với ID: ${userId}`
      );
    }
    return user;
  } catch (error) {
    console.error("Error in getUserById:", error);
    throw error instanceof ApiError
      ? error
      : new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Lỗi khi lấy thông tin người dùng: " + (error.message || "")
        );
  }
};

export const userService = {
  getAllUsers,
  createUser,
  updateUser,
  changePassword,
  getUserProfile,
  createStaff,
  getServicesByUserId,
  cancelAppointment,
  getUserTestAppointments,
  getAllOrders,
  getTestResults,
  getUserById,
};
