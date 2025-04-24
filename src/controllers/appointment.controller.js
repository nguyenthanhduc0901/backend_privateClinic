const Appointment = require('../models/appointment.model');
const { ValidationError } = require('../utils/apiError');
const { validationResult } = require('express-validator');

/**
 * AppointmentController
 * Xử lý các request liên quan đến lịch hẹn khám bệnh
 */
class AppointmentController {
  /**
   * Lấy danh sách lịch hẹn
   * @route GET /api/appointments
   */
  static async getAllAppointments(req, res, next) {
    try {
      const { date, status, patientId, page, limit } = req.query;
      const appointments = await Appointment.findAll({ 
        date, status, patientId, page, limit 
      });
      
      res.status(200).json({
        success: true,
        ...appointments
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Lấy danh sách lịch hẹn theo ngày
   * @route GET /api/appointments/by-date/:date
   */
  static async getAppointmentsByDate(req, res, next) {
    try {
      const { date } = req.params;
      const appointments = await Appointment.findByDate(date);
      
      res.status(200).json({
        success: true,
        data: appointments
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Lấy thông tin lịch hẹn theo ID
   * @route GET /api/appointments/:id
   */
  static async getAppointmentById(req, res, next) {
    try {
      const { id } = req.params;
      const appointment = await Appointment.findById(id);
      
      res.status(200).json({
        success: true,
        data: appointment
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Tạo lịch hẹn mới
   * @route POST /api/appointments
   */
  static async createAppointment(req, res, next) {
    try {
      // Kiểm tra lỗi validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Dữ liệu không hợp lệ', errors.array());
      }
      
      // Kiểm tra ngày hẹn không được là ngày trong quá khứ
      const appointmentDate = new Date(req.body.appointment_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (appointmentDate < today) {
        throw new ValidationError('Ngày hẹn không thể là ngày trong quá khứ', [{
          param: 'appointment_date',
          msg: 'Ngày hẹn phải từ hôm nay trở đi'
        }]);
      }
      
      const appointment = await Appointment.create(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Tạo lịch hẹn thành công',
        data: appointment
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Cập nhật lịch hẹn
   * @route PUT /api/appointments/:id
   */
  static async updateAppointment(req, res, next) {
    try {
      // Kiểm tra lỗi validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Dữ liệu không hợp lệ', errors.array());
      }
      
      // Kiểm tra ngày hẹn mới không được là ngày trong quá khứ
      if (req.body.appointment_date) {
        const appointmentDate = new Date(req.body.appointment_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (appointmentDate < today) {
          throw new ValidationError('Ngày hẹn không thể là ngày trong quá khứ', [{
            param: 'appointment_date',
            msg: 'Ngày hẹn phải từ hôm nay trở đi'
          }]);
        }
      }
      
      const { id } = req.params;
      const appointment = await Appointment.update(id, req.body);
      
      res.status(200).json({
        success: true,
        message: 'Cập nhật lịch hẹn thành công',
        data: appointment
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Hủy lịch hẹn
   * @route PATCH /api/appointments/:id/cancel
   */
  static async cancelAppointment(req, res, next) {
    try {
      const { id } = req.params;
      const appointment = await Appointment.cancel(id);
      
      res.status(200).json({
        success: true,
        message: 'Hủy lịch hẹn thành công',
        data: appointment
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Lấy thông tin về giới hạn lịch hẹn
   * @route GET /api/appointments/limits
   */
  static async getAppointmentLimits(req, res, next) {
    try {
      const limits = await Appointment.getAppointmentLimits();
      
      // Thêm thông tin count cho ngày hiện tại
      const today = new Date().toISOString().split('T')[0];
      const currentCount = await Appointment.getCurrentPatientCount(today);
      
      res.status(200).json({
        success: true,
        data: {
          ...limits,
          today,
          currentCount,
          remainingToday: limits.maxPatientsPerDay - currentCount
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AppointmentController;
