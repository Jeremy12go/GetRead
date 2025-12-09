import { useState } from "react";
import "../styles/ProductDetail.css";
import { translations } from '../components/translations.js';
import { updateStockToBook } from '../API/APIGateway.js';

export default function ProductDetail({ bookOpen, addToCart, aumentar, disminuir, language, stateLogin, fromPurchased = false }) {
  const [ cantidad, setCantidad ] = useState(1);
  const [ nuevoStock, setNuevoStock ] = useState(0);
  const [ editandoStock, setEditandoStock ] = useState(false);
  const [ mensajeStock, setMensajeStock ] = useState('');
  const [ nuevoPrecio, setNuevoPrecio ] = useState(0);
  const [ editandoPrecio, setEditandoPrecio ] = useState(false);
  const [ mensajePrecio, setMensajePrecio ] = useState('');

  if (!bookOpen){
    return <p>Cargando...</p>;
  } else {
    console.log("ProductDetail Recibio:",bookOpen);
  }

  const hasStock = bookOpen.stock > 0;
  
  const savedAccount = JSON.parse(localStorage.getItem("objectAccount") || '{}');
  const isOwner = savedAccount?.profile?._id === bookOpen.idseller;

  const handleUpdateStock = async () => {
    try {
      const stockAdicional = parseInt(nuevoStock);
      if (isNaN(stockAdicional) || stockAdicional <= 0) {
        setMensajeStock(translations[language].libro_cantidad_invalido);
        return;
      }

      const nuevoStockTotal = bookOpen.stock + stockAdicional;
      await updateStockToBook(bookOpen._id, { stock: nuevoStockTotal });
      
      bookOpen.stock = nuevoStockTotal;
      setMensajeStock(`✓ Stock actualizado a ${nuevoStockTotal}`);
      setNuevoStock(0);
      setEditandoStock(false);
      
      setTimeout(() => setMensajeStock(''), 3000);
    } catch (error) {
      console.error('Error actualizando stock:', error);
      setMensajeStock(translations[language].libro_error_actualizar);
    }
  };

  const handleUpdatePrecio = async () => {
    try {
      const precioNuevo = parseFloat(nuevoPrecio);
      if (isNaN(precioNuevo) || precioNuevo <= 0) {
        setMensajePrecio(translations[language].libro_precio_invalido || 'Precio inválido');
        return;
      }

      await updateStockToBook(bookOpen._id, { price: precioNuevo });
      
      bookOpen.price = precioNuevo;
      setMensajePrecio(`✓ Precio actualizado a $${precioNuevo.toLocaleString("es-CL")}`);
      setNuevoPrecio(0);
      setEditandoPrecio(false);
      
      setTimeout(() => setMensajePrecio(''), 3000);
    } catch (error) {
      console.error('Error actualizando precio:', error);
      setMensajePrecio(translations[language].libro_error_actualizar || 'Error al actualizar');
    }
  };

  const getBookText = (field) => {
    if (language === 'en' && bookOpen[`${field}_en`]) {
      return bookOpen[`${field}_en`];
    }
    return bookOpen[field] || bookOpen[`${field}_en`] || '';
  };

  return (
    
    <div className="pd-container">
      <div className="pd-wrapper">
        {/* Imagen */}
        <div className="pd-image-box">
          <img src={bookOpen.image} alt={bookOpen.name} className="pd-image" />
        </div>

        {/* Info */}
        <div className="pd-info">
          <h1 className="pd-title">{getBookText('name')}</h1>
          <p className="pd-author">{bookOpen.author}</p>

          <p className="pd-description">{getBookText('description')}</p>
          
          {/* Precio con opción de editar para el dueño */}
          <div className="pd-precio-container">
            <p className="pd-price pd-precio-text">${bookOpen.price.toLocaleString("es-CL")}</p>
            
            {isOwner && !editandoPrecio && (
              <button 
                className="pd-add-btn pd-editar-precio-btn"
                onClick={() => setEditandoPrecio(true)}
              >
                {translations[language].txt_editar_precio}
              </button>
            )}
            
            {isOwner && editandoPrecio && (
              <div className="pd-precio-edit-container">
                <input 
                  type="number" 
                  min="0"
                  value={nuevoPrecio}
                  onChange={(e) => setNuevoPrecio(e.target.value)}
                  placeholder="Nuevo precio"
                  className="pd-precio-input"
                />
                <button 
                  className="pd-add-btn pd-precio-confirmar-btn"
                  onClick={handleUpdatePrecio}
                >
                  {translations[language].txt_confirmar}
                </button>
                <button 
                  onClick={() => { setEditandoPrecio(false); setNuevoPrecio(0); }}
                  className="pd-add-btn pd-precio-cancelar-btn"
                >
                  {translations[language].txt_cancelar}
                </button>
              </div>
            )}
          </div>

          {/* Opciones */}
          {!fromPurchased && (
            <div className="pd-options">
              <select className="pd-select">
                <option>{translations[language].libro_tipo_compra}</option>
                <option>{translations[language].libro_nuevo}</option>
                <option>{translations[language].libro_usado}</option>
              </select>

              {stateLogin && (
                <>
                  <button 
                    className="pd-add-btn" 
                    onClick={ () => addToCart(bookOpen, cantidad) }
                    disabled={!hasStock}
                    style={{
                      opacity: hasStock ? 1 : 0.5,
                      cursor: hasStock ? 'pointer' : 'not-allowed'
                    }}
                  >
                    {hasStock ? translations[language].libro_agregar_carro : (translations[language].libro_sin_stock)}
                  </button>
                  <div className="pd-quantity-box">
                    <button 
                      onClick={ () => setCantidad(prev => Math.max(1, prev - 1)) }
                      disabled={!hasStock}
                      style={{ cursor: hasStock ? 'pointer' : 'not-allowed', opacity: hasStock ? 1 : 0.5 }}
                    >
                      -
                    </button>
                    <span>{hasStock ? cantidad : 0}</span>
                    <button 
                      onClick={ () => setCantidad(prev => Math.min(bookOpen.stock, prev + 1)) }
                      disabled={!hasStock}
                      style={{ cursor: hasStock ? 'pointer' : 'not-allowed', opacity: hasStock ? 1 : 0.5 }}
                    >
                      +
                    </button>
                  </div>
                </>
              )}

              <p className="pd-stock" style={{ color: hasStock ? 'inherit' : '#d9534f' }}>
                {translations[language].libro_stock_disponible} {bookOpen.stock}
              </p>
            </div>
          )}

          {/* Contenedor de Detalles y Gestión */}
          <div style={{ display: 'flex', gap: '20px', marginTop: '20px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            
            {/* Detalles del Libro */}
            <div className="pd-details" style={{ flex: '1', minWidth: '280px', margin: 0 }}>
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

            {/* Control de Stock y Precio para Vendedor */}
            {isOwner && (
              <div style={{ 
                flex: '1', 
                minWidth: '280px',
                padding: '20px 15px', 
                backgroundColor: '#f0f8ff', 
                borderRadius: '8px', 
                border: '1px solid #4a90e2',
                height: 'fit-content'
              }}>
                <h2 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#333' }}>
                  {translations[language].libro_gestionar}
                </h2>

                {/* Gestión de Stock */}
                <div>
                  <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
                    {translations[language].libro_stock_actual}: <strong>{bookOpen.stock}</strong>
                  </p>
                  
                  {!editandoStock ? (
                    <button 
                      className="pd-add-btn"
                      onClick={() => setEditandoStock(true)}
                      style={{ padding: '8px 16px', width: '100%' }}
                    >
                      {translations[language].libro_aumentar_stock}
                    </button>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <input 
                        type="number" 
                        min="1"
                        value={nuevoStock}
                        onChange={(e) => setNuevoStock(e.target.value)}
                        placeholder="Cantidad"
                        style={{
                          padding: '10px',
                          borderRadius: '4px',
                          border: '1px solid #ddd',
                          fontSize: '14px'
                        }}
                      />
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                          className="pd-add-btn"
                          onClick={handleUpdateStock}
                          style={{ padding: '10px 16px', flex: 1 }}
                        >
                          {translations[language].perfil_confirmar}
                        </button>
                        <button 
                          onClick={() => { setEditandoStock(false); setNuevoStock(0); }}
                          className="pd-add-btn"
                          style={{
                            padding: '10px 16px',
                            backgroundColor: '#6c757d',
                            flex: 1
                          }}
                        >
                          {translations[language].txt_cancelar}
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {mensajeStock && (
                    <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: mensajeStock.includes('✓') ? '#28a745' : '#dc3545' }}>
                      {mensajeStock}
                    </p>
                  )}
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
