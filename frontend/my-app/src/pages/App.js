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
import { updateProfile } from "../API/APIGateway"
import { useState, useEffect} from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {

    const [ stateLogin, setStateLogin ] = useState(false);
    const [ objectAccount, setObjectAccount ] = useState('');
    const [ name, setName ] = useState('');
    const [ profileImage, setProfileImage ] = useState('');
    const [ search, setSearch ] = useState('');
    const [ saldoBilletera, setSaldoBilletera ] = useState(0);
    const [ cart, setCart ] = useState([]);
    const [ loadingSession, setLoadingSession ] = useState(true);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        const savedData = JSON.parse(localStorage.getItem("objectAccount"));
        const savedCart = JSON.parse(localStorage.getItem("cart"));

        if (savedCart && Array.isArray(savedCart)) {
            setCart(savedCart);
        }

        if (savedToken && savedData) {
            setObjectAccount(savedData);
            setProfileImage(savedData.account?.profileImage);
            setName(savedData.profile?.name.split(" ")[0]);
            setStateLogin(true);
        }

        setLoadingSession(false);
    }, []);

    const addToCart = (book) => {
        setCart(prev => {
            const updated = (() => {
                const exists = prev.find(item => item.id === book.id);
                if (exists) {
                    return prev.map(item =>
                        item.id === book.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                }
                return [...prev, { ...book, quantity: 1 }];
            })();
           
            const idProfile = objectAccount?.profile._id;
            const mappedCart = updated.map(item => ({
                book: item.id,       
                quantity: item.quantity
            }));

            updateProfile(idProfile, { cart: mappedCart });

            return updated; 
        });
    };

    const aumentar = (id) => {
        setCart(prev => {
            const updated = prev.map(item =>
                item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
            );

            const idProfile = objectAccount?.profile._id;

            const mappedCart = updated.map(item => ({
                book: item.id,
                quantity: item.cantidad
            }));

            updateProfile(idProfile, { cart: mappedCart });

            return updated;
        });
    };
 

    const disminuir = (id) => {
        setCart(prev => {
            const updated = prev .map(item =>
                    item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item)
                    .filter(item => item.cantidad > 0
                );

            const idProfile = objectAccount?.profile._id;
            const mappedCart = updated.map(item => ({
                book: item.id,
                quantity: item.cantidad
            }));

            updateProfile(idProfile, { cart: mappedCart } );

            return updated;
        });
    };

    const eliminar = (id) => {
        setCart(prev => {
            const updated = prev.filter(item => item.id !== id);

            const idProfile = objectAccount?.profile._id;

            const mappedCart = updated.map(item => ({
                book: item.id,
                quantity: item.cantidad
            }));

            updateProfile(idProfile, { cart: mappedCart } );

            return updated;
        });
    };

    if (loadingSession) {
        return <div>Cargando...</div>;
    }   

    return(
        <Router>

            <Header stateLogin={ stateLogin } name={ name } profileImage={ profileImage } search={ search } setSearch={ setSearch } 
            saldoBilletera={ saldoBilletera } /*Agregar la cantidad de items en el carrito cerca del logo de carrito*/ /> 

            <Routes>
                <Route path="/home" element={ <Home stateLogin={ stateLogin } search={ search } addToCart={ addToCart } /> } />

                {/*Pagina principal*/}
                <Route path="/" element={ <Home stateLogin={ stateLogin } search={ search } addToCart={ addToCart } /> } />

                {/*Login*/}
                <Route path="/login" element={ <Login setStateLogin={ setStateLogin }
                setName={ setName } setProfileImage={ setProfileImage } setObjectAccount={ setObjectAccount } />} />

                {/* Reset de la contraseña */}
                <Route path="/reset-password/:token" element={ <ResetPassword/> } />

                {/*Registro*/}
                <Route path="/register" element={ <Register/> } />

                {/*Home post login*/}
                <Route path="/homepostlogin" element={ stateLogin 
                    ? <HomePostLogin setStateLogin={ setStateLogin } /> 
                    : <Navigate to="/login" replace/> } />

                {/*Carrito*/}
                <Route path="/carrito" element={ stateLogin
                    ? <Carrito cart={ cart } aumentar={ aumentar } disminuir={ disminuir } eliminar={ eliminar } setCart={ setCart }/> 
                    : <Navigate to="/login" replace />} />

                {/*Perfil*/}
                <Route path="/perfil" element={ stateLogin
                    ? <Perfil setStateLogin={ setStateLogin } setName={ setName } setObjectAccount={ setObjectAccount } objectAccount={ objectAccount } /> 
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