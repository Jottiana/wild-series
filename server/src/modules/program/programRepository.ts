import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";

type Program = {
  id: number;
  title: string;
  synopsis: string;
  poster: string;
  country: string;
  year: number;
  category_id: number;
};

class ProgramRepository {
  // Browse (Read All)
  async readAll() {
    const [rows] = await databaseClient.query<Rows>("select * from program");
    return rows as Program[];
  }

  // Read (Read One)
  async read(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "select * from program where id = ?",
      [id],
    );
    return rows[0] as Program | undefined;
  }

  // Add (Create)
  async create(program: Omit<Program, "id">) {
    const [result] = await databaseClient.query<Result>(
      "insert into program (title, synopsis, poster, country, year, category_id) values (?, ?, ?, ?, ?, ?)",
      [
        program.title,
        program.synopsis,
        program.poster,
        program.country,
        program.year,
        program.category_id,
      ],
    );
    return result.insertId;
  }

  // Edit (Update)
  async update(id: number, program: Partial<Omit<Program, "id">>) {
    const [result] = await databaseClient.query<Result>(
      `update program set 
        title = coalesce(?, title), 
        synopsis = coalesce(?, synopsis), 
        poster = coalesce(?, poster), 
        country = coalesce(?, country), 
        year = coalesce(?, year),
        category_id = coalesce(?, category_id)
      where id = ?`,
      [
        program.title,
        program.synopsis,
        program.poster,
        program.country,
        program.year,
        program.category_id,
        id,
      ],
    );
    return result.affectedRows > 0;
  }

  // Delete
  async delete(id: number) {
    const [result] = await databaseClient.query<Result>(
      "delete from program where id = ?",
      [id],
    );
    return result.affectedRows > 0;
  }
}

export default new ProgramRepository();
