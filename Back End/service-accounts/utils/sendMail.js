const SibApiV3Sdk = require('@sendinblue/client');
require('dotenv').config();

const client = new SibApiV3Sdk.TransactionalEmailsApi();
client.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_KEY
);

async function sendPasswordResetEmail(toEmail, name, resetLink) {
  try {
    const emailData = {
      sender: { email: "jeremy12go@gmail.com", name: "Get&ReadTeam" },
      to: [{ email: toEmail }],
      subject: "Cambia tu contraseña en GetAndRead",
      htmlContent: `
        <h2>Hola ${name} 👋</h2>
        <p>Tu cuenta fue registrada mediante Google.</p>
        <p>Te recomendamos cambiar tu contraseña provisional.</p>

        <p>
          <a href="${resetLink}" 
             style="background:#4CAF50;color:white;padding:10px 20px;text-decoration:none;border-radius:8px">
            Cambiar contraseña
          </a>
        </p>

        <p>Si no fuiste tú, ignora este correo.</p>

        <br>
        <strong>GetAndRead</strong>
      `
    };

    await client.sendTransacEmail(emailData);
    console.log("Correo enviado a:", toEmail);

  } catch (err) {
    console.error("Error enviando correo:", err);
  }
}

module.exports = { sendPasswordResetEmail };
