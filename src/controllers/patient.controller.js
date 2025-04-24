const Patient = require('../models/patient.model');
const { ValidationError } = require('../utils/apiError');
const { validationResult } = require('express-validator');

/**
 * PatientController
 * Xử lý các request liên quan đến bệnh nhân
 */
class PatientController {
  /**
   * Lấy danh sách tất cả bệnh nhân
   * @route GET /api/patients
   */
  static async getAllPatients(req, res, next) {
    try {
      const { search, page, limit } = req.query;
      const patients = await Patient.findAll({ search, page, limit });
      
      res.status(200).json({
        success: true,
        ...patients
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Lấy thông tin của một bệnh nhân
   * @route GET /api/patients/:id
   */
  static async getPatientById(req, res, next) {
    try {
      const { id } = req.params;
      const patient = await Patient.findById(id);
      
      res.status(200).json({
        success: true,
        data: patient
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Tạo bệnh nhân mới
   * @route POST /api/patients
   */
  static async createPatient(req, res, next) {
    try {
      // Kiểm tra lỗi validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Dữ liệu không hợp lệ', errors.array());
      }
      
      const patient = await Patient.create(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Tạo bệnh nhân thành công',
        data: patient
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Cập nhật thông tin bệnh nhân
   * @route PUT /api/patients/:id
   */
  static async updatePatient(req, res, next) {
    try {
      // Kiểm tra lỗi validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Dữ liệu không hợp lệ', errors.array());
      }
      
      const { id } = req.params;
      const patient = await Patient.update(id, req.body);
      
      res.status(200).json({
        success: true,
        message: 'Cập nhật bệnh nhân thành công',
        data: patient
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Xóa bệnh nhân
   * @route DELETE /api/patients/:id
   */
  static async deletePatient(req, res, next) {
    try {
      const { id } = req.params;
      await Patient.delete(id);
      
      res.status(200).json({
        success: true,
        message: 'Xóa bệnh nhân thành công'
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Lấy lịch sử khám bệnh của bệnh nhân
   * @route GET /api/patients/:id/medical-history
   */
  static async getPatientMedicalHistory(req, res, next) {
    try {
      const { id } = req.params;
      const medicalHistory = await Patient.getMedicalHistory(id);
      
      res.status(200).json({
        success: true,
        data: medicalHistory
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PatientController;
