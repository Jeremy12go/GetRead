import '../styles/carrito.css';
import '../styles/styles.css';
import { createOrder, getProfile, updateProfile } from '../API/APIGateway.js';
import { useEffect } from 'react';

function Carrito({ cart, setCart, aumentar, disminuir, eliminar }) {

  const total = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  const handleMakePurchase = async () => {
  
    const objAccount = localStorage.getItem("objectAccount");
    const profile = objAccount.profile;
    const idsToBooks = cart.flatMap(item => Array(item.cantidad).fill(item.id));

    try {
      const res = await createOrder(profile?.id, idsToBooks, total);
      const orderId = res.data.id;

      const orders = profile?.orders;
      await updateProfile(profile?.id, { orders: [...orders, orderId] });

      //setCart([]);
      //setIdTiendaACalificar(infoTienda.id);
      //setIdOrdenACalificar(orderId);
      //irAConfirmacion();
    } catch (e) {
      alert('Error al guardar el pedido');
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("objectAccount");
    if (!saved) return;

    const parsed = JSON.parse(saved);

    getProfile(parsed.profile._id)
      .then(async (res) => {
        console.log("Respuesta de getProfile:", res.data);

        const cartFromServer = res.data.cart || [];
        console.log("Carro cargado del BackEnd:", cartFromServer);

        const transformedCart = await Promise.all(
          cartFromServer.map(async (item) => {
            const bookDetails = await fetch(`http://localhost:3004/stores/${item.book}`)
              .then(r => r.json());

            return {
              id: item.book,
              cantidad: item.quantity,
              nombre: bookDetails.name,
              precio: bookDetails.price,
              imagen: bookDetails.image
            };
          })
        );

        setCart(transformedCart);
      })
      .catch(err => console.error("Error cargando perfil:", err));
  }, []);

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
