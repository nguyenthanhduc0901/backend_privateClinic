const express = require('express');
const PatientController = require('../controllers/patient.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const { patientSchema } = require('../schemas');
const { createPatientSchema, updatePatientSchema } = patientSchema;
const validate = require('../middlewares/validation.middleware');

const router = express.Router();

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
  validate(createPatientSchema),
  PatientController.createPatient
);

// Route: PUT /api/patients/:id
// Mô tả: Cập nhật thông tin bệnh nhân
// Quyền: update_patient
router.put(
  '/:id',
  authorize(['update_patient']),
  validate(updatePatientSchema),
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

module.exports = router;
