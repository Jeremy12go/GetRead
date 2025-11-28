const jwt = require("jsonwebtoken");
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET_KEY;

module.exports = function verifyToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1]; // formato: Bearer token

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Token inválido o expirado" });

    req.user = decoded; // guardamos datos del usuario decodificados
    next();
  });
};
