const Medicine = require('../models/medicine.model');
const { ValidationError } = require('../utils/apiError');
const { validationResult } = require('express-validator');

/**
 * MedicineController
 * Xử lý các request liên quan đến thuốc
 */
class MedicineController {
  /**
   * Lấy danh sách thuốc
   * @route GET /api/medicines
   */
  static async getAllMedicines(req, res, next) {
    try {
      const { search, unit, lowStock, page, limit } = req.query;
      const medicines = await Medicine.findAll({ 
        search, unit, lowStock: lowStock === 'true', page, limit 
      });
      
      res.status(200).json({
        success: true,
        ...medicines
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Lấy thông tin thuốc theo ID
   * @route GET /api/medicines/:id
   */
  static async getMedicineById(req, res, next) {
    try {
      const { id } = req.params;
      const medicine = await Medicine.findById(id);
      
      res.status(200).json({
        success: true,
        data: medicine
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Tạo thuốc mới
   * @route POST /api/medicines
   */
  static async createMedicine(req, res, next) {
    try {
      // Kiểm tra lỗi validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Dữ liệu không hợp lệ', errors.array());
      }
      
      const medicine = await Medicine.create(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Thêm thuốc thành công',
        data: medicine
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Cập nhật thông tin thuốc
   * @route PUT /api/medicines/:id
   */
  static async updateMedicine(req, res, next) {
    try {
      // Kiểm tra lỗi validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Dữ liệu không hợp lệ', errors.array());
      }
      
      const { id } = req.params;
      const medicine = await Medicine.update(id, req.body);
      
      res.status(200).json({
        success: true,
        message: 'Cập nhật thuốc thành công',
        data: medicine
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Cập nhật số lượng thuốc trong kho
   * @route PATCH /api/medicines/:id/stock
   */
  static async updateStock(req, res, next) {
    try {
      // Kiểm tra lỗi validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Dữ liệu không hợp lệ', errors.array());
      }
      
      const { id } = req.params;
      const { quantity } = req.body;
      
      const medicine = await Medicine.updateStock(id, parseInt(quantity));
      
      res.status(200).json({
        success: true,
        message: 'Cập nhật kho thuốc thành công',
        data: medicine
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Xóa thuốc
   * @route DELETE /api/medicines/:id
   */
  static async deleteMedicine(req, res, next) {
    try {
      const { id } = req.params;
      await Medicine.delete(id);
      
      res.status(200).json({
        success: true,
        message: 'Xóa thuốc thành công'
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Lấy thống kê sử dụng thuốc
   * @route GET /api/medicines/statistics
   */
  static async getMedicineStatistics(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const statistics = await Medicine.getUsageStatistics({ startDate, endDate });
      
      res.status(200).json({
        success: true,
        data: statistics
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Lấy giới hạn số lượng thuốc
   * @route GET /api/medicines/limits
   */
  static async getMedicineLimits(req, res, next) {
    try {
      const maxMedicines = await Medicine.getMaxMedicinesCount();
      
      res.status(200).json({
        success: true,
        data: {
          maxMedicines
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MedicineController;
