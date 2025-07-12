import { staffService } from '~/services/staffService'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const staffUpdateOrder = async (req, res, next) => {
  try {
    const decoded = req.jwtDecoded
    console.log('req.body.data', req.body.data)
    console.log('req body', req.body)
    const { order_id } = req.body
    console.log('decoded', decoded)
    if (decoded.data.role === 'manager' || decoded.data.role === 'staff') {
      const result = await staffService.staffUpdateOrder(order_id)
      
      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Cập nhật đơn hàng thành công',
        data: result
      })
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Bạn không có quyền này'
      })
    }
  } catch (error) {
    const status = error instanceof ApiError ? error.statusCode : 500
    return res.status(status).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật đơn hàng'
    })
  }
}

const getStaffProfile = async (req, res, next) => {
  try {
    const decoded = req.jwtDecoded
    const staffId = decoded.data?.user_id

    if (!staffId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Không tìm thấy thông tin nhân viên'
      })
    }

    const staffProfile = await staffService.getStaffProfile(staffId)

    return res.status(StatusCodes.OK).json({
      success: true,
      data: staffProfile
    })
  } catch (error) {
    const status = error instanceof ApiError ? error.statusCode : 500
    return res.status(status).json({
      success: false,
      message: error.message || 'Lỗi khi lấy thông tin nhân viên'
    })
  }
}

const updateStaffProfile = async (req, res, next) => {
  try {
    const decoded = req.jwtDecoded
    const staffId = decoded.data?.user_id
    const updateData = req.body

    if (!staffId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Không tìm thấy thông tin nhân viên'
      })
    }

    const updatedProfile = await staffService.updateStaffProfile(staffId, updateData)

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      data: updatedProfile
    })
  } catch (error) {
    const status = error instanceof ApiError ? error.statusCode : 500
    return res.status(status).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật thông tin nhân viên'
    })
  }
}

const getPendingOrders = async (req, res, next) => {
  try {
    const decoded = req.jwtDecoded
    
    if (decoded.role !== 'manager' && decoded.role !== 'staff') {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Bạn không có quyền truy cập'
      })
    }

    const pendingOrders = await staffService.getPendingOrders()

    return res.status(StatusCodes.OK).json({
      success: true,
      data: pendingOrders
    })
  } catch (error) {
    const status = error instanceof ApiError ? error.statusCode : 500
    return res.status(status).json({
      success: false,
      message: error.message || 'Lỗi khi lấy danh sách đơn hàng chờ xử lý'
    })
  }
}

const getOrderDetails = async (req, res, next) => {
  try {
    const decoded = req.jwtDecoded
    const { order_id } = req.params

    if (decoded.role !== 'manager' && decoded.role !== 'staff') {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Bạn không có quyền truy cập'
      })
    }

    const orderDetails = await staffService.getOrderDetails(order_id)

    return res.status(StatusCodes.OK).json({
      success: true,
      data: orderDetails
    })
  } catch (error) {
    const status = error instanceof ApiError ? error.statusCode : 500
    return res.status(status).json({
      success: false,
      message: error.message || 'Lỗi khi lấy chi tiết đơn hàng'
    })
  }
}

const updateOrderStatus = async (req, res, next) => {
  try {
    const decoded = req.jwtDecoded
    const { order_id } = req.params
    const { status } = req.body

    if (decoded.role !== 'manager' && decoded.role !== 'staff') {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Bạn không có quyền này'
      })
    }

    const updatedOrder = await staffService.updateOrderStatus(order_id, status)

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Cập nhật trạng thái đơn hàng thành công',
      data: updatedOrder
    })
  } catch (error) {
    const status = error instanceof ApiError ? error.statusCode : 500
    return res.status(status).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật trạng thái đơn hàng'
    })
  }
}

export const staffController = {
  staffUpdateOrder,
  getStaffProfile,
  updateStaffProfile,
  getPendingOrders,
  getOrderDetails,
  updateOrderStatus
}