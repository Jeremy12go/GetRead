import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { 
  getProfile, 
  getSubOrderById, 
  qualifySubOrder, 
  getOrderById, 
  getAllBooks 
} from "../API/APIGateway";

import "./Calificar.css";

function Calificar() {
  const [ books, setBooks ] = useState([]);
  const [ subOrders, setSubOrders ] = useState([]);
  const [ rawSubOrders, setRawSubOrders ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ enviando, setEnviando ] = useState(false);
  const [ enviado, setEnviado ] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const res = await getAllBooks();
        setBooks(res.data);
      } catch (e) {
        console.error("Error cargando libros:", e);
      }
    };
    loadBooks();
  }, []);

  useEffect(() => {
    const loadSubOrders = async () => {
      try {
        const objAccount = JSON.parse(localStorage.getItem("objectAccount"));
        const idProfile = objAccount?.profile._id;

        const profileRes = await getProfile(idProfile);
        const ordersIds = profileRes.data.orders;

        const pendientes = [];

        for (const orderId of ordersIds) {
          const orderRes = await getOrderById(orderId);
          const subIds = orderRes.data.subOrders || [];

          for (const subId of subIds) {
            const subRes = await getSubOrderById(subId);
            if (subRes.data?.status === "Pendiente") {
              pendientes.push(subRes.data);
            }
          }
        }

        setRawSubOrders(pendientes);
      } catch (e) {
        console.error("Error cargando subórdenes:", e);
      }
    };

    loadSubOrders();
  }, []);

  useEffect(() => {
    if (!books.length || !rawSubOrders.length) return;

    const enriched = rawSubOrders.map(sub => {
      const productos = sub.productList.map(item => {
        const libro = books.find(b => 
          String(b._id) === String(item.book)
        );

        return {
          ...item,
          name: libro?.name || "Título no disponible",
          image: libro?.image || "https://via.placeholder.com/120x180?text=Libro",
          price: libro?.price || 0
        };
      });

      return {
        ...sub,
        productList: productos,
        estrellas: 0,
        comentario: ""
      };
    });

    setSubOrders(enriched);
    setLoading(false);
  }, [books, rawSubOrders]);

  const handleSetRating = (index, stars) => {
    const copy = [...subOrders];
    copy[index].estrellas = stars;
    setSubOrders(copy);
  };

  const handleSetComentario = (index, text) => {
    const copy = [...subOrders];
    copy[index].comentario = text;
    setSubOrders(copy);
  };

  const handleEnviar = async (subOrder) => {
    try {
      setEnviando(true);

      await qualifySubOrder(subOrder._id, {
        rating: subOrder.estrellas,
        comment: subOrder.comentario
      });

      setEnviado(true);
      setSubOrders(prev =>
        prev.filter(so => so._id !== subOrder._id)
      );
    } catch (e) {
      alert("Error al enviar calificación");
    } finally {
      setEnviando(false);
    }
  };

  if (loading) return <p>Cargando subórdenes pendientes...</p>;

  return (
    <div className="calificar-container">
      <h2>Califica tus compras</h2>

      {subOrders.length === 0 && !enviado && (
        <p>No tienes subórdenes pendientes</p>
      )}

      {enviado && (
        <div className="calificar-mensaje-exito">
          ¡Calificación enviada!
        </div>
      )}

      {subOrders.map((sub, index) => (
      <div className="suborden-card" >
        <div key={sub._id} className="suborden-card-horizontal">
          <div className="suborden-libros">
            {sub.productList.map((p, i) => (
              <div key={i} className="libro-item">
                <img
                  src={p.image}
                  alt={p.name}
                  className="libro-portada"
                />
                <span className="libro-titulo">{p.name}</span>
              </div>
            ))}
          </div>

          <div className="suborden-rating">
            <div className="calificar-estrellas">
              {[1, 2, 3, 4, 5].map(num => (
                <span
                  key={num}
                  className={`calificar-estrella${sub.estrellas >= num ? " activa" : ""}`}
                  onClick={() => handleSetRating(index, num)}
                >
                  ★
                </span>
              ))}
            </div>

            <textarea
              placeholder="Escribe tu comentario"
              value={sub.comentario}
              onChange={e => handleSetComentario(index, e.target.value)}
              rows={2}
              className="calificar-textarea"
            />

            <button
              className="calificar-btn-enviar"
              disabled={sub.estrellas === 0 || enviando}
              onClick={() => handleEnviar(sub)}
            >
              {enviando ? "Enviando..." : "Enviar calificación"}
            </button>
          </div>

        </div>
      </div>
      ))}

      <button
        onClick={() => navigate("/perfil")}
        className="calificar-btn-volver"
      >
        Finalizar
      </button>
    </div>
  );
}

export default Calificar;