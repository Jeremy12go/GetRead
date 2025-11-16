import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from '../API/APIGateway.js';
import "../styles/perfil.css";

import usuario from '../assets/usuario.png'

export default function Perfil({ setStateLogin, setName }) {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
            email: response.data.account?.email || savedAccount.email
          };
          
          setPerfil(freshProfile);
          localStorage.setItem('profile', JSON.stringify(freshProfile));
        } else {
          console.error('No se recibió perfil del backend');
        }
      }
      
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      console.error('Error response:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  loadProfile();
}, []);

  const handleLogout = () => {
    localStorage.removeItem('idProfile');
    setStateLogin(false);
    setName('');
    setPerfil(null);
    navigate('/home');
  };

  return (
    <div className="perfil-page">
      {perfil ? (
        <div className="perfil-container">
          <div className="perfil-header">
            {/* Bloque izquierdo: Mi Perfil + icono */}
            <div className="perfil-content">
              <div className="perfil-icon">
                <h1>Mi Perfil</h1>
                <img src={usuario} alt="Usuario" />
              </div>
            </div>

            {/* Bloque derecho: Detalles */}
            <div className="perfil-details">
              <h1>Detalles:</h1>
              <p>Nombre: {perfil.name}</p>
              <p>Dirección: {perfil.address}</p>
              <p>Correo electrónico: {perfil.email}</p>
              <p>Perfil: {perfil._id}</p>
              <p>Teléfono: {perfil.phoneNumber}</p>
            </div>
          </div> {/* ← cierre de perfil-header */}

          {/* Botones debajo */}
          <div className="perfil-botones">
            <button className="btn verde">Ver Historial Pedidos</button>
            <button className="btn negro" onClick={()=> navigate('/editar')}>Editar Perfil</button>
            <button className="btn rojo" onClick={handleLogout}>Cerrar Sesión</button>
            <button className="btn azul">Ver libros Adquiridos</button>
          </div>
        </div>
      ) : (
        <p>Cargando perfil...</p>
      )}
    </div>
  );

}
