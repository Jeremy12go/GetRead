import '../styles/login.css';
import '../styles/styles.css';
import { useState } from "react";
import { loginAccount, getProfile } from '../API/APIGateway.js';
import { useNavigate } from 'react-router-dom';

function Login({ setStateLogin, setName }) {

    const navigate = useNavigate();
    
    const [errorLogin, setErrorLogin] = useState(false);
    const [ email , setEmail ] = useState('');
    const [ password, setPassword ] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorLogin('');

        try {
            localStorage.clear();
            const res = await loginAccount(email, password);
            console.log('Respuesta login:', res.data);

            const account = res.data.account;
            const profile = res.data.profile;

            localStorage.setItem('account', JSON.stringify(account));
            localStorage.setItem('profile', JSON.stringify({
                ...profile,
                email: account.email
            }));

            setName(profile.name);
            setStateLogin(true);
            navigate('/home');

        } catch (e) {
            if (e.response?.data?.error) {
                setErrorLogin(e.response.data.error);
            } else {
                setErrorLogin('Error al iniciar sesión');
            }
            console.error('Error al hacer login:', e.response?.data || e.message);
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
                    <span onClick={() => navigate('/register')} className="text-subrayado">
                        Haz click aquí!
                    </span>
                </p>

                <div>
                    <p className="text-common"> Email* </p>
                    <input
                        type="text"
                        placeholder="Email"
                        className="input-text"
                        value={email}
                        onChange={(e)=> setEmail(e.target.value)
                    }/>

                    <p className="text-common"> Contraseña* </p>
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
                <button onClick={handleSubmit} className="button-generic" >
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