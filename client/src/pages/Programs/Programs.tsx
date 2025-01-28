import { useEffect, useState } from "react";
import "./Programs.css";

interface Program {
  id: number;
  title: string;
  synopsis: string;
  poster: string;
  country: string;
  year: number;
  category_id: number;
}

interface NewProgram {
  title: string;
  synopsis: string;
  poster: string;
  country: string;
  year?: number;
  category_id?: number;
}

type ValidationError = {
  field: string;
  message: string;
};

const Programs = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);

  const [newProgram, setNewProgram] = useState<NewProgram>({
    title: "",
    synopsis: "",
    poster: "",
    country: "",
  });

  const [formErrors, setFormErrors] = useState<ValidationError[]>([]);

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

    if (!newProgram.year || !newProgram.category_id) {
      setFormErrors([
        ...(newProgram.year
          ? []
          : [{ field: "year", message: "L'année est requise" }]),
        ...(newProgram.category_id
          ? []
          : [{ field: "category_id", message: "La catégorie est requise" }]),
      ]);
      return;
    }

    setFormErrors([]);

    fetch("http://localhost:3310/api/programs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProgram),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            const errors: ValidationError[] = data.validationErrors;
            setFormErrors(errors);
            throw new Error("Validation failed");
          });
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
        });
      })
      .catch((error) => console.error("Error adding program:", error));
  };

  const handleUpdateProgram = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingProgram) {
      if (
        !editingProgram.title ||
        !editingProgram.synopsis ||
        !editingProgram.country ||
        !editingProgram.year ||
        !editingProgram.category_id
      ) {
        console.error("Tous les champs obligatoires doivent être remplis.");
        return;
      }

      const { id, ...programData } = editingProgram;

      fetch(`http://localhost:3310/api/programs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(programData),
      })
        .then((response) => {
          if (response.ok) {
            fetchPrograms();
            setEditingProgram(null);
          } else {
            console.error("Erreur de mise à jour :", response);
          }
        })
        .catch((error) =>
          console.error("Erreur pendant la mise à jour :", error),
        );
    }
  };

  const handleEdit = (program: Program) => {
    setEditingProgram(program);
  };

  const handleCancelEdit = () => {
    setEditingProgram(null);
  };

  const handleConfirmDelete = (id: number) => {
    const userConfirmed = window.confirm(
      "Êtes-vous sûr de vouloir supprimer ce programme ? Cette action est irréversible.",
    );

    if (userConfirmed) {
      handleDeleteProgram(id);
    }
  };

  const handleDeleteProgram = (id: number) => {
    fetch(`http://localhost:3310/api/programs/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          fetchPrograms();
          setEditingProgram(null);
        } else {
          console.error("Erreur lors de la suppression :", response);
        }
      })
      .catch((error) =>
        console.error("Erreur pendant la suppression :", error),
      );
  };

  return (
    <div>
      <h1>Programmes</h1>

      <form onSubmit={handleAddProgram}>
        <h2>Ajouter un nouveau programme</h2>
        <div className="form-group">
          <label htmlFor="title">Titre</label>
          <input
            id="title"
            type="text"
            name="title"
            placeholder="Titre"
            value={newProgram.title || ""}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="synopsis">Synopsis</label>
          <textarea
            id="synopsis"
            name="synopsis"
            placeholder="Synopsis"
            value={newProgram.synopsis || ""}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="poster">URL de l'affiche</label>
          <input
            id="poster"
            type="text"
            name="poster"
            placeholder="URL de l'affiche"
            value={newProgram.poster || ""}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="country">Pays</label>
          <input
            id="country"
            type="text"
            name="country"
            placeholder="Pays"
            value={newProgram.country || ""}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="year">Année</label>
          <input
            id="year"
            type="number"
            name="year"
            placeholder="Année"
            value={newProgram.year || ""}
            onChange={handleInputChange}
            required
          />
          {formErrors.find((err) => err.field === "year") && (
            <p className="error">
              {formErrors.find((err) => err.field === "year")?.message}
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="category_id">Catégorie</label>
          <input
            id="category_id"
            type="number"
            name="category_id"
            placeholder="Numéro de catégorie"
            value={newProgram.category_id || ""}
            onChange={handleInputChange}
            required
          />
          {formErrors.find((err) => err.field === "category_id") && (
            <p className="error">
              {formErrors.find((err) => err.field === "category_id")?.message}
            </p>
          )}
        </div>

        <button type="submit">Ajouter un programme</button>
      </form>

      <ul className="programs-list">
        {programs.map((program) => (
          <li key={program.id} className="program-card">
            <div className="card-header">
              <img
                className="card-image"
                src={program.poster}
                alt={`Affiche de ${program.title}`}
              />
            </div>
            <div className="card-body">
              <h2 className="card-title">{program.title}</h2>
              <p className="card-synopsis">{program.synopsis}</p>
              <p className="card-country">
                <strong>Pays :</strong> {program.country}
              </p>
              <p className="card-year">
                <strong>Année :</strong> {program.year}
              </p>
              <p className="card-category">
                <strong>Catégorie :</strong> {program.category_id}
              </p>
              <button
                className="btn-edit"
                type="button"
                onClick={() => handleEdit(program)}
              >
                Modifier
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editingProgram && (
        <div className="modal">
          <div className="modal-content">
            <form onSubmit={handleUpdateProgram} className="form">
              <h2>Modifier un programme</h2>

              <div className="form-group">
                <label htmlFor="edit-title">Titre</label>
                <input
                  id="edit-title"
                  type="text"
                  name="title"
                  placeholder="Titre"
                  value={editingProgram.title}
                  onChange={(e) =>
                    setEditingProgram({
                      ...editingProgram,
                      title: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-synopsis">Synopsis</label>
                <textarea
                  id="edit-synopsis"
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
              </div>

              <div className="form-group">
                <label htmlFor="edit-poster">URL de l'affiche</label>
                <input
                  id="edit-poster"
                  type="text"
                  name="poster"
                  placeholder="URL de l'affiche"
                  value={editingProgram.poster}
                  onChange={(e) =>
                    setEditingProgram({
                      ...editingProgram,
                      poster: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-country">Pays</label>
                <input
                  id="edit-country"
                  type="text"
                  name="country"
                  placeholder="Pays"
                  value={editingProgram.country}
                  onChange={(e) =>
                    setEditingProgram({
                      ...editingProgram,
                      country: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-year">Année</label>
                <input
                  id="edit-year"
                  type="number"
                  name="year"
                  placeholder="Année"
                  value={editingProgram.year}
                  onChange={(e) =>
                    setEditingProgram({
                      ...editingProgram,
                      year: Number.parseInt(e.target.value, 10),
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-category-id">Catégorie</label>
                <input
                  id="edit-category-id"
                  type="number"
                  name="category_id"
                  placeholder="Catégorie ID"
                  value={editingProgram.category_id}
                  onChange={(e) =>
                    setEditingProgram({
                      ...editingProgram,
                      category_id: Number.parseInt(e.target.value, 10),
                    })
                  }
                  required
                />
              </div>

              <button type="submit">Mettre à jour</button>
              <button
                className="btn-cancel"
                type="button"
                onClick={handleCancelEdit}
              >
                Annuler
              </button>
              <button
                className="btn-delete"
                type="button"
                onClick={() => handleConfirmDelete(editingProgram.id)}
              >
                Supprimer
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Programs;
