import { useState } from "react";
import "../styles/ProductDetail.css";

export default function ProductDetail({ bookOpen, addToCart, aumentar, disminuir }) {
  const [ cantidad, setCantidad ] = useState(1);

  if (!bookOpen){
    return <p>Cargando...</p>;
  } else {
    console.log("ProductDetail Recibio:",bookOpen);
  }

  return (
    
    <div className="pd-container">
      <div className="pd-wrapper">
        {/* Imagen */}
        <div className="pd-image-box">
          <img src={bookOpen.image} alt={bookOpen.name} className="pd-image" />
        </div>

        {/* Info */}
        <div className="pd-info">
          <h1 className="pd-title">{bookOpen.name}</h1>
          <p className="pd-author">{bookOpen.author}</p>

          <p className="pd-description">{bookOpen.description}</p>
          <p className="pd-price">${bookOpen.price.toLocaleString("es-CL")}</p>

          {/* Opciones */}
          <div className="pd-options">
            <select className="pd-select">
              <option>Tipo de compra</option>
              <option>Nuevo</option>
              <option>Usado</option>
            </select>

            <button className="pd-add-btn" 
              onClick={ () => addToCart(bookOpen) }>
            Añadir al carro</button>

            <div className="pd-quantity-box">
              <button onClick={ () => disminuir(bookOpen._id) }>-</button>
              <span>{cantidad}</span>
              <button onClick={ () => aumentar(bookOpen._id) }>+</button>
            </div>

            <p className="pd-stock">Stock disponible: {bookOpen.stock}</p>
          </div>

          {/* Detalles */}
          <div className="pd-details">
            <h2>Detalles</h2>
            <p><strong>Vendido Por:</strong> {bookOpen.idseller}</p>
            <p><strong>ISBN:</strong> {bookOpen.isbn}</p>
            <p><strong>Categoría:</strong> {bookOpen.genre?.join(", ")}</p>
            <p><strong>Rango Público:</strong> {bookOpen.public_range}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
