# MPOLOG - Sistema de Conteo de Personas

Sistema web/móvil para el registro y análisis de conteo de personas en diferentes áreas.

## 🚀 Tecnologías

### Backend
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- bcrypt

### Frontend
- React + TypeScript
- Ionic Framework
- Framer Motion
- TanStack Table
- Axios
- Lottie React

## 📦 Estructura del Proyecto

```
MPOLOG/
├── Backend/          # API REST con Node.js
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── routes/
│   └── package.json
│
└── Front/           # Aplicación Ionic + React
    └── logistica-app/
        ├── src/
        │   ├── components/
        │   ├── context/
        │   ├── pages/
        │   ├── services/
        │   └── styles/
        └── package.json
```

## 🔧 Instalación

### Backend

```bash
cd Backend
npm install
```

Crear archivo `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mpolog
JWT_SECRET=tu_secret_key_aqui
```

Iniciar servidor:

```bash
npm run dev
```

### Frontend

```bash
cd Front/logistica-app
npm install
```

Iniciar aplicación:

```bash
ionic serve
```

## 📱 Características

- ✅ Autenticación de usuarios (JWT)
- ✅ Registro de conteo de personas por área y fecha
- ✅ Dashboard con estadísticas
- ✅ Visualización de datos en tablas interactivas
- ✅ Tema claro/oscuro
- ✅ Responsive design
- ✅ Animaciones suaves

## 🗄️ Modelos de Datos

### Usuario
- nombre
- username
- password (encriptado)

### Conteo de Personas
- fecha
- área (enum)
- cantidad
- observaciones (opcional)
- usuario (referencia)

## 🔐 Áreas Disponibles

- Bloque 1 y 2
- Bloque 3 y 4
- Altar y Media
- JEF Teen
- Genesis
- Cafetería
- Seguridad

## 👥 Autores

Angel Fernández

## 📄 Licencia

ISC
