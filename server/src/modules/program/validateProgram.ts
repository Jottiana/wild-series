import type { RequestHandler } from "express";
import { programSchema } from "./programValidator";

const validateProgram: RequestHandler = (req, res, next) => {
  const { error } = programSchema.validate(req.body, { abortEarly: false });

  if (!error) {
    next();
  } else {
    res.status(400).json({
      validationErrors: error.details.map((err) => ({
        field: err.path[0],
        message: err.message,
      })),
    });
  }
};

export default validateProgram;
