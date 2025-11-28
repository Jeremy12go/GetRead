import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/login.css"; 
import "../styles/styles.css";

function ResetPassword() {
    const { token } = useParams(); 
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (newPassword.trim().length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        try {
            const res = await fetch(`http://localhost:3004/accounts/reset-password/${token}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ newPassword })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "No se pudo cambiar la contraseña.");
                return;
            }

            setSuccess("¡Contraseña actualizada con éxito! Serás redirigido al login...");
            
            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (err) {
            console.error("Error al cambiar contraseña:", err);
            setError("Error de conexión con el servidor.");
        }
    };

    return (
        <div className="App">
            <div>
                <p className="text-titulos">Cambiar contraseña</p>
                <p className="text-common">Ingresa tu nueva contraseña</p>

                <form onSubmit={handleSubmit}>
                    <p className="text-common">Nueva contraseña*</p>
                    <input
                        type="password"
                        className="input-text"
                        placeholder="Nueva contraseña"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <p className="text-common">Confirmar contraseña*</p>
                    <input
                        type="password"
                        className="input-text"
                        placeholder="Confirmar contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <button type="submit" className="button-generic" style={{ marginTop: "20px" }}>
                        Guardar contraseña
                    </button>
                </form>

                {error && <p className="text-error">{error}</p>}
                {success && <p className="text-success">{success}</p>}
            </div>
        </div>
    );
}

export default ResetPassword;
