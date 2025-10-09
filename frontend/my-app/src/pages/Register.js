import '../styles/register.css'
import React, { useState } from 'react';
import { registerAccount } from '../API/APIGateway';

function Register({ cambiarPantalla }) {

    const [ email , setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ name, setName ] = useState('');
    const [ phoneNumber, setPhoneNumber ] = useState('');
    const [ address, setAddress ] = useState('');
    const [errorRegistro, setErrorRegistro] = useState(false);

    const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !name.trim() || !phoneNumber.trim() || !address.trim()) {
            setErrorRegistro("Debes completar todos los campos.");
            return;
        }
    try {
        const res = await registerAccount(email, password, name, phoneNumber, address);
        console.log('Cuenta creada:', res.data);
        cambiarPantalla("inicio");
    } catch (e) {
        console.error('Error al registrar:', e.response?.data || e.message);
    }
    };

    return (
        <div class="App">
            <div>
                <p className="text-titulos">
                    Registro
                </p>
                <div>
                    
                    <p className="text-common">
                        Nombre de usuario* </p>
                    <input type="name" placeholder="Usuario" 
                        value={name} onChange={ (e) => setName(e.target.value) }
                        className="input-text" />   

                    <p className="text-common">
                        Telefono*</p>
                    <input type="phoneNumber" placeholder="911111111"
                        value={phoneNumber} onChange={ (e) => setPhoneNumber(e.target.value) }
                        className="input-text" />

                    <p className="text-common">
                        Dirección*</p>
                    <input type="address" placeholder="Ciudad/Calle/Numero"
                        value={address} onChange={ (e) => setAddress(e.target.value) }
                        className="input-text" />

                    <p className="text-common">
                        Email*</p>
                    <input type="email" placeholder="Email" 
                        value={email} onChange={ (e) => setEmail(e.target.value) }
                        className="input-text" />

                    <p className="text-common">
                        Contraseña*</p>
                    <input type="password" placeholder="Contraseña"
                        value={password} onChange={ (e) => setPassword(e.target.value) }
                        className="input-text" />

                    <p className="text-common">
                        Se creara un perfil automaticamente asociado a tu dirección de correo.
                    </p>
                </div>
            </div>
            <div>
                <button onClick={ handleSubmit } className="boton-register">
                    Registrar
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