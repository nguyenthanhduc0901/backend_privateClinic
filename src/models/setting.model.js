const db = require('../config/db');
const { NotFoundError, ValidationError } = require('../utils/apiError');

/**
 * Setting Model
 * Quản lý thao tác với bảng settings (cài đặt hệ thống)
 */
class Setting {
  /**
   * Lấy danh sách tất cả cài đặt
   * @param {Object} options - Các tùy chọn lọc và phân trang
   * @returns {Promise<Array>} Danh sách cài đặt
   */
  static async findAll(options = {}) {
    const { search = '', page = 1, limit = 10 } = options;
    const offset = (page - 1) * limit;
    
    const query = `
      SELECT 
        id, key, value, description, editable, created_at, updated_at
      FROM settings
      WHERE 
        key ILIKE $1 OR
        description ILIKE $1
      ORDER BY key
      LIMIT $2 OFFSET $3
    `;
    
    const countQuery = `
      SELECT COUNT(*) FROM settings
      WHERE 
        key ILIKE $1 OR
        description ILIKE $1
    `;
    
    const searchParam = `%${search}%`;
    
    const { rows } = await db.query(query, [searchParam, limit, offset]);
    const countResult = await db.query(countQuery, [searchParam]);
    const total = parseInt(countResult.rows[0].count);
    
    return {
      data: rows,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  }
  
  /**
   * Tìm cài đặt theo ID
   * @param {Number} id - ID của cài đặt
   * @returns {Promise<Object>} Thông tin cài đặt
   */
  static async findById(id) {
    const query = `
      SELECT 
        id, key, value, description, editable, created_at, updated_at
      FROM settings
      WHERE id = $1
    `;
    
    const { rows } = await db.query(query, [id]);
    
    if (rows.length === 0) {
      throw new NotFoundError('Không tìm thấy cài đặt');
    }
    
    return rows[0];
  }
  
  /**
   * Tìm cài đặt theo key
   * @param {String} key - Key của cài đặt
   * @returns {Promise<Object>} Thông tin cài đặt
   */
  static async findByKey(key) {
    const query = `
      SELECT 
        id, key, value, description, editable, created_at, updated_at
      FROM settings
      WHERE key = $1
    `;
    
    const { rows } = await db.query(query, [key]);
    
    if (rows.length === 0) {
      throw new NotFoundError('Không tìm thấy cài đặt');
    }
    
    return rows[0];
  }
  
  /**
   * Lấy giá trị cài đặt theo key
   * @param {String} key - Key của cài đặt
   * @param {*} defaultValue - Giá trị mặc định nếu không tìm thấy
   * @returns {Promise<*>} Giá trị cài đặt
   */
  static async getValue(key, defaultValue = null) {
    try {
      const setting = await this.findByKey(key);
      return setting.value;
    } catch (error) {
      if (error instanceof NotFoundError) {
        return defaultValue;
      }
      throw error;
    }
  }
  
  /**
   * Tạo cài đặt mới
   * @param {Object} data - Dữ liệu cài đặt
   * @returns {Promise<Object>} Cài đặt mới tạo
   */
  static async create(data) {
    try {
      const { key, value, description, editable = true } = data;
      
      const query = `
        INSERT INTO settings (key, value, description, editable)
        VALUES ($1, $2, $3, $4)
        RETURNING id, key, value, description, editable, created_at, updated_at
      `;
      
      const { rows } = await db.query(query, [key, value, description, editable]);
      
      return rows[0];
    } catch (error) {
      // Lỗi unique constraint (key trùng)
      if (error.code === '23505' && error.constraint === 'settings_key_key') {
        throw new ValidationError(
          'Key cài đặt đã tồn tại',
          'Vui lòng sử dụng key khác'
        );
      }
      
      throw error;
    }
  }
  
  /**
   * Cập nhật thông tin cài đặt
   * @param {Number} id - ID của cài đặt
   * @param {Object} data - Dữ liệu cập nhật
   * @returns {Promise<Object>} Cài đặt sau khi cập nhật
   */
  static async update(id, data) {
    // Kiểm tra cài đặt tồn tại
    const setting = await this.findById(id);
    
    // Kiểm tra nếu cài đặt không được phép chỉnh sửa
    if (!setting.editable) {
      throw new ValidationError(
        'Cài đặt này không được phép chỉnh sửa'
      );
    }
    
    const { value, description } = data;
    
    try {
      const query = `
        UPDATE settings
        SET 
          value = COALESCE($1, value),
          description = COALESCE($2, description)
        WHERE id = $3
        RETURNING id, key, value, description, editable, created_at, updated_at
      `;
      
      const { rows } = await db.query(query, [value, description, id]);
      
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Cập nhật giá trị cài đặt theo key
   * @param {String} key - Key của cài đặt
   * @param {String} value - Giá trị mới
   * @returns {Promise<Object>} Cài đặt sau khi cập nhật
   */
  static async updateValue(key, value) {
    try {
      // Tìm cài đặt theo key
      const setting = await this.findByKey(key);
      
      // Kiểm tra nếu cài đặt không được phép chỉnh sửa
      if (!setting.editable) {
        throw new ValidationError(
          'Cài đặt này không được phép chỉnh sửa'
        );
      }
      
      const query = `
        UPDATE settings
        SET value = $1
        WHERE key = $2
        RETURNING id, key, value, description, editable, created_at, updated_at
      `;
      
      const { rows } = await db.query(query, [value, key]);
      
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Xóa cài đặt
   * @param {Number} id - ID của cài đặt
   * @returns {Promise<Boolean>} Kết quả xóa
   */
  static async delete(id) {
    // Kiểm tra cài đặt tồn tại
    const setting = await this.findById(id);
    
    // Kiểm tra nếu cài đặt không được phép chỉnh sửa
    if (!setting.editable) {
      throw new ValidationError(
        'Cài đặt này không được phép xóa'
      );
    }
    
    const query = 'DELETE FROM settings WHERE id = $1';
    await db.query(query, [id]);
    
    return true;
  }
  
  /**
   * Lấy cài đặt clinic
   * @returns {Promise<Object>} Thông tin clinic
   */
  static async getClinicInfo() {
    const clinicSettings = [
      'clinic_name',
      'clinic_address',
      'clinic_phone',
      'clinic_email',
      'clinic_open_time',
      'clinic_close_time',
      'clinic_max_appointments_per_day'
    ];
    
    const query = `
      SELECT key, value
      FROM settings
      WHERE key = ANY($1::text[])
    `;
    
    const { rows } = await db.query(query, [clinicSettings]);
    
    // Chuyển đổi thành đối tượng
    const clinicInfo = {};
    rows.forEach(row => {
      clinicInfo[row.key] = row.value;
    });
    
    return clinicInfo;
  }
}

module.exports = Setting;
