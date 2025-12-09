import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ordersByProfile, getSubOrderById } from '../API/APIGateway.js';
import { translations } from '../components/translations.js';
import "../styles/carrito.css";

function formatearFecha(fechaFormat) {
  const fecha = new Date(fechaFormat);
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const year = String(fecha.getFullYear()).slice(-2);
  const hora = fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${dia}-${mes}-${year} ${hora}`;
}

export default function HistorialPedidos({ language }) {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  const traducirEstado = (status) => {
    const estadoKey = `estado_${status.toLowerCase()}`;
    return translations[language]?.[estadoKey] || status;
  };

  useEffect(() => {
    const cargarPedidos = async () => {
      setCargando(true);
      try {
        const savedAccount = JSON.parse(localStorage.getItem("objectAccount"));
        if (!savedAccount) {
          navigate('/login');
          return;
        }
        
        console.log(savedAccount);
        const idProfile = savedAccount?.profile._id;
        
        const ordersRes = await ordersByProfile(idProfile);
        const pedidosData = ordersRes.data;
        
        if (!pedidosData || pedidosData.length === 0) {
          setPedidos([]);
          setCargando(false);
          return;
        }
        
        const pedidosEnriquecidos = await Promise.all(
          pedidosData.map(async (orden) => {
            if (orden.subOrders && orden.subOrders.length > 0) {
              if (typeof orden.subOrders[0] === 'string') {
                const subOrdersDetails = await Promise.all(
                  orden.subOrders.map(async (subOrderId) => {
                    try {
                      const subOrderRes = await getSubOrderById(subOrderId);
                      return subOrderRes.data;
                    } catch (e) {
                      console.error(`Error cargando suborden ${subOrderId}:`, e);
                      return null;
                    }
                  })
                );
                return {
                  ...orden,
                  subOrdersDetails: subOrdersDetails.filter(so => so !== null)
                };
              } else {
                return {
                  ...orden,
                  subOrdersDetails: orden.subOrders
                };
              }
            }
            return orden;
          })
        );
        
        setPedidos(pedidosEnriquecidos);

      } catch (e) {
        console.error('Error cargando pedidos:', e);
        setPedidos([]);
      }
      setCargando(false);
    };
    cargarPedidos();
  }, [navigate]);

  if (cargando) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>{translations[language].perfil_cargando}</p>
      </div>
    );
  }

  return (
    <div className="carrito-container">
      <h2>{translations[language]?.txt_historial}</h2>
      
      {pedidos.length === 0 ? (
        <p className="text-center color-gray mt-20">
          {translations[language]?.no_pedidos || 'No hay pedidos anteriores.'}
        </p>
      ) : (
        <div className="flex-column gap-15 mt-20">
          {pedidos.map((orden) => (
            <div key={orden._id} className="orden-card">
              <div className="orden-header">
                <div>
                  <h3 className="orden-title">
                    {translations[language].txt_orden} #{orden._id.slice(-6)}
                  </h3>
                  <p className="orden-text">
                    {translations[language].txt_fecha}: {formatearFecha(orden.orderDate)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="orden-price">
                    ${orden.totalPrice.toFixed(2)}
                  </p>
                  <p className="orden-text">
                    {translations[language].txt_estado}: {traducirEstado(orden.status)}
                  </p>
                </div>
              </div>

              {orden.subOrdersDetails && orden.subOrdersDetails.length > 0 && (
                <div className="productos-section">
                  <p className="productos-title">
                    {translations[language].txt_productos}:
                  </p>
                  {orden.subOrdersDetails.map((subOrder, subIdx) => (
                    <div key={subIdx} className="suborden-item">
                      <p className="suborden-seller">
                        {translations[language].txt_vendedor} #{subOrder.idSeller?.slice(-6) || 'N/A'}
                      </p>
                      {subOrder.productList && subOrder.productList.map((item, idx) => (
                        <div key={idx} className="product-list-item">
                          • {translations[language].txt_cantidad}: {item.quantity} - ${item.priceAtPurchase.toFixed(2)} c/u
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => navigate('/perfil')}
        className="Bcomprar mt-20"
      >
        {translations[language].txt_regresar}
      </button>
    </div>
  );
}
