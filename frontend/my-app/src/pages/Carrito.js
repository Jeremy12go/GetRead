import '../styles/carrito.css';
import '../styles/styles.css';
import { createOrder, getProfile, updateProfile } from '../API/APIGateway.js';
import { useEffect, useState } from 'react';
import { translations } from '../components/translations.js';
import { useNavigate } from 'react-router-dom';

function Carrito({ cart, setCart, aumentar, disminuir, eliminar, setBookOpen, language }) {

  const [ total, setTotal ] = useState(cart.reduce((sum, item) => sum + item.price * item.quantity, 0));

  const navigate = useNavigate();

  useEffect(() => {
    setTotal(cart.reduce((sum, item) => sum + item.price * item.quantity, 0));
    console.log("Se activo Effect", total);
  }, [cart]);

  const handleMakePurchase = async () => {
  
    const objAccount = localStorage.getItem("objectAccount");
    const profile = objAccount.profile;
    const idsToBooks = cart.flatMap(item => Array(item.stock).fill(item._id));

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
        
        const cartFromServer = res.data.cart || [];
        const transformedCart = await Promise.all(
          cartFromServer.map(async (item) => {
            const bookDetails = await fetch(`http://localhost:3004/stores/${item.book}`)
              .then(r => r.json());

            return {
              _id: item.book,
              quantity: item.quantity,
              name: bookDetails.name,
              price: bookDetails.price,
              image: bookDetails.image,
              stock: bookDetails.stock,
              author: bookDetails.author,
              description: bookDetails.description,
              idseller: bookDetails.idseller,
              isbn: bookDetails.isbn,
              genre: bookDetails.genre,
              public_range: bookDetails.public_range
            };
          })
        );
        console.log(transformedCart);
        setCart(transformedCart);
      })
      .catch(err => console.error("Error cargando perfil:", err));
  }, []);

  return (
    <div className="carrito-container">

      <h2>{translations[language].carrito}</h2>

      {cart.length === 0 && <p>{translations[language].carrito_vacio2}</p>}

      {cart.map(item => (
        <div key={item._id} className="carrito-item">

          <img src={item.image} className="carrito-img"
          onClick={ () => {
            setBookOpen(item);
            console.log("Libro Abierto:",item);
            navigate("/book-detail");
            }}  />

          <div className="carrito-info">
            <h3>{item.name}</h3>
            <p>${item.price}</p>

            <div className="carrito-controls">
              <button onClick={() => disminuir(item._id)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => aumentar(item._id)}>+</button>
              <button onClick={() => eliminar(item._id)}>Eliminar</button>
            </div>
          </div>

          <p className="carrito-subtotal">${item.price * item.quantity}</p>

        </div>
      ))}

      <h3>Total: ${total}</h3>
    </div>
  );
}

export default Carrito;
