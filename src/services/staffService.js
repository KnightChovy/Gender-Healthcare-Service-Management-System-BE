import { MODELS } from '~/models/initModels'
import ApiError from '~/utils/ApiError'

const staffUpdateOrder = async (order_id) => {
  try {
    if (!order_id) {
      throw ApiError(404, 'Không tìm thấy dữ liệu')
    }
    const order = await MODELS.OrderModel.findOne({ where: { order_id: order_id } })
    if (!order) {
      throw ApiError(404, 'Không tìm thấy đơn hàng')
    }
    const updatedCount = await MODELS.OrderModel.update({ order_status: 'paid' }, { where: { order_id: order_id, order_status: 'pending' } })
    if (updatedCount[0] === 0) {
      throw ApiError(404, 'Không cập nhật đơn hàng')
    }
    const updatedOrder = await MODELS.OrderModel.findOne({
      where: { order_id: order_id }
    });
    return updatedOrder
  } catch (error) {
    throw ApiError(500, 'Lỗi khi cập nhập đơn hàng')
  }
}

const getStaffProfile = async (staffId) => {
  try {
    if (!staffId) {
      throw ApiError(400, 'Thiếu thông tin nhân viên')
    }

    const staff = await MODELS.UserModel.findOne({
      where: { user_id: staffId },
      attributes: { exclude: ['password'] }
    })

    if (!staff) {
      throw ApiError(404, 'Không tìm thấy thông tin nhân viên')
    }

    return staff
  } catch (error) {
    throw ApiError(500, 'Lỗi khi lấy thông tin nhân viên')
  }
}

const updateStaffProfile = async (staffId, updateData) => {
  try {
    if (!staffId) {
      throw ApiError(400, 'Thiếu thông tin nhân viên')
    }

    const staff = await MODELS.UserModel.findOne({
      where: { user_id: staffId }
    })

    if (!staff) {
      throw ApiError(404, 'Không tìm thấy thông tin nhân viên')
    }

    // Remove sensitive fields from update data
    const { password, role, ...safeUpdateData } = updateData

    const updatedStaff = await MODELS.UserModel.update(safeUpdateData, {
      where: { user_id: staffId },
      returning: true
    })

    const updatedProfile = await MODELS.UserModel.findOne({
      where: { user_id: staffId },
      attributes: { exclude: ['password'] }
    })

    return updatedProfile
  } catch (error) {
    throw ApiError(500, 'Lỗi khi cập nhật thông tin nhân viên')
  }
}

const getPendingOrders = async () => {
  try {
    const pendingOrders = await MODELS.OrderModel.findAll({
      where: { order_status: 'pending' },
      include: [
        {
          model: MODELS.UserModel,
          as: 'user',
          attributes: ['user_id', 'first_name', 'last_name', 'email', 'phone']
        },
        {
          model: MODELS.OrderDetailModel,
          as: 'orderDetails',
          include: [
            {
              model: MODELS.ServiceTestModel,
              as: 'serviceTest'
            }
          ]
        }
      ],
      order: [['created_at', 'DESC']]
    })

    return pendingOrders
  } catch (error) {
    throw ApiError(500, 'Lỗi khi lấy danh sách đơn hàng chờ xử lý')
  }
}

const getOrderDetails = async (orderId) => {
  try {
    if (!orderId) {
      throw ApiError(400, 'Thiếu mã đơn hàng')
    }

    const orderDetails = await MODELS.OrderModel.findOne({
      where: { order_id: orderId },
      include: [
        {
          model: MODELS.UserModel,
          as: 'user',
          attributes: ['user_id', 'first_name', 'last_name', 'email', 'phone']
        },
        {
          model: MODELS.OrderDetailModel,
          as: 'orderDetails',
          include: [
            {
              model: MODELS.ServiceTestModel,
              as: 'serviceTest'
            }
          ]
        }
      ]
    })

    if (!orderDetails) {
      throw ApiError(404, 'Không tìm thấy đơn hàng')
    }

    return orderDetails
  } catch (error) {
    throw ApiError(500, 'Lỗi khi lấy chi tiết đơn hàng')
  }
}

const updateOrderStatus = async (orderId, status) => {
  try {
    if (!orderId) {
      throw ApiError(400, 'Thiếu mã đơn hàng')
    }

    if (!status) {
      throw ApiError(400, 'Thiếu trạng thái đơn hàng')
    }

    const validStatuses = ['pending', 'paid', 'processing', 'completed', 'cancelled']
    if (!validStatuses.includes(status)) {
      throw ApiError(400, 'Trạng thái đơn hàng không hợp lệ')
    }

    const order = await MODELS.OrderModel.findOne({
      where: { order_id: orderId }
    })

    if (!order) {
      throw ApiError(404, 'Không tìm thấy đơn hàng')
    }

    await MODELS.OrderModel.update(
      { order_status: status },
      { where: { order_id: orderId } }
    )

    const updatedOrder = await MODELS.OrderModel.findOne({
      where: { order_id: orderId },
      include: [
        {
          model: MODELS.UserModel,
          as: 'user',
          attributes: ['user_id', 'first_name', 'last_name', 'email', 'phone']
        },
        {
          model: MODELS.OrderDetailModel,
          as: 'orderDetails',
          include: [
            {
              model: MODELS.ServiceTestModel,
              as: 'serviceTest'
            }
          ]
        }
      ]
    })

    return updatedOrder
  } catch (error) {
    throw ApiError(500, 'Lỗi khi cập nhật trạng thái đơn hàng')
  }
}

const completePaidOrder = async (orderId) => {
  try {
    if (!orderId) {
      throw ApiError(400, 'Thiếu mã đơn hàng')
    }

    const order = await MODELS.OrderModel.findOne({
      where: { order_id: orderId }
    })

    if (!order) {
      throw ApiError(404, 'Không tìm thấy đơn hàng')
    }

    if (order.order_status !== 'paid') {
      throw ApiError(400, 'Chỉ có thể hoàn thành đơn hàng đã thanh toán')
    }

    const result = await MODELS.OrderModel.update(
      { order_status: 'completed' },
      { where: { order_id: orderId, order_status: 'paid' } }
    )

    // const updatedOrder = await MODELS.OrderModel.findOne({
    //   where: { order_id: orderId },
    //   include: [
    //     {
    //       model: MODELS.UserModel,
    //       as: 'user',
    //       attributes: ['user_id', 'first_name', 'last_name', 'email', 'phone']
    //     },
    //     {
    //       model: MODELS.OrderDetailModel,
    //       as: 'orderDetails',
    //       include: [
    //         {
    //           model: MODELS.ServiceTestModel,
    //           as: 'serviceTest'
    //         }
    //       ]
    //     }
    //   ]
    // })

    return result
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw ApiError(500, 'Lỗi khi hoàn thành đơn hàng')
  }
}

const cancelPendingOrder = async (orderId) => {
  try {
    if (!orderId) {
      throw ApiError(400, 'Thiếu mã đơn hàng')
    }

    const order = await MODELS.OrderModel.findOne({
      where: { order_id: orderId }
    })

    if (!order) {
      throw ApiError(404, 'Không tìm thấy đơn hàng')
    }

    if (order.order_status !== 'pending') {
      throw ApiError(400, 'Chỉ có thể hủy đơn hàng đang chờ xử lý')
    }

    const result = await MODELS.OrderModel.update(
      { order_status: 'cancelled' },
      { where: { order_id: orderId, order_status: 'pending' } }
    )

    // const updatedOrder = await MODELS.OrderModel.findOne({
    //   where: { order_id: orderId },
    //   include: [
    //     {
    //       model: MODELS.UserModel,
    //       as: 'user',
    //       attributes: ['user_id', 'first_name', 'last_name', 'email', 'phone']
    //     },
    //     {
    //       model: MODELS.OrderDetailModel,
    //       as: 'orderDetails',
    //       include: [
    //         {
    //           model: MODELS.ServiceTestModel,
    //           as: 'serviceTest'
    //         }
    //       ]
    //     }
    //   ]
    // })

    return result
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw ApiError(500, 'Lỗi khi hủy đơn hàng')
  }
}

export const staffService = {
  staffUpdateOrder,
  getStaffProfile,
  updateStaffProfile,
  getPendingOrders,
  getOrderDetails,
  updateOrderStatus,
  completePaidOrder,
  cancelPendingOrder
}