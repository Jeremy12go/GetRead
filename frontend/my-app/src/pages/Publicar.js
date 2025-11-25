import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createBook } from "../API/APIGateway";
import "../styles/register.css";
import "../styles/styles.css";
import "../styles/publicar.css";
import { translations } from '../components/translations.js';

const GENRES = [
  'Novela','Cuento','Fabula','Poesía','Comedia','Drama','Filosófico','Científico',
  'Fantasía','Ciencia Ficción','Terror','Misterio','Suspenso','Romance','Aventura',
  'Biografía','Historia','Ciencia','Filosofía','Psicología','Autoayuda','Política',
  'Economía','Educación','Arte','Música','Cine','Tecnología','Turismo','Gastronomía',
  'Espiritualidad','Religión'
];

const PUBLIC_RANGE = ['Infantil','Juvenil','Adulto','Todo Público'];

function PublicarLibro( { language, setLanguage } ) {
  const navigate = useNavigate();

  const [ name, setName ] = useState('');
  const [ author, setAuthor ] = useState('');
  const [ isbn, setISBN ] = useState('');
  const [ description, setDescription ] = useState('');
  const [ price, setPrice ] = useState(0);
  const [ stock, setStock ] = useState(0);
  const [ imageFile, setImageFile ] = useState(null);
  const [ uploadingImage, setUploadingImage ] = useState(false);
  const [ errorForm, setErrorForm ] = useState('');
  const [ genre, setGenre ] = useState([]);
  const [ publicRange, setPublicRange ] = useState('Adulto');
  const [ genreDropdownOpen, setGenreDropdownOpen ] = useState(false);
  const genreDropdownRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isbn || !name || !author || !description || !price || !stock || genre.length === 0) {
      setErrorForm(translations[language].publicar_alert);
      return;
    }

    try {
      setErrorForm("");
      const savedAccount = JSON.parse(localStorage.getItem("account"));
      const profileId = savedAccount.profileseller;

      console.log("Payload enviado:", {
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

      const formData = new FormData();
      formData.append("idseller", profileId);
      formData.append("isbn", isbn);
      formData.append("author", author);
      formData.append("name", name);
      formData.append("price", parseFloat(price));
      formData.append("stock", parseInt(stock, 10));
      formData.append("description", description);
      formData.append("genre", JSON.stringify(genre));
      formData.append("public_range", publicRange);
      formData.append("image", imageFile);

      await createBook(formData);

      /*
      console.log("Libro completo devuelto por el backend:", res.data);
      const bookId = res.data._id;
      

      if (imageFile) {
        setUploadingImage(true);
        await uploadBookImage(bookId, imageFile);
        setUploadingImage(false);
      }
      */
      alert(translations[language].publicar_alert2);
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
        <p className="text-titulos2">{translations[language].publicar}</p>
      <form className="form-row" onSubmit={handleSubmit}>
        

        <div className="form-group">

            <label className="text">{translations[language].publicar_titulo}</label>
            <input
            type="text"
            value={ name }
            onChange={(e) => setName(e.target.value)}
            className="input"
            />
        </div>

        <div className="form-group">
            <label className="text">{translations[language].publicar_autor}</label>
            <input
            type="text"
            value={ author }
            onChange={(e) => setAuthor(e.target.value)}
            className="input"
            />
        </div>

        <div className="form-group">
            <label className="text">ISBN*</label>
            <input
            type="text"
            value={ isbn }
            onChange={(e) => setISBN(e.target.value)}
            className="input"
            />
        </div>

        <div className="form-group">
        <label className="text">{translations[language].publicar_descripcion}</label>
        <textarea
          value={ description }
          onChange={(e) => setDescription(e.target.value)}
          className="textarea"
          rows="4"
        />
        </div>

        <div className="form-group">
        <label className="text">{translations[language].publicar_precio}</label>
        <input
          type="number"
          value={ price }
          onChange={(e) => setPrice(e.target.value)}
          className="input"
        />
        </div>

        <div className="form-group">
        <label className="text">{translations[language].publicar_cantidad}</label>
        <input
          type="number"
          value={ stock }
          onChange={(e) => setStock(e.target.value)}
          className="input"
        />
        </div>

        <div className="form-group">
        <label className="text">{translations[language].publicar_genero}</label>
        <div className="genre-dropdown" ref={ genreDropdownRef }>
          <button
            type="button"
            className="genre-dropdown-btn"
            onClick={() => setGenreDropdownOpen(!genreDropdownOpen)}
          >
            {genre.length === 0 ? translations[language].publicar_generos : `${genre.length} ${translations[language].publicar_generos_seleccionados}`}
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
            {translations[language].publicar_seleccionados} {genre.join(", ")}
          </p>
        )}

        <div className="form-group">
        <label className="text">{translations[language].publicar_rango}</label>
        <select 
          className="input" 
          value={publicRange} 
          onChange={e => setPublicRange(e.target.value)}
        >
          {PUBLIC_RANGE.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        </div>

        <div className="form-group">
        <label className="text">{translations[language].publicar_imagen}</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="input"
        />
        </div>

        <button className="button" type="submit" disabled={ uploadingImage }>
          { uploadingImage ? "Subiendo imagen..." : translations[language].publicar_btn }
        </button>

        {errorForm && <p style={{ color: "red" }}>{errorForm}</p>}
      </form>
    </div>
  );
}

export default PublicarLibro;