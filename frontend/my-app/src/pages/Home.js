import '../styles/home.css';
import '../styles/styles.css';
import { useRef, useState, useEffect} from "react";
import ico_addCarrito from '../assets/anadirCarro.png';
import { useNavigate } from 'react-router-dom';
import { translations } from '../components/translations.js';

function Home({ stateLogin, search, addToCart, language, setLanguage }){

    const [ books, setBooks ] = useState([]);
    const [ genreFilter, setGenreFilter ] = useState("all");
    const [ ageFilter, setAgeFilter ] = useState("all");

    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:3004/stores")
        .then(res => res.json())
        .then(data => setBooks(data));
    }, []);

    const carouselRef = useRef(null);

    useEffect(() => {
        const track = carouselRef.current;
        if (!track) return;

        let speed = 0.5;

        const animation = () => {
        track.scrollLeft += speed;

        if (track.scrollLeft >= track.scrollWidth / 2) {
            track.scrollLeft = 0;
        }

        requestAnimationFrame(animation);
        };

        animation();
    }, []);

    const filteredBooks = books.filter( book => {
        const matchesGenre = genreFilter === "all" || book.genre?.includes(genreFilter);
        const matchesAge = ageFilter === "all" || book.public_range === ageFilter;
        const matchesSearch = !search || search.trim() === "" || book.name?.toLowerCase().includes(search.toLowerCase());
        return matchesGenre && matchesAge && matchesSearch;
    });

    return (
        <div>
            {!stateLogin ? (
                <div className="hero-section">
                    <div className="hero-content">
                        <h1>{translations[language].txt_home} <br/> {translations[language].txt_open}</h1>
                        <p>{translations[language].txt_enjoy}</p>
                        <button className='button-generic' 
                            onClick={ () => navigate('/register') }>{translations[language].btn_wtr}</button>
                    </div>
                </div>
            ):(
                <div className="carousel" ref={ carouselRef }>
                    <div className="carousel_track">
                        {[...books, ...books].map((book, i) => (
                            <img key={i} src={book.image} alt={book.title} />
                        ))}
                    </div>
                </div>
            )}

            {/* Filtro */}
            <div className="filtre" >
                <label> {translations[language].filter}:
                    <select value={ genreFilter } 
                        onChange={(e) => setGenreFilter(e.target.value) }  >

                        <option value="all">{translations[language].filter_all}</option>
                        <option value="Novela">{translations[language].filter_Novela}</option>
                        <option value="Cuento">{translations[language].filter_Cuento}</option>
                        <option value="Fabula">{translations[language].filter_Fabula}</option>
                        <option value="Comedia">{translations[language].filter_Comedia}</option>
                        <option value="Drama">{translations[language].filter_Drama}</option>
                        <option value="Filosofico">{translations[language].filter_Filosofico}</option>
                        <option value="Cientifico">{translations[language].filter_Cientifico}</option>
                        <option value="Fantasia">{translations[language].filter_Fantasia}</option>
                        <option value="Ciencia Ficción">{translations[language].filter_CienciaFiccion}</option>
                        <option value="Terror">{translations[language].filter_Terror}</option>
                        <option value="Misterio">{translations[language].filter_Misterio}</option>
                        <option value="Suspenso">{translations[language].filter_Suspenso}</option>
                        <option value="Romance">{translations[language].filter_Romance}</option>
                        <option value="Biografia">{translations[language].filter_Biografia}</option>
                        <option value="Historia">{translations[language].filter_Historia}</option>
                        <option value="Ciencia">{translations[language].filter_Ciencia}</option>
                        <option value="Filosofia">{translations[language].filter_Filosofia}</option>
                        <option value="Psicologia">{translations[language].filter_Psicologia}</option>
                        <option value="Autoayuda">{translations[language].filter_Autoayuda}</option>
                        <option value="Politica">{translations[language].filter_Politica}</option>
                        <option value="Economia">{translations[language].filter_Economia}</option>
                        <option value="Educación">{translations[language].filter_Educacion}</option>
                        <option value="Arte">{translations[language].filter_Arte}</option>
                        <option value="Musica">{translations[language].filter_Musica}</option>
                        <option value="Cine">{translations[language].filter_Cine}</option>
                        <option value="Tecnologia">{translations[language].filter_Tecnologia}</option>
                        <option value="Turismo">{translations[language].filter_Turismo}</option>
                        <option value="Gastronomia">{translations[language].filter_Gastronomia}</option>
                        <option value="Espiritualidad">{translations[language].filter_Espiritualidad}</option>
                        <option value="Religión">{translations[language].filter_Religion}</option>
                    </select>

                    <select value={ ageFilter } onChange={ (e) => setAgeFilter(e.target.value) } >
                        
                        <option value="all">{translations[language].filter_all_ages}</option>
                        <option value="Infantil">{translations[language].filter_Infantil}</option>
                        <option value="Juvenil">{translations[language].filter_Juvenil}</option>
                        <option value="Adulto">{translations[language].filter_Adulto}</option>
                        <option value="Todo Publico">{translations[language].filter_all_public}</option>
                    </select>
                </label>
            </div>
            
            {/* Catalogo */}
            <div className="grid-wrap">
                { filteredBooks.map((book, i) => (
                    <div key={i} className="card-container">
                        <img className="card-image" src={book.image} alt={book.title} />

                        <div className="bottom-bar">
                            <img src={ico_addCarrito} className="bar-btn"
                                onClick={() => addToCart({
                                        id: book._id,
                                        nombre: book.name,
                                        precio: book.price,
                                        imagen: book.image
                                    })}/>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;