const express = require('express');
const { body } = require('express-validator');
const PatientController = require('../controllers/patient.controller');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

// Validation rules cho bệnh nhân
const patientValidation = [
  body('full_name')
    .notEmpty().withMessage('Tên bệnh nhân không được trống')
    .isLength({ max: 100 }).withMessage('Tên bệnh nhân không được quá 100 ký tự'),
  
  body('gender')
    .notEmpty().withMessage('Giới tính không được trống')
    .isIn(['Nam', 'Nữ', 'Khác']).withMessage('Giới tính phải là Nam, Nữ hoặc Khác'),
  
  body('birth_year')
    .notEmpty().withMessage('Năm sinh không được trống')
    .isInt({ min: 1900 }).withMessage('Năm sinh phải lớn hơn 1900'),
  
  body('phone')
    .optional()
    .isLength({ max: 20 }).withMessage('Số điện thoại không được quá 20 ký tự'),
  
  body('address')
    .optional()
];

// Tất cả các route đều yêu cầu xác thực
router.use(authenticate);

// Route: GET /api/patients
// Mô tả: Lấy danh sách tất cả bệnh nhân
// Quyền: view_patients
router.get(
  '/',
  authorize(['view_patients']),
  PatientController.getAllPatients
);

// Route: GET /api/patients/:id
// Mô tả: Lấy thông tin của một bệnh nhân
// Quyền: view_patients
router.get(
  '/:id',
  authorize(['view_patients']),
  PatientController.getPatientById
);

// Route: POST /api/patients
// Mô tả: Tạo bệnh nhân mới
// Quyền: create_patient
router.post(
  '/',
  authorize(['create_patient']),
  patientValidation,
  PatientController.createPatient
);

// Route: PUT /api/patients/:id
// Mô tả: Cập nhật thông tin bệnh nhân
// Quyền: update_patient
router.put(
  '/:id',
  authorize(['update_patient']),
  patientValidation,
  PatientController.updatePatient
);

// Route: DELETE /api/patients/:id
// Mô tả: Xóa bệnh nhân
// Quyền: delete_patient
router.delete(
  '/:id',
  authorize(['delete_patient']),
  PatientController.deletePatient
);

// Route: GET /api/patients/:id/medical-history
// Mô tả: Lấy lịch sử khám bệnh của bệnh nhân
// Quyền: view_patients, view_medical_records
router.get(
  '/:id/medical-history',
  authorize(['view_patients', 'view_medical_records']),
  PatientController.getPatientMedicalHistory
);

module.exports = router;
