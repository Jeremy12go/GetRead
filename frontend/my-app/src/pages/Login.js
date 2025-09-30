import '../styles/login.css';
import { useState } from "react";
import Registro from "./Registro.js";
import Principal from "./Principal.js";
import Contenedor from "../components/Contenedor.js";
import PedidosDemo from "../components/PedidosDemo.js";
import { loginAccount } from '../API/APIGateway.js';

function App() {

    const [pantallaActual, setPantallaActual] = useState("inicio");
    const [errorLogin, setErrorLogin] = useState(false);

    const [ email , setEmail ] = useState('');
    const [ password, setPassword ] = useState('');

    const cambiarPantalla = (nuevaPantalla) => {
        if (nuevaPantalla === 'inicio'){
            setErrorLogin(false);
            setEmail("");
            setPassword("");
        }
        setPantallaActual(nuevaPantalla);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorLogin('');
        try {
            const res = await loginAccount(email, password);
            localStorage.setItem('idProfile', res.data);
            const p = localStorage.getItem('idProfile');
            console.log('Login en el perfil:', res.data);
            cambiarPantalla("Principal");
        } catch (e) {
            if (e.response && e.response.data && e.response.data.error){
                setErrorLogin(e.response.data.error);
                console.error('Error al registrar:', e.response?.data || e.message);
            } else{
                console.error('Error al registrar:', e.response?.data || e.message);
            }
        }
    };

    return (
        <div className="App">
            {pantallaActual === "PedidosDemo" ? (
                <PedidosDemo
                volverAPrincipal={() => setPantallaActual("Principal")}
                volverALogin={() => setPantallaActual("inicio")}
                />
            ) : (
            <header className="Contenedor">
                {pantallaActual === "inicio" ? (
                    <>
                        <p style={{ fontWeight: 'bold', fontSize: '70px', margin:'40px'}}>
                            Utal Eats
                        </p>
                        <Contenedor>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ fontSize: '35px', marginBottom: '4px', marginTop: '0px'}}
                                className="text-titulos">
                                    Iniciar sesión
                                </p>

                                <p style={{ fontSize: '16px' , marginTop: '0'}}
                                   className="text-common">
                                    ¿Primera vez?{' '}
                                    <span
                                        onClick={() => cambiarPantalla("Registro")}
                                        className="text-subrayado"
                                        >
                                        Haz click aquí!
                                    </span>
                                </p>

                                <div style={{ fontSize: '16px', textAlign: 'left', maxWidth: '300px', margin: '0 auto', marginTop: '30px'}}>
                                    <p style={{marginBottom: '10px'}}
                                       className="text-common">
                                        Email* </p>
                                    <input
                                        type="text"
                                        placeholder="Email"
                                        className="input-text"
                                        value={email}
                                        onChange={(e)=> setEmail(e.target.value)
                                    }/>

                                    <p style={{marginBottom: '10px'}}
                                       className="text-common">
                                        Contraseña*</p>
                                    <input
                                        type="password"
                                        placeholder="Contraseña"
                                        className="input-text"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />

                                </div>
                            </div>
                            <div style={{height: '45px' ,marginTop: '20px', marginBottom: '20px'}}>
                                <button onClick={handleSubmit} className="boton-iniciar" >
                                    Iniciar Sesión
                                </button>
                                {errorLogin && (
                                    <p style={{ color: 'red', marginTop: '10px' }}>
                                        {errorLogin}
                                    </p>
                                )}
                            </div>
                        </Contenedor>
                    </>
                ) : pantallaActual === "Registro" ? (
                    <Registro cambiarPantalla={cambiarPantalla} />
                ) : pantallaActual === "Principal" ? (
                    <Principal cambiarPantalla={cambiarPantalla} />
                ) : null}
            </header>
        )}
        </div>
    );
}

export default App;