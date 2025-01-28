import joi from "joi";

export const programSchema = joi.object({
  title: joi.string().max(255).required().messages({
    "string.base": "Le titre doit être une chaîne de caractères.",
    "string.max": "Le titre ne doit pas dépasser 255 caractères.",
    "any.required": "Le titre est obligatoire.",
  }),
  synopsis: joi.string().max(1000).required().messages({
    "string.base": "Le synopsis doit être une chaîne de caractères.",
    "string.max": "Le synopsis ne doit pas dépasser 1000 caractères.",
    "any.required": "Le synopsis est obligatoire.",
  }),
  poster: joi.string().uri().required().messages({
    "string.base": "L'URL de l'affiche doit être une chaîne de caractères.",
    "string.uri": "L'URL de l'affiche doit être une URL valide.",
    "any.required": "L'URL de l'affiche est obligatoire.",
  }),
  country: joi.string().max(255).required().messages({
    "string.base": "Le pays doit être une chaîne de caractères.",
    "string.max": "Le pays ne doit pas dépasser 255 caractères.",
    "any.required": "Le pays est obligatoire.",
  }),
  year: joi.number().integer().min(1900).max(2100).required().messages({
    "number.base": "L'année doit être un nombre entier.",
    "number.integer": "L'année doit être un entier.",
    "number.min": "L'année doit être au moins 1900.",
    "number.max": "L'année doit être au plus 2100.",
    "any.required": "L'année est obligatoire.",
  }),
  category_id: joi.number().integer().required().messages({
    "number.base": "L'identifiant de la catégorie doit être un nombre.",
    "number.integer": "L'identifiant de la catégorie doit être un entier.",
    "any.required": "La catégorie est obligatoire.",
  }),
});
