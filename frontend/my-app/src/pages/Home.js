import '../styles/home.css';
import Header from '../incluides/header.js'
import img_1 from '../assets/PortadasLibros/Harry.jpg';
import img_2 from '../assets/PortadasLibros/Juego.jpg';
import img_3 from '../assets/PortadasLibros/Franki.jpg';
import img_4 from '../assets/PortadasLibros/Quijote.jpg';
import img_5 from '../assets/PortadasLibros/Sennor.jpg';

function App() {

    return(
        <div class="general">

            { /* Menu bar */ }
            < Header/>
            { /* Carouser */ }
            <div class="carousel" >
                <div class="carousel_track">
                    <img src={img_1} />
                    <img src={img_2} />
                    <img src={img_3} />
                    <img src={img_4} />
                    <img src={img_5} />

                    <img src={img_1} />
                    <img src={img_2} />
                    <img src={img_3} />
                    <img src={img_4} />
                    <img src={img_5} /> 

                    <img src={img_1} />
                    <img src={img_2} />
                    <img src={img_3} />
                    <img src={img_4} />
                    <img src={img_5} /> 
                </div>
            </div>
        </div>
    );
}

export default App;