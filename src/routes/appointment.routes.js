const express = require('express');
const { body, param, query } = require('express-validator');
const AppointmentController = require('../controllers/appointment.controller');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

// Validation rules cho lịch hẹn
const appointmentValidation = [
  body('patient_id')
    .notEmpty().withMessage('ID bệnh nhân không được trống')
    .isInt().withMessage('ID bệnh nhân phải là số nguyên'),
  
  body('appointment_date')
    .notEmpty().withMessage('Ngày hẹn không được trống')
    .isDate().withMessage('Ngày hẹn phải đúng định dạng YYYY-MM-DD'),
  
  body('appointment_time')
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).withMessage('Thời gian phải đúng định dạng HH:MM:SS'),
  
  body('notes')
    .optional()
];

// Validation cho date param
const dateParamValidation = [
  param('date')
    .isDate().withMessage('Ngày phải đúng định dạng YYYY-MM-DD')
];

// Tất cả các route đều yêu cầu xác thực
router.use(authenticate);

// Route: GET /api/appointments
// Mô tả: Lấy danh sách tất cả lịch hẹn với bộ lọc
// Quyền: view_appointments
router.get(
  '/',
  authorize(['view_appointments']),
  AppointmentController.getAllAppointments
);

// Route: GET /api/appointments/by-date/:date
// Mô tả: Lấy danh sách lịch hẹn theo ngày
// Quyền: view_appointments
router.get(
  '/by-date/:date',
  authorize(['view_appointments']),
  dateParamValidation,
  AppointmentController.getAppointmentsByDate
);

// Route: GET /api/appointments/limits
// Mô tả: Lấy thông tin về giới hạn bệnh nhân trong ngày
// Quyền: view_appointments
router.get(
  '/limits',
  authorize(['view_appointments']),
  AppointmentController.getAppointmentLimits
);

// Route: GET /api/appointments/:id
// Mô tả: Lấy thông tin của một lịch hẹn
// Quyền: view_appointments
router.get(
  '/:id',
  authorize(['view_appointments']),
  AppointmentController.getAppointmentById
);

// Route: POST /api/appointments
// Mô tả: Tạo lịch hẹn mới
// Quyền: create_appointment
router.post(
  '/',
  authorize(['create_appointment']),
  appointmentValidation,
  AppointmentController.createAppointment
);

// Route: PUT /api/appointments/:id
// Mô tả: Cập nhật thông tin lịch hẹn
// Quyền: update_appointment
router.put(
  '/:id',
  authorize(['update_appointment']),
  appointmentValidation,
  AppointmentController.updateAppointment
);

// Route: PATCH /api/appointments/:id/cancel
// Mô tả: Hủy lịch hẹn
// Quyền: cancel_appointment
router.patch(
  '/:id/cancel',
  authorize(['cancel_appointment']),
  AppointmentController.cancelAppointment
);

module.exports = router;
