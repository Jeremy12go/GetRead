import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, uploadAccountImage } from '../API/APIGateway.js';
import "../styles/perfil.css";
import { translations } from '../components/translations.js';

import usuarioDefault from '../assets/usuario.png'

export default function Perfil({ setStateLogin, setName, language, setLanguage }) {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const navigate = useNavigate();

  const API_URL = 'http://localhost:3000';

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const savedProfile = JSON.parse(localStorage.getItem('profile'));
        const savedAccount = JSON.parse(localStorage.getItem('account'));
        
        if (savedProfile) {
          setPerfil(savedProfile);
        }

        if (savedAccount?._id) {
          const response = await getProfile(savedAccount._id);
          
          if (response.data && response.data.profile) {
            const freshProfile = {
              ...response.data.profile,
              email: response.data.account?.email || savedAccount.email,
              profileImage: response.data.account?.profileImage,
              profilebuyer: response.data.account?.profilebuyer,
              profileseller: response.data.account?.profileseller
            };
            
            setPerfil(freshProfile);
            localStorage.setItem('profile', JSON.stringify(freshProfile));
          }
        }
        
      } catch (error) {
        console.error('Error al cargar perfil:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Solo se permiten imágenes (JPEG, PNG, GIF, WEBP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar los 5MB');
      return;
    }

    try {
      setUploadingImage(true);
      
      const savedAccount = JSON.parse(localStorage.getItem('account'));
      const response = await uploadAccountImage(savedAccount._id, file);

      // Actualizar tanto perfil como account
      const updatedProfile = {
        ...perfil,
        profileImage: response.data.profileImage
      };
      
      const updatedAccount = {
        ...savedAccount,
        profileImage: response.data.profileImage
      };
      
      setPerfil(updatedProfile);
      localStorage.setItem('profile', JSON.stringify(updatedProfile));
      localStorage.setItem('account', JSON.stringify(updatedAccount));

      window.dispatchEvent(new Event('profileUpdated'));

      alert(translations[language].perfil_alert);

    } catch (error) {
      console.error('Error al subir imagen:', error);
      alert('Error al subir la imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setStateLogin(false);
    setName('');
    setPerfil(null);
    window.dispatchEvent(new Event('profileUpdated'));
    navigate('/home');
  };

  if (loading) {
    return (
      <div className="perfil-page">
        <p>{translations[language].perfil_cargando}</p>
      </div>
    );
  }

  const imageUrl = perfil?.profileImage 
    ? `${API_URL}${perfil.profileImage}` 
    : usuarioDefault;

  return (
    <div className="perfil-page">
      {perfil ? (
        <div className="perfil-container">
          <div className="perfil-header">
            <div className="perfil-content">
              <div className="perfil-icon">
                <h1>{translations[language].perfil}</h1>
                
                <div className="profile-image-container">
                  <label htmlFor="profile-image-input" className="image-upload-label">
                    <img 
                      src={imageUrl} 
                      alt="Perfil" 
                      className="profile-image"
                      onError={(e) => e.target.src = usuarioDefault}
                    />
                    <div className="image-overlay">
                      <span className="overlay-text">
                        {uploadingImage ? translations[language].perfil_actualizar : translations[language].perfil_imagen}
                      </span>
                    </div>
                  </label>
                  
                  <input
                    id="profile-image-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    disabled={uploadingImage}
                  />
                </div>
              </div>
            </div>

            <div className="perfil-details">
              <h1>{translations[language].perfil_detalles}</h1>
              <p><strong>{translations[language].perfil_nombre}</strong> {perfil.name}</p>
              <p><strong>{translations[language].perfil_direccion}</strong> {perfil.address}</p>
              <p><strong>{translations[language].perfil_correo}</strong> {perfil.email}</p>
              <p><strong>{translations[language].perfil_id}</strong> {perfil._id}</p>
              <p><strong>{translations[language].perfil_telefono}</strong> {perfil.phoneNumber}</p>
            </div>
          </div>

          <div className="perfil-botones">
            {/* Bloque Buyer */}
            {perfil.profilebuyer && (
              <>
                <button className="btn verde" onClick={() => navigate('/historial-pedidos')}>
                  {translations[language].btn_pedidos}
                </button>
                <button className="btn azul">{translations[language].btn_libros}</button>
              </>
            )}

            {/* Bloque Seller */}
            {perfil.profileseller && (
              <>
                <button className="btn verde" onClick={() => navigate('/historial-publicaciones')}>
                  {translations[language].perfil_publicaciones2}
                </button>
                <button className="btn azul" onClick={() => navigate('/publicar')}>
                  {translations[language].perfil_publicar}
                </button>
              </>
            )}

            {/* Botones comunes */}
            <button className="btn negro" onClick={() => navigate('/editar')}>
              {translations[language].btn_editar}
            </button>
            <button className="btn rojo" onClick={handleLogout}>
              {translations[language].btn_cerrar}
            </button>
          </div>

          <div className="perfil-reviews">
            {perfil.profilebuyer ? (
              <>
                <h2>{translations[language].perfil_resenas}</h2>
                {/* Aquí renderizas lista de reseñas del buyer */}
              </>
            ) : perfil.profileseller ? (
              <>
                <h2>{translations[language].perfil_publicaciones2}</h2>
                {/* Aquí renderizas lista de publicaciones del seller */}
              </>
            ) : (
              <p>Este perfil no tiene tipo definido</p>
            )}
          </div>
        </div>
      ) : (
        <p>No se pudo cargar el perfil</p>
      )}
    </div>
  );
}