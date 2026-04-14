const { ZodError } = require('zod');

// Middleware to strictly enforce schemas and strip unknown keys
const validate = (schema) => (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: "Données de formulaire manquantes ou invalides." 
    });
  }

  try {
    // schema.parse will recursively validate and strip out unlisted fields!
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = (error.errors || []).map((issue) => issue.message).join(', ');
      return res.status(400).json({ 
        success: false, 
        message: `Erreur de validation: ${errorMessages}` 
      });
    }
    next(error);
  }
};

module.exports = { validate };
