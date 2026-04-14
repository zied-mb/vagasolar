const { z } = require('zod');

// We use default Zod objects which automatically strip out unknown keys when parsed.
// This prevents 'Mass Assignment' vulnerabilities (e.g. sending isApproved: true).

const testimonialSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  role: z.string().optional(),
  content: z.string().min(10, "Le message doit contenir au moins 10 caractères").max(1000),
  rating: z.number().min(1).max(5),
  image: z.string().url("URL d'image invalide").optional().or(z.literal('')),
});

const subscriberSchema = z.object({
  email: z.string().email("Format d'email invalide"),
});

module.exports = {
  testimonialSchema,
  subscriberSchema
};
