const express = require('express');
const { body } = require('express-validator');
const MedicineController = require('../controllers/medicine.controller');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

// Validation rules cho thuốc
const medicineValidation = [
  body('name')
    .notEmpty().withMessage('Tên thuốc không được trống')
    .isLength({ max: 100 }).withMessage('Tên thuốc không được quá 100 ký tự'),
  
  body('unit')
    .notEmpty().withMessage('Đơn vị tính không được trống')
    .isIn(['viên', 'chai']).withMessage('Đơn vị tính phải là viên hoặc chai'),
  
  body('price')
    .notEmpty().withMessage('Giá thuốc không được trống')
    .isFloat({ min: 0 }).withMessage('Giá thuốc phải là số dương'),
  
  body('quantity_in_stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Số lượng trong kho phải là số nguyên không âm'),
  
  body('description')
    .optional()
];

// Validation cho cập nhật kho
const stockValidation = [
  body('quantity')
    .notEmpty().withMessage('Số lượng không được trống')
    .isInt().withMessage('Số lượng phải là số nguyên')
];

// Tất cả các route đều yêu cầu xác thực
router.use(authenticate);

// Route: GET /api/medicines
// Mô tả: Lấy danh sách tất cả thuốc
// Quyền: view_medicines
router.get(
  '/',
  authorize(['view_medicines']),
  MedicineController.getAllMedicines
);

// Route: GET /api/medicines/statistics
// Mô tả: Lấy thống kê sử dụng thuốc
// Quyền: view_medicines
router.get(
  '/statistics',
  authorize(['view_medicines']),
  MedicineController.getMedicineStatistics
);

// Route: GET /api/medicines/limits
// Mô tả: Lấy giới hạn số lượng thuốc
// Quyền: view_medicines
router.get(
  '/limits',
  authorize(['view_medicines']),
  MedicineController.getMedicineLimits
);

// Route: GET /api/medicines/:id
// Mô tả: Lấy thông tin của một thuốc
// Quyền: view_medicines
router.get(
  '/:id',
  authorize(['view_medicines']),
  MedicineController.getMedicineById
);

// Route: POST /api/medicines
// Mô tả: Tạo thuốc mới
// Quyền: create_medicine
router.post(
  '/',
  authorize(['create_medicine']),
  medicineValidation,
  MedicineController.createMedicine
);

// Route: PUT /api/medicines/:id
// Mô tả: Cập nhật thông tin thuốc
// Quyền: update_medicine
router.put(
  '/:id',
  authorize(['update_medicine']),
  medicineValidation,
  MedicineController.updateMedicine
);

// Route: PATCH /api/medicines/:id/stock
// Mô tả: Cập nhật số lượng thuốc trong kho
// Quyền: manage_medicine_stock
router.patch(
  '/:id/stock',
  authorize(['manage_medicine_stock']),
  stockValidation,
  MedicineController.updateStock
);

// Route: DELETE /api/medicines/:id
// Mô tả: Xóa thuốc
// Quyền: delete_medicine
router.delete(
  '/:id',
  authorize(['delete_medicine']),
  MedicineController.deleteMedicine
);

module.exports = router;
