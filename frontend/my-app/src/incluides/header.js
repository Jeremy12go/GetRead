import '../styles/header.css'
import logo from '../assets/logBackgroundWhite.png'
import lg_carrito from '../assets/carrito.png'

function App(){

    return(
        <div>
            <div class="search-container">
                {/* Logo */}
                <img src={logo} />

                {/* Barra de búsqueda */}
                <input type="text" placeholder="Buscar..." />

                {/* Carro */}
                {/*<img src={lg_carrito} />*/}

                {/* Perfil */}

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