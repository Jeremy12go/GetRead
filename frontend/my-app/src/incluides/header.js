import '../styles/header.css'
import logo from '../assets/logBackgroundWhite.png'
import lg_carrito from '../assets/carrito.png'
import usuario from '../assets/usuario.png'
import lupa from '../assets/lupa.png'

function Header({ view, setView }) {

    return(
        <div class="general">
            <div class="search-container">
                {/* Logo */}
                <img class="logo" src={logo} />

                {/* Barra de búsqueda */}
                <input type="text" placeholder="Buscar..." />
                <img class="lupa" src={lupa} />

                {/* Carrito de compras*/}
                <img class="carrito" src={lg_carrito} />

                {/* Perfil */}
                <div class="login-container" onClick={() => setView('login')}>
                    <img class="usuario" src={usuario}  />
                    <button class="BinicioSesion" >Login</button>
                </div>

            </div>
            

            {/* Botones */}
            <nav>
                <a onClick={() => setView('start')}>Inicio</a>
                <a>Registrar</a>
                <a>Eliminar</a>
                <a>Editar</a>
            </nav>
        </div>
    );
}

export default Header;