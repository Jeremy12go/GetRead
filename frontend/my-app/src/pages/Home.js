import '../styles/home.css';
import '../styles/styles.css';
import { useRef, useState, useEffect} from "react";
import ico_addCarrito from '../assets/anadirCarro.png';

function Home({ stateLogin, search }){

    const [ books, setBooks ] = useState([]);
    const [ genreFilter, setGenreFilter ] = useState("all");
    const [ ageFilter, setAgeFilter ] = useState("all");

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
                        <h1>Cada libro es una puerta <br/> ¿Cuál abrirás hoy?</h1>
                        <p>Disfruta de un sinfín de libros para ti...</p>
                        <button className='button-generic'>Quiero leer</button>
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
                <label> Filtrar:
                    <select value={ genreFilter } 
                        onChange={(e) => setGenreFilter(e.target.value) }  >

                        <option value="all">Todo Genero</option>
                        <option value="Novela">Novela</option>
                        <option value="Cuento">Cuento</option>
                        <option value="Fabula">Fabula</option>
                        <option value="Comedia">Comedia</option>
                        <option value="Drama">Drama</option>
                        <option value="Filosofico">Filosofico</option>
                        <option value="Cientifico">Cientifico</option>
                        <option value="Fantasia">Fantasia</option>
                        <option value="Ciencia Ficción">Ciencia Ficción</option>
                        <option value="Terror">Terror</option>
                        <option value="Misterio">Misterio</option>
                        <option value="Suspenso">Suspenso</option>
                        <option value="Romance">Romance</option>
                        <option value="Biografia">Biografia</option>
                        <option value="Historia">Historia</option>
                        <option value="Ciencia">Ciencia</option>
                        <option value="Filosofia">Filosofia</option>
                        <option value="Psicologia">Psicologia</option>
                        <option value="Autoayuda">Autoayuda</option>
                        <option value="Politica">Politica</option>
                        <option value="Economia">Economia</option>
                        <option value="Educación">Educación</option>
                        <option value="Arte">Arte</option>
                        <option value="Musica">Musica</option>
                        <option value="Cine">Cine</option>
                        <option value="Tecnologia">Tecnologia</option>
                        <option value="Turismo">Turismo</option>
                        <option value="Gastronomia">Gastronomia</option>
                        <option value="Espiritualidad">Espiritualidad</option>
                        <option value="Religión">Religión</option>
                    </select>

                    <select value={ ageFilter } onChange={ (e) => setAgeFilter(e.target.value) } >
                        
                        <option value="all">Todas las Edades</option>
                        <option value="Infantil">Infantil</option>
                        <option value="Juvenil">Juvenil</option>
                        <option value="Adulto">Adulto</option>
                        <option value="Todo Publico">Todo Publico</option>
                    </select>
                </label>
            </div>
            
            {/* Catalogo */}
            <div className="grid-wrap">
                { filteredBooks.map((book, i) => (
                    <div key={i} className="card-container">
                        <img className="card-image" src={book.image} alt={book.title} />

                        <div className="bottom-bar">
                            <img src={ico_addCarrito} className="bar-btn"/>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;
