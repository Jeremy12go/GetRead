import '../styles/login.css';
import { useState } from "react";
import homePostLogin from "./HomePostLogin.js";
import { loginAccount } from '../API/APIGateway.js';

function Login({ view, setView }) {
    
    const [errorLogin, setErrorLogin] = useState(false);
    const [ email , setEmail ] = useState('');
    const [ password, setPassword ] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorLogin('');
        try {
            const res = await loginAccount(email, password);
            localStorage.setItem('idProfile', res.data);
            const p = localStorage.getItem('idProfile');
            console.log('Login en el perfil:', res.data);
            setView('homePostLogin');
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
            <div>
                <p className="text-titulos">
                    Iniciar sesión
                </p>

                <p className="text-common">
                    ¿Primera vez?{' '}
                    <span onClick={() => setView('register')} className="text-subrayado">
                        Haz click aquí!
                    </span>
                </p>

                <div>
                    <p className="text-input"> Email* </p>
                    <input
                        type="text"
                        placeholder="Email"
                        className="input-text"
                        value={email}
                        onChange={(e)=> setEmail(e.target.value)
                    }/>

                    <p className="text-input"> Contraseña* </p>
                    <input
                        type="password"
                        placeholder="Contraseña"
                        className="input-text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                </div>
            </div>
            <div>
                <button onClick={handleSubmit} className="boton-iniciar" >
                    Iniciar Sesión
                </button>
                {errorLogin && (
                    <p className='text-error'>
                        {errorLogin}
                    </p>
                )}
            </div>
        </div>
    );
}

export default Login;