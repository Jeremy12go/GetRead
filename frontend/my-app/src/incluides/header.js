import '../styles/header.css'
import logo from '../assets/logBackgroundWhite.png'
import lg_carrito from '../assets/carrito.png'
import lg_billetera from '../assets/billetera.png'
import usuario from '../assets/usuario.png'
import lupa from '../assets/lupa.png'
import mundo from '../assets/mundo.png'
import { useNavigate } from 'react-router-dom';
import { translations } from '../components/translations';


function Header({ stateLogin, name , profileImage, search, setSearch, saldoBilletera, language, setLanguage }) {

    const navigate = useNavigate();

    const displayImage = profileImage && stateLogin ? profileImage : usuario;

    const formatSaldo = (saldo) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP'
        }).format(saldo || 0);
    };

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
    };

    return(
        <div className="general">
            {/* Logo */}
            <div className="left">
                <img className="logo" src={logo} onClick = { () => navigate('/home') } />
            </div>

            {/* Barra de búsqueda */}
                <div className="search-container">
                    <input 
                        type="text" 
                        placeholder={translations[language].search} 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)} 
                    />
                    <img className="lupa" src={lupa} />
                </div>

            {/* Selección de idioma */}
            <div className='lenguage-select-wrapper'>
                <div className="language-icon-fixed">
                    <img className="mundo" src={mundo} />
                </div>
                <div className='lenguage-select'>
                    <button 
                        className={`language-btn ${language === 'es' ? 'active' : ''}`}
                        onClick={() => handleLanguageChange({ target: { value: 'es' } })}
                    >
                        ES
                    </button>
                    <button 
                        className={`language-btn ${language === 'en' ? 'active' : ''}`}
                        onClick={() => handleLanguageChange({ target: { value: 'en' } })}
                    >
                        EN
                    </button>
                </div>
            </div>

            <div className="right">
                {/* Carrito de compras*/}
                <img className="carrito" src={lg_carrito} onClick={() => 
                    stateLogin
                    ? navigate('/carrito')
                    : navigate('/home')
                } />

                {/* Billetera */}
                { stateLogin && (
                    <div className="billetera-container">
                        <img 
                            className="billetera" 
                            src={lg_billetera}
                        />
                        <span className="saldo-billetera">
                            { formatSaldo(saldoBilletera) }
                        </span>
                    </div>
                )}

                {/* Perfil */}
                <div className="login-container"
                    onClick={() => 
                        stateLogin
                        ? navigate('/perfil')
                        : navigate('/login')
                    }>
                    
                    <img className="usuario" src={ displayImage } onError={ (e) => e.target.src = usuario } />
                    {   stateLogin
                        ? <button className="BinicioSesion" >{ name }</button>
                        : <button className="BinicioSesion" >{translations[language].profile}</button>
                    }

                </div>
            </div>
        </div>
    );
}

export default Header;