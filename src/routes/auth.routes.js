const express = require('express');
const { body } = require('express-validator');
const AuthController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

// Validation cho đăng nhập
const loginValidation = [
  body('username')
    .notEmpty().withMessage('Tên đăng nhập không được trống'),
  
  body('password')
    .notEmpty().withMessage('Mật khẩu không được trống')
];

// Validation cho đổi mật khẩu
const changePasswordValidation = [
  body('currentPassword')
    .notEmpty().withMessage('Mật khẩu hiện tại không được trống'),
  
  body('newPassword')
    .notEmpty().withMessage('Mật khẩu mới không được trống')
    .isLength({ min: 6 }).withMessage('Mật khẩu mới phải có ít nhất 6 ký tự')
];

// Route: POST /api/auth/login
// Mô tả: Đăng nhập hệ thống
// Quyền: Không yêu cầu xác thực
router.post(
  '/login',
  loginValidation,
  AuthController.login
);

// Route: GET /api/auth/me
// Mô tả: Lấy thông tin người dùng hiện tại
// Quyền: Yêu cầu đã đăng nhập
router.get(
  '/me',
  authenticate,
  AuthController.getCurrentUser
);

// Route: POST /api/auth/change-password
// Mô tả: Đổi mật khẩu người dùng
// Quyền: Yêu cầu đã đăng nhập
router.post(
  '/change-password',
  authenticate,
  changePasswordValidation,
  AuthController.changePassword
);

module.exports = router;
