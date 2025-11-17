import '../styles/header.css'
import '../styles/styles.css'
import logo from '../assets/logBackgroundWhite.png'
import lg_carrito from '../assets/carrito.png'
import usuario from '../assets/usuario.png'
import lupa from '../assets/lupa.png'
import { useNavigate } from 'react-router-dom';


function Header({ stateLogin, name , profileImage }) {

    const navigate = useNavigate();
    
    const API_URL = 'http://localhost:3000';

    const displayImage = profileImage 
        ? `${API_URL}${profileImage}` 
        : usuario;

    return(
        <div className="general">
            <div className="search-container">
                {/* Logo */}
                <img className="logo" src={logo} onClick = { () => navigate('/home') } />

                {/* Barra de búsqueda */}
                <input type="text" placeholder="Buscar..." />
                <img className="lupa" src={lupa} />
                {/* Carrito de compras*/}
                <img className="carrito" src={lg_carrito} onClick={() => 
                    stateLogin
                     ? navigate('/carrito')
                     : navigate('/homePostLogin')
                } />

                {/* Perfil */}

                <div className="login-container"
                    onClick={() => 
                        stateLogin
                         ? navigate('/perfil')
                         : navigate('/login')
                    }
                >
                    
                    <img className="usuario" src={displayImage} onError={(e) => e.target.src = usuario} />
                    { stateLogin ?
                    <button className="BinicioSesion" >{name}</button> :
                    <button className="BinicioSesion" >Perfil</button>}

                </div>
            </div>
            

            {/* Botones */}
            <nav className='nav'>
                <button className="header-button" onClick={() => navigate('/home')}>Inicio</button>
                <button className="header-button" onClick={() => navigate('/register')}>Registrar</button>
                <button className="header-button" onClick={() => navigate('/delete')}>Eliminar</button>
                <button className="header-button" onClick={() => navigate('/edit')}>Editar</button>
            </nav>
        </div>
    );
}

export default Header;