// ============================================
// Zod Validation Middleware
// ============================================

function validate(schema) {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { validate };
