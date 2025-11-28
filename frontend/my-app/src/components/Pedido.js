import React, { useEffect, useState } from "react";
import "./Pedido.css";
import { getProductById, getStoreById } from "../API/APIGateway";

function Pedido({ volver, pedido }) {
  const [productos, setProductos] = useState([]);
  const [tienda, setTienda] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarProductos = async () => {
      if (!pedido || !pedido.productList || !pedido.idStore) {
        setCargando(false);
        return;
      }
      setCargando(true);

      // 1. Contar cantidades de cada producto
      const cantidades = {};
      pedido.productList.forEach(id => {
        cantidades[id] = (cantidades[id] || 0) + 1;
      });

      // 2. Obtener productos individualmente
      const productosTemp = [];
      await Promise.all(
        Object.keys(cantidades).map(async id => {
          try {
            const res = await getProductById(id);
            productosTemp.push({
              ...res.data,
              cantidad: cantidades[id]
            });
          } catch (e) {
            // Si el producto no existe, lo ignoramos
          }
        })
      );
      console.log("Productos obtenidos:", productosTemp);
      setProductos(productosTemp);

      // 3. Obtener tienda
      try {
        const tiendaRes = await getStoreById(pedido.idStore);
        setTienda(tiendaRes.data);
      } catch (e) {
        setTienda(null);
      }

      setCargando(false);
    };
    cargarProductos();
  }, [pedido]);

  const total = productos.reduce((acc, prod) => acc + (prod.price * prod.cantidad), 0);

  if (!pedido) {
    return (
      <div className="pedido-container">
        <h3>No se encontró el pedido.</h3>
        <button onClick={volver} className="pedido-btn-volver">Volver</button>
      </div>
    );
  }

  return (
    <div className="pedido-container">
      <h2>Detalle del Pedido</h2>
      <div className="pedido-tienda-info">
        <img src={tienda && tienda.logo && tienda.logo.data } 
            alt="logo tienda" className="pedido-tienda-logo" 
          />
        <div className="pedido-tienda-datos">
          <div className="pedido-tienda-nombre">{tienda ? tienda.name : "Tienda desconocida"}</div>
          <div className="pedido-tienda-fecha">
            Fecha: {pedido.orderDate ? new Date(pedido.orderDate).toLocaleString() : ""}
          </div>
        </div>
      </div>
      {cargando ? (
        <p>Cargando productos...</p>
      ) : productos.length === 0 ? (
        <p>No hay productos en este pedido.</p>
      ) : (
        productos.map(prod => (
          <div key={prod.id} className="pedido-item">
            <img
              src={ prod.image && prod.image.data }
              alt={prod.name}
              className="pedido-item-img"
            />
            <div className="pedido-item-info">
              <div className="pedido-item-nombre">{prod.name}</div>
              <div>Cantidad: {prod.cantidad}</div>
            </div>
            <div className="pedido-item-precio">${prod.price * prod.cantidad}</div>
          </div>
        ))
      )}
      <div className="pedido-total">
        Total: ${total}
      </div>
      <div className="pedido-botones">
        <button onClick={volver} className="pedido-btn-volver">Volver al historial</button>
      </div>
    </div>
  );
}

export default Pedido;