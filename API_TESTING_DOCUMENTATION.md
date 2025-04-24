# API Testing Documentation - Private Clinic Management System

## Tổng quan

Tài liệu này cung cấp hướng dẫn toàn diện để kiểm thử API cho hệ thống quản lý phòng khám tư nhân. Nó bao gồm các phương pháp kiểm thử, công cụ được đề xuất và các test case chi tiết cho từng API endpoint.

## Nội dung

1. [Công cụ kiểm thử](#công-cụ-kiểm-thử)
2. [Môi trường kiểm thử](#môi-trường-kiểm-thử)
3. [Quy trình kiểm thử](#quy-trình-kiểm-thử)
4. [Test Cases theo API Endpoint](#test-cases-theo-api-endpoint)
5. [Authentication](#authentication)
6. [Bộ sưu tập Postman](#bộ-sưu-tập-postman)

## Công cụ kiểm thử

### Công cụ được đề xuất:

1. **Postman**: Để kiểm thử API thủ công và tạo bộ sưu tập test có thể tái sử dụng.
2. **Jest/Supertest**: Để viết unit test và integration test tự động.
3. **Newman**: Để chạy bộ sưu tập Postman từ dòng lệnh, phù hợp cho CI/CD.

### Cài đặt công cụ:

```bash
# Cài đặt Jest và Supertest cho unit testing
npm install --save-dev jest supertest

# Cài đặt Newman để chạy bộ sưu tập Postman từ dòng lệnh
npm install -g newman
```

## Môi trường kiểm thử

Thiết lập các môi trường kiểm thử sau:

1. **Local**: Môi trường phát triển cục bộ
   - URL: `http://localhost:3000/api`
   
2. **Development**: Môi trường phát triển dùng chung
   - URL: `https://dev-clinic-api.example.com/api`
   
3. **Staging**: Môi trường kiểm thử trước khi đưa vào sản phẩm
   - URL: `https://staging-clinic-api.example.com/api`
   
4. **Production**: Môi trường sản phẩm
   - URL: `https://clinic-api.example.com/api`

## Quy trình kiểm thử

1. **Kiểm thử đơn vị (Unit Testing)**:
   - Kiểm thử từng chức năng của model và controller một cách riêng lẻ.
   - Sử dụng mocks và stubs để cô lập các phụ thuộc.

2. **Kiểm thử tích hợp (Integration Testing)**:
   - Kiểm thử tương tác giữa các thành phần, ví dụ: controller với database.
   - Kiểm thử flow hoàn chỉnh qua nhiều API endpoint.

3. **Kiểm thử API đầu cuối (API Endpoint Testing)**:
   - Kiểm thử từng API endpoint với các trường hợp dữ liệu đầu vào khác nhau.
   - Kiểm tra mã trạng thái HTTP, định dạng phản hồi và nội dung phản hồi.

## Test Cases theo API Endpoint

### 1. Authentication APIs

#### 1.1 Đăng nhập: POST /api/auth/login

**Input**:
```json
{
  "username": "admin01",
  "password": "123456"
}
```

**Test Cases**:
- ✅ **TC001**: Đăng nhập thành công với thông tin đúng.
- ❌ **TC002**: Username không tồn tại.
- ❌ **TC003**: Mật khẩu không đúng.
- ❌ **TC004**: Tài khoản đã bị khóa (`is_active = false`).

#### 1.2 Lấy thông tin người dùng hiện tại: GET /api/auth/me

**Test Cases**:
- ✅ **TC005**: Lấy thông tin người dùng thành công với token hợp lệ.
- ❌ **TC006**: Token không hợp lệ.
- ❌ **TC007**: Token đã hết hạn.

#### 1.3 Đổi mật khẩu: POST /api/auth/change-password

**Input**:
```json
{
  "currentPassword": "123456",
  "newPassword": "1234567"
}
```

**Test Cases**:
- ✅ **TC008**: Đổi mật khẩu thành công.
- ❌ **TC009**: Mật khẩu hiện tại không đúng.
- ❌ **TC010**: Mật khẩu mới không đáp ứng yêu cầu (ít nhất 6 ký tự).

### 2. Patient APIs

#### 2.1 Lấy danh sách bệnh nhân: GET /api/patients

**Parameters**:
- `search`: Từ khóa tìm kiếm (optional)
- `page`: Số trang (optional, default: 1)
- `limit`: Số lượng bản ghi trên trang (optional, default: 10)

**Test Cases**:
- ✅ **TC011**: Lấy danh sách bệnh nhân thành công.
- ✅ **TC012**: Tìm kiếm bệnh nhân theo từ khóa thành công.
- ✅ **TC013**: Phân trang hoạt động chính xác.
- ❌ **TC014**: Không có quyền truy cập.

#### 2.2 Tạo bệnh nhân mới: POST /api/patients

**Input**:
```json
{
  "full_name": "Nguyễn Văn A",
  "gender": "male",
  "birth_year": 1990,
  "phone": "0912345678",
  "address": "123 Đường Nguyễn Trãi, Quận 1, TP.HCM"
}
```

**Test Cases**:
- ✅ **TC015**: Tạo bệnh nhân mới thành công.
- ❌ **TC016**: Số điện thoại đã tồn tại.
- ❌ **TC017**: Dữ liệu đầu vào không hợp lệ (thiếu trường bắt buộc).
- ❌ **TC018**: Không có quyền tạo bệnh nhân.

### 3. Appointment APIs

#### 3.1 Lấy danh sách cuộc hẹn: GET /api/appointments

**Parameters**:
- `patientId`: ID bệnh nhân (optional)
- `staffId`: ID nhân viên (optional)
- `date`: Ngày hẹn (optional)
- `status`: Trạng thái cuộc hẹn (optional)
- `page`: Số trang (optional, default: 1)
- `limit`: Số lượng bản ghi trên trang (optional, default: 10)

**Test Cases**:
- ✅ **TC019**: Lấy danh sách cuộc hẹn thành công.
- ✅ **TC020**: Lọc cuộc hẹn theo bệnh nhân.
- ✅ **TC021**: Lọc cuộc hẹn theo nhân viên.
- ✅ **TC022**: Lọc cuộc hẹn theo ngày.
- ✅ **TC023**: Lọc cuộc hẹn theo trạng thái.
- ❌ **TC024**: Không có quyền truy cập.

#### 3.2 Tạo cuộc hẹn mới: POST /api/appointments

**Input**:
```json
{
  "patient_id": 1,
  "staff_id": 2,
  "appointment_date": "2025-05-01",
  "appointment_time": "09:00",
  "reason": "Khám định kỳ",
  "status": "scheduled"
}
```

**Test Cases**:
- ✅ **TC025**: Tạo cuộc hẹn mới thành công.
- ❌ **TC026**: Bệnh nhân không tồn tại.
- ❌ **TC027**: Nhân viên không tồn tại.
- ❌ **TC028**: Thời gian đã có cuộc hẹn khác.
- ❌ **TC029**: Định dạng ngày/giờ không hợp lệ.

### 4. Medical Record APIs

#### 4.1 Lấy danh sách hồ sơ y tế: GET /api/medical-records

**Parameters**:
- `patientId`: ID bệnh nhân (optional)
- `staffId`: ID nhân viên (optional)
- `diseaseTypeId`: ID loại bệnh (optional)
- `startDate`: Ngày bắt đầu (optional)
- `endDate`: Ngày kết thúc (optional)
- `status`: Trạng thái (optional)
- `page`: Số trang (optional, default: 1)
- `limit`: Số lượng bản ghi trên trang (optional, default: 10)

**Test Cases**:
- ✅ **TC030**: Lấy danh sách hồ sơ y tế thành công.
- ✅ **TC031**: Lọc theo ID bệnh nhân.
- ✅ **TC032**: Lọc theo khoảng thời gian.
- ❌ **TC033**: Không có quyền truy cập.

#### 4.2 Tạo hồ sơ y tế mới: POST /api/medical-records

**Input**:
```json
{
  "patient_id": 1,
  "staff_id": 2,
  "examination_date": "2025-04-25",
  "symptoms": "Sốt, ho, đau họng",
  "diagnosis": "Viêm đường hô hấp trên",
  "disease_type_id": 1,
  "status": "completed",
  "notes": "Cần theo dõi"
}
```

**Test Cases**:
- ✅ **TC034**: Tạo hồ sơ y tế mới thành công.
- ❌ **TC035**: Bệnh nhân không tồn tại.
- ❌ **TC036**: Nhân viên không tồn tại.
- ❌ **TC037**: Loại bệnh không tồn tại.
- ❌ **TC038**: Dữ liệu đầu vào không hợp lệ.

### 5. Medicine APIs

#### 5.1 Lấy danh sách thuốc: GET /api/medicines

**Parameters**:
- `search`: Từ khóa tìm kiếm (optional)
- `unit`: Đơn vị thuốc (optional)
- `lowStock`: Lọc thuốc sắp hết (optional, boolean)
- `page`: Số trang (optional, default: 1)
- `limit`: Số lượng bản ghi trên trang (optional, default: 10)

**Test Cases**:
- ✅ **TC039**: Lấy danh sách thuốc thành công.
- ✅ **TC040**: Tìm kiếm thuốc theo tên.
- ✅ **TC041**: Lọc thuốc sắp hết hàng.
- ❌ **TC042**: Không có quyền truy cập.

#### 5.2 Tạo thuốc mới: POST /api/medicines

**Input**:
```json
{
  "name": "Paracetamol",
  "unit": "viên",
  "price": 5000,
  "quantity_in_stock": 100,
  "description": "Thuốc giảm đau, hạ sốt"
}
```

**Test Cases**:
- ✅ **TC043**: Tạo thuốc mới thành công.
- ❌ **TC044**: Tên thuốc đã tồn tại.
- ❌ **TC045**: Dữ liệu đầu vào không hợp lệ.
- ❌ **TC046**: Không có quyền tạo thuốc.

#### 5.3 Cập nhật số lượng thuốc: PUT /api/medicines/:id/stock

**Input**:
```json
{
  "quantity": 50,
  "operation": "add"
}
```

**Test Cases**:
- ✅ **TC047**: Thêm số lượng thuốc thành công.
- ✅ **TC048**: Giảm số lượng thuốc thành công (`operation: "subtract"`).
- ✅ **TC049**: Đặt số lượng thuốc thành công (`operation: "set"`).
- ❌ **TC050**: Số lượng trừ vượt quá số lượng hiện có.
- ❌ **TC051**: Thuốc không tồn tại.
- ❌ **TC052**: Không có quyền cập nhật.

### 6. Prescription APIs

#### 6.1 Tạo đơn thuốc mới: POST /api/prescriptions

**Input**:
```json
{
  "medical_record_id": 1,
  "items": [
    {
      "medicine_id": 1,
      "quantity": 10,
      "usage_instruction_id": 1,
      "notes": "Uống sau khi ăn"
    },
    {
      "medicine_id": 2,
      "quantity": 5,
      "usage_instruction_id": 2,
      "notes": "Uống trước khi đi ngủ"
    }
  ]
}
```

**Test Cases**:
- ✅ **TC053**: Tạo đơn thuốc thành công.
- ❌ **TC054**: Hồ sơ y tế không tồn tại.
- ❌ **TC055**: Thuốc không tồn tại.
- ❌ **TC056**: Cách dùng thuốc không tồn tại.
- ❌ **TC057**: Số lượng thuốc không đủ.
- ❌ **TC058**: Không có quyền tạo đơn thuốc.

### 7. Invoice APIs

#### 7.1 Tạo hóa đơn mới: POST /api/invoices

**Input**:
```json
{
  "patient_id": 1,
  "medical_record_id": 1,
  "items": [
    {
      "description": "Khám bệnh",
      "amount": 150000
    },
    {
      "description": "Thuốc",
      "amount": 250000
    }
  ],
  "payment_method": "cash",
  "notes": "Đã thanh toán đầy đủ"
}
```

**Test Cases**:
- ✅ **TC059**: Tạo hóa đơn thành công.
- ❌ **TC060**: Bệnh nhân không tồn tại.
- ❌ **TC061**: Hồ sơ y tế không tồn tại.
- ❌ **TC062**: Phương thức thanh toán không hợp lệ.
- ❌ **TC063**: Không có quyền tạo hóa đơn.

### 8. Role APIs

#### 8.1 Lấy danh sách vai trò: GET /api/roles

**Parameters**:
- `search`: Từ khóa tìm kiếm (optional)
- `page`: Số trang (optional, default: 1)
- `limit`: Số lượng bản ghi trên trang (optional, default: 10)

**Test Cases**:
- ✅ **TC064**: Lấy danh sách vai trò thành công.
- ❌ **TC065**: Không có quyền truy cập.

#### 8.2 Thêm quyền cho vai trò: POST /api/roles/:id/permissions

**Input**:
```json
{
  "permission_id": 1
}
```

**Test Cases**:
- ✅ **TC066**: Thêm quyền cho vai trò thành công.
- ❌ **TC067**: Vai trò không tồn tại.
- ❌ **TC068**: Quyền không tồn tại.
- ❌ **TC069**: Quyền đã tồn tại trong vai trò.
- ❌ **TC070**: Không có quyền cập nhật vai trò.

### 9. Setting APIs

#### 9.1 Lấy thông tin phòng khám: GET /api/settings/clinic

**Test Cases**:
- ✅ **TC071**: Lấy thông tin phòng khám thành công.
- ❌ **TC072**: Không có quyền truy cập.

#### 9.2 Cập nhật cài đặt theo key: PUT /api/settings/key/:key

**Input**:
```json
{
  "value": "Phòng khám tư nhân ABC",
  "description": "Tên phòng khám"
}
```

**Test Cases**:
- ✅ **TC073**: Cập nhật cài đặt thành công.
- ❌ **TC074**: Key không tồn tại.
- ❌ **TC075**: Dữ liệu đầu vào không hợp lệ.
- ❌ **TC076**: Không có quyền cập nhật cài đặt.

### 10. Disease Type APIs

#### 10.1 Lấy danh sách loại bệnh: GET /api/disease-types

**Parameters**:
- `search`: Từ khóa tìm kiếm (optional)
- `page`: Số trang (optional, default: 1)
- `limit`: Số lượng bản ghi trên trang (optional, default: 10)

**Test Cases**:
- ✅ **TC077**: Lấy danh sách loại bệnh thành công.
- ❌ **TC078**: Không có quyền truy cập.

#### 10.2 Tạo loại bệnh mới: POST /api/disease-types

**Input**:
```json
{
  "name": "Viêm phổi",
  "description": "Bệnh về đường hô hấp"
}
```

**Test Cases**:
- ✅ **TC079**: Tạo loại bệnh mới thành công.
- ❌ **TC080**: Tên loại bệnh đã tồn tại.
- ❌ **TC081**: Dữ liệu đầu vào không hợp lệ.
- ❌ **TC082**: Không có quyền tạo loại bệnh.

### 11. Usage Instruction APIs

#### 11.1 Lấy danh sách cách dùng thuốc: GET /api/usage-instructions

**Parameters**:
- `search`: Từ khóa tìm kiếm (optional)
- `page`: Số trang (optional, default: 1)
- `limit`: Số lượng bản ghi trên trang (optional, default: 10)

**Test Cases**:
- ✅ **TC083**: Lấy danh sách cách dùng thuốc thành công.
- ❌ **TC084**: Không có quyền truy cập.

#### 11.2 Tạo cách dùng thuốc mới: POST /api/usage-instructions

**Input**:
```json
{
  "instruction": "Uống 1 viên/lần, ngày 2 lần sau khi ăn",
  "description": "Dùng cho thuốc kháng sinh"
}
```

**Test Cases**:
- ✅ **TC085**: Tạo cách dùng thuốc mới thành công.
- ❌ **TC086**: Cách dùng thuốc đã tồn tại.
- ❌ **TC087**: Vượt quá giới hạn số lượng cách dùng.
- ❌ **TC088**: Dữ liệu đầu vào không hợp lệ.
- ❌ **TC089**: Không có quyền tạo cách dùng thuốc.

## Authentication

Tất cả các API (ngoại trừ /api/auth/login) đều yêu cầu xác thực bằng token JWT.

### Headers cho API có xác thực:

```
Authorization: Bearer <jwt_token>
```

**Test Cases cho xác thực**:
- ❌ **TC090**: Không cung cấp token.
- ❌ **TC091**: Token không hợp lệ.
- ❌ **TC092**: Token đã hết hạn.
- ❌ **TC093**: Người dùng không còn hoạt động (`is_active = false`).

## Bộ sưu tập Postman

Để thuận tiện cho việc kiểm thử, một bộ sưu tập Postman đã được tạo sẵn bao gồm tất cả các API endpoint với các test script tự động.

### Cách sử dụng bộ sưu tập Postman:

1. Tạo thư mục `postman` trong dự án.
2. Tạo các file sau trong thư mục `postman`:
   - `PrivateClinic.postman_collection.json`: Chứa bộ sưu tập API
   - `Local.postman_environment.json`: Chứa biến môi trường cho môi trường local
   - `Development.postman_environment.json`: Chứa biến môi trường cho môi trường phát triển
   - `Staging.postman_environment.json`: Chứa biến môi trường cho môi trường staging
   - `Production.postman_environment.json`: Chứa biến môi trường cho môi trường sản phẩm

3. Thiết lập các biến môi trường:
   - `baseUrl`: URL cơ sở của API
   - `token`: Token JWT (sẽ được tự động cập nhật sau khi đăng nhập)
   - `refreshToken`: Refresh token (nếu có)

### Chạy bộ sưu tập từ dòng lệnh (sử dụng Newman):

```bash
newman run postman/PrivateClinic.postman_collection.json -e postman/Local.postman_environment.json
```

## Cách viết Unit Tests với Jest và Supertest

### Cấu trúc thư mục tests:

```
tests/
  ├── auth/
  │   ├── login.test.js
  │   └── me.test.js
  ├── patients/
  │   ├── get.test.js
  │   └── create.test.js
  └── ...
```

### Ví dụ test cho API đăng nhập:

```javascript
// tests/auth/login.test.js
const request = require('supertest');
const app = require('../../src/app');

describe('Auth API - Login', () => {
  it('should login with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'doctor01',
        password: 'doctor123'
      });
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('token');
  });

  it('should reject invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'doctor01',
        password: 'wrongpassword'
      });
    
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('success', false);
  });
});
```

### Thêm script test vào package.json:

```json
{
  "scripts": {
    "test": "jest --runInBand",
    "test:auth": "jest --testPathPattern=tests/auth",
    "test:patients": "jest --testPathPattern=tests/patients"
  }
}
```

Chạy unit tests:

```bash
npm test
```

## Quy trình CI/CD cho Testing

1. **Tạo file cấu hình GitHub Actions**:

```yaml
# .github/workflows/test.yml
name: API Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:latest
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: clinic_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
          
    steps:
    - uses: actions/checkout@v2
    - name: Use Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '20.x'
    - name: Install dependencies
      run: npm ci
    - name: Set up database
      run: node setup-test-db.js
    - name: Run tests
      run: npm test
      env:
        NODE_ENV: test
        DB_HOST: localhost
        DB_PORT: 5432
        DB_NAME: clinic_test
        DB_USER: postgres
        DB_PASSWORD: postgres
        JWT_SECRET: test_jwt_secret
        PORT: 3000
```

2. **Tạo file setup-test-db.js** để khởi tạo cơ sở dữ liệu test:

```javascript
// setup-test-db.js
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const setupDatabase = async () => {
  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'clinic_test',
    user: 'postgres',
    password: 'postgres'
  });

  try {
    // Đọc file SQL
    const sqlFile = fs.readFileSync(path.join(__dirname, 'setup_database.sql'), 'utf8');
    
    // Thực thi các câu lệnh SQL
    await pool.query(sqlFile);
    
    console.log('Test database setup complete');
  } catch (error) {
    console.error('Error setting up test database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

setupDatabase();
```

## Thực hành Test-Driven Development (TDD)

1. Viết test case trước.
2. Viết code để vượt qua test.
3. Refactor code nếu cần thiết.
4. Lặp lại.

Quy trình này đảm bảo tất cả code được viết đều có test và đáp ứng các yêu cầu đã định nghĩa.
