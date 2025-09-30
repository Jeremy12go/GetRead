import React, { useState } from "react";
import "./Carrito.css";
import { createOrder, getProfile, updateProfile } from '../API/APIGateway.js';


function Carrito({ infoTienda, carrito, setCarrito, volver, irAConfirmacion, logoTienda, setIdTiendaACalificar, setIdOrdenACalificar }) {
  const [enviando, setEnviando] = useState(false);

  const sumar = (id) => { // para sumar cantidad
    setCarrito(carrito.map(item =>
      item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
    ));
  };

  const restar = (id) => { // para restar cantidad (si llega a 0 se elimina)
    setCarrito(carrito =>
      carrito
        .map(item =>
          item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
        )
        .filter(item => item.cantidad > 0)
    );
  };

  const eliminar = (id) => { // para quitar de carrito
    setCarrito(carrito.filter(item => item.id !== id));
  };

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

   const handleGuardarPedido = async () => {
    setEnviando(true);
    const idProfile = localStorage.getItem('idProfile');
    const ids = carrito.flatMap(item => Array(item.cantidad).fill(item.id));
    try {
      const res = await createOrder(idProfile, ids, total, infoTienda.id);
      const orderId = res.data.id;

      const profileRes = await getProfile(idProfile);
      const orders = profileRes.data.orders || [];

      await updateProfile(idProfile, { orders: [...orders, orderId] });

      setEnviando(false);
      setCarrito([]);
      setIdTiendaACalificar(infoTienda.id); // <--- Aquí
      setIdOrdenACalificar(orderId); 
      irAConfirmacion();
    } catch (e) {
      setEnviando(false);
      alert('Error al guardar el pedido');
    }

  };

  return (
    <div className="carrito-container">
      <h2>Carrito</h2>
      {carrito.length === 0 ? (
        <div className="carrito-tienda-info">
          <div className="carrito-tienda-datos">
            <div className="carrito-tienda-nombre">Carrito vacío</div>
          </div>
        </div>
      ) : (
        infoTienda && (
          <div className="carrito-tienda-info">
            <img src={logoTienda} alt="logo tienda" className="carrito-tienda-logo" />
            <div className="carrito-tienda-datos">
              <div className="carrito-tienda-nombre">{infoTienda.name}</div>
              <div className="carrito-tienda-calificacion">Calificación: {infoTienda.average_rating} ⭐</div>
            </div>
          </div>
        )
      )}
      {carrito.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        carrito.map(item => (
          <div key={item.id} className="carrito-item">
            <img src={item.imagen} alt={item.nombre} className="carrito-item-img" />
            <div className="carrito-item-info">
              <div className="carrito-item-nombre">{item.nombre}</div>
              <div>
                <button onClick={() => restar(item.id)} className="carrito-btn-cantidad">-</button>
                <span className="carrito-item-cantidad">{item.cantidad}</span>
                <button onClick={() => sumar(item.id)} className="carrito-btn-cantidad">+</button>
                <button onClick={() => eliminar(item.id)} className="carrito-btn-eliminar">Eliminar</button>
              </div>
            </div>
            <div className="carrito-item-precio">${item.precio * item.cantidad}</div>
          </div>
        ))
      )}
      <div className="carrito-total">
        Total: ${total}
      </div>
      <div className="carrito-botones">
        <button onClick={volver} className="carrito-btn-volver">Volver</button>
        <button
          onClick={handleGuardarPedido}
          disabled={carrito.length === 0 || enviando}
          className="carrito-btn-realizar"
        >
          {enviando ? "Enviando pedido..." : "Realizar pedido"}
        </button>
      </div>
    </div>
  );
}

export default Carrito;