import '../styles/home.css';
import '../styles/styles.css';
import { useRef, useState, useEffect} from "react";
import ico_addCarrito from '../assets/anadirCarro.png';
import { useNavigate } from 'react-router-dom';
import { translations } from '../components/translations.js';

function Home({ stateLogin, search, addToCart, language, setLanguage, setBookOpen }){

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

            <div className="filtre">
            <label>{translations[language].filter}:</label>

            <select 
                value={genreFilter} 
                onChange={(e) => setGenreFilter(e.target.value)}
            >
                <option value="all">{translations[language].filter_all}</option>
                {Object.keys(translations[language].genreList).map((g) => (
                <option key={g} value={g}>
                    {translations[language].genreList[g]}
                </option>
                ))}
            </select>

            <select 
                value={ageFilter} 
                onChange={(e) => setAgeFilter(e.target.value)}
            >
                <option value="all">{translations[language].filter_all_ages}</option>
                {Object.keys(translations[language].publicRangeList).map((r) => (
                <option key={r} value={r}>
                    {translations[language].publicRangeList[r]}
                </option>
                ))}
            </select>
            </div>

            
            {/* Catalogo */}
            <div className="grid-wrap">
                { filteredBooks.map((book, i) => (
                    <div key={i} className="card-container">
                        <img className="card-image" src={book.image} alt={book.title} />

                        <div className="bottom-bar">
                            <img src={ico_addCarrito} className="bar-btn"
                                onClick={() => {
                                    console.log("Home llama addToCart:",book);
                                    addToCart(book);}}/>
                            <button className="detail-btn" onClick={() => {
                                setBookOpen(book);
                                navigate("/book-detail");
                                }}>
                            Detalles  
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;