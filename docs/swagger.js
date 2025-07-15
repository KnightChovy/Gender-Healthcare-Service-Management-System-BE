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
 *     summary: Tạo lịch làm việc tuần cho bác sĩ
 *     description: Cho phép bác sĩ đăng ký lịch làm việc cho cả tuần
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - weekStartDate
 *               - schedule
 *             properties:
 *               weekStartDate:
 *                 type: string
 *                 format: date
 *                 example: "2023-07-10"
 *                 description: Ngày bắt đầu tuần (thứ Hai)
 *               schedule:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - date
 *                     - timeSlots
 *                   properties:
 *                     date:
 *                       type: string
 *                       format: date
 *                       example: "2023-07-10"
 *                       description: Ngày làm việc trong tuần
 *                     timeSlots:
 *                       type: array
 *                       items:
 *                         type: object
 *                         required:
 *                           - time_start
 *                           - time_end
 *                         properties:
 *                           time_start:
 *                             type: string
 *                             format: time
 *                             example: "08:00:00"
 *                             description: Giờ bắt đầu làm việc
 *                           time_end:
 *                             type: string
 *                             format: time
 *                             example: "11:00:00"
 *                             description: Giờ kết thúc làm việc
 *           example:
 *             weekStartDate: "2023-07-10"
 *             schedule:
 *               - date: "2023-07-10"
 *                 timeSlots:
 *                   - time_start: "08:00:00"
 *                     time_end: "11:00:00"
 *                   - time_start: "13:30:00"
 *                     time_end: "17:00:00"
 *               - date: "2023-07-11"
 *                 timeSlots:
 *                   - time_start: "08:00:00"
 *                     time_end: "12:00:00"
 *     responses:
 *       200:
 *         description: Lịch làm việc cập nhật thành công
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
 *                   example: "Cập nhật lịch làm việc thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     doctor_id:
 *                       type: string
 *                       example: "DR000001"
 *                     weekStartDate:
 *                       type: string
 *                       example: "2023-07-10"
 *                     schedule:
 *                       type: array
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Chưa xác thực
 *       404:
 *         description: Không tìm thấy thông tin bác sĩ
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
 *             properties:
 *               appointmentIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Appointments approved successfully
 *       400:
 *         description: Invalid request data
 *       403:
 *         description: Forbidden
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
 *                   example: "Internal server error while sending email"
 */

/**
 * @swagger
 * /v1/auth/forget-password:
 *   patch:
 *     summary: Đặt lại mật khẩu
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               username:
 *                 type: string
 *                 example: "dinhhoangphuc"
 *               newPassword:
 *                 type: string
 *                 example: "AAaa11@@22"
 *               confirmPassword:
 *                 type: string
 *                 example: "AAaa11@@22"
 *     responses:
 *       200:
 *         description: Mật khẩu đã được đặt lại thành công
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
 *                   example: "Password reset successfully"
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy người dùng
 */

/**
 * @swagger
 * /v1/users/{id}/services:
 *   get:
 *     summary: Get services by user ID
 *     description: Retrieve all services associated with a specific user.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
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
 *                 service:
 *                   type: object
 *       404:
 *         description: User or services not found
 */

/**
 * @swagger
 * /v1/services:
 *   get:
 *     summary: Get all services
 *     description: Retrieve a list of all available services/tests.
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: List of services retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ServiceTest'
 */

/**
 * @swagger
 * /v1/services/bookingService:
 *   post:
 *     summary: Đặt dịch vụ y tế
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookingData:
 *                 type: object
 *                 required: [serviceData, payment_method]
 *                 properties:
 *                   serviceData:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         service_id:
 *                           type: string
 *                           example: "SV000001"
 *                   payment_method:
 *                     type: string
 *                     enum: [cash, vnpay, credit_card]
 *                     example: "vnpay"
 *                   appointment_id:
 *                     type: string
 *                     nullable: true
 *                     example: "AP000001"
 *                   appointment_date:
 *                     type: string
 *                     format: date
 *                     example: "2025-07-15"
 *                   appointment_time:
 *                     type: string
 *                     example: "10:00 - 10:30"
 *           example:
 *             bookingData:
 *               serviceData: [{"service_id": "SV000001"}, {"service_id": "SV000002"}]
 *               payment_method: "vnpay"
 *               appointment_id: null
 *               appointment_date: "2025-07-15"
 *               appointment_time: "10:00 - 10:30"
 *     responses:
 *       200:
 *         description: Đặt dịch vụ thành công
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
 *                   example: "Đặt dịch vụ thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     order:
 *                       type: object
 *                     order_details:
 *                       type: array
 *                     skipped_services:
 *                       type: array
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc dịch vụ đã tồn tại
 *       401:
 *         description: Chưa xác thực
 *       404:
 *         description: Không tìm thấy dịch vụ
 *       500:
 *         description: Lỗi hệ thống
 */

/**
 * @swagger
 * /v1/managers/appointments/{appointmentId}/approve:
 *   patch:
 *     summary: Approve a specific appointment
 *     description: Approve a single appointment by its ID (Manager only).
 *     tags: [Managers]
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *     responses:
 *       200:
 *         description: Appointment approved successfully
 *       404:
 *         description: Appointment not found
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /v1/managers/appointments/approve:
 *   patch:
 *     summary: Approve multiple appointments
 *     description: Approve multiple appointments at once (Manager only).
 *     tags: [Managers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               appointmentIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Appointments approved successfully
 *       400:
 *         description: Invalid request data
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /v1/doctors/profile:
 *   get:
 *     summary: Get doctor profile
 *     description: Retrieve the profile of the currently authenticated doctor.
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Doctor profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /v1/doctors/{doctor_id}/available-timeslots:
 *   get:
 *     summary: Get available timeslots for a doctor
 *     description: Retrieve all available timeslots for a specific doctor.
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: doctor_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor ID
 *     responses:
 *       200:
 *         description: Available timeslots retrieved successfully
 *       404:
 *         description: Doctor or timeslots not found
 */

/**
 * @swagger
 * /v1/doctors/{doctor_id}/appointments:
 *   post:
 *     summary: Mark appointment as completed by doctor
 *     description: Mark a specific appointment as completed by the doctor.
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: doctor_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               appointment_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Appointment marked as completed
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: Appointment not found
 */

/**
 * @swagger
 * /v2/payment/webhook:
 *   post:
 *     summary: Stripe webhook endpoint
 *     description: Endpoint for Stripe to send webhook events.
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook received successfully
 *       400:
 *         description: Invalid webhook event
 */

/**
 * @swagger
 * /v2/payment/create-checkout-session:
 *   post:
 *     summary: Create Stripe checkout session
 *     description: Create a new Stripe checkout session for payment.
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Checkout session created successfully
 *       400:
 *         description: Invalid request data
 */

/**
 * @swagger
 * /v1/doctors/{doctor_id}:
 *   patch:
 *     summary: Cập nhật thông tin bác sĩ
 *     description: Cập nhật hồ sơ của bác sĩ, bao gồm thông tin cá nhân và chứng chỉ
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: doctor_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bác sĩ cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: "Nguyễn"
 *               last_name:
 *                 type: string
 *                 example: "Bỉnh Khiêm"
 *               email:
 *                 type: string
 *                 example: "doctor@example.com"
 *               phone:
 *                 type: string
 *                 example: "0912345678"
 *               address:
 *                 type: string
 *                 example: "123 Đường Sức Khỏe, Quận 1, TP.HCM"
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 example: "male"
 *               birthday:
 *                 type: string
 *                 format: date
 *                 example: "1985-05-15"
 *               bio:
 *                 type: string
 *                 example: "Tôi là bác sĩ với 10 năm kinh nghiệm trong lĩnh vực sản phụ khoa"
 *               experience_year:
 *                 type: integer
 *                 example: 10
 *               specialization:
 *                 type: string
 *                 example: "Nam khoa"
 *               certificate:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Chuyên khoa I", "Chuyên khoa II"]
 *     responses:
 *       200:
 *         description: Cập nhật thông tin bác sĩ thành công
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
 *                   example: "Cập nhật thông tin bác sĩ thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     doctor_id:
 *                       type: string
 *                       example: "DR000001"
 *                     user_id:
 *                       type: string
 *                       example: "US000001"
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     bio:
 *                       type: string
 *                     experience_year:
 *                       type: integer
 *                     user:
 *                       type: object
 *                     certificates:
 *                       type: array
 *                       items:
 *                         type: object
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Chưa xác thực
 *       403:
 *         description: Không có quyền cập nhật hồ sơ này
 */

/**
 * @swagger
 * /v1/users/cancel-appointment:
 *   post:
 *     summary: Hủy cuộc hẹn
 *     description: Cho phép người dùng hủy cuộc hẹn của họ
 *     tags: [Users]
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
 *     responses:
 *       200:
 *         description: Hủy cuộc hẹn thành công
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
 *                   example: "Hủy cuộc hẹn thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     appointment_id:
 *                       type: string
 *                       example: "AP000001"
 *                     status:
 *                       type: string
 *                       example: "rejected"
 *                     cancelled_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc không thể hủy
 *       401:
 *         description: Không được xác thực
 *       404:
 *         description: Không tìm thấy cuộc hẹn
 */

/**
 * @swagger
 * /v1/emails/send-appointment-cancellation:
 *   post:
 *     summary: Gửi email thông báo hủy cuộc hẹn
 *     description: Gửi email xác nhận đã hủy cuộc hẹn và thông báo hoàn tiền (nếu có) cho người dùng
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
 *                 example: "AP000123"
 *                 description: ID của cuộc hẹn đã hủy
 *               reason:
 *                 type: string
 *                 example: "Thay đổi lịch trình cá nhân"
 *                 description: Lý do hủy cuộc hẹn
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
 *                   example: "Email thông báo hủy cuộc hẹn đã được gửi thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     emailSent:
 *                       type: boolean
 *                       example: true
 *                     appointment_id:
 *                       type: string
 *                       example: "AP000123"
 *                     sentTo:
 *                       type: string
 *                       example: "user@example.com"
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
 *                   example: "Thiếu thông tin cuộc hẹn (appointment_id)"
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
 *                   example: "Không tìm thấy cuộc hẹn với ID: AP000123"
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
 *                   example: "Lỗi khi gửi email thông báo hủy cuộc hẹn"
 */

/**
 * @swagger
 * /v1/emails/booking-service-success:
 *   post:
 *     summary: Gửi email thông báo đặt dịch vụ thành công
 *     description: Gửi email xác nhận đặt dịch vụ thành công cho một đơn hàng cụ thể
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
 *               - user_id
 *               - order_id
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: ID của người dùng
 *                 example: "US000005"
 *               order_id:
 *                 type: string
 *                 description: ID của đơn hàng
 *                 example: "OD000123"
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
 *                   example: "Email thông báo đặt dịch vụ thành công đã được gửi"
 *                 data:
 *                   type: object
 *                   properties:
 *                     emailSent:
 *                       type: boolean
 *                       example: true
 *                     user_id:
 *                       type: string
 *                       example: "US000005"
 *                     order_id:
 *                       type: string
 *                       example: "OD000123"
 *                     sentTo:
 *                       type: string
 *                       example: "user@example.com"
 *       400:
 *         description: Thiếu thông tin cần thiết
 *       404:
 *         description: Không tìm thấy người dùng hoặc đơn hàng
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /v1/cycle:
 *   post:
 *     summary: Tạo và tính toán chu kỳ kinh nguyệt mới
 *     description: |
 *       Tính toán và lưu trữ chu kỳ kinh nguyệt mới cho người dùng đã xác thực. Yêu cầu xác thực qua header `x-access-token`.
 *     tags: [Cycle]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lastPeriodDate
 *               - cycleLength
 *               - periodLength
 *               - pillTime
 *             properties:
 *               lastPeriodDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-06-01"
 *                 description: Ngày bắt đầu kỳ kinh cuối (YYYY-MM-DD)
 *               cycleLength:
 *                 type: integer
 *                 example: 28
 *                 description: Độ dài chu kỳ (ngày)
 *               periodLength:
 *                 type: integer
 *                 example: 5
 *                 description: Số ngày hành kinh
 *               pillTime:
 *                 type: string
 *                 example: "07:30"
 *                 description: Thời gian nhắc uống thuốc (HH:mm)
 *     responses:
 *       200:
 *         description: Tạo và tính toán chu kỳ thành công
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
 *                   example: create cycle successfully
 *                 cycle:
 *                   $ref: '#/components/schemas/Cycle'
 *       400:
 *         description: Thiếu hoặc sai dữ liệu đầu vào
 *       401:
 *         description: Không xác thực hoặc token không hợp lệ
 *       500:
 *         description: Lỗi hệ thống
 *
 *   get:
 *     summary: Lấy thông tin chu kỳ của người dùng hiện tại
 *     description: |
 *       Lấy thông tin chu kỳ gần nhất của người dùng đã xác thực. Yêu cầu xác thực qua header `x-access-token`.
 *     tags: [Cycle]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy chu kỳ thành công
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
 *                   example: create cycle successfully
 *                 cycle:
 *                   $ref: '#/components/schemas/Cycle'
 *       401:
 *         description: Không xác thực hoặc token không hợp lệ
 *       404:
 *         description: Không tìm thấy chu kỳ
 *       500:
 *         description: Lỗi hệ thống
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Cycle:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID chu kỳ
 *         user_id:
 *           type: string
 *           description: ID người dùng
 *         lastPeriodDate:
 *           type: string
 *           format: date
 *           description: Ngày bắt đầu kỳ kinh cuối
 *         cycleLength:
 *           type: integer
 *           description: Độ dài chu kỳ (ngày)
 *         periodLength:
 *           type: integer
 *           description: Số ngày hành kinh
 *         pillTime:
 *           type: string
 *           description: Thời gian nhắc uống thuốc (HH:mm)
 *         periodRange:
 *           type: object
 *           properties:
 *             start:
 *               type: string
 *               format: date
 *             end:
 *               type: string
 *               format: date
 *         ovulationRange:
 *           type: object
 *           properties:
 *             start:
 *               type: string
 *               format: date
 *             end:
 *               type: string
 *               format: date
 *         fertilityWindow:
 *           type: object
 *           properties:
 *             start:
 *               type: string
 *               format: date
 *             end:
 *               type: string
 *               format: date
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /v1/test-results:
 *   get:
 *     summary: Lấy tất cả kết quả xét nghiệm
 *     tags: [TestResults]
 *     responses:
 *       200:
 *         description: Danh sách kết quả xét nghiệm
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TestResult'
 *
 * /v1/test-results/{id}:
 *   get:
 *     summary: Lấy kết quả xét nghiệm theo ID
 *     tags: [TestResults]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của kết quả xét nghiệm
 *     responses:
 *       200:
 *         description: Kết quả xét nghiệm
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TestResult'
 *       404:
 *         description: Không tìm thấy
 *
 *   put:
 *     summary: Cập nhật kết quả xét nghiệm
 *     tags: [TestResults]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của kết quả xét nghiệm
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TestResultInput'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TestResult'
 *       404:
 *         description: Không tìm thấy
 *
 *   delete:
 *     summary: Xóa kết quả xét nghiệm
 *     tags: [TestResults]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của kết quả xét nghiệm
 *     responses:
 *       204:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy
 *
 * /v1/test-results/create:
 *   post:
 *     summary: Tạo kết quả xét nghiệm mới
 *     tags: [TestResults]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TestResultInput'
 *     responses:
 *       201:
 *         description: Tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TestResult'
 *
 * components:
 *   schemas:
 *     TestResult:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         good_title:
 *           type: string
 *         good_result:
 *           type: string
 *         bad_title:
 *           type: string
 *         bad_result:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     TestResultInput:
 *       type: object
 *       required:
 *         - name
 *         - good_title
 *         - good_result
 *         - bad_title
 *         - bad_result
 *       properties:
 *         name:
 *           type: string
 *         good_title:
 *           type: string
 *         good_result:
 *           type: string
 *         bad_title:
 *           type: string
 *         bad_result:
 *           type: string
 */

/**
 * @swagger
 * /v1/test-appointments/user/{user_id}:
 *   get:
 *     summary: Lấy danh sách dịch vụ đã đặt của người dùng
 *     description: Lấy tất cả orders và chi tiết các dịch vụ mà người dùng đã đặt
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng cần lấy thông tin dịch vụ
 *         example: "US000005"
 *     responses:
 *       200:
 *         description: Lấy thông tin thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         user_id:
 *                           type: string
 *                           example: "US000005"
 *                         first_name:
 *                           type: string
 *                           example: "Nguyễn"
 *                         last_name:
 *                           type: string
 *                           example: "Văn A"
 *                         email:
 *                           type: string
 *                           example: "nguyenvana@example.com"
 *                         phone:
 *                           type: string
 *                           example: "0901234567"
 *                     orders:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           order:
 *                             type: object
 *                             properties:
 *                               order_id:
 *                                 type: string
 *                                 example: "OD000123"
 *                               user_id:
 *                                 type: string
 *                                 example: "US000005"
 *                               order_type:
 *                                 type: string
 *                                 example: "directly"
 *                               payment_method:
 *                                 type: string
 *                                 example: "VNPAY"
 *                               order_status:
 *                                 type: string
 *                                 example: "pending"
 *                               created_at:
 *                                 type: string
 *                                 format: date-time
 *                               total_amount:
 *                                 type: number
 *                                 example: 1250000
 *                           services:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 service_id:
 *                                   type: string
 *                                   example: "SV000001"
 *                                 name:
 *                                   type: string
 *                                   example: "Xét nghiệm máu tổng quát"
 *                                 price:
 *                                   type: number
 *                                   example: 650000
 *                                 description:
 *                                   type: string
 *                                   example: "Xét nghiệm máu toàn diện đánh giá sức khỏe tổng quát"
 *                                 preparation_guidelines:
 *                                   type: string
 *                                                                     example: "Nhịn ăn 8 giờ trước khi xét nghiệm"
 *                     total_amount:
 *                       type: number
 *                       example: 1950000
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
 *                   example: "User ID is required"
 *       404:
 *         description: Không tìm thấy người dùng
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
 *                   example: "Không tìm thấy người dùng với ID: US000005"
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
 *                   example: "Không thể lấy thông tin đơn hàng và dịch vụ của người dùng"
 */

/**
 * @swagger
 * /v1/staff/getAllOrder:
 *   get:
 *     summary: Lấy tất cả đơn hàng (manager and staff)
 *     description: Lấy danh sách tất cả đơn hàng trong hệ thống, manager và staff mới có quyền truy cập
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách đơn hàng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     orders:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           order:
 *                             type: object
 *                             properties:
 *                               order_id:
 *                                 type: string
 *                                 example: "OD000123"
 *                               user_id:
 *                                 type: string
 *                                 example: "US000005"
 *                               order_type:
 *                                 type: string
 *                                 example: "directly"
 *                               payment_method:
 *                                 type: string
 *                                 example: "VNPAY"
 *                               order_status:
 *                                 type: string
 *                                 example: "pending"
 *                               created_at:
 *                                 type: string
 *                                 format: date-time
 *                               total_amount:
 *                                 type: number
 *                                 example: 1250000
 *                               user:
 *                                 type: object
 *                                 properties:
 *                                   user_id:
 *                                     type: string
 *                                   first_name:
 *                                     type: string
 *                                   last_name:
 *                                     type: string
 *                                   email:
 *                                     type: string
 *                                   phone:
 *                                     type: string
 *                           services:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 service_id:
 *                                   type: string
 *                                 name:
 *                                   type: string
 *                                 price:
 *                                   type: number
 *                                 description:
 *                                   type: string
 *                     total_orders:
 *                       type: integer
 *                       example: 35
 *                     total_amount:
 *                       type: number
 *                       example: 45250000
 *       401:
 *         description: Không được xác thực
 *       403:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /v1/staff/update-order:
 *   patch:
 *     summary: Cập nhật trạng thái đơn hàng thành đã thanh toán
 *     description: Cho phép nhân viên và quản lý cập nhật trạng thái đơn hàng từ 'pending' thành 'paid'
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_id
 *             properties:
 *               order_id:
 *                 type: string
 *                 description: Mã đơn hàng cần cập nhật
 *                 example: "OD000123"
 *     responses:
 *       200:
 *         description: Cập nhật đơn hàng thành công
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
 *                   example: "Cập nhật đơn hàng thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     order_id:
 *                       type: string
 *                       example: "OD000123"
 *                     order_status:
 *                       type: string
 *                       example: "paid"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
 *                       type: string
 *                       format: date-time
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
 *                   example: "Dữ liệu không hợp lệ"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *       401:
 *         description: Không có quyền truy cập
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
 *                   example: "Bạn không có quyền này"
 *       404:
 *         description: Không tìm thấy đơn hàng
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
 *                   example: "Không tìm thấy đơn hàng"
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
 *                   example: "Lỗi khi cập nhật đơn hàng"
 */

/**
 * @swagger
 * /v1/emails/order-test-completion:
 *   post:
 *     summary: Gửi email thông báo hoàn thành xét nghiệm cho cả đơn hàng
 *     description: Gửi email thông báo hoàn thành xét nghiệm và thời gian chờ kết quả cho tất cả dịch vụ trong một đơn hàng
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
 *               - user_id
 *               - order_id
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: ID của người dùng
 *                 example: "US000005"
 *               order_id:
 *                 type: string
 *                 description: ID của đơn hàng
 *                 example: "OD000123"
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
 *                   example: "Email thông báo hoàn thành xét nghiệm đã được gửi"
 *                 data:
 *                   type: object
 *                   properties:
 *                     emailSent:
 *                       type: boolean
 *                       example: true
 *                     user_id:
 *                       type: string
 *                       example: "US000005"
 *                     order_id:
 *                       type: string
 *                       example: "OD000123"
 *                     sentTo:
 *                       type: string
 *                       example: "user@example.com"
 *                     expectedResultDate:
 *                       type: string
 *                       example: "15/07/2023, 14:30"
 *       400:
 *         description: Thiếu thông tin cần thiết
 *       404:
 *         description: Không tìm thấy người dùng hoặc đơn hàng
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /v1/staff/orders/{order_id}/complete:
 *   patch:
 *     summary: Hoàn thành đơn hàng đã thanh toán
 *     description: Cho phép nhân viên và quản lý hoàn thành đơn hàng đã thanh toán (chuyển từ 'paid' thành 'completed')
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: order_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã đơn hàng cần hoàn thành
 *         example: "OD000123"
 *     responses:
 *       200:
 *         description: Hoàn thành đơn hàng thành công
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
 *                   example: "Hoàn thành đơn hàng thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     order_id:
 *                       type: string
 *                       example: "OD000123"
 *                     order_status:
 *                       type: string
 *                       example: "completed"
 *                     user:
 *                       type: object
 *                       properties:
 *                         user_id:
 *                           type: string
 *                           example: "US000005"
 *                         first_name:
 *                           type: string
 *                           example: "Nguyễn"
 *                         last_name:
 *                           type: string
 *                           example: "Văn A"
 *                         email:
 *                           type: string
 *                           example: "nguyenvana@example.com"
 *                         phone:
 *                           type: string
 *                           example: "0901234567"
 *                     orderDetails:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           order_detail_id:
 *                             type: string
 *                             example: "ODD000001"
 *                           serviceTest:
 *                             type: object
 *                             properties:
 *                               service_id:
 *                                 type: string
 *                                 example: "SV000001"
 *                               name:
 *                                 type: string
 *                                 example: "Xét nghiệm máu tổng quát"
 *                               price:
 *                                 type: number
 *                                 example: 650000
 *                               description:
 *                                 type: string
 *                                 example: "Xét nghiệm máu toàn diện đánh giá sức khỏe tổng quát"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Chỉ có thể hoàn thành đơn hàng đã thanh toán
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
 *                   example: "Chỉ có thể hoàn thành đơn hàng đã thanh toán"
 *       401:
 *         description: Không có quyền truy cập
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
 *                   example: "Bạn không có quyền này"
 *       404:
 *         description: Không tìm thấy đơn hàng
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
 *                   example: "Không tìm thấy đơn hàng"
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
 *                   example: "Lỗi khi hoàn thành đơn hàng"
 */

/**
 * @swagger
 * /v1/staff/orders/{order_id}/cancel:
 *   patch:
 *     summary: Hủy đơn hàng đang chờ xử lý
 *     description: Cho phép nhân viên và quản lý hủy đơn hàng đang chờ xử lý (chuyển từ 'pending' thành 'cancelled')
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: order_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã đơn hàng cần hủy
 *         example: "OD000123"
 *     responses:
 *       200:
 *         description: Hủy đơn hàng thành công
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
 *                   example: "Hủy đơn hàng thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     order_id:
 *                       type: string
 *                       example: "OD000123"
 *                     order_status:
 *                       type: string
 *                       example: "cancelled"
 *                     user:
 *                       type: object
 *                       properties:
 *                         user_id:
 *                           type: string
 *                           example: "US000005"
 *                         first_name:
 *                           type: string
 *                           example: "Nguyễn"
 *                         last_name:
 *                           type: string
 *                           example: "Văn A"
 *                         email:
 *                           type: string
 *                           example: "nguyenvana@example.com"
 *                         phone:
 *                           type: string
 *                           example: "0901234567"
 *                     orderDetails:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           order_detail_id:
 *                             type: string
 *                             example: "ODD000001"
 *                           serviceTest:
 *                             type: object
 *                             properties:
 *                               service_id:
 *                                 type: string
 *                                 example: "SV000001"
 *                               name:
 *                                 type: string
 *                                 example: "Xét nghiệm máu tổng quát"
 *                               price:
 *                                 type: number
 *                                 example: 650000
 *                               description:
 *                                 type: string
 *                                 example: "Xét nghiệm máu toàn diện đánh giá sức khỏe tổng quát"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Chỉ có thể hủy đơn hàng đang chờ xử lý
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
 *                   example: "Chỉ có thể hủy đơn hàng đang chờ xử lý"
 *       401:
 *         description: Không có quyền truy cập
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
 *                   example: "Bạn không có quyền này"
 *       404:
 *         description: Không tìm thấy đơn hàng
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
 *                   example: "Không tìm thấy đơn hàng"
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
 *                   example: "Lỗi khi hủy đơn hàng"
 */

/**
 * @swagger
 * /v1/users/test-results:
 *   get:
 *     summary: Lấy kết quả xét nghiệm của người dùng
 *     description: API cho phép người dùng xem kết quả các xét nghiệm đã thực hiện
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: order_id
 *         schema:
 *           type: string
 *         description: ID của đơn hàng cần lấy kết quả (không bắt buộc)
 *         example: "OD000123"
 *     responses:
 *       200:
 *         description: Lấy kết quả thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         user_id:
 *                           type: string
 *                           example: "US000005"
 *                         first_name:
 *                           type: string
 *                           example: "Nguyễn"
 *                         last_name:
 *                           type: string
 *                           example: "Văn A"
 *                         email:
 *                           type: string
 *                           example: "nguyenvana@example.com"
 *                         phone:
 *                           type: string
 *                           example: "0901234567"
 *                     results:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           order_id:
 *                             type: string
 *                             example: "OD000123"
 *                           order_detail_id:
 *                             type: string
 *                             example: "ODT000123"
 *                           testresult_id:
 *                             type: string
 *                             example: "TR000123"
 *                           service:
 *                             type: object
 *                             properties:
 *                               service_id:
 *                                 type: string
 *                                 example: "SV000001"
 *                               name:
 *                                 type: string
 *                                 example: "Xét nghiệm máu tổng quát"
 *                               description:
 *                                 type: string
 *                                 example: "Xét nghiệm máu toàn diện kiểm tra sức khỏe"
 *                               result_wait_time:
 *                                 type: integer
 *                                 example: 24
 *                           exam_date:
 *                             type: string
 *                             format: date
 *                             example: "2023-07-15"
 *                           exam_time:
 *                             type: string
 *                             example: "09:00:00"
 *                           result:
 *                             type: object
 *                             properties:
 *                               testresult_id:
 *                                 type: string
 *                                 example: "TR000123"
 *                               result:
 *                                 type: string
 *                                 example: "12.5 g/dL"
 *                               conclusion:
 *                                 type: string
 *                                 example: "Trong ngưỡng bình thường"
 *                               reference_range:
 *                                 type: string
 *                                 example: "12-16 g/dL"
 *                               doctor_note:
 *                                 type: string
 *                                 example: "Chỉ số huyết học bình thường"
 *                               created_at:
 *                                 type: string
 *                                 format: date-time
 *                               updated_at:
 *                                 type: string
 *                                 format: date-time
 *                               doctor:
 *                                 type: object
 *                                 properties:
 *                                   doctor_id:
 *                                     type: string
 *                                     example: "DR000001"
 *                                   first_name:
 *                                     type: string
 *                                     example: "Trần"
 *                                   last_name:
 *                                     type: string
 *                                     example: "Văn B"
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /v1/test-results/create-testResult:
 *   post:
 *     summary: Create test results for an order (MySQL)
 *     description: Input test results for a specific order. Only staff or manager roles are allowed.
 *     tags: [TestResults]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         description: Access token (JWT)
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_id
 *               - test_results
 *             properties:
 *               order_id:
 *                 type: string
 *                 example: OD000007
 *               test_results:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - service_id
 *                     - order_id
 *                     - conclusion
 *                   properties:
 *                     service_id:
 *                       type: string
 *                       example: SV000001
 *                     order_id:
 *                       type: string
 *                       example: OD000007
 *                     result:
 *                       type: string
 *                       example: "Không phát hiện kháng nguyên p24 hay kháng thể HIV trong máu."
 *                     conclusion:
 *                       type: string
 *                       example: "Không phát hiện virus HIV"
 *                     normal_range:
 *                       type: string
 *                       example: good
 *                     recommendations:
 *                       type: string
 *                       example: ""
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-07-13T19:43:21.586Z"
 *     responses:
 *       201:
 *         description: Test results created successfully
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
 *                   example: create successfully
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       400:
 *         description: Invalid input data
 */
