import { mentorClubLogoBase64 } from './mentorClubLogoBase64';

// Usamos el base64 directamente desde el archivo exportado para evitar problemas con la ruta al compilar en producción (dist)
const logoUrl = `data:image/png;base64,${mentorClubLogoBase64}`;

export const getCarnetHtml = (persona: any, carnetUrl: string) => {
    // Obtenemos los nombres (si vienen vacíos ponemos un texto por defecto)
    const nombre = persona.nombre ? persona.nombre.toUpperCase() : 'NOMBRE';
    const apellido = persona.apellido ? persona.apellido.toUpperCase() : 'APELLIDO';
    const edad = persona.edad ? persona.edad : 'No especificada';
    const adulto = persona.adultoResponsable || persona.apoderado || 'No especificado';
    const telefono = persona.telefono ? persona.telefono : 'No especificado';
    const direccion = persona.direccion ? persona.direccion : 'No especificada';
    
    // API de QR Server para generar la imagen del QR (en blanco y negro como en la Imagen 2)
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(carnetUrl)}&color=000000&bgcolor=ffffff`;
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Carnet Digital - ${nombre} ${apellido}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&display=swap" rel="stylesheet">
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Montserrat', sans-serif;
        }

        body {
            background-color: #f5f5f5; /* Fondo neutral para visualizar el carnet */
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 20px;
        }

        .carnet-container {
            width: 100%;
            max-width: 360px;
            min-height: 570px;
            height: auto;
            background-color: #ffffff;
            border-radius: 18px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            display: flex;
            flex-direction: column;
            position: relative;
            border: 1px solid rgba(0,0,0,0.05);
        }

        /* Sección Superior: Negra */
        .top-section {
            background-color: #030303;
            height: 240px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 30px;
        }

        .club-title {
            color: #d1a738;
            font-size: 36px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 2px;
            text-align: center;
            line-height: 1.1;
        }

        /* Franja Dorada */
        .gold-strip {
            height: 28px;
            /* Gradiente que simula el dorado metálico de la imagen */
            background: linear-gradient(to right, #b48e35 0%, #e0bd61 20%, #fef3a5 50%, #e0bd61 80%, #b48e35 100%);
            width: 100%;
        }

        /* Sección Inferior: Blanca */
        .bottom-section {
            background-color: #ffffff;
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-top: 30px;
            padding-bottom: 30px;
        }

        .name-container {
            text-align: center;
            margin-bottom: 25px;
            line-height: 1.05;
        }

        .first-name {
            color: #d1a738; /* Tono dorado para el nombre */
            font-size: 30px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .last-name {
            color: #000000;
            font-size: 38px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: -0.5px;
        }

        /* Información extra */
        .info-container {
            text-align: center;
            margin-bottom: 25px;
            font-size: 14px;
            color: #333;
            line-height: 1.5;
            width: 90%;
        }

        .info-item {
            margin-bottom: 6px;
        }

        .info-item strong {
            color: #d1a738;
            font-weight: 800;
        }

        /* Contenedor del QR */
        .qr-container {
            width: 165px;
            height: 165px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .qr-container img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    </style>
</head>
<body>
    <div class="carnet-container">
        <!-- Parte superior negra con el Título -->
        <div class="top-section">
            <div class="club-title">MENTOR<br>CLUB</div>
        </div>
        
        <!-- Franja dorada -->
        <div class="gold-strip"></div>
        
        <!-- Parte inferior blanca con Nombre, Apellido y QR -->
        <div class="bottom-section">
            <div class="name-container">
                <div class="first-name">${nombre}</div>
                <div class="last-name">${apellido}</div>
            </div>
            
            <div class="info-container">
                <div class="info-item"><strong>Edad:</strong> ${edad}</div>
                <div class="info-item"><strong>Adulto Responsable:</strong> ${adulto}</div>
                <div class="info-item"><strong>Teléfono:</strong> ${telefono}</div>
                <div class="info-item"><strong>Dirección:</strong> ${direccion}</div>
            </div>
            
            <div class="qr-container">
                <img src="${qrImageUrl}" alt="Código QR del Carnet">
            </div>
        </div>
    </div>
</body>
</html>`;
};
