import '../styles/carrito.css';
import { createOrder, getProfile, updateProfile, updateStockToBook, getSubOrderById, addOrderToSeller } from '../API/APIGateway.js';
import { useEffect, useState } from 'react';
import { translations } from '../components/translations.js';
import { useNavigate } from 'react-router-dom';

function Carrito({ cart, setCart, aumentar, disminuir, eliminar, setBookOpen, language }) {

  const [ total, setTotal ] = useState(cart.reduce((sum, item) => sum + item.price * item.quantity, 0));
  const [ purchaseSuccess, setPurchaseSuccess ] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setTotal(cart.reduce((sum, item) => sum + item.price * item.quantity, 0));
  }, [cart]);

  const handleMakePurchase = async () => {
    try {
      setPurchaseSuccess(true);

      const objAccount = JSON.parse(localStorage.getItem("objectAccount"));
      const idProfile = objAccount?.profile._id;
      const profile = (await getProfile(idProfile)).data;

      // Crear lista de productos
      const productList = cart.map(item => ({
        book: item._id,
        quantity: item.quantity,
        priceAtPurchase: item.price,
        idSeller: item.idseller,
      }));

      // Actualizar stock
      for (const item of cart) {
        await updateStockToBook(item._id, {
          stock: item.stock - item.quantity
        });
      }

      // Crear orden
      const res = await createOrder({
        idBuyer: idProfile,
        productList,
        totalPrice: total
      });

      const { order, subOrders } = res.data;
      
      // Asociar suborders a cada vendedor
      for (const subOrderId of subOrders) {
        const subOrder = await getSubOrderById(subOrderId);
        await addOrderToSeller(subOrder.data.idSeller, subOrderId);
      }

      // Actualizar perfil del comprador
      const booksPurchased = cart.map(item => ({
        book: item._id,
        quantity: item.quantity
      }));

      const currentBooks = profile.books;
      const currentOrders = profile.orders;
      
      await updateProfile( idProfile, {
        books: [...currentBooks, ...booksPurchased], // añadir libros
        cart: [], // limpiar carrito
        orders: [...currentOrders, order._id] // añadir orden
      }).catch(err => {
        console.error('Error al actualizar libros del comprador:', err.message);
      });


      // Mostrar animación y redirigir
      setTimeout(() => {
        setPurchaseSuccess(false);
        navigate("/perfil");
      }, 2000);

    } catch (e) {
      console.error(e);
      alert("Error al procesar la compra");
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
            navigate("/book-detail");
            }}  />

          <div className="carrito-info">
            <h3>{item.name}</h3>
            <p>${item.price}</p>

            <div className="carrito-controls">
              <button className="buttons" onClick={() => disminuir(item._id)}>-</button>
              <span>{item.quantity}</span>
              <button className="buttons" onClick={() => aumentar(item._id)}>+</button>
              <button className="buttons" onClick={() => eliminar(item._id)}>Eliminar</button>
            </div>
          </div>

          <p className="carrito-subtotal">${item.price * item.quantity}</p>

        </div>
      ))}

      <h3>Total: ${total}</h3>
      
      <button onClick={ handleMakePurchase } className="Bcomprar" >Comprar</button>

      {purchaseSuccess && (
        <div className="success-overlay">
          <div className="success-modal">
            <div className="checkmark">✓</div>
            <h2>¡Compra exitosa!</h2>
            <p>Gracias por tu compra :D</p>
          </div>
        </div>
      )}
      
    </div>
  );
}

export default Carrito;
