export const getCarnetHtml = (persona: any, carnetUrl: string) => {
    const nombreCompleto = `${persona.nombre} ${persona.apellido}`;
    const edadTexto = persona.edad ? `${persona.edad} años` : 'No registrada';
    const grupoTexto = persona.grupo ? persona.grupo.toUpperCase() : 'MENTOR CLUB';
    const encargadoTexto = persona.adultoResponsable || persona.nombrePadres || 'No registrado';
    const telefonoTexto = persona.telefono || 'Sin teléfono';
    
    // API de QR Server para generar la imagen del QR
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(carnetUrl)}&color=9d4edd&bgcolor=ffffff`;

    // Si tiene foto, la cargamos; si no, mostramos un avatar SVG precioso en gradiente
    const avatarHtml = persona.foto 
        ? `<img class="profile-img" src="${persona.foto}" alt="${nombreCompleto}">`
        : `<div class="avatar-fallback">
             <svg viewBox="0 0 24 24">
               <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
             </svg>
           </div>`;

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Carnet Digital - ${nombreCompleto}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #9d4edd;
            --primary-glow: rgba(157, 78, 221, 0.4);
            --bg-dark: #07060f;
            --card-bg: rgba(20, 18, 38, 0.65);
            --border-color: rgba(255, 255, 255, 0.08);
            --text-main: #f3f0fc;
            --text-muted: #a5a1b8;
            --gold: #ffb703;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Outfit', sans-serif;
        }

        body {
            background-color: var(--bg-dark);
            color: var(--text-main);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            overflow-x: hidden;
            position: relative;
        }

        /* Glowing background blobs */
        .blob {
            position: absolute;
            width: 350px;
            height: 350px;
            border-radius: 50%;
            background: radial-gradient(circle, var(--primary) 0%, transparent 70%);
            opacity: 0.2;
            filter: blur(60px);
            z-index: 0;
            pointer-events: none;
        }

        .blob-1 {
            top: -50px;
            left: -50px;
        }

        .blob-2 {
            bottom: -50px;
            right: -50px;
        }

        .container {
            width: 100%;
            max-width: 420px;
            z-index: 1;
            perspective: 1000px;
        }

        /* CARD STYLING */
        .carnet-card {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            backdrop-filter: blur(25px);
            -webkit-backdrop-filter: blur(25px);
            border-radius: 30px;
            padding: 35px 28px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4), 
                        0 0 40px rgba(157, 78, 221, 0.15);
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            animation: cardEntrance 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        /* Glowing top bar */
        .carnet-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 6px;
            background: linear-gradient(90deg, #7b2cbf, var(--primary), #c8b6ff);
        }

        /* LOGO / DEPT BADGE */
        .badge {
            display: inline-block;
            padding: 6px 16px;
            background: rgba(157, 78, 221, 0.15);
            border: 1px solid rgba(157, 78, 221, 0.3);
            color: #d8b4fe;
            border-radius: 100px;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 2px;
            margin-bottom: 24px;
            text-transform: uppercase;
            box-shadow: 0 4px 15px rgba(157, 78, 221, 0.1);
        }

        /* PROFILE IMAGE CONTAINER */
        .profile-wrapper {
            width: 140px;
            height: 140px;
            border-radius: 50%;
            padding: 5px;
            background: linear-gradient(135deg, #7b2cbf, var(--primary));
            box-shadow: 0 8px 25px var(--primary-glow);
            margin-bottom: 20px;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .profile-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
            border: 3px solid #0f0c24;
        }

        .avatar-fallback {
            width: 100%;
            height: 100%;
            background: #141226;
            border-radius: 50%;
            border: 3px solid #0f0c24;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-muted);
        }

        .avatar-fallback svg {
            width: 60px;
            height: 60px;
            fill: rgba(255, 255, 255, 0.15);
        }

        /* CARD TEXT */
        h1 {
            font-size: 24px;
            font-weight: 800;
            background: linear-gradient(to right, #ffffff, #e1d5ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 6px;
            letter-spacing: -0.5px;
        }

        .role-title {
            color: var(--primary);
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 1px;
            margin-bottom: 24px;
            text-transform: uppercase;
        }

        /* DATA FIELD LIST */
        .info-grid {
            width: 100%;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 20px;
            padding: 20px;
            text-align: left;
            margin-bottom: 28px;
        }

        .info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .info-row:last-child {
            border-bottom: none;
            padding-bottom: 0;
        }

        .info-row:first-child {
            padding-top: 0;
        }

        .info-label {
            font-size: 13px;
            color: var(--text-muted);
            font-weight: 500;
        }

        .info-val {
            font-size: 14px;
            color: var(--text-main);
            font-weight: 700;
        }

        .phone-link {
            color: var(--primary);
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 5px;
            transition: color 0.3s;
        }

        .phone-link:hover {
            color: #c8b6ff;
        }

        /* BOTTOM ROW WITH QR IN THE CORNER */
        .footer-row {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            padding-top: 24px;
            text-align: left;
        }

        .footer-text {
            flex: 1;
            padding-right: 15px;
        }

        .footer-text h4 {
            font-size: 14px;
            font-weight: 700;
            margin-bottom: 4px;
            color: var(--text-main);
        }

        .footer-text p {
            font-size: 11px;
            color: var(--text-muted);
            line-height: 1.4;
        }

        .qr-container {
            width: 90px;
            height: 90px;
            background: white;
            border-radius: 14px;
            padding: 6px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            cursor: pointer;
        }

        .qr-container:hover {
            transform: scale(1.1) rotate(2deg);
        }

        .qr-container img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        @keyframes cardEntrance {
            from {
                opacity: 0;
                transform: translateY(30px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
    </style>
</head>
<body>
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>

    <div class="container">
        <div class="carnet-card">
            <!-- DEPT BADGE -->
            <div class="badge">Mentor Club</div>
            
            <!-- PROFILE IMAGE -->
            <div class="profile-wrapper">
                ${avatarHtml}
            </div>

            <!-- NAME -->
            <h1>${nombreCompleto}</h1>
            <p class="role-title">Miembro de Kids</p>

            <!-- INFO LIST -->
            <div class="info-grid">
                <div class="info-row">
                    <span class="info-label">Edad</span>
                    <span class="info-val">${edadTexto}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Pertenece a</span>
                    <span class="info-val">${grupoTexto}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Encargado</span>
                    <span class="info-val">${encargadoTexto}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Teléfono</span>
                    <span class="info-val">
                        <a href="tel:${telefonoTexto}" class="phone-link">
                            <svg style="width: 14px; height: 14px; fill: currentColor;" viewBox="0 0 24 24">
                                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                            </svg>
                            ${telefonoTexto}
                        </a>
                    </span>
                </div>
            </div>

            <!-- FOOTER WITH QR -->
            <div class="footer-row">
                <div class="footer-text">
                    <h4>Identificación Válida</h4>
                    <p>Maranatha Iglesia Infantil. Escanea el código QR para validar la vigencia digital de esta credencial.</p>
                </div>
                <div class="qr-container" title="Escanear para validar">
                    <img src="${qrImageUrl}" alt="Código QR del Carnet">
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
};
