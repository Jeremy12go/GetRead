import Home from "./Home.js";
import Login from "./Login";
import Register from "./Register.js";
import Carrito from "./Carrito.js";
import Header from "../incluides/Header.js";
import Perfil from "./Perfil.js";
import Editar from "./Editar.js";
import ResetPassword from "../pages/ResetPassword";
import PublicarLibro from "../pages/Publicar"
import ProductDetail from "../pages/ProductDetail";
import Calificar from "../components/Calificar.js";
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
    const [ language, setLanguage ] = useState('es');
    const [ cart, setCart ] = useState([]);
    const [ loadingSession, setLoadingSession ] = useState(true);
    const [ bookOpen, setBookOpen ] = useState(null);
    const [ valueCart, setValueCart ] = useState(0);

    useEffect(() => {
        const browserLang = navigator.language.split('-')[0];
        const detectedLang = ['es', 'en'].includes(browserLang) ? browserLang : 'es';
        setLanguage(detectedLang);
        document.documentElement.lang = detectedLang;
    }, []);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
        if(bookOpen !== null){
            localStorage.setItem("bookOpen", JSON.stringify(bookOpen));
        }
        calculateValueCart(cart);
    }, [cart, bookOpen]);

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        const savedData = JSON.parse(localStorage.getItem("objectAccount"));
        const savedCart = JSON.parse(localStorage.getItem("cart"));
        const savedBookOpen = JSON.parse(localStorage.getItem("bookOpen"));

        if (savedCart && Array.isArray(savedCart)) {
            setCart(savedCart);
        }

        if (savedBookOpen) {
            setBookOpen(savedBookOpen);
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
                const exists = prev.find(item => item._id === book._id);
                if (exists) {
                    return prev.map(item =>
                        item._id === book._id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                }
                return [...prev, { ...book, quantity: 1 }];
            })();
            
            const idProfile = objectAccount?.profile._id;
            const mappedCart = updated.map(item => ({
                book: item._id,       
                quantity: item.quantity
            }));

            updateProfile(idProfile, { cart: mappedCart });
            return updated;
        });

        calculateValueCart(cart);
    };

    const aumentar = (id) => {
        setCart(prev => {
            const updated = prev.map(item =>
                item._id === id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );

            const idProfile = objectAccount?.profile._id;
            const mappedCart = updated.map(item => ({
                book: item._id,
                quantity: item.quantity
            }));

            updateProfile(idProfile, { cart: mappedCart });
            return updated;
        });
        calculateValueCart(cart);
    };
 
    const disminuir = (id) => {
        setCart(prev => {
            const updated = prev
                .map(item =>
                    item._id === id
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter(item => item.quantity > 0);

            const idProfile = objectAccount?.profile._id;
            const mappedCart = updated.map(item => ({
                book: item._id,
                quantity: item.quantity
            }));

            updateProfile(idProfile, { cart: mappedCart });
            return updated;
        });
        calculateValueCart(cart);
    };

    const eliminar = (id) => {
        setCart(prev => {
            const updated = prev.filter(item => item._id !== id);

            const idProfile = objectAccount?.profile._id;
            const mappedCart = updated.map(item => ({
                book: item._id,
                quantity: item.quantity
            }));

            updateProfile(idProfile, { cart: mappedCart });
            return updated;
        });
        calculateValueCart(cart);
    };

    const calculateValueCart = (cart) => {
        let value_cart = 0;
        for ( let i = 0; i < cart.length; i++) {
            value_cart += cart[i].quantity;
        }
        setValueCart(value_cart);
    }

    if (loadingSession) {
        return <div>Cargando...</div>;
    }   

    return(
        <Router>

            <Header stateLogin={ stateLogin } name={ name } profileImage={ profileImage } search={ search } setSearch={ setSearch } 
            saldoBilletera={ saldoBilletera } valueCart={ valueCart } language={ language } /> {/*Agregar la cantidad de items en el carrito cerca del logo de carrito*/}

            <Routes>
                <Route path="/home" element={ <Home stateLogin={ stateLogin } search={ search } addToCart={ addToCart } language={ language } 
                setBookOpen={ setBookOpen } /> } />

                {/*Pagina principal*/}
                <Route path="/" element={ <Home stateLogin={ stateLogin } search={ search } addToCart={ addToCart }
                setBookOpen={ setBookOpen }  language={ language } />} />

                {/*Login*/}
                <Route path="/login" element={ <Login setStateLogin={ setStateLogin }
                setName={ setName } setProfileImage={ setProfileImage } setObjectAccount={ setObjectAccount } language={ language } />} />

                {/* Reset de la contraseña */}
                <Route path="/reset-password/:token" element={ <ResetPassword/> } />

                {/*Registro*/}
                <Route path="/register" element={ <Register language={ language } />} />

                {/*Detalles del libro*/}
                <Route path="/book-detail" element={ <ProductDetail bookOpen={ bookOpen } addToCart={ addToCart } 
                aumentar={ aumentar } disminuir={ disminuir } language={ language } /> }/>

                {/*Carrito*/}
                <Route path="/cart" element={ stateLogin
                    ? <Carrito cart={ cart } aumentar={ aumentar } disminuir={ disminuir } eliminar={ eliminar } setCart={ setCart }
                    setBookOpen={ setBookOpen } language={ language } />  
                    : <Navigate to="/login" replace />} />

                {/*Calificar*/}
                <Route path="/qualify" element={ <Calificar objectAccount={ objectAccount } /> } />

                {/*Perfil*/}
                <Route path="/perfil" element={ stateLogin
                    ? <Perfil setStateLogin={ setStateLogin } setName={ setName } setObjectAccount={ setObjectAccount } objectAccount={ objectAccount } language={ language } /> 
                    : <Navigate to="/home" replace /> } />
                <Route path="/editar" element={ stateLogin 
                    ? <Editar setName={ setName } language={ language } setObjectAccount={ setObjectAccount } objectAccount={ objectAccount } /> 
                    : <Navigate to="/login" replace /> } />
                <Route path="/publicar" element={ <PublicarLibro language={ language } /> } />
            </Routes>
        </Router>
    );
}

export default App;