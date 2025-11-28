import '../styles/register.css'
import '../styles/styles.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerBuyer, registerSeller } from '../API/APIGateway';
import { translations } from '../components/translations.js';


function Register({ language, setLanguage }) {
    
    const navigate = useNavigate();
    const [ email , setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ name, setName ] = useState('');
    const [ phoneNumber, setPhoneNumber ] = useState('');
    const [ address, setAddress ] = useState('');
    const [role, setRole] = useState('buyer');
    const [ errorRegistro, setErrorRegistro] = useState(false);

    const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !name.trim() || !phoneNumber.trim() || !address.trim()) {
            setErrorRegistro("Debes completar todos los campos.");
            return;
        }
    try {
        let res;
        if (role === 'buyer') {
            res = await registerBuyer(email, password, name, phoneNumber, address);
        } else {
            res = await registerSeller(email, password, name, phoneNumber, address);
        }
        console.log('Cuenta creada:', res.data);
        navigate('/homepostlogin');

    } catch (e) {
        console.error('Error al registrar:', e.response?.data || e.message);
    }
    };

    return (
        <div class="App">
            <div>
                <p className="text-titulos">
                    {translations[language].txt_registro}
                </p>
                <div>
                    
                    <p className="text-common">
                        {translations[language].txt_usr_name} </p>
                    <input type="name" placeholder={translations[language].txt_usr_name2} 
                        value={name} onChange={ (e) => setName(e.target.value) }
                        className="input-text" />   

                    <p className="text-common">
                        {translations[language].txt_telefono}</p>
                    <input type="phoneNumber" placeholder="+XX 123456789"
                        value={phoneNumber} onChange={ (e) => setPhoneNumber(e.target.value) }
                        className="input-text" />

                    <p className="text-common">
                        {translations[language].txt_direccion}</p>
                    <input type="address" placeholder={translations[language].txt_direccion2}
                        value={address} onChange={ (e) => setAddress(e.target.value) }
                        className="input-text" />

                    <p className="text-common">
                        Email*</p>
                    <input type="email" placeholder="Email" 
                        value={email} onChange={ (e) => setEmail(e.target.value) }
                        className="input-text" />

                    <p className="text-common">
                        {translations[language].txt_pwd1}</p>
                    <input type="password" placeholder={translations[language].txt_pwd2}
                        value={password} onChange={ (e) => setPassword(e.target.value) }
                        className="input-text" />

                    <p className="text-common">{translations[language].txt_perfil}</p>
                        <div className="role-options">
                            <label>
                            <input
                                type="radio"
                                value="buyer"
                                checked={role === 'buyer'}
                                onChange={(e) => setRole(e.target.value)}
                            />
                            {translations[language].perfil_buyer}
                            </label>
                            <label>
                            <input
                                type="radio"
                                value="seller"
                                checked={role === 'seller'}
                                onChange={(e) => setRole(e.target.value)}
                            />
                            {translations[language].perfil_seller}
                            </label>
                        </div>
                </div>
            </div>
            <div>
                <button onClick={ handleSubmit } className="button-generic">
                    {translations[language].txt_registro}
                </button>
                {errorRegistro && (
                    <p style={{ visibility: errorRegistro ? 'visible' : 'hidden' }}>
                        {errorRegistro || ''}
                    </p>
                )}
            </div>
        </div>
    );
}

export default Register;