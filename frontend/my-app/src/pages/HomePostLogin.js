import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
/*
import ContenedorItems from "../components/ContenedorItems";
import ContenedorComida from "../components/ContenedorComida";
import Carrito from "./Carrito.js";
import Historial from "../components/Historial";
import Realizado from "../components/Realizado";
import Calificar from "../components/Calificar";
import Pedido from "../components/Pedido";
import carritoImg from '../assets/carrito.png';
import historialImg from '../assets/historial.png';
import lupaImg from '../assets/lupa.png';
import usuarioImg from '../assets/usuario.png';
*/
import { storeByCity, getProfile, getProductsByStore, getRatingsByStore } from '../API/APIGateway.js';


function calcularAverageRating(ratings) {
    if (!Array.isArray(ratings) || ratings.length === 0) return "N/A";
    const starsArray = ratings
        .map(r => typeof r.stars === "number" ? r.stars : Number(r.stars))
        .filter(star => !isNaN(star));
    if (starsArray.length === 0) return "N/A";
    const sum = starsArray.reduce((acc, star) => acc + star, 0);
    return (sum / starsArray.length).toFixed(1);
}

function HomePostLogin({ setStateLogin }) {

    const [ carrito, setCarrito ] = useState([]);
    const [ stores, setStores ] = useState([]);

    const [ productosTienda, setProductosTienda ] = useState([]);
    const [ tiendaSeleccionada, setTiendaSeleccionada ] = useState(null);
    const [ perfil, setPerfil] = useState(null);
    const [ user, setUser] = useState(false);

    const [ pedidoSeleccionado, setPedidoSeleccionado ] = useState(null);
    const [ idTiendaACalificar, setIdTiendaACalificar ] = useState(null);
    const [ idOrdenACalificar, setIdOrdenACalificar ] = useState(null);   

    const navigate = useNavigate();

    useEffect(() => {
        const cargarTiendas = async () => {
        try {
            const idProfile = localStorage.getItem('idProfile');
            const profile = await getProfile(idProfile);
            setPerfil(profile.data);
            const city = profile.data.address.split(' ')[0].toLowerCase();
            const stores_ = await storeByCity(city);

            const storesWithRating = await Promise.all(
            stores_.data.map(async tienda => {
                try {
                const ratingsRes = await getRatingsByStore(tienda.id);
                const average_rating = calcularAverageRating(ratingsRes.data);
                return { ...tienda, average_rating };
                } catch {
                return { ...tienda, average_rating: "N/A" };
                }
            })
            );

            setStores(storesWithRating);
        } catch (e) {
            console.error('Error al obtener tiendas:', e.message);
        }
        };
        cargarTiendas();
    }, []);

    const seleccionarTienda = async (tienda) => {
        if (carrito.length > 0 && carrito[0].idStore !== tienda.id) setCarrito([]);
        setTiendaSeleccionada(tienda);

        try {
        const res = await getProductsByStore(tienda.id);
        setProductosTienda(res.data);
        } catch {
        setProductosTienda([]);
        }
    };

    const agregarACarrito = (producto) => {
        setCarrito(prev => {
        const existe = prev.find(item => item.id === producto.id);
        if (existe) {
            return prev.map(item =>
            item.id === producto.id
                ? { ...item, cantidad: item.cantidad + 1 }
                : item
            );
        }
        return [...prev, {
            id: producto.id,
            nombre: producto.name,
            imagen: producto.image,
            precio: producto.price,
            cantidad: 1,
            idStore: producto.idStore
        }];
        });
    };
} 

export default HomePostLogin;