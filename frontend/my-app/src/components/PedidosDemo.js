import React, { useState } from "react";
import Carrito from "./Carrito";
import Realizado from "./Realizado";
import Calificar from "./Calificar";
import Historial from "./Historial";
import Pedido from "./Pedido";

//ESTO ES SOLO PARA TESTEAR FUNCIONES ANTES DE TENER EL RESTO DE APP (ELIMINAR DESPUES)

function PedidosDemo({volverAPrincipal, volverALogin}) {
  const [pantalla, setPantalla] = useState("");
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <button onClick={volverAPrincipal} style={{ position: "absolute", left: 20, top: 20 }}>
        Ir a Principal
      </button>
      <button onClick={volverALogin} style={{ position: "absolute", left: 130, top: 20 }}>
        Ir a Login
      </button>
      {!pantalla && (
        <>
          <h2>TEST</h2>
          <button onClick={() => setPantalla("carrito")}>Carrito</button>
          <button onClick={() => setPantalla("pedidoRealizado")}>Pedido realizado</button>
          <button onClick={() => setPantalla("calificacion")}>Calificación</button>
          <button onClick={() => setPantalla("historial")}>Historial</button>
          <button onClick={() => setPantalla("detallesPedido")}>Detalles Pedido</button>
        </>
      )}
      {pantalla === "carrito" && <Carrito
        volver={() => setPantalla("")}
        irAConfirmacion={() => setPantalla("pedidoRealizado")}
      />}
      {pantalla === "pedidoRealizado" && <Realizado
        volver={() => setPantalla("")}
        irACalificar={() => setPantalla("calificacion")}
      />}
      {pantalla === "calificacion" && <Calificar volver={() => setPantalla("")} />}
      {pantalla === "historial" && <Historial
        volver={() => setPantalla("")}
        verPedido={pedido => {
          setPedidoSeleccionado(pedido);
          setPantalla("detallesPedido");}}
      />}
      {pantalla === "detallesPedido" && <Pedido
    volver={() => {
      setPantalla("historial");
      setPedidoSeleccionado(null); // con esto se supone si uno llega a esta seccion por otro lado saldra no hay pedido
    }}
    pedido={pedidoSeleccionado}
  />}
    </div>
  );
}

export default PedidosDemo;