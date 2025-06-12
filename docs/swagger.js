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


