import Home from "./Home.js";
import Login from "./Login";
import Register from "./Register.js";
import HomePostLogin from "./HomePostLogin.js";
import Carrito from "./Carrito.js";
import Header from "../incluides/header.js";
import Perfil from "./Perfil.js";
import Editar from "./Editar.js";
import ResetPassword from "../pages/ResetPassword";
import PublicarLibro from "../pages/Publicar.js"
import { useState, useEffect} from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {

    const [ stateLogin, setStateLogin ] = useState(false);
    const [ objectAccount, setObjectAccount ] = useState('');
    const [ name, setName ] = useState('');
    const [ profileImage, setProfileImage ] = useState('');
    const [ search, setSearch ] = useState('');
    const [ saldoBilletera, setSaldoBilletera ] = useState(0);

    return(
        <Router>

            <Header stateLogin={ stateLogin } setStateLogin={ setStateLogin } name={ name }
            setName={ setName } profileImage={ profileImage } search={ search } setSearch={ setSearch } 
            saldoBilletera={ saldoBilletera } />

            <Routes>
                <Route path="/home" element={ <Home stateLogin={ stateLogin } search={ search } /> } />

                {/*Pagina principal*/}
                <Route path="/" element={ <Home stateLogin={ stateLogin } search={ search } /> } />

                {/*Login*/}
                <Route path="/login" element={ <Login setStateLogin={ setStateLogin }
                setName={ setName } setProfileImage={ setProfileImage } setObjectAccount={ setObjectAccount } />} />

                {/* Reset de la contraseña */}
                <Route path="/reset-password/:token" element={ <ResetPassword/> } />

                {/*Registro*/}
                <Route path="/register" element={ <Register/> } />

                {/*Home post login*/}
                <Route path="/homepostlogin" element={ stateLogin 
                    ? <HomePostLogin setStateLogin={setStateLogin} /> 
                    : <Navigate to="/login" replace/> } />

                {/*Carrito*/}
                <Route path="/carrito" element={ stateLogin
                    ? <Carrito /> 
                    : <Navigate to="/login" replace />} />
                {/*Perfil*/}
                <Route path="/perfil" element={ stateLogin
                    ? <Perfil setStateLogin={ setStateLogin } setName={ setName } objectAccount={ objectAccount } /> 
                    : <Navigate to="/home" replace /> } />
                <Route path="/editar" element={ stateLogin 
                    ? <Editar setName={ setName } /> 
                    : <Navigate to="/login" replace /> } />
                <Route path="/publicar" element={ <PublicarLibro/> } />
            </Routes>
        </Router>
    );
}

export default App;