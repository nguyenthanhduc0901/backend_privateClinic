const Setting = require('../models/setting.model');
const { ValidationError } = require('../utils/apiError');
const { validationResult } = require('express-validator');
const db = require('../config/db');

/**
 * SettingController
 * Xử lý các request liên quan đến cài đặt hệ thống
 */
class SettingController {
  /**
   * Lấy danh sách cài đặt
   * @route GET /api/settings
   */
  static async getAllSettings(req, res, next) {
    try {
      const { search, page, limit } = req.query;
      const settings = await Setting.findAll({ search, page, limit });
      
      res.status(200).json({
        success: true,
        ...settings
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Lấy thông tin cài đặt theo ID
   * @route GET /api/settings/:id
   */
  static async getSettingById(req, res, next) {
    try {
      const { id } = req.params;
      const setting = await Setting.findById(id);
      
      res.status(200).json({
        success: true,
        data: setting
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Lấy thông tin cài đặt theo key
   * @route GET /api/settings/key/:key
   */
  static async getSettingByKey(req, res, next) {
    try {
      const { key } = req.params;
      const setting = await Setting.findByKey(key);
      
      res.status(200).json({
        success: true,
        data: setting
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Lấy thông tin phòng khám (clinic settings)
   * @route GET /api/settings/clinic
   */
  static async getClinicInfo(req, res, next) {
    try {
      const clinicInfo = await Setting.getClinicInfo();
      
      res.status(200).json({
        success: true,
        data: clinicInfo
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Tạo cài đặt mới
   * @route POST /api/settings
   */
  static async createSetting(req, res, next) {
    try {
      // Kiểm tra lỗi validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Dữ liệu không hợp lệ', errors.array());
      }
      
      const setting = await Setting.create(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Tạo cài đặt thành công',
        data: setting
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Cập nhật cài đặt theo ID
   * @route PUT /api/settings/:id
   */
  static async updateSetting(req, res, next) {
    try {
      // Kiểm tra lỗi validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Dữ liệu không hợp lệ', errors.array());
      }
      
      const { id } = req.params;
      const setting = await Setting.update(id, req.body);
      
      res.status(200).json({
        success: true,
        message: 'Cập nhật cài đặt thành công',
        data: setting
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Cập nhật cài đặt theo key
   * @route PUT /api/settings/key/:key
   */
  static async updateSettingByKey(req, res, next) {
    try {
      // Kiểm tra lỗi validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Dữ liệu không hợp lệ', errors.array());
      }
      
      const { key } = req.params;
      const { value } = req.body;
      
      if (value === undefined) {
        throw new ValidationError('Giá trị cài đặt là bắt buộc');
      }
      
      const setting = await Setting.updateValue(key, value);
      
      res.status(200).json({
        success: true,
        message: 'Cập nhật cài đặt thành công',
        data: setting
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Cập nhật nhiều cài đặt cùng lúc
   * @route PUT /api/settings/bulk
   */
  static async updateBulkSettings(req, res, next) {
    try {
      const { settings } = req.body;
      
      if (!settings || !Array.isArray(settings)) {
        throw new ValidationError('Danh sách cài đặt không hợp lệ');
      }
      
      // Bắt đầu transaction
      await db.query('BEGIN');
      
      const results = [];
      
      // Cập nhật từng cài đặt
      for (const item of settings) {
        if (!item.key || item.value === undefined) {
          await db.query('ROLLBACK');
          throw new ValidationError('Thiếu key hoặc value cho cài đặt');
        }
        
        try {
          const setting = await Setting.updateValue(item.key, item.value);
          results.push(setting);
        } catch (error) {
          await db.query('ROLLBACK');
          throw error;
        }
      }
      
      // Hoàn thành transaction
      await db.query('COMMIT');
      
      res.status(200).json({
        success: true,
        message: 'Cập nhật cài đặt thành công',
        data: results
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Xóa cài đặt
   * @route DELETE /api/settings/:id
   */
  static async deleteSetting(req, res, next) {
    try {
      const { id } = req.params;
      await Setting.delete(id);
      
      res.status(200).json({
        success: true,
        message: 'Xóa cài đặt thành công'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = SettingController;
