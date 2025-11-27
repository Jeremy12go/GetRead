import { useState } from "react";
import "../styles/ProductDetail.css";
import { translations } from '../components/translations.js';

export default function ProductDetail({ bookOpen, addToCart, aumentar, disminuir, language }) {
  const [ cantidad, setCantidad ] = useState(1);

  if (!bookOpen){
    return <p>Cargando...</p>;
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
              <option>{translations[language].libro_tipo_compra}</option>
              <option>{translations[language].libro_nuevo}</option>
              <option>{translations[language].libro_usado}</option>
            </select>

            <button className="pd-add-btn" 
              onClick={ () => addToCart({
                  id: bookOpen._id,
                  nombre: bookOpen.name,
                  precio: bookOpen.price,
                  imagen: bookOpen.image }) }>
            {translations[language].libro_agregar_carro}</button>

            <div className="pd-quantity-box">
              <button onClick={ () => disminuir(bookOpen._id) }>-</button>
              <span>{cantidad}</span>
              <button onClick={ () => aumentar(bookOpen._id) }>+</button>
            </div>

            <p className="pd-stock">{translations[language].libro_stock_disponible} {bookOpen.stock}</p>
          </div>

          {/* Detalles */}
          <div className="pd-details">
            <h2>{translations[language].libro_detalles}</h2>
            <p><strong>{translations[language].libro_vendido_por}</strong> {bookOpen.idseller}</p>
            <p><strong>ISBN:</strong> {bookOpen.isbn}</p>
            <p>
              <strong>{translations[language].libro_categoria}</strong>{" "}
              {bookOpen.genre?.map(g => translations[language].genreList[g] || g).join(", ")}
            </p>
            <p>
              <strong>{translations[language].libro_rango_publico}</strong>{" "}
                {translations[language].publicRangeList[bookOpen.public_range?.replace(" ", "")] || bookOpen.public_range}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
