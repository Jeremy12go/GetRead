import '../styles/register.css'
import { useState, useEffect } from 'react';
import '../styles/styles.css';
import { updateAccount } from '../API/APIGateway'; 
import { useNavigate } from 'react-router-dom';
import { translations } from '../components/translations.js';

function Editar({ setName, language, setLanguage }) {

    const navigate = useNavigate();
    
    const [ email, setEmail ] = useState('');
    const [ name, setNameLocal ] = useState('');
    const [ address, setAddress ] = useState('');
    const [ phoneNumber, setPhoneNumber ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ errorRegistro, setErrorRegistro ] = useState(false);

    // Cargar datos actuales del perfil
    useEffect(() => {
        const savedProfile = JSON.parse(localStorage.getItem("profile"));
        const savedAccount = JSON.parse(localStorage.getItem("account"));

        if (savedAccount) {
            setNameLocal(savedProfile.name ?? "");
            setPhoneNumber(savedProfile.phoneNumber ?? "");
            setAddress(savedProfile.address ?? "");
        }
        if (savedAccount) {
            setEmail(savedAccount.email ?? "");
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim() || !phoneNumber.trim() || !password.trim() || !address.trim()) {
            setErrorRegistro("Debes completar todos los campos.");
            return;
        }

        try {
            const savedAccount = JSON.parse(localStorage.getItem("account"));

            const res = await updateAccount(savedAccount._id, { name, phoneNumber, password, address });

            const updatedProfile = {
                ...res.data.profile,
                email: savedAccount.email,
                _id: res.data.profile._id
            };
            
            const updatedAccount = {
                ...savedAccount
            };

            localStorage.setItem('profile', JSON.stringify(updatedProfile));
            localStorage.setItem('account', JSON.stringify(updatedAccount));

            setName(res.data.profile.name);

            console.log("Perfil actualizado:", res.data);
            navigate("/Home");

        } catch (e) {
            console.error("Error al actualizar:", e.response?.data || e.message);
        }
    };

    return (
        <div className="App">
            <div>
                <p className="text-titulos">{translations[language].perfil_editar_info}</p>

                <p className="text-common">{translations[language].perfil_correo}</p>
                <input
                    type="email"
                    value={email}
                    readOnly
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-text"
                    style={{ backgroundColor: "#eaeaea", cursor: "not-allowed" }}
                />

                <p className="text-common">{translations[language].txt_usr_name}</p>
                <input
                    type="text"
                    placeholder="Usuario"
                    value={name}
                    onChange={(e) => setNameLocal(e.target.value)}
                    className="input-text"
                />

                <p className="text-common">{translations[language].txt_telefono}</p>
                <input
                    type="text"
                    placeholder="911111111"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="input-text"
                />

                <p className="text-common">{translations[language].txt_direccion}</p>
                <input
                    type="text"
                    placeholder="Dirección"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="input-text"
                />

                <p className="text-common">{translations[language].txt_pwd1}</p>
                <input
                    type="password"
                    placeholder={translations[language].txt_pwd2}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-text"
                />
            </div>

            <div>
                <button className="button-generic" onClick={handleSubmit}>
                    {translations[language].perfil_confirmar}
                </button>

                {errorRegistro && (
                    <p style={{ visibility: errorRegistro ? "visible" : "hidden" }}>
                        {errorRegistro}
                    </p>
                )}
            </div>
        </div>
    );
}

export default Editar;
