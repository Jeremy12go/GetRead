import '../styles/header.css'
import logo from '../assets/logBackgroundWhite.png'
import lg_carrito from '../assets/carrito.png'
import usuario from '../assets/usuario.png'
import lupa from '../assets/lupa.png'

function Header({ view, setView, stateLogin, setStateLogin, name, setName }) {

    return(
        <div class="general">
            <div class="search-container">
                {/* Logo */}
                <img class="logo" src={logo} onClick = { () => setView('home') } />

                {/* Barra de búsqueda */}
                <input type="text" placeholder="Buscar..." />
                <img class="lupa" src={lupa} />

                {/* Carrito de compras*/}
                <img class="carrito" src={lg_carrito} onClick={() => 
                    stateLogin ?
                    setView('homePostLogin') :
                    setView('home')
                } />

                {/* Perfil */}
                <div class="login-container" onClick={() => setView('login')}>
                    <img class="usuario" src={usuario}  />
                    { stateLogin ?
                    <button class="BinicioSesion" >{name}</button> :
                    <button class="BinicioSesion" >Login</button>}
                    {console.log("estado: "+stateLogin)}
                </div>

            </div>
            

            {/* Botones */}
            <nav>
                <a onClick={() => setView('homePostLogin')}>Inicio</a>
                <a>Registrar</a>
                <a>Eliminar</a>
                <a>Editar</a>
            </nav>
        </div>
    );
}

export default Header;