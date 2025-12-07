import '../styles/login.css';
import '../styles/styles.css';
import { useState } from "react";
import { loginAccount } from '../API/APIGateway.js';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from "@react-oauth/google";
import axios from 'axios';
import { translations } from '../components/translations.js'; 

function Login({ setStateLogin, setName, setProfileImage, language, setObjectAccount }) {

    const navigate = useNavigate();
    
    const [ errorLogin, setErrorLogin ] = useState(false);
    const [ email , setEmail ] = useState('');
    const [ password, setPassword ] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorLogin('');

        try {
            const res = await loginAccount(email, password);

            const account = res.data.account;
            const profile = res.data.profile;
            
            setObjectAccount(res.data);
            console.log(res.data);

            localStorage.setItem("objectAccount", JSON.stringify(res.data));
            localStorage.setItem("token", res.data.token);

            if (account?.profileImage !== undefined) {
                setProfileImage(account.profileImage);
            }

            window.dispatchEvent(new Event('profileUpdated'));

            setName(profile?.name.split(" ")[0]);
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

            setObjectAccount(res.data);

            localStorage.setItem("objectAccount", JSON.stringify(res.data));
            localStorage.setItem("token", res.data.token);

            if (account?.profileImage !== undefined) {
                setProfileImage(account.profileImage);
            }

            window.dispatchEvent(new Event('profileUpdated'));

            setName(profile?.name.split(" ")[0]);
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
                <p className="text-titulos">{translations[language].txt_login}</p>
                <p className="text-common">
                    {translations[language].txt_first_time}{' '}
                    <span onClick={ () => navigate('/register') } className="text-subrayado">
                        {translations[language].txt_create_account}
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
                    <p className="text-common"> {translations[language].txt_pwd1} </p>
                    <input
                        type="password"
                        placeholder={translations[language].txt_pwd2}
                        className="input-text"
                        value={ password }
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            </div>
            <div>
                <button onClick={ handleSubmit } className="button-generic" >
                    {translations[language].txt_login}
                </button>
                {errorLogin && (
                    <p className='text-error'>
                        {errorLogin}
                    </p>
                )}

                <div className="separator"></div>

                <GoogleLogin
                    onSuccess={ handleGoogleLogin }
                    onError={() => setErrorLogin("Error al iniciar sesión con Google")}
                />
            </div>
        </div>
    );
}

export default Login;