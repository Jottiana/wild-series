import { useEffect, useState } from "react";
import "./Programs.css";

interface Program {
  id: number;
  title: string;
  synopsis: string;
  poster: string;
  country: string;
  year: number;
}

const Programs = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [newProgram, setNewProgram] = useState<Partial<Program>>({
    title: "",
    synopsis: "",
    poster: "",
    country: "",
    year: undefined,
  });

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = () => {
    fetch("http://localhost:3310/api/programs")
      .then((response) => response.json())
      .then((data) => setPrograms(data))
      .catch((error) => console.error("Error fetching programs:", error));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewProgram({ ...newProgram, [name]: value });
  };

  const handleAddProgram = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !newProgram.title ||
      !newProgram.synopsis ||
      !newProgram.country ||
      !newProgram.year
    ) {
      console.error("Missing required fields.");
      return;
    }

    fetch("http://localhost:3310/api/programs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProgram),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add program");
        }
        return response.json();
      })
      .then(() => {
        fetchPrograms();
        setNewProgram({
          title: "",
          synopsis: "",
          poster: "",
          country: "",
          year: undefined,
        });
      })
      .catch((error) => console.error("Error adding program:", error));
  };

  const handleUpdateProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProgram) {
      fetch(`http://localhost:3310/api/programs/${editingProgram.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProgram),
      })
        .then((response) => {
          if (response.ok) {
            fetchPrograms();
            setEditingProgram(null);
          } else {
            console.error("Error updating program:", response);
          }
        })
        .catch((error) => console.error("Error updating program:", error));
    }
  };

  const handleEdit = (program: Program) => {
    setEditingProgram(program);
  };

  const handleCancelEdit = () => {
    setEditingProgram(null);
  };

  return (
    <div>
      <h1>Programs</h1>

      <form onSubmit={handleAddProgram}>
        <h2>Add a New Program</h2>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={newProgram.title || ""}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="synopsis"
          placeholder="Synopsis"
          value={newProgram.synopsis || ""}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="poster"
          placeholder="Poster URL"
          value={newProgram.poster || ""}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={newProgram.country || ""}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="year"
          placeholder="Year"
          value={newProgram.year || ""}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Add Program</button>
      </form>

      <ul>
        {programs.map((program) => (
          <li key={program.id}>
            <h2>{program.title}</h2>
            <p>{program.synopsis}</p>
            <img src={program.poster} alt={program.title} />
            <p>Country: {program.country}</p>
            <p>Year: {program.year}</p>

            <button type="button" onClick={() => handleEdit(program)}>
              Edit
            </button>
          </li>
        ))}
      </ul>

      {editingProgram && (
        <form onSubmit={handleUpdateProgram}>
          <h2>Edit Program</h2>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={editingProgram.title}
            onChange={(e) =>
              setEditingProgram({ ...editingProgram, title: e.target.value })
            }
            required
          />
          <textarea
            name="synopsis"
            placeholder="Synopsis"
            value={editingProgram.synopsis}
            onChange={(e) =>
              setEditingProgram({
                ...editingProgram,
                synopsis: e.target.value,
              })
            }
            required
          />
          <input
            type="text"
            name="poster"
            placeholder="Poster URL"
            value={editingProgram.poster}
            onChange={(e) =>
              setEditingProgram({
                ...editingProgram,
                poster: e.target.value,
              })
            }
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={editingProgram.country}
            onChange={(e) =>
              setEditingProgram({
                ...editingProgram,
                country: e.target.value,
              })
            }
            required
          />
          <input
            type="number"
            name="year"
            placeholder="Year"
            value={editingProgram.year}
            onChange={(e) =>
              setEditingProgram({
                ...editingProgram,
                year: Number.parseInt(e.target.value, 10),
              })
            }
            required
          />
          <button type="submit">Update Program</button>
          <button type="button" onClick={handleCancelEdit}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default Programs;
