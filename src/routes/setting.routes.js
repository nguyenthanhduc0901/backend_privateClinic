const express = require('express');
const { body } = require('express-validator');
const SettingController = require('../controllers/setting.controller');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

// Validation rules cho cài đặt
const settingValidation = [
  body('key')
    .notEmpty().withMessage('Key cài đặt không được để trống')
    .isLength({ max: 50 }).withMessage('Key cài đặt không được quá 50 ký tự')
    .matches(/^[a-z_]+$/).withMessage('Key cài đặt chỉ được chứa chữ cái thường và dấu gạch dưới'),
  
  body('value')
    .notEmpty().withMessage('Giá trị cài đặt không được để trống'),
  
  body('description')
    .optional()
    .isLength({ max: 255 }).withMessage('Mô tả không được quá 255 ký tự')
];

// Validation rules cho cập nhật cài đặt
const updateSettingValidation = [
  body('value')
    .notEmpty().withMessage('Giá trị cài đặt không được để trống'),
  
  body('description')
    .optional()
    .isLength({ max: 255 }).withMessage('Mô tả không được quá 255 ký tự')
];

// Validation rules cho cập nhật hàng loạt
const bulkUpdateValidation = [
  body('settings')
    .isArray().withMessage('Danh sách cài đặt phải là một mảng')
    .notEmpty().withMessage('Danh sách cài đặt không được trống')
];

// Tất cả các route đều yêu cầu xác thực
router.use(authenticate);

// Route: GET /api/settings
// Mô tả: Lấy danh sách tất cả cài đặt
// Quyền: view_settings
router.get(
  '/',
  authorize(['view_settings']),
  SettingController.getAllSettings
);

// Route: GET /api/settings/clinic
// Mô tả: Lấy thông tin phòng khám từ cài đặt
// Quyền: view_settings
router.get(
  '/clinic',
  authorize(['view_settings']),
  SettingController.getClinicInfo
);

// Route: GET /api/settings/:id
// Mô tả: Lấy thông tin của một cài đặt theo ID
// Quyền: view_settings
router.get(
  '/:id',
  authorize(['view_settings']),
  SettingController.getSettingById
);

// Route: GET /api/settings/key/:key
// Mô tả: Lấy thông tin của một cài đặt theo key
// Quyền: view_settings
router.get(
  '/key/:key',
  authorize(['view_settings']),
  SettingController.getSettingByKey
);

// Route: POST /api/settings
// Mô tả: Tạo cài đặt mới
// Quyền: create_setting
router.post(
  '/',
  authorize(['create_setting']),
  settingValidation,
  SettingController.createSetting
);

// Route: PUT /api/settings/:id
// Mô tả: Cập nhật thông tin cài đặt theo ID
// Quyền: update_setting
router.put(
  '/:id',
  authorize(['update_setting']),
  updateSettingValidation,
  SettingController.updateSetting
);

// Route: PUT /api/settings/key/:key
// Mô tả: Cập nhật thông tin cài đặt theo key
// Quyền: update_setting
router.put(
  '/key/:key',
  authorize(['update_setting']),
  updateSettingValidation,
  SettingController.updateSettingByKey
);

// Route: PUT /api/settings/bulk
// Mô tả: Cập nhật nhiều cài đặt cùng lúc
// Quyền: update_setting
router.put(
  '/bulk',
  authorize(['update_setting']),
  bulkUpdateValidation,
  SettingController.updateBulkSettings
);

// Route: DELETE /api/settings/:id
// Mô tả: Xóa cài đặt
// Quyền: delete_setting
router.delete(
  '/:id',
  authorize(['delete_setting']),
  SettingController.deleteSetting
);

module.exports = router;
