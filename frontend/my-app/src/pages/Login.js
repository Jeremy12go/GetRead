import '../styles/login.css';
import '../styles/styles.css';
import { useState } from "react";
import { loginAccount } from '../API/APIGateway.js';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from "@react-oauth/google";
import axios from 'axios';
 
function Login({ setStateLogin, setName, setProfileImage }) {

    const navigate = useNavigate();
    
    const [ errorLogin, setErrorLogin ] = useState(false);
    const [ email , setEmail ] = useState('');
    const [ password, setPassword ] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorLogin('');

        try {
            localStorage.clear();
            const res = await loginAccount(email, password);

            const account = res.data.account;
            const profile = res.data.profile;

            localStorage.setItem('account', JSON.stringify(account));
            localStorage.setItem('profile', JSON.stringify({
                ...profile,
                email: account.email,
                profileImage: account.profileImage
            }));

            if (profile?.profileImage) {
                setProfileImage(profile.profileImage);
            } else if (account?.profileImage) {
                setProfileImage(account.profileImage);
            }

            window.dispatchEvent(new Event('profileUpdated'));

            setName(profile.name.split(" ")[0]);
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

    const handleGoogleLogin = async ( credentialResponse ) => {
        try {
            const googleToken = credentialResponse.credential;

            const res = await axios.post("http://localhost:3004/accounts/google/tokenLogin", {
                token: googleToken
            });

            const account = res.data.account;
            const profile = res.data.profile;

            // Guardar igual que el login normal
            localStorage.setItem("account", JSON.stringify(account));
            localStorage.setItem("profile", JSON.stringify({
                ...profile,
                email: account.email,
                profileImage: account.profileImage
            }));

            setProfileImage(account.profileImage);
            setName(profile.name);
            setStateLogin(true);

            navigate('/home');
        } 
        catch (e) {
            console.error("Error Google Login:", e);
            setErrorLogin("Error al iniciar sesión con Google");
        }
    };

    return (
        <div className="App">
            <div>
                <p className="text-titulos">Iniciar sesión</p>
                <p className="text-common">
                    ¿Primera vez?{' '}
                    <span onClick={ () => navigate('/register') } className="text-subrayado">
                        Haz click aquí!
                    </span>
                </p>

                <div>
                    {/* mail */}
                    <p className="text-common"> Email* </p>
                    <input
                        type="text"
                        placeholder="Email"
                        className="input-text"
                        value={ email }
                        onChange={(e)=> setEmail(e.target.value)
                    }/>
                    {/* password */}
                    <p className="text-common"> Contraseña* </p>
                    <input
                        type="password"
                        placeholder="Contraseña"
                        className="input-text"
                        value={ password }
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            </div>
            <div>
                <button onClick={ handleSubmit } className="button-generic" >
                    Iniciar Sesión
                </button>
                {errorLogin && (
                    <p className='text-error'>
                        {errorLogin}
                    </p>
                )}
                <GoogleLogin
                    onSuccess={ handleGoogleLogin }
                    onError={() => setErrorLogin("Error al iniciar sesión con Google")}
                />
            </div>
        </div>
    );
}

export default Login;