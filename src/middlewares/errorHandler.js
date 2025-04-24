/**
 * Middleware xử lý lỗi toàn cục
 */
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  // Xử lý lỗi PostgreSQL
  if (err.code && err.code.startsWith('P')) {
    // Xử lý lỗi theo mã lỗi của PostgreSQL
    if (err.code === 'P0001') {
      // Custom error từ trigger 
      return res.status(400).json({ 
        error: 'Bad Request',
        message: err.message || 'Database constraint violation',
        detail: err.detail,
        hint: err.hint
      });
    }
    
    // Lỗi vi phạm ràng buộc khóa ngoại
    if (err.code === '23503') {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: 'Foreign key constraint violation',
        detail: err.detail
      });
    }
    
    // Lỗi vi phạm ràng buộc khóa chính/unique
    if (err.code === '23505') {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: 'Unique constraint violation',
        detail: err.detail
      });
    }
    
    // Lỗi vi phạm ràng buộc check
    if (err.code === '23514') {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: 'Check constraint violation',
        detail: err.detail
      });
    }
  }

  // Xử lý lỗi 404
  if (err.name === 'NotFoundError') {
    return res.status(404).json({
      error: 'Not Found',
      message: err.message
    });
  }

  // Xử lý lỗi xác thực
  if (err.name === 'AuthenticationError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: err.message
    });
  }

  // Xử lý lỗi phân quyền
  if (err.name === 'AuthorizationError') {
    return res.status(403).json({
      error: 'Forbidden',
      message: err.message
    });
  }

  // Xử lý lỗi validation
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Bad Request',
      message: err.message,
      errors: err.errors
    });
  }

  // Xử lý lỗi chung
  return res.status(err.statusCode || 500).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'Something went wrong on the server'
  });
};

module.exports = {
  errorHandler
};
