import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from '../API/APIGateway.js';
import "../styles/perfil.css";

import usuario from '../assets/usuario.png'

export default function Perfil({ setStateLogin, setName }) {
  const [perfil, setPerfil] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const idProfile = localStorage.getItem('idProfile');
    if (!idProfile) return;
    getProfile(idProfile).then(res => 
      console.log(res.data) ||
      setPerfil(res.data));
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
              <p>Perfil: {perfil.role}</p>
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
