const express = require('express');
const { body } = require('express-validator');
const StaffController = require('../controllers/staff.controller');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

// Validation rules cho thêm/cập nhật nhân viên
const staffValidationRules = [
  body('username')
    .notEmpty().withMessage('Tên đăng nhập không được để trống')
    .isLength({ min: 3, max: 50 }).withMessage('Tên đăng nhập phải từ 3-50 ký tự')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới'),
  
  body('fullName')
    .notEmpty().withMessage('Họ tên không được để trống')
    .isLength({ max: 100 }).withMessage('Họ tên không được quá 100 ký tự'),
  
  body('email')
    .notEmpty().withMessage('Email không được để trống')
    .isEmail().withMessage('Email không hợp lệ'),
  
  body('phone')
    .optional()
    .matches(/^[0-9+\-\s]+$/).withMessage('Số điện thoại không hợp lệ'),
  
  body('address')
    .optional()
    .isLength({ max: 255 }).withMessage('Địa chỉ không được quá 255 ký tự'),
  
  body('roleId')
    .notEmpty().withMessage('Vai trò là bắt buộc')
    .isInt().withMessage('ID vai trò không hợp lệ')
];

// Validation rules cho tạo nhân viên mới
const createStaffValidation = [
  ...staffValidationRules,
  
  body('password')
    .notEmpty().withMessage('Mật khẩu không được để trống')
    .isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự')
];

// Validation rules cho cập nhật thông tin nhân viên
const updateStaffValidation = [
  ...staffValidationRules.map(rule => rule.optional())
];

// Validation rules cho đổi mật khẩu
const changePasswordValidation = [
  body('newPassword')
    .notEmpty().withMessage('Mật khẩu mới không được để trống')
    .isLength({ min: 6 }).withMessage('Mật khẩu mới phải có ít nhất 6 ký tự')
];

// Tất cả các route đều yêu cầu xác thực
router.use(authenticate);

// Route: GET /api/staff
// Mô tả: Lấy danh sách tất cả nhân viên
// Quyền: view_staff
router.get(
  '/',
  authorize(['view_staff']),
  StaffController.getAllStaff
);

// Route: GET /api/staff/:id
// Mô tả: Lấy thông tin của một nhân viên
// Quyền: view_staff
router.get(
  '/:id',
  authorize(['view_staff']),
  StaffController.getStaffById
);

// Route: POST /api/staff
// Mô tả: Tạo nhân viên mới
// Quyền: create_staff
router.post(
  '/',
  authorize(['create_staff']),
  createStaffValidation,
  StaffController.createStaff
);

// Route: PUT /api/staff/:id
// Mô tả: Cập nhật thông tin nhân viên
// Quyền: update_staff
router.put(
  '/:id',
  authorize(['update_staff']),
  updateStaffValidation,
  StaffController.updateStaff
);

// Route: PATCH /api/staff/:id/change-password
// Mô tả: Thay đổi mật khẩu nhân viên
// Quyền: update_staff
router.patch(
  '/:id/change-password',
  authorize(['update_staff']),
  changePasswordValidation,
  StaffController.changePassword
);

// Route: PATCH /api/staff/:id/status
// Mô tả: Thay đổi trạng thái hoạt động của nhân viên
// Quyền: update_staff
router.patch(
  '/:id/status',
  authorize(['update_staff']),
  StaffController.changeStatus
);

// Route: DELETE /api/staff/:id
// Mô tả: Xóa nhân viên
// Quyền: delete_staff
router.delete(
  '/:id',
  authorize(['delete_staff']),
  StaffController.deleteStaff
);

module.exports = router;
