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
 * /v1/auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     description: Get a new access token using refresh token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Refresh token received during login
 *     responses:
 *       200:
 *         description: Token refreshed successfully
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
 *                   example: Token refreshed successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *       401:
 *         description: Invalid refresh token
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
 * /v1/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users in the system (Admin/Manager only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 listAllUsers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *
 *   post:
 *     summary: Create a new user
 *     description: Register a new user account
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUser'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input data
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
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Invalid token or user not logged in
 *       404:
 *         description: Profile not found
 */

/**
 * @swagger
 * /v1/users/{id}:
 *   put:
 *     summary: Update user profile
 *     description: Update user information by ID
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUser'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *
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
 *       401:
 *         description: Unauthorized - Invalid token or incorrect current password
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
 *       404:
 *         description: Resource not found
 *       401:
 *         description: Unauthorized access
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
 *       401:
 *         description: Không được xác thực
 *       403:
 *         description: Không có quyền thực hiện
 *       404:
 *         description: Không tìm thấy thông tin bác sĩ
 *       409:
 *         description: Xung đột dữ liệu
 *       500:
 *         description: Lỗi server
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
 * /v1/doctors/{doctor_id}/appointments:
 *   get:
 *     summary: Get doctor's appointments
 *     description: Retrieve all appointments for a specific doctor
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: doctor_id
 *         required: true
 *         description: Doctor ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Doctor appointments retrieved successfully
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
 *                   example: Fetched doctor appointments successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Appointment'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Doctor access only
 */

/**
 * @swagger
 * /v1/appointments:
 *   post:
 *     summary: Create a new appointment
 *     description: Create a new appointment with validation
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - selectedDoctor
 *             properties:
 *               user_id:
 *                 type: string
 *                 pattern: '^US\\d{6}$'
 *                 example: "US000003"
 *                 description: User ID (must be US followed by 6 digits)
 *               selectedDoctor:
 *                 type: string
 *                 pattern: '^DR\\d{6}$'
 *                 example: "DR000003"
 *                 description: Doctor ID (must be DR followed by 6 digits)
 *               timeslot_id:
 *                 type: string
 *                 pattern: '^TS\\d{6}$'
 *                 example: "TS000001"
 *                 description: Timeslot ID (optional)
 *               consultant_type:
 *                 type: string
 *                 maxLength: 150
 *                 example: "Tư vấn chu kỳ kinh nguyệt"
 *                 description: Type of consultation
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, completed, cancelled, rejected, 0, 1]
 *                 default: pending
 *                 example: "0"
 *                 description: Appointment status
 *               appointment_time:
 *                 type: string
 *                 example: "TS000002_10:00:00:00"
 *                 description: Appointment time
 *               price_apm:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 999999999.99
 *                 example: 200000
 *                 description: Appointment price
 *               symptoms:
 *                 type: string
 *                 maxLength: 65535
 *                 example: "Irregular periods"
 *                 description: Patient symptoms
 *               notes:
 *                 type: string
 *                 maxLength: 65535
 *                 example: "First consultation"
 *                 description: Additional notes
 *     responses:
 *       201:
 *         description: Appointment created successfully
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
 *                   example: Appointment created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Validation failed
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
 *                   example: "Validation failed: User ID must be US followed by 6 digits"
 *                 error:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User access only
 */

/**
 * @swagger
 * /v1/appointments/my-appointments:
 *   get:
 *     summary: Get user's own appointments
 *     description: Retrieve all appointments for the currently authenticated user
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User appointments retrieved successfully
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
 *                   example: Fetched user appointments successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Appointment'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User access only
 */

/**
 * @swagger
 * /v1/appointments/user/{userId}:
 *   get:
 *     summary: Get specific user's appointments
 *     description: Retrieve all appointments for a specific user (Admin/Manager access)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: false
 *         description: User ID (if not provided, uses authenticated user's ID)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User appointments retrieved successfully
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
 *                   example: Fetched user appointments successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: User ID is required
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /v1/managers/dashboard:
 *   get:
 *     summary: Manager dashboard
 *     description: Welcome page for manager dashboard
 *     tags: [Managers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Welcome message
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
 *                   example: Welcome to the manager dashboard!
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Manager access only
 */

/**
 * @swagger
 * /v1/managers/appointments:
 *   get:
 *     summary: Get all appointments (Manager)
 *     description: Retrieve all appointments in the system for management
 *     tags: [Managers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All appointments retrieved successfully
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
 *                   example: Fetched all appointments successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Appointment'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Manager access only
 */

/**
 * @swagger
 * /v1/managers/appointments/{appointmentId}/approve:
 *   patch:
 *     summary: Approve single appointment
 *     description: Update status of a specific appointment
 *     tags: [Managers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         description: Appointment ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, completed, cancelled, rejected]
 *                 example: "confirmed"
 *                 description: New appointment status
 *     responses:
 *       200:
 *         description: Appointment status updated successfully
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
 *                   example: Appointment confirmed successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     appointment:
 *                       $ref: '#/components/schemas/Appointment'
 *                     action:
 *                       type: string
 *                       example: "confirmed"
 *                     approvedBy:
 *                       type: string
 *                       example: "MG000001"
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Manager access only
 *       404:
 *         description: Appointment not found
 */

/**
 * @swagger
 * /v1/managers/appointments/approve:
 *   patch:
 *     summary: Approve multiple appointments
 *     description: Update status of multiple appointments (single or bulk)
 *     tags: [Managers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - appointmentIds
 *               - status
 *             properties:
 *               appointmentIds:
 *                 oneOf:
 *                   - type: string
 *                     example: "AP000001"
 *                     description: Single appointment ID
 *                   - type: array
 *                     items:
 *                       type: string
 *                     example: ["AP000001", "AP000002", "AP000003"]
 *                     description: Multiple appointment IDs
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, completed, cancelled, rejected]
 *                 example: "confirmed"
 *                 description: New appointment status
 *     responses:
 *       200:
 *         description: Appointment status updated successfully
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
 *                   example: confirmed completed
 *                 data:
 *                   type: object
 *                   properties:
 *                     successful:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           appointment:
 *                             $ref: '#/components/schemas/Appointment'
 *                           action:
 *                             type: string
 *                           approvedBy:
 *                             type: string
 *                           timestamp:
 *                             type: string
 *                             format: date-time
 *                     failed:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           appointmentId:
 *                             type: string
 *                           error:
 *                             type: string
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Manager access only
 */

/**
 * @swagger
 * /v1/services:
 *   get:
 *     summary: Get all services
 *     description: Retrieve all medical services available in the system
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: Services retrieved successfully
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
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         user_id:
 *           type: string
 *           example: "US000001"
 *         username:
 *           type: string
 *           example: "john_doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "john.doe@example.com"
 *         phone:
 *           type: string
 *           example: "0987654321"
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           example: "male"
 *         birthday:
 *           type: string
 *           format: date
 *           example: "1990-05-15"
 *         avatar:
 *           type: string
 *           example: "https://example.com/avatars/john.jpg"
 *         address:
 *           type: string
 *           example: "123 Nguyen Hue Street, District 1, Ho Chi Minh City"
 *         first_name:
 *           type: string
 *           example: "John"
 *         last_name:
 *           type: string
 *           example: "Doe"
 *         role:
 *           type: string
 *           enum: [user, doctor, manager, admin]
 *           example: "user"
 *         status:
 *           type: integer
 *           example: 1
 *         slug:
 *           type: string
 *           example: "john-doe"
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *
 *     CreateUser:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - email
 *       properties:
 *         username:
 *           type: string
 *           minLength: 3
 *           maxLength: 20
 *           example: "john_doe"
 *         password:
 *           type: string
 *           minLength: 6
 *           maxLength: 50
 *           example: "password123"
 *         email:
 *           type: string
 *           format: email
 *           example: "john.doe@example.com"
 *         phone:
 *           type: string
 *           example: "0987654321"
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           example: "male"
 *         birthday:
 *           type: string
 *           format: date
 *           example: "1990-05-15"
 *         address:
 *           type: string
 *           example: "123 Nguyen Hue Street, District 1, Ho Chi Minh City"
 *         first_name:
 *           type: string
 *           example: "John"
 *         last_name:
 *           type: string
 *           example: "Doe"
 *
 *     UpdateUser:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "john.doe@example.com"
 *         phone:
 *           type: string
 *           example: "0987654321"
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           example: "male"
 *         birthday:
 *           type: string
 *           format: date
 *           example: "1990-05-15"
 *         avatar:
 *           type: string
 *           example: "https://example.com/avatars/john.jpg"
 *         address:
 *           type: string
 *           example: "123 Nguyen Hue Street, District 1, Ho Chi Minh City"
 *         first_name:
 *           type: string
 *           example: "John"
 *         last_name:
 *           type: string
 *           example: "Doe"
 *
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
 *           nullable: true
 *           example: "TS000001"
 *         status:
 *           type: string
 *           enum: [pending, confirmed, completed, cancelled, rejected, 0, 1]
 *           example: "pending"
 *         rating:
 *           type: integer
 *           nullable: true
 *           example: 5
 *         feedback:
 *           type: string
 *           nullable: true
 *           example: "Great service!"
 *         descriptions:
 *           type: string
 *           nullable: true
 *           example: "Regular checkup"
 *         price_apm:
 *           type: number
 *           format: decimal
 *           nullable: true
 *           example: 750000.00
 *         consultant_type:
 *           type: string
 *           nullable: true
 *           example: "Tư vấn trực tiếp"
 *         booking:
 *           type: integer
 *           example: 1
 *         appointment_time:
 *           type: string
 *           format: time
 *           nullable: true
 *           example: "09:00:00"
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *
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
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /v1/emails/payment-reminder:
 *   post:
 *     summary: Gửi email nhắc thanh toán
 *     description: Gửi email thông báo và nhắc nhở người dùng thanh toán cho cuộc hẹn đã được chấp nhận
 *     tags: [Emails]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - appointment_id
 *             properties:
 *               appointment_id:
 *                 type: string
 *                 example: "AP000001"
 *                 description: ID của cuộc hẹn cần gửi nhắc thanh toán
 *     responses:
 *       200:
 *         description: Email đã được gửi thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Payment reminder email sent successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     emailSent:
 *                       type: boolean
 *                       example: true
 *                     appointmentId:
 *                       type: string
 *                       example: "AP000001"
 *                     sentTo:
 *                       type: string
 *                       example: "user@example.com"
 *       400:
 *         description: Dữ liệu gửi lên không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "appointment_id is required"
 *       404:
 *         description: Không tìm thấy cuộc hẹn hoặc người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Appointment not found"
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Internal server error while sending email"
 */

/**
 * @swagger
 * /v1/emails/booking-confirmation:
 *   post:
 *     summary: Gửi email xác nhận đặt lịch thành công
 *     description: Gửi email thông báo đặt lịch thành công và nhắc người dùng xem chi tiết trên hệ thống
 *     tags: [Emails]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - appointment_id
 *             properties:
 *               appointment_id:
 *                 type: string
 *                 example: "AP000001"
 *                 description: ID của cuộc hẹn cần gửi xác nhận
 *     responses:
 *       200:
 *         description: Email đã được gửi thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Booking confirmation email sent successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     emailSent:
 *                       type: boolean
 *                       example: true
 *                     appointmentId:
 *                       type: string
 *                       example: "AP000001"
 *                     sentTo:
 *                       type: string
 *                       example: "user@example.com"
 *       400:
 *         description: Dữ liệu gửi lên không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "appointment_id is required"
 *       404:
 *         description: Không tìm thấy cuộc hẹn hoặc người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Appointment not found"
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Internal server error while sending email"
 *                 error:
 *                   type: string
 */

/**
 * @swagger
 * /v1/emails/sendEmail:
 *   post:
 *     summary: Gửi email test
 *     description: API test gửi email đến một địa chỉ email cụ thể
 *     tags: [Emails]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "test@example.com"
 *                 description: Địa chỉ email nhận
 *     responses:
 *       200:
 *         description: Email đã được gửi thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Email sent successfully"
 *                 info:
 *                   type: string
 *                   example: "123456789abcdef"
 *       400:
 *         description: Dữ liệu gửi lên không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "The email is required"
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Internal server error while sending email"
 */

/**
 *
 * @swagger
 * /v1/admins/createStaff:
 *   post:
 *     summary: Tạo nhân viên/bác sĩ mới
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStaffRequest'
 *     responses:
 *       201:
 *         description: Tạo thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Chưa xác thực
 *       403:
 *         description: Không có quyền
 *       409:
 *         description: Tài khoản đã tồn tại
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateStaffRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - confirm_password
 *         - first_name
 *         - last_name
 *         - gender
 *         - email
 *         - phone
 *         - role
 *       properties:
 *         username:
 *           type: string
 *           example: "khiemmadit"
 *         password:
 *           type: string
 *           example: "Phat@123"
 *         confirm_password:
 *           type: string
 *           example: "Phat@123"
 *         first_name:
 *           type: string
 *           example: "Khiêm"
 *         last_name:
 *           type: string
 *           example: "Phan"
 *         gender:
 *           type: string
 *           enum: [male, female]
 *           example: "male"
 *         email:
 *           type: string
 *           example: "tanphatphan901@gmail.com"
 *         phone:
 *           type: string
 *           example: "0868331121"
 *         role:
 *           type: string
 *           enum: [staff, doctor, manager]
 *           example: "doctor"
 *         birthday:
 *           type: string
 *           example: "2004-03-25"
 *         experience_year:
 *           type: integer
 *           example: 6
 *         bio:
 *           type: string
 *           example: "Bác sĩ chuyên khoa với nhiều kinh nghiệm trong lĩnh vực phụ khoa"
 *         specialization:
 *           type: string
 *           enum: [phu_khoa, tam_ly, da_lieu, noi_tiet, dinh_duong, sin_ly, suc_khoe_tinh_duc, suc_khoe_sinh_san]
 *           example: "phu_khoa"
 *         certificate:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Chuyên khoa"]
 */

/**
 * @swagger
 * /v1/emails/appointment-feedback:
 *   post:
 *     summary: Gửi email yêu cầu đánh giá cuộc hẹn
 *     description: Gửi email kèm đường dẫn đánh giá đến người dùng sau khi cuộc hẹn hoàn thành
 *     tags: [Emails]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - appointment_id
 *             properties:
 *               appointment_id:
 *                 type: string
 *                 example: "AP000123"
 *                 description: ID của cuộc hẹn đã hoàn thành
 *     responses:
 *       200:
 *         description: Email đã được gửi thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Email đánh giá cuộc hẹn đã được gửi thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     emailSent:
 *                       type: boolean
 *                       example: true
 *                     appointmentId:
 *                       type: string
 *                       example: "AP000123"
 *                     sentTo:
 *                       type: string
 *                       example: "patient@example.com"
 *                     feedbackLink:
 *                       type: string
 *                       example: "http://localhost:5173/feedback/appointment/AP000123"
 *       400:
 *         description: Thiếu thông tin cần thiết
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "appointment_id is required"
 *       404:
 *         description: Không tìm thấy cuộc hẹn hoặc người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Appointment not found"
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Lỗi server khi gửi email đánh giá cuộc hẹn"
 *                 error:
 *                   type: string
 *                   example: "Error details"
 */
