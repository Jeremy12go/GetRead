import React, {useState, useEffect} from 'react';
import ContenedorItems from "../components/ContenedorItems";
import ContenedorComida from "../components/ContenedorComida";
import { storeByCity } from '../API/APIGateway.js';
import { getProfile } from '../API/APIGateway.js';
import { getProductsByStore } from '../API/APIGateway.js';
import { getRatingsByStore } from '../API/APIGateway.js';
import { arrayBufferToBase64 } from '../base64.js';

import Carrito from "../components/Carrito";
import Historial from "../components/Historial";
import Realizado from "../components/Realizado";
import Calificar from "../components/Calificar";
import Pedido from "../components/Pedido";

import carritoImg from '../assets/carrito.png';
import historialImg from '../assets/historial.png';
import lupaImg from '../assets/lupa.png';
import usuarioImg from '../assets/usuario.png';


function Principal({ cambiarPantalla }) {

    const [carrito, setCarrito] = useState([]);
    const [ stores, setStores ] = useState([]);
    const [pantalla, setPantalla] = useState("principal");
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
    const [idTiendaACalificar, setIdTiendaACalificar] = useState(null);
    const [idOrdenACalificar, setIdOrdenACalificar] = useState(null);   

    function calcularAverageRating(ratings) {
        if (!Array.isArray(ratings) || ratings.length === 0) return "N/A";
        const starsArray = ratings
            .map(r => typeof r.stars === "number" ? r.stars : Number(r.stars))
            .filter(star => !isNaN(star));
        if (starsArray.length === 0) return "N/A";
        const sum = starsArray.reduce((acc, star) => acc + star, 0);
        return (sum / starsArray.length).toFixed(1);
    }
    

    useEffect(() => {
        const StoresByCity = async () => {
            try {
                const idProfile = localStorage.getItem('idProfile');
                const profile = await getProfile(idProfile);
                setPerfil(profile.data);
                const city = profile.data.address.split(' ')[0].toLowerCase()
                const stores_ = await storeByCity(city);
                console.log("xx",profile.data.name);

                const storesWithRating = await Promise.all(
                stores_.data.map(async tienda => {
                    try {
                        const ratingsRes = await getRatingsByStore(tienda.id);
                        const ratings = ratingsRes.data;
                        const average_rating = calcularAverageRating(ratings);
                        console.log(
                            `Tienda: ${tienda.name} | Stars:`,
                            ratings.map(r => r.stars),
                            "| Average:", average_rating
                        );
                        return { ...tienda, average_rating };
                        } catch (e) {
                            console.log("haha nope");
                            return { ...tienda, average_rating: "N/A" };
                        }
                    })
                );

                setStores(storesWithRating);
                return storesWithRating;
            } catch (e) {
                console.error('Error al obtener tiendas:', e.message);
                return [];
            }
        };

        StoresByCity();
    },[]);

    const [tiendaSeleccionada, setTiendaSeleccionada] = useState(null);
    const [productosTienda, setProductosTienda] = useState([]);
    const [user, setUser] = useState(false);
    const [perfil, setPerfil] = useState(null);

    const seleccionarTienda = async (tienda) => {
        if (
            carrito.length > 0 &&
            carrito[0].idStore !== tienda.id
        ) {
            setCarrito([]); // Limpia el carrito si hay items de una tienda y se selecciona otra
        }
        setTiendaSeleccionada(tienda);
        
        try {
            const res = await getProductsByStore(tienda.id);
            console.log("Productos recibidos:", res.data);
            setProductosTienda(res.data);
        } catch (e) {
            setProductosTienda([]);
            console.error('Error al obtener productos de la tienda:', e.message);
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
                imagen: producto.image
                    ? `data:${producto.image.contentType};base64,${arrayBufferToBase64(producto.image.data.data)}`
                    : "./logo.png",
                precio: producto.price,
                cantidad: 1,
                idStore: producto.idStore 
            }];
        });
    };

    if (pantalla === "carrito") {
        let logoTienda = tiendaSeleccionada && tiendaSeleccionada.logo && tiendaSeleccionada.logo.data
            ? `data:${tiendaSeleccionada.logo.contentType};base64,${arrayBufferToBase64(tiendaSeleccionada.logo.data.data)}`
            : (tiendaSeleccionada && tiendaSeleccionada.logo ? tiendaSeleccionada.logo : "./logo.png");
        return <Carrito
            infoTienda={tiendaSeleccionada}
            carrito={carrito}
            setCarrito={setCarrito}
            volver={() => setPantalla("principal")}
            irAConfirmacion={() => setPantalla("realizado")}
            logoTienda={logoTienda}
            setIdTiendaACalificar={setIdTiendaACalificar}
            setIdOrdenACalificar={setIdOrdenACalificar}
        />;
    }
    if (pantalla === "historial") {
        return <Historial
        volver={() => setPantalla("")}
        verPedido={pedido => {
          setPedidoSeleccionado(pedido);
          setPantalla("detallesPedido");}}
      />;
    }
    if(pantalla === "realizado") {
        return <Realizado
        volver={() => setPantalla("principal")}
        irACalificar={() => setPantalla("calificacion")}
      />
    }
    if (pantalla === "calificacion") {
        return <Calificar
            volver={() => setPantalla("principal")}
            idStore={idTiendaACalificar}
            idOrder={idOrdenACalificar}
            idProfile={perfil?.id}
        />
    }
    if(pantalla === "detallesPedido" && pedidoSeleccionado) {
        return <Pedido 
        pedido={pedidoSeleccionado}
        volver={() => setPantalla("historial")} />
    }

    return (
        <div className="layout-principal">
            <div className="menu-lateral">
                {/*MENU LATERAL*/}
                <button className="logo-box">Utal Eats</button>
                <button className="menu-boton" onClick={() => setPantalla("carrito")}> 
                    <div style={{ position: "relative", display: "inline-block" }}>
                        <img src={carritoImg} alt="Carrito" className="icons" /> 
                        {carrito.length > 0 && (
                            <span
                                style={{
                                    position: "absolute",
                                    top: "-6px",
                                    right: "-6px",
                                    background: "#ff5252",
                                    color: "#fff",
                                    borderRadius: "50%",
                                    padding: "2px 7px",
                                    fontSize: "0.8em",
                                    fontWeight: "bold",
                                    minWidth: "22px",
                                    textAlign: "center",
                                    boxShadow: "0 1px 4px rgba(0,0,0,0.15)"
                                }}
                            >
                                {carrito.reduce((a, b) => a + b.cantidad, 0)}
                            </span>
                        )}
                    </div>
                    Carrito
                </button>
                <button className="menu-boton" onClick={() => setPantalla("historial")}> 
                    <img src={historialImg} alt="Historial" className="icons" />
                    Historial
                </button>
            </div>
            <div className="contenido-principal">
                <div className="barra-lateral">
                    <div className="input-container">
                        <img src={lupaImg} alt="buscar" className="lupa-icono" />
                        <input type="text" placeholder="Buscar productos/tiendas" className="buscador" />
                    </div>
                    <button className="boton-perfil"
                            onClick={() => setUser(!user)}
                            style={{ position: 'relative', zIndex: 10 }}
                    >
                        <img src={usuarioImg} alt="Perfil" className="img-perfil" />
                    </button>
                    {user && (
                        <div className="profile-sidebar-overlay">
                            <div className="profile-sidebar">
                                {/* Encabezado del panel */}
                                <div className="sidebar-header">
                                    <h2>Mi Perfil</h2>
                                    <button
                                        onClick={() => setUser(false)}
                                        className="close-button"
                                    >
                                        ×
                                    </button>
                                </div>
                                <div className="sidebar-content">
                                    <div className="profile-info">
                                        <img
                                            src={usuarioImg}
                                            alt="Foto de perfil"
                                            className="profile-picture"
                                        />
                                        <p><strong>Perfil:</strong> {perfil?.id || 'Cargando...'} </p>
                                        <p><strong>Nombre:</strong> {perfil?.name || 'Cargando...'} </p>
                                        <p><strong>Teléfono:</strong> {perfil?.phoneNumber || 'Cargando...'} </p>
                                        <p><strong>Dirección:</strong> {perfil?.address || 'Cargando...'} </p>
                                    </div>
                                    <button
                                        className="logout-btn"
                                        onClick={() => cambiarPantalla("inicio")}
                                    >
                                        Cerrar sesión
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="sub-contenido">
                    {/* Parte Izquierda: Tiendas */}
                    <div className="contenido-izquierdo">
                        <div style={{ display: 'flex', flexDirection: 'column'}}>          
                            {stores.map((tienda) => (
                                <ContenedorItems
                                    key={tienda.id}
                                    item={{
                                        ...tienda,
                                        logo: `data:${tienda.logo.contentType};base64,${arrayBufferToBase64(tienda.logo.data.data)}`
                                    }}
                                    onClick={() => seleccionarTienda(tienda)} 
                                />
                            ))}
                        </div>
                    </div>
                    {/* Parte Derecha: Comidas */}
                    <div className="contenido-derecho">
                    {productosTienda && productosTienda.length > 0 ? (
                        <div style={{ display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                                gap: '15px'}}>
                        {productosTienda.map((producto) => (
                            <ContenedorComida
                            key={producto.id}
                            item={{
                                ...producto,
                                image: producto.image
                                    ? `data:${producto.image.contentType};base64,${arrayBufferToBase64(producto.image.data.data)}`
                                    : "./logo.png"
                            }}
                            onClick={() => agregarACarrito(producto)}
                            />
                        ))}
                        </div>
                    ) : (
                        <p>No hay comidas para mostrar</p>
                    )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Principal;