const Staff = require('../models/staff.model');
const { ValidationError } = require('../utils/apiError');
const { validationResult } = require('express-validator');

/**
 * StaffController
 * Xử lý các request liên quan đến nhân viên
 */
class StaffController {
  /**
   * Lấy danh sách nhân viên
   * @route GET /api/staff
   */
  static async getAllStaff(req, res, next) {
    try {
      const { search, page, limit, roleId, isActive } = req.query;
      const staffList = await Staff.findAll({ 
        search, 
        page, 
        limit, 
        roleId: roleId ? parseInt(roleId) : null,
        isActive: isActive !== undefined ? isActive === 'true' : null
      });
      
      res.status(200).json({
        success: true,
        ...staffList
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Lấy thông tin nhân viên theo ID
   * @route GET /api/staff/:id
   */
  static async getStaffById(req, res, next) {
    try {
      const { id } = req.params;
      const staff = await Staff.findById(id);
      
      res.status(200).json({
        success: true,
        data: staff
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Tạo nhân viên mới
   * @route POST /api/staff
   */
  static async createStaff(req, res, next) {
    try {
      // Kiểm tra lỗi validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Dữ liệu không hợp lệ', errors.array());
      }
      
      const staff = await Staff.create(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Tạo nhân viên thành công',
        data: staff
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Cập nhật thông tin nhân viên
   * @route PUT /api/staff/:id
   */
  static async updateStaff(req, res, next) {
    try {
      // Kiểm tra lỗi validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Dữ liệu không hợp lệ', errors.array());
      }
      
      const { id } = req.params;
      const staff = await Staff.update(id, req.body);
      
      res.status(200).json({
        success: true,
        message: 'Cập nhật thông tin nhân viên thành công',
        data: staff
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Thay đổi mật khẩu nhân viên
   * @route PATCH /api/staff/:id/change-password
   */
  static async changePassword(req, res, next) {
    try {
      // Kiểm tra lỗi validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Dữ liệu không hợp lệ', errors.array());
      }
      
      const { id } = req.params;
      const { newPassword } = req.body;
      
      await Staff.changePassword(id, newPassword);
      
      res.status(200).json({
        success: true,
        message: 'Thay đổi mật khẩu thành công'
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Thay đổi trạng thái hoạt động của nhân viên
   * @route PATCH /api/staff/:id/status
   */
  static async changeStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      
      if (isActive === undefined) {
        throw new ValidationError('Trạng thái hoạt động là bắt buộc');
      }
      
      const staff = await Staff.changeStatus(id, isActive);
      
      res.status(200).json({
        success: true,
        message: `${isActive ? 'Kích hoạt' : 'Vô hiệu hóa'} tài khoản nhân viên thành công`,
        data: staff
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Xóa nhân viên
   * @route DELETE /api/staff/:id
   */
  static async deleteStaff(req, res, next) {
    try {
      const { id } = req.params;
      
      // Ngăn việc xóa tài khoản của chính mình
      if (req.user && req.user.id === parseInt(id)) {
        throw new ValidationError('Không thể xóa tài khoản của chính bạn');
      }
      
      await Staff.delete(id);
      
      res.status(200).json({
        success: true,
        message: 'Xóa nhân viên thành công'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = StaffController;
