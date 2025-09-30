import React, { useState } from "react";
import { createRating, addRatingToStore } from "../API/APIGateway";
import "./Calificar.css";

function Calificar({ volver, idStore, idOrder, idProfile }) {
  const [estrellas, setEstrellas] = useState(0);
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleEnviar = async () => {
    setEnviando(true);
    try {
      const res = await createRating(idStore, idOrder, idProfile, estrellas, comentario);
      const ratingID = res.data._id;
      await addRatingToStore(idStore, ratingID);
      setEnviado(true);
    } catch (e) {
      alert("Error al enviar calificación");
    }
    setEnviando(false);
  };

  return (
    <div className="calificar-container">
      <h2>Califica la tienda</h2>
      <div className="calificar-estrellas">
        {[1, 2, 3, 4, 5].map(num => (
          <span
            key={num}
            className={`calificar-estrella${estrellas >= num ? " activa" : ""}`}
            onClick={() => setEstrellas(num)}
          >
            ★
          </span>
        ))}
      </div>
      <textarea
        placeholder="Deja un comentario (opcional)"
        value={comentario}
        onChange={e => setComentario(e.target.value)}
        rows={4}
        className="calificar-textarea"
      />
      <div>
        {!enviado && (
          <button
            onClick={handleEnviar}
            disabled={estrellas === 0 || enviando}
            className="calificar-btn-enviar"
          >
            {enviando ? "Enviando..." : "Enviar calificación"}
          </button>
        )}
      </div>
      <button onClick={volver} className="calificar-btn-volver">Volver</button>
      {enviado && <div className="calificar-mensaje-exito">¡Gracias por tu calificación!</div>}
    </div>
  );
}

export default Calificar;