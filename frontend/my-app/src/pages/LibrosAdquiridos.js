import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from '../API/APIGateway.js';
import { translations } from '../components/translations.js';
import "../styles/carrito.css";

export default function LibrosAdquiridos({ language, setBookOpen, setFromPurchased }) {
  const [ books, setBooks ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const savedAccount = JSON.parse(localStorage.getItem("objectAccount"));
        if (!savedAccount) {
          navigate('/login');
          return;
        }

        const profileId = savedAccount.profile._id;
        const profileData = await getProfile(profileId);
        const booksData = profileData.data.books || [];

        const booksWithDetails = await Promise.all(
          booksData.map(async (item) => {
            try {
              const bookDetails = await fetch(`http://localhost:3004/stores/${item.book}`)
                .then(r => r.json());
              
              return {
                ...bookDetails,
                quantityPurchased: item.quantity
              };
            } catch (error) {
              console.error(`Error al cargar libro ${item.book}:`, error);
              return null;
            }
          })
        );

        setBooks(booksWithDetails.filter(book => book !== null));
      } catch (error) {
        console.error('Error al cargar libros:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [navigate]);

  const getBookText = (book, field) => {
    if (language === 'en' && book[`${field}_en`]) {
      return book[`${field}_en`];
    }
    return book[field] || book[`${field}_en`] || '';
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>{translations[language].perfil_cargando}</p>
      </div>
    );
  }

  return (
    <div className="carrito-container">
      <h2>{translations[language].btn_libros}</h2>
      
      {books.length === 0 ? (
        <p className="text-center color-gray mt-20">
          {translations[language]?.no_books || 'No has comprado ningún libro todavía.'}
        </p>
      ) : (
        <div className="flex-column gap-20 mt-20">
          {books.map((book, i) => (
            <div key={i} className="item-card">
              <img 
                src={book.image} 
                alt={getBookText(book, 'name')} 
                className="item-card-image"
                onClick={() => {
                  setBookOpen(book);
                  setFromPurchased(true);
                  navigate("/book-detail");
                }}
              />
              
              <div className="item-card-content">
                <h3 className="item-card-title">
                  {getBookText(book, 'name')}
                </h3>
                
                <p className="item-card-text">
                  <strong>{translations[language].publicar_autor2}:</strong> {book.author}
                </p>
                
                <p className="item-card-description">
                  {getBookText(book, 'description')}
                </p>
                
                <div className="item-card-footer">
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>
                    {translations[language].txt_cantidad}: {book.quantityPurchased}
                  </p>
                  
                  <button 
                    className="Bcomprar" 
                    onClick={() => {
                      setBookOpen(book);
                      setFromPurchased(true);
                      navigate("/book-detail");
                    }}
                  >
                    {translations[language].libro_detalles}
                  </button>
                </div>
              </div>
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
