import type { RequestHandler } from "express";
import ProgramRepository from "./programRepository";
import programRepository from "./programRepository";

const browse: RequestHandler = async (req, res) => {
  const programsFromDB = await ProgramRepository.readAll();

  res.json(programsFromDB);
};

const read: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id) || id <= 0) {
      res.status(400).json({
        error: "Invalid program ID",
      });
      return;
    }

    const program = await programRepository.read(id);

    if (!program) {
      res.sendStatus(404);
      return;
    }

    res.json(program);
  } catch (err) {
    next(err);
  }
};

const add: RequestHandler = async (req, res, next) => {
  try {
    const newProgram = {
      title: req.body.title,
      synopsis: req.body.synopsis,
      poster: req.body.poster,
      country: req.body.country,
      year: req.body.year,
      category_id: req.body.category_id,
    };

    const insertId = await programRepository.create(newProgram);

    res.status(201).json({ insertId });
  } catch (err) {
    next(err);
  }
};

const edit: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { title, synopsis, poster, country, year, category_id } = req.body;

    const updated = await ProgramRepository.update(id, {
      title,
      synopsis,
      poster,
      country,
      year,
      category_id,
    });

    if (updated) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.error("Error during update:", err);
    next(err);
  }
};

const deleteProgram: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const deleted = await ProgramRepository.delete(id);

    if (deleted) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    next(err);
  }
};

export default { browse, read, add, edit, delete: deleteProgram };
