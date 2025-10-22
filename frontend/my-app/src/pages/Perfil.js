import { useState, useEffect} from "react";

export default function Perfil() {
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    const idProfile = localStorage.getItem('idProfile');
    if (!idProfile) return;
    //getProfile(idProfile).then(res => setPerfil(res.data));
  }, []);

  return (
    <div className="perfil-page">
      {perfil ? (
        <>
          <h1>Mi Perfil</h1>
          <p><strong>Nombre:</strong> {perfil.name}</p>
          <p><strong>Teléfono:</strong> {perfil.phoneNumber}</p>
          <p><strong>Dirección:</strong> {perfil.address}</p>
        </>
      ) : (
        <p>Cargando perfil...</p>
      )}
    </div>
  );
}
