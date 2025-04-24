const express = require('express');
const { body } = require('express-validator');
const PermissionController = require('../controllers/permission.controller');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

// Validation rules cho quyền hạn
const permissionValidation = [
  body('name')
    .notEmpty().withMessage('Tên quyền không được để trống')
    .isLength({ max: 50 }).withMessage('Tên quyền không được quá 50 ký tự')
    .matches(/^[a-z_]+$/).withMessage('Tên quyền chỉ được chứa chữ cái thường và dấu gạch dưới'),
  
  body('description')
    .optional()
    .isLength({ max: 255 }).withMessage('Mô tả không được quá 255 ký tự')
];

// Tất cả các route đều yêu cầu xác thực
router.use(authenticate);

// Route: GET /api/permissions
// Mô tả: Lấy danh sách tất cả quyền hạn
// Quyền: view_permissions
router.get(
  '/',
  authorize(['view_permissions']),
  PermissionController.getAllPermissions
);

// Route: GET /api/permissions/all
// Mô tả: Lấy danh sách tất cả quyền hạn không phân trang
// Quyền: view_permissions
router.get(
  '/all',
  authorize(['view_permissions']),
  PermissionController.getListAll
);

// Route: GET /api/permissions/:id
// Mô tả: Lấy thông tin của một quyền hạn
// Quyền: view_permissions
router.get(
  '/:id',
  authorize(['view_permissions']),
  PermissionController.getPermissionById
);

// Route: GET /api/permissions/:id/roles
// Mô tả: Lấy danh sách vai trò có quyền hạn cụ thể
// Quyền: view_permissions
router.get(
  '/:id/roles',
  authorize(['view_permissions']),
  PermissionController.getRolesWithPermission
);

// Route: POST /api/permissions
// Mô tả: Tạo quyền hạn mới
// Quyền: create_permission
router.post(
  '/',
  authorize(['create_permission']),
  permissionValidation,
  PermissionController.createPermission
);

// Route: PUT /api/permissions/:id
// Mô tả: Cập nhật thông tin quyền hạn
// Quyền: update_permission
router.put(
  '/:id',
  authorize(['update_permission']),
  permissionValidation,
  PermissionController.updatePermission
);

// Route: DELETE /api/permissions/:id
// Mô tả: Xóa quyền hạn
// Quyền: delete_permission
router.delete(
  '/:id',
  authorize(['delete_permission']),
  PermissionController.deletePermission
);

module.exports = router;
