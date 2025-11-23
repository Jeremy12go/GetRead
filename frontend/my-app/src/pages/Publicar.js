import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createBook, uploadBookImage } from "../API/APIGateway";
import "../styles/register.css";
import "../styles/styles.css";
import "../styles/publicar.css";

const GENRES = [
  'Novela','Cuento','Fabula','Poesia','Comedia','Drama','Filosofico','Cientifico',
  'Fantasia','Ciencia Ficción','Terror','Misterio','Suspenso','Romance','Aventura',
  'Biografia','Historia','Ciencia','Filosofia','Psicologia','Autoayuda','Politica',
  'Economia','Educación','Arte','Musica','Cine','Tecnologia','Turismo','Gastronomia',
  'Espiritualidad','Religión'
];

const PUBLIC_RANGE = ['Infantil','Juvenil','Adulto','Todo Publico'];

function PublicarLibro() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setISBN] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errorForm, setErrorForm] = useState("");
  const [genre, setGenre] = useState([]);
  const [publicRange, setPublicRange] = useState("Adulto");
  const [genreDropdownOpen, setGenreDropdownOpen] = useState(false);
  const genreDropdownRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isbn || !name || !author || !description || !price || !stock || genre.length === 0) {
      setErrorForm("Debes completar todos los campos.");
      return;
    }

    try {
      setErrorForm("");
      const savedAccount = JSON.parse(localStorage.getItem("account"));
      const profileId = savedAccount.profileseller;

      console.log("📦 Payload enviado:", {
        idseller: profileId,
        isbn,
        author,
        name,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        description,
        genre,
        public_range: publicRange,
      });

      const res = await createBook({
        idseller: profileId,
        isbn,
        author,
        name,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        description,
        genre,
        public_range: publicRange,
      });

      console.log("📘 Libro completo devuelto por el backend:", res.data);
      const bookId = res.data._id;
      

      if (imageFile) {
        setUploadingImage(true);
        await uploadBookImage(bookId, imageFile);
        setUploadingImage(false);
      }

      alert("Libro publicado correctamente");
      navigate("/home");
    } catch (err) {
      console.error("Error al publicar libro:", err.response?.data || err.message || err);
      setErrorForm("Error al publicar el libro");
    }
  };

  const handleGenreChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setGenre(selectedOptions);
  };

  return (
    <div className="container-libros">
        <p className="text-titulos2">Publicar Libro</p>
      <form className="form-row" onSubmit={handleSubmit}>
        

        <div className="form-group">

            <label className="text">Título*</label>
            <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            />
        </div>

        <div className="form-group">
            <label className="text">Autor*</label>
            <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="input"
            />
        </div>

        <div className="form-group">
            <label className="text">ISBN*</label>
            <input
            type="text"
            value={isbn}
            onChange={(e) => setISBN(e.target.value)}
            className="input"
            />
        </div>

        <div className="form-group">
        <label className="text">Descripción*</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea"
          rows="4"
        />
        </div>

        <div className="form-group">
        <label className="text">Precio*</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="input"
        />
        </div>

        <div className="form-group">
        <label className="text">Stock*</label>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="input"
        />
        </div>

        <div className="form-group">
        <label className="text">Géneros*</label>
        <div className="genre-dropdown" ref={genreDropdownRef}>
          <button
            type="button"
            className="genre-dropdown-btn"
            onClick={() => setGenreDropdownOpen(!genreDropdownOpen)}
          >
            {genre.length === 0 ? "Selecciona géneros..." : `${genre.length} seleccionados`}
            <span className={`dropdown-arrow ${genreDropdownOpen ? "open" : ""}`}>▼</span>
          </button>

          {genreDropdownOpen && (
            <div className="genre-dropdown-content">
              {GENRES.map(g => (
                <label key={g} className="genre-option">
                  <input
                    type="checkbox"
                    checked={genre.includes(g)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setGenre([...genre, g]);
                      } else {
                        setGenre(genre.filter(x => x !== g));
                      }
                    }}
                  />
                  <span>{g}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        </div>

        {genre.length > 0 && (
          <p style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
            Seleccionados: {genre.join(", ")}
          </p>
        )}

        <div className="form-group">
        <label className="text">Rango de público*</label>
        <select 
          className="input" 
          value={publicRange} 
          onChange={e => setPublicRange(e.target.value)}
        >
          {PUBLIC_RANGE.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        </div>

        <div className="form-group">
        <label className="text">Imagen del libro</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="input"
        />
        </div>

        <button className="button" type="submit" disabled={uploadingImage}>
          {uploadingImage ? "Subiendo imagen..." : "Publicar"}
        </button>

        {errorForm && <p style={{ color: "red" }}>{errorForm}</p>}
      </form>
    </div>
  );
}

export default PublicarLibro;