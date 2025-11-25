import '../styles/carrito.css';
import '../styles/styles.css';
import { createOrder, getAccount, updateProfile } from '../API/APIGateway.js';

function Carrito({ cart, aumentar, disminuir, eliminar }) {

  const total = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  /*
  const handleGuardarPedido = async () => {
    setEnviando(true);
    const idProfile = localStorage.getItem('idProfile');
    const ids = cart.flatMap(item => Array(item.cantidad).fill(item.id));

    try {
      const res = await createOrder(idProfile, ids, total, infoTienda.id);
      const orderId = res.data.id;

      const profileRes = await getAccount(idProfile);
      const orders = profileRes.data.orders || [];

      await updateProfile(idProfile, { orders: [...orders, orderId] });

      setEnviando(false);
      setCart([]);
      setIdTiendaACalificar(infoTienda.id);
      setIdOrdenACalificar(orderId);
      irAConfirmacion();
    } catch (e) {
      setEnviando(false);
      alert('Error al guardar el pedido');
    }
  };*/

  return (
    <div className="carrito-container">

      <h2>Carrito</h2>

      {cart.length === 0 && <p>Tu carrito está vacío</p>}

      {cart.map(item => (
        <div key={item.id} className="carrito-item">

          <img src={item.imagen} className="carrito-img" />

          <div className="carrito-info">
            <h3>{item.nombre}</h3>
            <p>${item.precio}</p>

            <div className="carrito-controls">
              <button onClick={() => disminuir(item.id)}>-</button>
              <span>{item.cantidad}</span>
              <button onClick={() => aumentar(item.id)}>+</button>
              <button onClick={() => eliminar(item.id)}>Eliminar</button>
            </div>
          </div>

          <p className="carrito-subtotal">${item.precio * item.cantidad}</p>

        </div>
      ))}

      <h3>Total: ${total}</h3>
    </div>
  );
}

export default Carrito;
