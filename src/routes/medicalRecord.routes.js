const express = require('express');
const { body } = require('express-validator');
const MedicalRecordController = require('../controllers/medicalRecord.controller');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

// Validation rules cho hồ sơ bệnh án
const medicalRecordValidation = [
  body('patient_id')
    .notEmpty().withMessage('ID bệnh nhân không được trống')
    .isInt().withMessage('ID bệnh nhân phải là số nguyên'),
  
  body('examination_date')
    .notEmpty().withMessage('Ngày khám không được trống')
    .isDate().withMessage('Ngày khám phải đúng định dạng YYYY-MM-DD'),
  
  body('symptoms')
    .optional(),
  
  body('diagnosis')
    .optional(),
  
  body('disease_type_id')
    .notEmpty().withMessage('ID loại bệnh không được trống')
    .isInt().withMessage('ID loại bệnh phải là số nguyên'),
  
  body('status')
    .optional()
    .isIn(['pending', 'completed', 'cancelled']).withMessage('Trạng thái không hợp lệ'),
  
  body('notes')
    .optional()
];

// Tất cả các route đều yêu cầu xác thực
router.use(authenticate);

// Route: GET /api/medical-records
// Mô tả: Lấy danh sách tất cả hồ sơ bệnh án
// Quyền: view_medical_records
router.get(
  '/',
  authorize(['view_medical_records']),
  MedicalRecordController.getAllMedicalRecords
);

// Route: GET /api/medical-records/:id
// Mô tả: Lấy thông tin của một hồ sơ bệnh án
// Quyền: view_medical_records
router.get(
  '/:id',
  authorize(['view_medical_records']),
  MedicalRecordController.getMedicalRecordById
);

// Route: POST /api/medical-records
// Mô tả: Tạo hồ sơ bệnh án mới
// Quyền: create_medical_record
router.post(
  '/',
  authorize(['create_medical_record']),
  medicalRecordValidation,
  MedicalRecordController.createMedicalRecord
);

// Route: PUT /api/medical-records/:id
// Mô tả: Cập nhật thông tin hồ sơ bệnh án
// Quyền: update_medical_record
router.put(
  '/:id',
  authorize(['update_medical_record']),
  medicalRecordValidation,
  MedicalRecordController.updateMedicalRecord
);

// Route: DELETE /api/medical-records/:id
// Mô tả: Xóa hồ sơ bệnh án
// Quyền: delete_medical_record
router.delete(
  '/:id',
  authorize(['delete_medical_record']),
  MedicalRecordController.deleteMedicalRecord
);

// Route: GET /api/medical-records/:id/prescriptions
// Mô tả: Lấy danh sách đơn thuốc của hồ sơ bệnh án
// Quyền: view_medical_records, view_prescriptions
router.get(
  '/:id/prescriptions',
  authorize(['view_medical_records', 'view_prescriptions']),
  MedicalRecordController.getMedicalRecordPrescriptions
);

// Route: GET /api/medical-records/:id/invoice
// Mô tả: Lấy thông tin hóa đơn của hồ sơ bệnh án
// Quyền: view_medical_records, view_invoices
router.get(
  '/:id/invoice',
  authorize(['view_medical_records', 'view_invoices']),
  MedicalRecordController.getMedicalRecordInvoice
);

module.exports = router;
