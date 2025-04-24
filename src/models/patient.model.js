const db = require('../config/db');
const { NotFoundError } = require('../utils/apiError');

/**
 * Patient Model
 * Quản lý thao tác với bảng patients
 */
class Patient {
  /**
   * Lấy tất cả bệnh nhân
   * @param {Object} options - Các tùy chọn lọc và phân trang
   * @returns {Promise<Array>} Danh sách bệnh nhân
   */
  static async findAll(options = {}) {
    const { search = '', page = 1, limit = 10 } = options;
    const offset = (page - 1) * limit;
    
    const query = `
      SELECT 
        id, full_name, gender, birth_year, 
        phone, address, created_at, updated_at,
        (SELECT EXTRACT(YEAR FROM CURRENT_DATE) - birth_year) AS age
      FROM patients
      WHERE 
        full_name ILIKE $1 OR
        phone ILIKE $1 OR
        address ILIKE $1
      ORDER BY full_name
      LIMIT $2 OFFSET $3
    `;
    
    const countQuery = `
      SELECT COUNT(*) FROM patients
      WHERE 
        full_name ILIKE $1 OR
        phone ILIKE $1 OR
        address ILIKE $1
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
   * Tìm bệnh nhân theo ID
   * @param {Number} id - ID của bệnh nhân
   * @returns {Promise<Object>} Thông tin bệnh nhân
   */
  static async findById(id) {
    const query = `
      SELECT 
        id, full_name, gender, birth_year, 
        phone, address, created_at, updated_at,
        (SELECT EXTRACT(YEAR FROM CURRENT_DATE) - birth_year) AS age
      FROM patients
      WHERE id = $1
    `;
    
    const { rows } = await db.query(query, [id]);
    
    if (rows.length === 0) {
      throw new NotFoundError('Không tìm thấy bệnh nhân');
    }
    
    return rows[0];
  }
  
  /**
   * Tạo bệnh nhân mới
   * @param {Object} data - Dữ liệu bệnh nhân
   * @returns {Promise<Object>} Bệnh nhân mới tạo
   */
  static async create(data) {
    const { full_name, gender, birth_year, phone, address } = data;
    
    const query = `
      INSERT INTO patients (full_name, gender, birth_year, phone, address)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, full_name, gender, birth_year, phone, address, created_at, updated_at
    `;
    
    const { rows } = await db.query(query, [full_name, gender, birth_year, phone, address]);
    
    return rows[0];
  }
  
  /**
   * Cập nhật thông tin bệnh nhân
   * @param {Number} id - ID của bệnh nhân
   * @param {Object} data - Dữ liệu cập nhật
   * @returns {Promise<Object>} Bệnh nhân sau khi cập nhật
   */
  static async update(id, data) {
    // Kiểm tra bệnh nhân tồn tại
    await this.findById(id);
    
    const { full_name, gender, birth_year, phone, address } = data;
    
    const query = `
      UPDATE patients
      SET 
        full_name = COALESCE($1, full_name),
        gender = COALESCE($2, gender),
        birth_year = COALESCE($3, birth_year),
        phone = COALESCE($4, phone),
        address = COALESCE($5, address)
      WHERE id = $6
      RETURNING id, full_name, gender, birth_year, phone, address, created_at, updated_at
    `;
    
    const { rows } = await db.query(query, [
      full_name, gender, birth_year, phone, address, id
    ]);
    
    return rows[0];
  }
  
  /**
   * Xóa bệnh nhân
   * @param {Number} id - ID của bệnh nhân
   * @returns {Promise<Boolean>} Kết quả xóa
   */
  static async delete(id) {
    // Kiểm tra bệnh nhân tồn tại
    await this.findById(id);
    
    try {
      const query = 'DELETE FROM patients WHERE id = $1';
      await db.query(query, [id]);
      return true;
    } catch (error) {
      if (error.code === '23503') { // Foreign key constraint violation
        throw new Error('Không thể xóa bệnh nhân này vì đã có dữ liệu liên quan');
      }
      throw error;
    }
  }
  
  /**
   * Lấy lịch sử khám bệnh của bệnh nhân
   * @param {Number} id - ID của bệnh nhân
   * @returns {Promise<Array>} Lịch sử khám bệnh
   */
  static async getMedicalHistory(id) {
    // Kiểm tra bệnh nhân tồn tại
    await this.findById(id);
    
    const query = `
      SELECT 
        mr.id, mr.examination_date, mr.symptoms, mr.diagnosis, 
        dt.name as disease_type, mr.status,
        s.full_name as doctor_name
      FROM medical_records mr
      JOIN disease_types dt ON mr.disease_type_id = dt.id
      JOIN staff s ON mr.staff_id = s.id
      WHERE mr.patient_id = $1
      ORDER BY mr.examination_date DESC
    `;
    
    const { rows } = await db.query(query, [id]);
    
    return rows;
  }
}

module.exports = Patient;
