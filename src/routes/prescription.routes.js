const express = require('express');
const { body } = require('express-validator');
const PrescriptionController = require('../controllers/prescription.controller');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

// Validation rules cho đơn thuốc
const prescriptionValidation = [
  body('medical_record_id')
    .notEmpty().withMessage('ID hồ sơ bệnh án không được trống')
    .isInt().withMessage('ID hồ sơ bệnh án phải là số nguyên'),
  
  body('medicine_id')
    .notEmpty().withMessage('ID thuốc không được trống')
    .isInt().withMessage('ID thuốc phải là số nguyên'),
  
  body('quantity')
    .notEmpty().withMessage('Số lượng không được trống')
    .isInt({ min: 1 }).withMessage('Số lượng phải là số nguyên dương'),
  
  body('usage_instruction_id')
    .notEmpty().withMessage('ID cách dùng không được trống')
    .isInt().withMessage('ID cách dùng phải là số nguyên'),
  
  body('notes')
    .optional()
];

// Validation cho cập nhật đơn thuốc
const updatePrescriptionValidation = [
  body('quantity')
    .optional()
    .isInt({ min: 1 }).withMessage('Số lượng phải là số nguyên dương'),
  
  body('usage_instruction_id')
    .optional()
    .isInt().withMessage('ID cách dùng phải là số nguyên'),
  
  body('notes')
    .optional()
];

// Tất cả các route đều yêu cầu xác thực
router.use(authenticate);

// Route: GET /api/prescriptions
// Mô tả: Lấy danh sách tất cả đơn thuốc
// Quyền: view_prescriptions
router.get(
  '/',
  authorize(['view_prescriptions']),
  PrescriptionController.getAllPrescriptions
);

// Route: GET /api/prescriptions/calculate-fee/:medicalRecordId
// Mô tả: Tính tổng tiền thuốc cho một hồ sơ bệnh án
// Quyền: view_prescriptions
router.get(
  '/calculate-fee/:medicalRecordId',
  authorize(['view_prescriptions']),
  PrescriptionController.calculateMedicineFee
);

// Route: GET /api/prescriptions/:id
// Mô tả: Lấy thông tin của một đơn thuốc
// Quyền: view_prescriptions
router.get(
  '/:id',
  authorize(['view_prescriptions']),
  PrescriptionController.getPrescriptionById
);

// Route: POST /api/prescriptions
// Mô tả: Tạo đơn thuốc mới
// Quyền: create_prescription
router.post(
  '/',
  authorize(['create_prescription']),
  prescriptionValidation,
  PrescriptionController.createPrescription
);

// Route: PUT /api/prescriptions/:id
// Mô tả: Cập nhật thông tin đơn thuốc
// Quyền: update_prescription
router.put(
  '/:id',
  authorize(['update_prescription']),
  updatePrescriptionValidation,
  PrescriptionController.updatePrescription
);

// Route: DELETE /api/prescriptions/:id
// Mô tả: Xóa đơn thuốc
// Quyền: delete_prescription
router.delete(
  '/:id',
  authorize(['delete_prescription']),
  PrescriptionController.deletePrescription
);

module.exports = router;
