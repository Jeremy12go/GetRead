import '../styles/home.css';
import '../styles/styles.css';

import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import { useState } from "react";

import Login from "./Login";
import Register from "./Register.js";
import HomePostLogin from "./HomePostLogin.js";
import Carrito from "./Carrito.js";
import Header from "../incluides/header.js";
import Perfil from "./Perfil.js";
import Editar from "./Editar.js";

import img_1 from '../assets/PortadasLibros/Harry.jpg';
import img_2 from '../assets/PortadasLibros/Juego.jpg';
import img_3 from '../assets/PortadasLibros/Franki.jpg';
import img_4 from '../assets/PortadasLibros/Quijote.jpg';
import img_5 from '../assets/PortadasLibros/Sennor.jpg';


function Home({stateLogin}){
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
            <div className="carousel" >
                <div className="carousel_track">
                    {[img_1, img_2, img_3, img_4, img_5].map((img, i) => (
                        <img key={i} src={img} alt={`Libro ${i}`} />
                    ))}
                </div>
            </div>
        )}

        {/* Filtro */}
        <div className="filtre" >
            <label>
            Filtrar:
            <select id="categorySelect" className="CategoriaMenu" >
                <option value="all">Genero</option>
                <option value="tech">SEXO1</option>
                <option value="pets">SEXO2</option>
                <option value="food">SEXO3</option>
            </select>
            <select id="category2Select" className="CategoriaMenu2" >
                <option value="all">Rango Publico</option>
                <option value="tech">GAY 1</option>
                <option value="pets">GAY 2</option>
                <option value="food">GAY 3</option>
            </select>
            </label>
        </div>
        {/* Catalogo */}
        <div className="grid-wrap">
            {[img_1, img_2, img_3, img_4, img_5].map((img, i) => (
                <img key={i} className="card" src={img} alt={`Portada ${i}`} />
            ))}
        </div>
    </div>
);
}


function App() {

    const [ stateLogin, setStateLogin ] = useState(false);
    const [ name, setName ] = useState('');

    return(
        <Router>
            <Header stateLogin={stateLogin} setStateLogin={setStateLogin} name={name} setName={setName} />
            <Routes>
                <Route path="/home" element={<Home stateLogin={stateLogin} />} />

                {/*Pagina principal*/}
                <Route path="/" element={<Home stateLogin={stateLogin} />} />

                {/*Login*/}
                <Route path="/login" element={<Login setStateLogin={setStateLogin} name={name} setName={setName} />} />

                {/*Registro*/}
                <Route path="/register" element={<Register />} />

                {/*Home post login*/}
                <Route path="/homepostlogin" element={stateLogin ? <HomePostLogin setStateLogin={setStateLogin} /> : <Navigate to="/login" replace/>} />

                {/*Carrito*/}
                <Route path="/carrito" element={stateLogin ? <Carrito /> : <Navigate to="/login" replace />} />

                {/*Perfil*/}
                <Route path="/perfil" element={stateLogin ? <Perfil setStateLogin={setStateLogin} setName={setName} /> : <Navigate to="/home" replace />} />
                <Route path="/editar" element={stateLogin ? <Editar /> : <Navigate to="/editar" replace />} />

            </Routes>
        </Router>
    );
}

export default App;