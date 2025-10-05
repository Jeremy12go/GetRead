import '../styles/header.css'
import logo from '../assets/logBackgroundWhite.png'
import lg_carrito from '../assets/carrito.png'
import usuario from '../assets/usuario.png'
import lupa from '../assets/lupa.png'

function App(){

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
                <img class="usuario" src={usuario} />

            </div>
            

            {/* Botones */}
            <nav>
                <a href="index.php">Inicio</a>
                <a href="registrar.php">Registrar</a>
                <a href="eliminar.php">Eliminar</a>
                <a href="editar.php">Editar</a>
            </nav>
        </div>
    );
}

export default App;