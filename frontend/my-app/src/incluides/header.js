import '../styles/header.css'
import logo from '../assets/logBackgroundWhite.png'
import lg_carrito from '../assets/carrito.png'
import usuario from '../assets/usuario.png'
import lupa from '../assets/lupa.png'
import { useNavigate } from 'react-router-dom';


function Header({ stateLogin, name }) {

    const navigate = useNavigate();

    return(
        <div class="general">
            <div class="search-container">
                {/* Logo */}
                <img class="logo" src={logo} onClick = { () => navigate('/home') } />

                {/* Barra de búsqueda */}
                <input type="text" placeholder="Buscar..." />
                <img class="lupa" src={lupa} />

                {/* Carrito de compras*/}
                <img class="carrito" src={lg_carrito} onClick={() => 
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
                    
                    <img class="usuario" src={usuario}  />
                    { stateLogin ?
                    <button class="BinicioSesion" >{name}</button> :
                    <button class="BinicioSesion" >Perfil</button>}
                    {console.log("estado: "+stateLogin)}

                </div>

            </div>
            

            {/* Botones */}
            <nav>
                <a onClick={() => navigate('/home')}>Inicio</a>
                <a onClick={() => navigate('/register')}>Registrar</a>
                <a>Eliminar</a>
                <a>Editar</a>
            </nav>
        </div>
    );
}

export default Header;