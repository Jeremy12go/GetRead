import '../styles/home.css';
import Login from "./Login";
import Register from "./Register.js";
import homePostLogin from './HomePostLogin.js'
import { useState } from "react";
import Header from '../incluides/header.js'
import img_1 from '../assets/PortadasLibros/Harry.jpg';
import img_2 from '../assets/PortadasLibros/Juego.jpg';
import img_3 from '../assets/PortadasLibros/Franki.jpg';
import img_4 from '../assets/PortadasLibros/Quijote.jpg';
import img_5 from '../assets/PortadasLibros/Sennor.jpg';

function App() {

    const [view, setView] = useState('home');

    return(
        <div>
            { /* Menu bar */ }
            < Header view={view} setView={setView} />
            { view === 'login' ?
                (<Login view={view} setView={setView} onClose={() => setView('home')} />) :
                view === 'register' ? 
                (<Register onClose={() => setView('home')} />) :
                view === 'homePostLogin' ?
                (<homePostLogin/>) :
                <div>
                    {/* Carouser */} 
                    <div class="carousel" >
                        <div class="carousel_track">
                            <img src={img_1} />
                            <img src={img_2} />
                            <img src={img_3} />
                            <img src={img_4} />
                            <img src={img_5} />

                            <img src={img_1} />
                            <img src={img_2} />
                            <img src={img_3} />
                            <img src={img_4} />
                            <img src={img_5} /> 

                            <img src={img_1} />
                            <img src={img_2} />
                            <img src={img_3} />
                            <img src={img_4} />
                            <img src={img_5} /> 
                        </div>
                    </div>

                    {/* Filtro */}
                    <div class="filtre" >
                        <label>
                        Filtrar:
                        <select id="categorySelect" class="CategoriaMenu" >
                            <option value="all">Genero</option>
                            {/* INSERTAR GENEROS POR LOS EXISTENTE EN LA DB */}
                            <option value="tech">SEXO1</option>
                            <option value="pets">SEXO2</option>
                            <option value="food">SEXO3</option>
                        </select>
                        <select id="category2Select" class="CategoriaMenu2" >
                            <option value="all">Rango Publico</option>
                            {/* INSERTAR RANGOS POR LOS EXISTENTE EN LA DB */}
                            <option value="tech">GAY 1</option>
                            <option value="pets">GAY 2</option>
                            <option value="food">GAY 3</option>
                        </select>
                        </label>
                    </div>

                    {/* Catalogo */}
                    <div class="grid-wrap">
                        <img class="card" src={img_1} />
                        <img class="card" src={img_2} />
                        <img class="card" src={img_3} />
                        <img class="card" src={img_4} />
                        <img class="card" src={img_5} />

                        <img class="card" src={img_1} />
                        <img class="card" src={img_2} />
                        <img class="card" src={img_3} />
                        <img class="card" src={img_4} />
                        <img class="card" src={img_5} />
                    </div>
                </div>
            }
        </div>
    );
}

export default App;