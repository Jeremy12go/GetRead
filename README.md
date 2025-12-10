# Get & Read

Es una plataforma para la venta y compra de libros, permitiendo que los usuarios puedan adquirir libros físicos de locales o usuarios cercanas a sus zonas de forma online. Mejorando la productividad de los usuarios, al arrendar uno o varios libros resulta más barato que comprarlo directamente. 

---

## Requisitos
- Node.js

## Tecnologías

### Backend
- Express

### Frontend
- React
- Axios

### Bases de Datos
- MongoDB
- Cloudinary

## Instalación y ejecución)

### Front End

#### Entrar a la ubicación de la app
```bash
    cd frontend/my-app
```

#### Instalar dependencias y librerias usadas
```bash
    npm i
    npm i axios react-router-dom @react-oauth/google
```

#### Iniciamos la aplicación
```bash
    npm start
```


### Back End

> [!IMPORTANT]
> Cada servicio debe instalar y iniciarse independientemente.
> Para cada servicio se debe generar su respectivo .env, siguiendo el archivo 'exampleENV.txt' 

- En la ruta de los servicio: accounts y orders.
```bash
    npm i express mongoose dotenv
```
- En la ruta del servicio accounts
```bash
    npm i multer dotenv passport passport-google-oauth20 jsonwebtoken cookie-parser google-auth-library @sendinblue/client cloudinary multer-storage-cloudinary 

```
- En la ruta del servicio stores
```bash
    npm i express mongoose multer dotenv cloudinary multer-storage-cloudinary jsonwebtoken
```
- En la ruta del servicio gateway
```bash
    npm i express dotenv cors
```

Luego se debe ejecutar cada servicio independiente mente, considerando estar en la carpeta
que contiene el proyecto:

- Servicio de accounts:
```bash
    cd '.\Back End\service-accounts'
    node \account-app.js
```

- Servicio de gateway:
```bash
    cd '.\Back End\service-gateway'
    node \gateway-app.js
```

- Servicio de orders:
```bash
    cd '.\Back End\service-orders'
    node \orders-app.js
```

- Servicio de stores:
```bash
    cd '.\Back End\service-stores'
    node \stores-app.js
```
