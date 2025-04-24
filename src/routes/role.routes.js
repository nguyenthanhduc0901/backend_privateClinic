const express = require('express');
const { body } = require('express-validator');
const RoleController = require('../controllers/role.controller');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

// Validation rules cho vai trò
const roleValidation = [
  body('name')
    .notEmpty().withMessage('Tên vai trò không được để trống')
    .isLength({ max: 50 }).withMessage('Tên vai trò không được quá 50 ký tự'),
  
  body('description')
    .optional()
    .isLength({ max: 255 }).withMessage('Mô tả không được quá 255 ký tự'),
  
  body('permissionIds')
    .optional()
    .isArray().withMessage('Danh sách quyền phải là một mảng')
    .custom(value => {
      if (!value.every(id => Number.isInteger(id) || typeof id === 'string' && /^\d+$/.test(id))) {
        throw new Error('Danh sách quyền chứa ID không hợp lệ');
      }
      return true;
    })
];

// Tất cả các route đều yêu cầu xác thực
router.use(authenticate);

// Route: GET /api/roles
// Mô tả: Lấy danh sách tất cả vai trò
// Quyền: view_roles
router.get(
  '/',
  authorize(['view_roles']),
  RoleController.getAllRoles
);

// Route: GET /api/roles/all
// Mô tả: Lấy danh sách tất cả vai trò không phân trang
// Quyền: view_roles
router.get(
  '/all',
  authorize(['view_roles']),
  RoleController.getListAll
);

// Route: GET /api/roles/:id
// Mô tả: Lấy thông tin của một vai trò
// Quyền: view_roles
router.get(
  '/:id',
  authorize(['view_roles']),
  RoleController.getRoleById
);

// Route: GET /api/roles/:id/permissions
// Mô tả: Lấy thông tin vai trò kèm quyền hạn
// Quyền: view_roles
router.get(
  '/:id/permissions',
  authorize(['view_roles']),
  RoleController.getRoleWithPermissions
);

// Route: POST /api/roles
// Mô tả: Tạo vai trò mới
// Quyền: create_role
router.post(
  '/',
  authorize(['create_role']),
  roleValidation,
  RoleController.createRole
);

// Route: PUT /api/roles/:id
// Mô tả: Cập nhật thông tin vai trò
// Quyền: update_role
router.put(
  '/:id',
  authorize(['update_role']),
  roleValidation,
  RoleController.updateRole
);

// Route: DELETE /api/roles/:id
// Mô tả: Xóa vai trò
// Quyền: delete_role
router.delete(
  '/:id',
  authorize(['delete_role']),
  RoleController.deleteRole
);

// Route: POST /api/roles/:id/permissions
// Mô tả: Thêm quyền cho vai trò
// Quyền: update_role
router.post(
  '/:id/permissions',
  authorize(['update_role']),
  RoleController.addPermission
);

// Route: DELETE /api/roles/:id/permissions/:permissionId
// Mô tả: Xóa quyền khỏi vai trò
// Quyền: update_role
router.delete(
  '/:id/permissions/:permissionId',
  authorize(['update_role']),
  RoleController.removePermission
);

module.exports = router;
