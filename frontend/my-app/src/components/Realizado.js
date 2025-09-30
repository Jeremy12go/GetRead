import React from "react";
import "./Realizado.css";

function Realizado({ volver, irACalificar }) {
  return (
    <div className="container">
      <div className="check">
        <span>✔</span>
      </div>
      <h2>Pedido Realizado</h2>
      <button
        onClick={irACalificar}
        className="btn-calificar"
      >
        Calificar tienda?
      </button>
      <button onClick={volver} className="btn-volver">Volver</button>
    </div>
  );
}

export default Realizado;