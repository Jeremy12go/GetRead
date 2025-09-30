# Get & Read

Es una plataforma para la venta, arriendo y compra de libros, permitiendo que los usuarios puedan adquirir libros físicos de locales o usuarios cercanas a sus zonas de forma online. Mejorando la productividad de los usuarios, al arrendar uno o varios libros resulta más barato que comprarlo directamente. 

---

## Tecnologías

### Backend
- Express

### Frontend
- React
- Axios

### Bases de Datos
- MongoDB
- Redis

> [!CAUTION]
> La instalación e uso mediante docker no esta disponible.
> ### DevOps
> - Docker
> - Docker Compose

> ---

> ## Requisitos
> Antes de ejecutar la aplicación, se debe tener instalado:
> - [Docker desktop](https://docs.docker.com/desktop/)

---

## Instalación y ejecución (CON Docker)

### 1. Clona el proyecto

```bash
    git clone https://github.com/tuUsuario/GetRead.git
    cd GetRead.git
```

### 2. Ejecuta el proyecto
```bash
    docker-compose up --build
```

## Instalación y ejecución (SIN Docker)

### Front End

#### Entrar a la ubicación de la app
```bash
    cd frontend/my-app
```

#### Instalar dependencias y librerias usadas
```bash
    npm install
    npm install axios
```

#### Iniciamos la aplicación
```bash
    npm start
```


### Back End

> [!IMPORTANT]
> Cada servicio debe instalar y iniciarse independientemente.


- En la ruta de los servicio: accounts, orders, ratings.
```bash
    npm install express mongoose dotenv
```
- En la ruta del servicio stores
```bash
    npm install express mongoose multer dotenv
```
- En la ruta del servicio gateway
```bash
    npm install express dotenv cors
```

Luego se debe ejecutar cada servicio independiente mente, considerando estar en la carpeta
que contiene el proyecto:

- Servicio de cuentas:
```bash
    cd '.\Back End\service-accounts'
    node \account-app.js
```


> [!NOTE]
> Las bases se crean automaticamente, pero no tienen datos xD
> LOS DATOS VIENEN EN EL DLC

> [!TIP]
> Se tiene que tener instalado mongoDB y preferentemente mongoDB Compass
> https://www.mongodb.com/try/download/community
> https://www.mongodb.com/try/download/compass