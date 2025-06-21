/**
 *
 * @swagger
 * /v1/auth/login:
 *   post:
 *     summary: Login to the system
 *     description: Authenticate user and return access & refresh tokens
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: User's username
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     tokens:
 *                       type: object
 *                       properties:
 *                         accessToken:
 *                           type: string
 *                         refreshToken:
 *                           type: string
 *                     user:
 *                       type: object
 *       401:
 *         description: Login failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid credentials
 *                 error:
 *                   type: string
 */

/**
 * @swagger
 * /v1/auth/logout:
 *   post:
 *     summary: Logout from the system
 *     description: Invalidates the user's session by deleting their refresh token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         description: Access token received during login
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logout successful
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *                 error:
 *                   type: string
 *                   example: No token provided or token is invalid
 */

/**
 * @swagger
 * /v1/users/{id}:
 *   patch:
 *     summary: Change user password
 *     description: Allow authenticated users to change their password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         description: Access token for authentication
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirm_Password
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: Current password of the user
 *               newPassword:
 *                 type: string
 *                 description: New password (minimum 6 characters)
 *                 minLength: 6
 *                 maxLength: 50
 *               confirm_Password:
 *                 type: string
 *                 description: Confirm new password (must match newPassword)
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password changed successfully
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid data
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example:
 *                     - "Current password is required"
 *                     - "New password must be at least 6 characters"
 *                     - "Passwords do not match"
 *       401:
 *         description: Unauthorized - Invalid token or incorrect current password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *                 error:
 *                   type: string
 *                   example: Current password is incorrect
 */

/**
 * @swagger
 * /v1/doctors:
 *   get:
 *     summary: Get all doctors
 *     description: Returns a list of all doctors with their certificate information
 *     tags: [Doctors]
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of doctors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 listAllDoctors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       doctor_id:
 *                         type: string
 *                         example: "DR000001"
 *                       user_id:
 *                         type: string
 *                         example: "US000005"
 *                       first_name:
 *                         type: string
 *                         example: "Khiêm"
 *                       last_name:
 *                         type: string
 *                         example: "Nguyễn Bỉnh"
 *                       bio:
 *                         type: string
 *                         example: "Internal medicine specialist"
 *                       experience_year:
 *                         type: integer
 *                         example: 5
 *                       certificates:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             certificates_id:
 *                               type: string
 *                               example: "CT000001"
 *                             certificate:
 *                               type: string
 *                               example: "Medical Practice License"
 *                             specialization:
 *                               type: string
 *                               example: "Internal Medicine"
 *       204:
 *         description: No doctors found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "No doctors found"
 *                 listAllDoctors:
 *                   type: array
 *                   example: []
 *       404:
 *         description: Resource not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Doctor information not found"
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Access denied"
 */

/**
 * @swagger
 * /v1/users/profile/me:
 *   get:
 *     summary: Get current user profile
 *     description: Retrieves the profile information of the currently authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         description: Access token received during login
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 userProfile:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                       example: "US000025"
 *                     username:
 *                       type: string
 *                       example: "binhkhiem"
 *                     email:
 *                       type: string
 *                       example: "nguyenbinhkhiem@example.com"
 *                     phone:
 *                       type: string
 *                       example: "0987654321"
 *                     gender:
 *                       type: string
 *                       example: "male"
 *                     birthday:
 *                       type: string
 *                       format: date
 *                       example: "1990-05-15"
 *                     avatar:
 *                       type: string
 *                       example: "https://example.com/avatars/binhkhiem.jpg"
 *                     address:
 *                       type: string
 *                       example: "123 Nguyen Hue Street, District 1, Ho Chi Minh City"
 *                     first_name:
 *                       type: string
 *                       example: "Bỉnh Khiêm"
 *                     last_name:
 *                       type: string
 *                       example: "Nguyễn"
 *                     role:
 *                       type: string
 *                       example: "customer"
 *                     status:
 *                       type: integer
 *                       example: 1
 *       401:
 *         description: Unauthorized - Invalid token or user not logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *                 error:
 *                   type: string
 *                   example: "No token provided or token is invalid"
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "User profile not found"
 */

/**
 * @swagger
 * /v1/doctors/schedule:
 *   post:
 *     summary: Tạo lịch làm việc cho bác sĩ
 *     description: Cho phép bác sĩ chọn ngày và các khung giờ làm việc trong ngày
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         description: Token nhận được khi đăng nhập
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - timeSlots
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Ngày làm việc (YYYY-MM-DD)
 *                 example: "2025-08-15"
 *               timeSlots:
 *                 type: array
 *                 description: Danh sách các khung giờ làm việc
 *                 items:
 *                   type: object
 *                   required:
 *                     - time_start
 *                     - time_end
 *                   properties:
 *                     time_start:
 *                       type: string
 *                       format: time
 *                       description: Giờ bắt đầu (HH:MM:SS)
 *                       example: "08:00:00"
 *                     time_end:
 *                       type: string
 *                       format: time
 *                       description: Giờ kết thúc (HH:MM:SS)
 *                       example: "09:00:00"
 *           example:
 *             date: "2025-08-15"
 *             timeSlots:
 *               - time_start: "08:00:00"
 *                 time_end: "09:00:00"
 *               - time_start: "09:30:00"
 *                 time_end: "10:30:00"
 *               - time_start: "13:00:00"
 *                 time_end: "14:00:00"
 *     responses:
 *       201:
 *         description: Lịch làm việc được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Đã tạo lịch làm việc thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     availability:
 *                       type: object
 *                       properties:
 *                         avail_id:
 *                           type: string
 *                           example: "AV000004"
 *                         date:
 *                           type: string
 *                           example: "2025-08-15"
 *                     timeSlots:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           timeslot_id:
 *                             type: string
 *                             example: "TS000007"
 *                           time_start:
 *                             type: string
 *                             example: "08:00:00"
 *                           time_end:
 *                             type: string
 *                             example: "09:00:00"
 *                           status:
 *                             type: string
 *                             example: "available"
 *       400:
 *         description: Dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Vui lòng cung cấp ngày và khung giờ làm việc"
 *       401:
 *         description: Không được xác thực
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Không được phép truy cập"
 *                 error:
 *                   type: string
 *                   example: "Token không hợp lệ hoặc đã hết hạn"
 *       403:
 *         description: Không có quyền thực hiện
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Bạn không có quyền thực hiện chức năng này"
 *       404:
 *         description: Không tìm thấy thông tin bác sĩ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy thông tin bác sĩ cho tài khoản này"
 *       409:
 *         description: Xung đột dữ liệu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Khung giờ 08:00:00 - 09:00:00 trùng với khung giờ hiện có"
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Lỗi khi tạo lịch làm việc"
 */

/**
 * @swagger
 * /v1/doctors/{doctor_id}/available-timeslots:
 *   get:
 *     summary: Lấy tất cả lịch làm việc của một bác sĩ
 *     description: Trả về danh sách tất cả các ngày làm việc và các khung giờ tương ứng của một bác sĩ, bao gồm các lịch hẹn đã được đặt.
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: doctor_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của bác sĩ
 *     responses:
 *       200:
 *         description: Lấy danh sách lịch làm việc thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     schedules:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: string
 *                             format: date
 *                             example: "2025-06-29"
 *                           dayOfWeek:
 *                             type: string
 *                             example: "Chủ nhật"
 *                           timeslots:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 timeslot_id:
 *                                   type: string
 *                                   example: "TS000010"
 *                                 time_start:
 *                                   type: string
 *                                   example: "08:00:00"
 *                                 time_end:
 *                                   type: string
 *                                   example: "09:00:00"
 *                                 appointment_times:
 *                                   type: array
 *                                   items:
 *                                     type: string
 *                                     example: "08:30:00"
 *                                 is_booked:
 *                                   type: boolean
 *                                   example: true
 */

/**
 * @swagger
 * /v1/appointments:
 *   get:
 *     summary: Lấy danh sách tất cả các cuộc hẹn
 *     description: Trả về danh sách tất cả các cuộc hẹn có trong hệ thống. (Chỉ dành cho Quản lý)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách cuộc hẹn thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Appointment'
 *       403:
 *         description: Không có quyền truy cập
 *
 *   post:
 *     summary: Tạo một cuộc hẹn mới
 *     description: Cho phép người dùng tạo một cuộc hẹn mới cùng với các dịch vụ xét nghiệm đi kèm.
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAppointment'
 *     responses:
 *       201:
 *         description: Tạo cuộc hẹn thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Appointment created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       403:
 *         description: Không có quyền tạo cuộc hẹn
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       properties:
 *         appointment_id:
 *           type: string
 *           example: "AP000001"
 *         user_id:
 *           type: string
 *           example: "US000001"
 *         doctor_id:
 *           type: string
 *           example: "DR000001"
 *         timeslot_id:
 *           type: string
 *           example: "TS000001"
 *         status:
 *           type: string
 *           example: "booked"
 *         rating:
 *           type: integer
 *           nullable: true
 *         feedback:
 *           type: string
 *           nullable: true
 *         descriptions:
 *           type: string
 *           example: "Khám tổng quát"
 *         price_apm:
 *           type: number
 *           format: decimal
 *           example: 750000.00
 *         consultant_type:
 *           type: string
 *           example: "Tư vấn trực tiếp"
 *         profile_id:
 *           type: string
 *           example: "PF000001"
 *         booking:
 *           type: integer
 *           example: 1
 *         appointment_time:
 *           type: string
 *           format: time
 *           example: "09:00:00"
 *
 *     CreateAppointment:
 *       type: object
 *       properties:
 *         appointment:
 *           $ref: '#/components/schemas/Appointment'
 *         detailAppointment_tests:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               service_id:
 *                 type: string
 *                 example: "SV000001"
 *               name:
 *                 type: string
 *                 example: "Xét nghiệm HIV"
 *               price:
 *                 type: number
 *                 example: 250000
 */

/**
 * @swagger
 * /v1/services:
 *   get:
 *     summary: Lấy danh sách tất cả các dịch vụ xét nghiệm
 *     description: Trả về danh sách tất cả các dịch vụ xét nghiệm có trong hệ thống.
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: Lấy danh sách dịch vụ thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ServiceTest'
 *
 * components:
 *   schemas:
 *     ServiceTest:
 *       type: object
 *       properties:
 *         service_id:
 *           type: string
 *           example: "SV000001"
 *         name:
 *           type: string
 *           example: "Xét nghiệm HIV"
 *         description:
 *           type: string
 *           example: "Phát hiện kháng thể HIV trong máu."
 *         price:
 *           type: number
 *           format: decimal
 *           example: 250000.00
 *         preparationGuidelines:
 *           type: string
 *           example: "Không cần chuẩn bị đặc biệt."
 *         resultWaitTime:
 *           type: integer
 *           example: 2
 */

