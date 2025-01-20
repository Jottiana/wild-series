import joi from "joi";

export const programSchema = joi.object({
  title: joi.string().max(255).required().messages({
    "string.base": "Title must be a string",
    "string.max": "Title must be less than 255 characters",
    "any.required": "Title is required",
  }),
  synopsis: joi.string().max(1000).required().messages({
    "string.base": "Synopsis must be a string",
    "string.max": "Synopsis must be less than 1000 characters",
    "any.required": "Synopsis is required",
  }),
  poster: joi.string().uri().required().messages({
    "string.base": "Poster must be a valid URL",
    "string.uri": "Poster must be a valid URL",
    "any.required": "Poster is required",
  }),
  country: joi.string().max(255).required().messages({
    "string.base": "Country must be a string",
    "string.max": "Country must be less than 255 characters",
    "any.required": "Country is required",
  }),
  year: joi
    .string()
    .pattern(/^\d{4}$/)
    .required()
    .messages({
      "string.base": "Year must be a string",
      "string.pattern.base": "Year must be a 4-digit number",
      "any.required": "Year is required",
    }),
});
