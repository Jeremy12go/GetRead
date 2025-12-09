import React, { useState, useEffect } from "react";
import "./Historial.css";
import { ordersByProfile, getStoreById } from '../API/APIGateway';

function formatearFecha(fechaFormat) {
  const fecha = new Date(fechaFormat);
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const year = String(fecha.getFullYear()).slice(-2);
  const hora = fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${dia}-${mes}-${year} ${hora}`;
}

function Historial({ volver, verPedido }) {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [tiendas, setTiendas] = useState({});

  useEffect(() => {
    const cargarPedidos = async () => {
      setCargando(true);
      try {
        // 1. Obtener perfil ID del localStorage
        const idProfile = localStorage.getItem('idProfile');
        if (!idProfile) {
          setPedidos([]);
          setCargando(false);
          return;
        }

        // 2. Obtener las órdenes completas del comprador
        const ordersRes = await ordersByProfile(idProfile);
        const pedidosData = ordersRes.data;
        
        if (!pedidosData || pedidosData.length === 0) {
          setPedidos([]);
          setCargando(false);
          return;
        }
        
        setPedidos(pedidosData);

        // 3. Obtener tiendas individualmente usando idStore de cada order
        const tiendasTemp = {};
        await Promise.all(
          pedidosData.map(async pedido => {
            const idStore = pedido.idStore;
            if (idStore && !tiendasTemp[idStore]) {
              try {
                const tiendaRes = await getStoreById(idStore);
                tiendasTemp[idStore] = tiendaRes.data;
              } catch (e) {
                tiendasTemp[idStore] = null;
              }
            }
          })
        );
        setTiendas(tiendasTemp);

      } catch (e) {
        console.error('Error cargando pedidos:', e);
        setPedidos([]);
      }
      setCargando(false);
    };
    cargarPedidos();
  }, []);

  return (
    <div className="historial-container">
      <h2>Historial de Pedidos</h2>
      {cargando ? (
        <p>Cargando...</p>
      ) : pedidos.length === 0 ? (
        <p>No hay pedidos anteriores.</p>
      ) : (
        <div>
          {pedidos.map(pedido => {
            const tienda = pedido.idStore ? tiendas[pedido.idStore] : null;
            return (
              <div
                key={pedido._id || pedido.id}
                onClick={() => verPedido(pedido)}
                className="historial-item"
              >
                <img
                  src={
                    tienda && tienda.logo
                  }
                  alt="logo tienda"
                  className="historial-logo"
                />
                <div className="historial-info">
                  <div className="historial-nombre">{tienda ? tienda.name : "Tienda desconocida"}</div>
                  <div className="historial-fecha">Fecha: {formatearFecha(pedido.orderDate || pedido.fecha)}</div>
                </div>
                <div className="historial-total">${pedido.totalPrice || pedido.total}</div>
              </div>
            );
          })}
        </div>
      )}
      <button onClick={volver} className="historial-btn-volver">Volver</button>
    </div>
  );
}

export default Historial;