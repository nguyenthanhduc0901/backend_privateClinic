/**
 * Middleware xử lý lỗi toàn cục
 */
const errorHandler = (err, req, res, next) => {
  console.dir(err, { depth: null });

  const pgCode =
    err.code || err.parent?.code || err.original?.code || null;

  if (pgCode) {
    switch (pgCode) {
      case 'P0001':   // Trigger raise
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Database constraint violation',
          detail: err.parent?.detail || err.detail,
          hint: err.parent?.hint || err.hint
        });
      case '23503':   // FK
        return res.status(400).json({ error: 'Bad Request', message: 'Foreign key violation', detail: err.parent?.detail || err.detail });
      case '23505':   // Unique
        return res.status(400).json({ error: 'Bad Request', message: 'Unique violation', detail: err.parent?.detail || err.detail });
      case '23514':   // Check
        return res.status(400).json({ error: 'Bad Request', message: 'Check violation', detail: err.parent?.detail || err.detail });
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
