import { MODELS } from "~/models/initModels";
import { Op } from "sequelize";
import { doctorModel } from "~/models/doctorModel";
import { comparePassword, hashPassword } from "~/utils/crypto";
import ApiError from "~/utils/ApiError";
const createStaff = async (staffData) => {
  try {
    const existingUser = await MODELS.UserModel.findOne({
      where: {
        [Op.or]: [{ username: staffData.username }, { email: staffData.email }],
      },
    });

    if (existingUser) {
      throw new ApiError(
        409,
        "User with this username or email already exists"
      );
    }

    staffData.password = hashPassword(staffData.password);

    const latestUser = await MODELS.UserModel.findOne({
      order: [["user_id", "DESC"]],
    });

    let nextId = 1;
    if (latestUser) {
      const latestId = parseInt(latestUser.user_id.substring(2));
      nextId = latestId + 1;
    }
    const userId = `US${nextId.toString().padStart(6, "0")}`;
    const now = new Date();

    // Tạo người dùng mới
    const newUser = await MODELS.UserModel.create({
      user_id: userId,
      first_name: staffData.first_name,
      last_name: staffData.last_name,
      username: staffData.username,
      email: staffData.email,
      password: staffData.password,
      gender: staffData.gender,
      phone: staffData.phone,
      role: staffData.role,
      status: 1,
      birthday: staffData.birthday || null,
      created_at: now,
      updated_at: now,
    });

    if (staffData.role === "doctor") {
      const latestDoctor = await MODELS.DoctorModel.findOne({
        order: [["doctor_id", "DESC"]],
      });

      let doctorId = "DR000001";
      if (latestDoctor && latestDoctor.doctor_id) {
        try {
          const matches = latestDoctor.doctor_id.match(/^DR(\d+)$/);
          if (matches && matches[1]) {
            const latestId = parseInt(matches[1]);
            doctorId = `DR${(latestId + 1).toString().padStart(6, "0")}`;
          }
        } catch (parseError) {
          console.warn(
            "Error parsing doctor ID, using default:",
            parseError.message
          );
        }
      }

      try {
        const doctorData = {
          doctor_id: doctorId,
          user_id: userId,
          first_name: staffData.first_name,
          last_name: staffData.last_name,
          bio: staffData.bio || "",
          experience_year: parseInt(staffData.experience_year || "0"),
        };

        await MODELS.DoctorModel.create(doctorData);

        if (
          (staffData.certificate && staffData.certificate.length > 0) ||
          staffData.specialization
        ) {
          const Certificate = doctorModel.initCertificateModel();

          const latestCertificate = await Certificate.findOne({
            order: [["certificates_id", "DESC"]],
          });

          let certIdCounter = 1;
          if (latestCertificate && latestCertificate.certificates_id) {
            try {
              const matches =
                latestCertificate.certificates_id.match(/^CT(\d+)$/);
              if (matches && matches[1]) {
                certIdCounter = parseInt(matches[1]) + 1;
              }
            } catch (parseError) {
              console.warn(
                "Error parsing certificate ID, using default:",
                parseError.message
              );
            }
          }

          if (staffData.certificate && Array.isArray(staffData.certificate)) {
            for (let i = 0; i < staffData.certificate.length; i++) {
              const currentCertId = `CT${(certIdCounter + i)
                .toString()
                .padStart(6, "0")}`;

              await Certificate.create({
                certificates_id: currentCertId,
                doctor_id: doctorId,
                certificate: staffData.certificate[i],
                specialization: staffData.specialization || null,
              });

              console.log(
                `Created certificate ${currentCertId} for doctor ${doctorId}`
              );
            }
          } else if (staffData.specialization) {
            const certId = `CT${certIdCounter.toString().padStart(6, "0")}`;

            await Certificate.create({
              certificates_id: certId,
              doctor_id: doctorId,
              certificate: "Chuyên khoa",
              specialization: staffData.specialization,
            });

            console.log(
              `Created default certificate ${certId} for doctor ${doctorId}`
            );
          }
        }

        console.log(`Doctor created successfully with ID: ${doctorId}`);

        return {
          user_id: newUser.user_id,
          username: newUser.username,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          doctor_id: doctorId,
          experience_year: parseInt(staffData.experience_year || "0"),
          bio: staffData.bio || "",
          specialization: staffData.specialization || null,
          certificate: staffData.certificate || [],
        };
      } catch (doctorError) {
        console.error("Error creating doctor:", doctorError);
        // Nếu không tạo được bác sĩ, xóa user đã tạo
        await MODELS.UserModel.destroy({ where: { user_id: userId } });
        throw new ApiError(
          500,
          `Failed to create doctor record: ${doctorError.message}`
        );
      }
    }

    return {
      user_id: newUser.user_id,
      username: newUser.username,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
    };
  } catch (error) {
    console.error("Error in createStaff:", error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, `Failed to create staff: ${error.message}`);
  }
};

const deleteStaff = async (staff_id) => {
  try {
    const staff = await MODELS.UserModel.findOne({
      where: { user_id: staff_id },
    });

    if (!staff) {
      throw new ApiError(404, "Staff not found");
    }

    // Cập nhật status về 0 (đã xóa)
    await MODELS.UserModel.update(
      { status: 0 },
      { where: { user_id: staff_id } }
    );

    console.log(`Staff with ID ${staff_id} has been deleted successfully`);
    return {
      staff: staff,
      message: "Staff deleted successfully",
    };
  } catch (error) {
    console.error("Error in deleteStaff:", error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, `Failed to delete staff: ${error.message}`);
  }
};
export const adminService = {
  createStaff,
};
