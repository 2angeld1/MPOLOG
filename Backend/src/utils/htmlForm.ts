import { picnicLogoBase64 } from './picnicLogoBase64';
import { rangerChefLogoBase64 } from './rangerChefLogoBase64';

export const getPicnicFormHtml = () => {
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro - Picnic con Propósito 2026</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #f43f5e;
            --primary-dark: #e11d48;
            --primary-light: #fb7185;
            --primary-glow: rgba(244, 63, 94, 0.35);
            --bg-color: #fff1f2;
            --card-bg: #ffffff;
            --text-main: #881337;
            --text-dark: #4c0519;
            --text-muted: #9f1239;
            --border-color: #fecdd3;
            --border-light: #ffe4e6;
            --success: #10b981;
            --error: #e11d48;
            --badge-bg: rgba(244, 63, 94, 0.12);
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Outfit', sans-serif;
            -webkit-tap-highlight-color: transparent;
        }

        body {
            background-color: var(--bg-color);
            color: var(--text-dark);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px 14px 40px;
            background-image: radial-gradient(#fda4af 1px, transparent 1px);
            background-size: 24px 24px;
            position: relative;
        }

        /* Subtle watermark logo in background */
        body::before {
            content: '';
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 500px;
            height: 500px;
            background-image: url('${picnicLogoBase64}');
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
            opacity: 0.035;
            pointer-events: none;
            z-index: 0;
        }

        .container {
            width: 100%;
            max-width: 620px;
            z-index: 1;
            position: relative;
        }

        .banner-card {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 20px;
            overflow: hidden;
            margin-bottom: 16px;
            box-shadow: 0 8px 20px rgba(244, 63, 94, 0.08);
            text-align: center;
        }

        .banner-img-wrap {
            width: 100%;
            background: linear-gradient(135deg, #f43f5e 0%, #fb7185 50%, #fda4af 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px 14px;
        }

        .banner-img {
            max-width: 100%;
            max-height: 380px;
            width: auto;
            height: auto;
            border-radius: 14px;
            box-shadow: 0 10px 25px rgba(136, 19, 55, 0.2);
            object-fit: contain;
            background: white;
            padding: 4px;
        }

        .card {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 18px;
            padding: 26px 24px;
            margin-bottom: 16px;
            box-shadow: 0 4px 15px rgba(244, 63, 94, 0.05);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .card-header {
            border-top: 8px solid var(--primary);
            border-top-left-radius: 18px;
            border-top-right-radius: 18px;
        }

        .tag-pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 14px;
            background: var(--badge-bg);
            border: 1px solid rgba(244, 63, 94, 0.25);
            color: var(--primary-dark);
            border-radius: 100px;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
            text-transform: uppercase;
        }

        h1 {
            font-size: 28px;
            font-weight: 800;
            color: var(--text-dark);
            margin-bottom: 8px;
            letter-spacing: -0.5px;
            line-height: 1.25;
            font-family: 'Playfair Display', serif;
        }

        p.intro-text {
            font-size: 15px;
            color: var(--text-muted);
            line-height: 1.6;
            margin-bottom: 20px;
            font-style: italic;
        }

        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 12px;
            margin: 16px 0;
        }

        .info-box {
            background: #fff5f6;
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 14px;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .info-box-icon {
            font-size: 24px;
            line-height: 1;
        }

        .info-box-content {
            flex: 1;
        }

        .info-box-title {
            font-size: 12px;
            text-transform: uppercase;
            font-weight: 700;
            color: var(--text-muted);
            letter-spacing: 0.5px;
            margin-bottom: 2px;
        }

        .info-box-val {
            font-size: 14.5px;
            font-weight: 700;
            color: var(--text-dark);
            line-height: 1.4;
        }

        .input-group {
            margin-bottom: 20px;
        }

        label.field-label {
            display: block;
            font-size: 14.5px;
            font-weight: 700;
            color: var(--text-dark);
            margin-bottom: 8px;
        }

        .required-star {
            color: var(--primary);
            font-weight: 700;
        }

        input[type="text"],
        input[type="number"],
        input[type="tel"] {
            width: 100%;
            padding: 13px 16px;
            border: 1.5px solid var(--border-color);
            background: #fffafb;
            border-radius: 10px;
            font-size: 15px;
            color: var(--text-dark);
            outline: none;
            transition: all 0.2s ease;
        }

        input[type="text"]:focus,
        input[type="number"]:focus,
        input[type="tel"]:focus {
            background: #ffffff;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px var(--primary-glow);
        }

        /* Minor Acudiente Section */
        .minor-card {
            display: none;
            background: linear-gradient(135deg, rgba(244, 63, 94, 0.05) 0%, rgba(251, 113, 133, 0.08) 100%);
            border: 1.5px dashed var(--primary-light);
            border-radius: 14px;
            padding: 18px 16px;
            margin: 16px 0 20px;
            animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-6px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .minor-notice {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13.5px;
            font-weight: 600;
            color: var(--primary-dark);
            margin-bottom: 14px;
        }

        .btn-submit {
            width: 100%;
            background: linear-gradient(135deg, #fb7185 0%, #f43f5e 50%, #e11d48 100%);
            color: white;
            border: none;
            border-radius: 12px;
            padding: 16px 24px;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 4px 15px var(--primary-glow);
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-top: 10px;
        }

        .btn-submit:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(244, 63, 94, 0.5);
        }

        .btn-submit:active {
            transform: translateY(1px);
        }

        .btn-submit:disabled {
            background: #fda4af;
            cursor: not-allowed;
            box-shadow: none;
            transform: none;
        }

        .spinner {
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 0.8s linear infinite;
            display: none;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .feedback-state {
            display: none;
            text-align: center;
            padding: 40px 20px;
        }

        .success-icon-wrap {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: rgba(244, 63, 94, 0.12);
            border: 2px solid var(--primary);
            color: var(--primary);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            box-shadow: 0 0 24px var(--primary-glow);
        }

        .success-icon-wrap svg {
            width: 40px;
            height: 40px;
            fill: none;
            stroke: currentColor;
            stroke-width: 3;
            stroke-linecap: round;
            stroke-linejoin: round;
        }

        .feedback-title {
            font-size: 26px;
            font-weight: 800;
            color: var(--text-dark);
            margin-bottom: 8px;
            font-family: 'Playfair Display', serif;
        }

        .feedback-desc {
            color: var(--text-muted);
            font-size: 15px;
            line-height: 1.6;
            margin-bottom: 24px;
        }

        .btn-secondary {
            background: #fff5f6;
            border: 1px solid var(--border-color);
            color: var(--primary-dark);
            padding: 12px 24px;
            border-radius: 10px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 700;
            transition: all 0.2s;
        }

        .btn-secondary:hover {
            background: #ffe4e6;
        }

        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        input[type=number] {
            -moz-appearance: textfield;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Banner Poster -->
        <div class="banner-card">
            <div class="banner-img-wrap">
                <img src="${picnicLogoBase64}" alt="Picnic con Propósito" class="banner-img">
            </div>
        </div>

        <div id="form-state">
            <div class="card card-header">
                <span class="tag-pill">🎀 Relaciones • Mujeres</span>
                <h1>PICNIC CON PROPÓSITO</h1>
                <p class="intro-text">
                    "Una tarde especial para compartir, conectar y crear recuerdos juntas."
                </p>

                <div class="info-grid">
                    <div class="info-box">
                        <div class="info-box-icon">📅</div>
                        <div class="info-box-content">
                            <div class="info-box-title">Fecha</div>
                            <div class="info-box-val">Sábado 17 de octubre</div>
                        </div>
                    </div>

                    <div class="info-box">
                        <div class="info-box-icon">⏰</div>
                        <div class="info-box-content">
                            <div class="info-box-title">Horario</div>
                            <div class="info-box-val">12:30 p. m. a 3:30 p. m.</div>
                        </div>
                    </div>

                    <div class="info-box" style="grid-column: 1 / -1;">
                        <div class="info-box-icon">📍</div>
                        <div class="info-box-content">
                            <div class="info-box-title">Lugar del Evento</div>
                            <div class="info-box-val">Senderos de Costa Verde</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Formulario Principal -->
            <form id="registroForm">
                <div class="card">
                    <div class="input-group">
                        <label class="field-label" for="nombreCompleto">
                            Nombre y Apellido <span class="required-star">*</span>
                        </label>
                        <input type="text" id="nombreCompleto" name="nombreCompleto" placeholder="Ingresa tu nombre y apellido" required>
                    </div>

                    <div class="input-group">
                        <label class="field-label" for="edad">
                            Edad <span class="required-star">*</span>
                        </label>
                        <input type="number" id="edad" name="edad" min="1" max="99" placeholder="Ingresa tu edad (Ej: 21)" oninput="handleAgeCheck(this.value)" required>
                    </div>

                    <!-- Sección Dinámica si es Menor de 18 -->
                    <div class="minor-card" id="minorCard">
                        <div class="minor-notice">
                            <span>🌸</span>
                            <span>Al ser menor de 18 años, por favor ingresa los datos de tu acudiente:</span>
                        </div>

                        <div class="input-group" style="margin-bottom: 14px;">
                            <label class="field-label" for="nombreAcudiente">
                                Nombre completo del acudiente o tutor <span class="required-star">*</span>
                            </label>
                            <input type="text" id="nombreAcudiente" name="nombreAcudiente" placeholder="Nombre del padre, madre o representante">
                        </div>

                        <div class="input-group" style="margin-bottom: 0;">
                            <label class="field-label" for="telefonoAcudiente">
                                Teléfono del acudiente <span class="required-star">*</span>
                            </label>
                            <input type="tel" id="telefonoAcudiente" name="telefonoAcudiente" placeholder="Ej: 6123-4567">
                        </div>
                    </div>

                    <div class="input-group">
                        <label class="field-label" for="telefono">
                            Teléfono de Contacto (WhatsApp) <span class="required-star">*</span>
                        </label>
                        <input type="tel" id="telefono" name="telefono" placeholder="Ej: 6123-4567" required>
                    </div>

                    <button type="submit" class="btn-submit" id="btnSubmit">
                        <span id="btnText">Confirmar Asistencia 🌸</span>
                        <span class="spinner" id="btnSpinner"></span>
                    </button>
                </div>
            </form>
        </div>

        <!-- Success State -->
        <div id="successState" class="card feedback-state">
            <div class="success-icon-wrap">
                <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h2 class="feedback-title">¡Registro Exitoso!</h2>
            <p class="feedback-desc">
                Tu asistencia para el <strong>Picnic con Propósito</strong> ha sido confirmada. ¡Nos vemos pronto para compartir una tarde maravillosa juntas!
            </p>
            <div style="background: #fff5f6; border: 1px solid var(--border-color); border-radius: 14px; padding: 16px; text-align: left; max-width: 400px; margin: 0 auto 24px;">
                <div style="font-size: 13px; font-weight: 700; color: var(--primary-dark); margin-bottom: 4px;">Recordatorio del Evento:</div>
                <div style="font-size: 14px; font-weight: 700; color: var(--text-dark);">📅 Sábado 17 de octubre • 12:30 p. m. a 3:30 p. m.</div>
                <div style="font-size: 14px; color: var(--text-muted); margin-top: 2px;">📍 Senderos de Costa Verde</div>
            </div>
            <button class="btn-secondary" onclick="resetForm()">Registrar a otra persona</button>
        </div>
    </div>

    <script>
        function handleAgeCheck(val) {
            const age = parseInt(val);
            const minorCard = document.getElementById('minorCard');
            const nombreAcudiente = document.getElementById('nombreAcudiente');
            const telefonoAcudiente = document.getElementById('telefonoAcudiente');

            if (!isNaN(age) && age < 18) {
                minorCard.style.display = 'block';
                nombreAcudiente.required = true;
                telefonoAcudiente.required = true;
            } else {
                minorCard.style.display = 'none';
                nombreAcudiente.required = false;
                telefonoAcudiente.required = false;
            }
        }

        const form = document.getElementById('registroForm');
        const formState = document.getElementById('form-state');
        const successState = document.getElementById('successState');
        const btnSubmit = document.getElementById('btnSubmit');
        const btnText = document.getElementById('btnText');
        const btnSpinner = document.getElementById('btnSpinner');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const edad = parseInt(document.getElementById('edad').value);
            let acudiente = '';
            let telAcudiente = '';

            if (edad < 18) {
                acudiente = document.getElementById('nombreAcudiente').value.trim();
                telAcudiente = document.getElementById('telefonoAcudiente').value.trim();
                if (!acudiente) {
                    alert('Por favor ingrese el nombre del acudiente al ser menor de 18 años.');
                    return;
                }
            }

            btnSpinner.style.display = 'block';
            btnText.style.display = 'none';
            btnSubmit.disabled = true;

            const nombreCompleto = document.getElementById('nombreCompleto').value.trim();
            const partes = nombreCompleto.split(' ');
            const nombre = partes[0] || 'Asistente';
            const apellido = partes.length > 1 ? partes.slice(1).join(' ') : '.';

            const payload = {
                nombre: nombre,
                apellido: apellido,
                edad: edad || undefined,
                adultoResponsable: acudiente || undefined,
                telefono: document.getElementById('telefono').value.trim(),
                ministerio: telAcudiente ? ('Tel. Acudiente: ' + telAcudiente) : undefined,
                departamento: 'Picnic con Propósito'
            };

            try {
                const response = await fetch('/api/registro-detallado/publico', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    formState.style.display = 'none';
                    successState.style.display = 'block';
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    const errData = await response.json();
                    throw new Error(errData.message || 'Error en el servidor al registrar.');
                }
            } catch (error) {
                console.error('Error registrando:', error);
                alert('Hubo un error al guardar tu registro: ' + error.message);
            } finally {
                btnSpinner.style.display = 'none';
                btnText.style.display = 'block';
                btnSubmit.disabled = false;
            }
        });

        function resetForm() {
            form.reset();
            document.getElementById('minorCard').style.display = 'none';
            successState.style.display = 'none';
            formState.style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    </script>
</body>
</html>`;
};

export const getTeenFormHtml = () => getPicnicFormHtml();
export const getImagenFormHtml = () => getPicnicFormHtml();

export const getMentorClubFormHtml = () => {
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formulario de Registro - Mentor Club</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #f72585;
            --primary-glow: rgba(247, 37, 133, 0.4);
            --bg-dark: #0a0915;
            --card-bg: rgba(20, 18, 38, 0.7);
            --border-color: rgba(255, 255, 255, 0.08);
            --text-main: #f3f0fc;
            --text-muted: #a5a1b8;
            --success: #00f5d4;
            --error: #ff5d8f;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Outfit', sans-serif;
            -webkit-tap-highlight-color: transparent;
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

        .blob {
            position: absolute;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            background: radial-gradient(circle, var(--primary) 0%, transparent 70%);
            opacity: 0.15;
            filter: blur(50px);
            z-index: 0;
            pointer-events: none;
        }

        .blob-1 { top: -50px; left: -50px; }
        .blob-2 { bottom: -50px; right: -50px; }

        .container {
            width: 100%;
            max-width: 600px;
            z-index: 1;
        }

        .card {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 24px;
            padding: 40px 30px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            text-align: center;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .logo-container {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
        }

        .logo-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #b5179e, var(--primary));
            border-radius: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 20px var(--primary-glow);
            margin-bottom: 10px;
        }

        .logo-icon svg { width: 32px; height: 32px; fill: white; }

        h1 {
            font-size: 28px;
            font-weight: 800;
            background: linear-gradient(to right, #f3f0fc, #ffb3d1);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
        }

        .subtitle {
            color: var(--text-muted);
            font-size: 15px;
            margin-bottom: 24px;
            line-height: 1.5;
        }

        .badge {
            display: inline-block;
            padding: 6px 14px;
            background: rgba(247, 37, 133, 0.15);
            border: 1px solid rgba(247, 37, 133, 0.3);
            color: #ff8cb3;
            border-radius: 100px;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.5px;
            margin-bottom: 20px;
            text-transform: uppercase;
        }

        form { text-align: left; }

        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 24px;
        }

        @media (max-width: 580px) {
            .form-grid { grid-template-columns: 1fr; gap: 0; }
        }

        .input-group { position: relative; margin-bottom: 16px; }
        .input-group.full-width { grid-column: 1 / -1; }

        .input-group label {
            display: block;
            font-size: 13px;
            font-weight: 600;
            color: var(--text-muted);
            margin-bottom: 8px;
            transition: color 0.3s;
        }

        .input-wrapper { position: relative; display: flex; align-items: center; }

        .input-icon {
            position: absolute;
            left: 16px;
            color: var(--text-muted);
            pointer-events: none;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.3s;
            z-index: 1;
        }

        .input-icon svg { width: 20px; height: 20px; fill: currentColor; }

        input, select, textarea {
            width: 100%;
            padding: 14px 16px 14px 48px;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--border-color);
            border-radius: 14px;
            color: var(--text-main);
            font-size: 15px;
            outline: none;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            appearance: none;
            -webkit-appearance: none;
        }

        textarea {
            padding: 14px 16px 14px 48px;
            resize: vertical;
            min-height: 80px;
            font-family: 'Outfit', sans-serif;
        }

        select { cursor: pointer; }

        .select-wrapper { position: relative; width: 100%; }

        .select-wrapper::after {
            content: "\\25BC";
            font-size: 10px;
            color: var(--text-muted);
            position: absolute;
            right: 18px;
            top: 50%;
            transform: translateY(-50%);
            pointer-events: none;
        }

        input:focus, select:focus, textarea:focus {
            border-color: var(--primary);
            background: rgba(255, 255, 255, 0.05);
            box-shadow: 0 0 0 4px var(--primary-glow);
        }

        input:focus + .input-icon, select:focus + .input-icon, textarea:focus + .input-icon { color: var(--primary); }

        .btn-submit {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #b5179e 0%, var(--primary) 100%);
            border: none;
            border-radius: 14px;
            color: white;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 8px 24px var(--primary-glow);
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-top: 8px;
        }

        .btn-submit:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 30px rgba(247, 37, 133, 0.6);
        }

        .btn-submit:active { transform: translateY(1px); }

        .feedback-state {
            display: none;
            animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        .feedback-icon {
            width: 72px;
            height: 72px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px;
        }

        .success-icon {
            background: rgba(0, 245, 212, 0.15);
            border: 2px solid var(--success);
            color: var(--success);
            box-shadow: 0 0 20px rgba(0, 245, 212, 0.3);
        }

        .success-icon svg {
            width: 36px;
            height: 36px;
            fill: none;
            stroke: currentColor;
            stroke-width: 3;
            stroke-linecap: round;
            stroke-linejoin: round;
        }

        .feedback-title { font-size: 24px; font-weight: 800; margin-bottom: 12px; }

        .feedback-desc {
            color: var(--text-muted);
            font-size: 15px;
            line-height: 1.6;
            margin-bottom: 30px;
        }

        .btn-secondary {
            background: transparent;
            border: 1px solid var(--border-color);
            color: var(--text-main);
            padding: 12px 24px;
            border-radius: 12px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.3s;
        }

        .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(255, 255, 255, 0.2);
        }

        .spinner {
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 0.8s linear infinite;
            display: none;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-6px); }
            40%, 80% { transform: translateX(6px); }
        }
        .shake { animation: shake 0.4s ease-in-out; }
    </style>
</head>
<body>
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>

    <div class="container">
        <div id="form-state" class="card">
            <div class="logo-container">
                <div>
                    <div class="logo-icon" style="margin: 0 auto 12px;">
                        <svg viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17h-2v-2h2v2zm0-4h-2V7h2v8z"/>
                        </svg>
                    </div>
                    <h1>Registro Kids</h1>
                    <span class="badge">Mentor Club</span>
                </div>
            </div>

            <p class="subtitle">Completa los datos del ni\u00f1o para registrarlo en Mentor Club.</p>

            <form id="registroForm">
                <div class="form-grid">
                    <div class="input-group">
                        <label for="nombre">Nombre del Ni\u00f1o *</label>
                        <div class="input-wrapper">
                            <input type="text" id="nombre" name="nombre" placeholder="Nombre" required>
                            <div class="input-icon">
                                <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                            </div>
                        </div>
                    </div>

                    <div class="input-group">
                        <label for="apellido">Apellido *</label>
                        <div class="input-wrapper">
                            <input type="text" id="apellido" name="apellido" placeholder="Apellido" required>
                            <div class="input-icon">
                                <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                            </div>
                        </div>
                    </div>

                    <div class="input-group">
                        <label for="edad">Edad *</label>
                        <div class="input-wrapper">
                            <input type="number" id="edad" name="edad" min="1" max="99" placeholder="Ej: 10" required>
                            <div class="input-icon">
                                <svg viewBox="0 0 24 24"><path d="M9 11.75c-.41 0-.75-.34-.75-.75V9c0-.41.34-.75.75-.75h2c.41 0 .75.34.75.75v2c0 .41-.34.75-.75.75H9zm6 0c-.41 0-.75-.34-.75-.75V9c0-.41.34-.75.75-.75h2c.41 0 .75.34.75.75v2c0 .41-.34.75-.75.75H15zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-2.2c1.78 0 3.37-.91 4.31-2.3H7.69c.94 1.39 2.53 2.3 4.31 2.3z"/></svg>
                            </div>
                        </div>
                    </div>

                    <div class="input-group">
                        <label for="tipoSangre">Tipo de Sangre</label>
                        <div class="input-wrapper select-wrapper">
                            <select id="tipoSangre" name="tipoSangre">
                                <option value="" disabled selected>Selecciona tipo</option>
                                <option value="O+">O Positivo (O+)</option>
                                <option value="O-">O Negativo (O-)</option>
                                <option value="A+">A Positivo (A+)</option>
                                <option value="A-">A Negativo (A-)</option>
                                <option value="B+">B Positivo (B+)</option>
                                <option value="B-">B Negativo (B-)</option>
                                <option value="AB+">AB Positivo (AB+)</option>
                                <option value="AB-">AB Negativo (AB-)</option>
                                <option value="Desconocido">No sabe / Desconocido</option>
                            </select>
                            <div class="input-icon">
                                <svg viewBox="0 0 24 24"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                            </div>
                        </div>
                    </div>

                    <div class="input-group full-width">
                        <label for="tallaSueter">Talla de Su\u00e9ter (Dryfit) *</label>
                        <div class="input-wrapper">
                            <input type="text" id="tallaSueter" name="tallaSueter" placeholder="Ej: S, M, L, XL" required>
                            <div class="input-icon">
                                <svg viewBox="0 0 24 24"><path d="M21.6 18.2L13 11.75v-.91a3 3 0 0 0 .7-5.32A3 3 0 0 0 9 1.5a3 3 0 0 0-2.7 4.02 3 3 0 0 0 .7 5.32v.91l-8.6 6.45A2 2 0 0 0 0 20.5a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2 2 2 0 0 0-.4-1.3z"/></svg>
                            </div>
                        </div>
                    </div>

                    <div class="input-group full-width">
                        <label for="grupo">Grupo *</label>
                        <div class="input-wrapper select-wrapper">
                            <select id="grupo" name="grupo" required>
                                <option value="" disabled selected>Selecciona un grupo</option>
                                <option value="exploradores">Exploradores</option>
                                <option value="seguidores de la senda">Seguidores de la Senda</option>
                                <option value="pioneros">Pioneros</option>
                                <option value="navegantes">Navegantes</option>
                            </select>
                            <div class="input-icon">
                                <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                            </div>
                        </div>
                    </div>

                    <div class="input-group full-width">
                        <label for="adultoResponsable">Nombre del Adulto Responsable *</label>
                        <div class="input-wrapper">
                            <input type="text" id="adultoResponsable" name="adultoResponsable" placeholder="Nombre completo" required>
                            <div class="input-icon">
                                <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                            </div>
                        </div>
                    </div>

                    <div class="input-group full-width">
                        <label for="telefono">Tel\u00e9fono del Adulto *</label>
                        <div class="input-wrapper">
                            <input type="tel" id="telefono" name="telefono" placeholder="Ej: 04121234567" required>
                            <div class="input-icon">
                                <svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                            </div>
                        </div>
                    </div>

                    <div class="input-group full-width">
                        <label for="direccion">Direcci\u00f3n de Residencia *</label>
                        <div class="input-wrapper">
                            <input type="text" id="direccion" name="direccion" placeholder="Direcci\u00f3n completa" required>
                            <div class="input-icon">
                                <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                            </div>
                        </div>
                    </div>

                    <div class="input-group full-width">
                        <label for="alergiasMedicamentos">Alergias y Medicamentos <span style="font-weight: normal; opacity: 0.6;">(Opcional)</span></label>
                        <div class="input-wrapper">
                            <textarea id="alergiasMedicamentos" name="alergiasMedicamentos" placeholder="Describe alergias o medicamentos, separados por comas"></textarea>
                            <div class="input-icon" style="top: 16px; transform: none;">
                                <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l4.59-4.58L18 11l-6 6z"/></svg>
                            </div>
                        </div>
                    </div>
                </div>

                <button type="submit" class="btn-submit">
                    <span class="spinner" id="btn-spinner"></span>
                    <span id="btn-text">Completar Registro</span>
                </button>
            </form>
        </div>

        <div id="success-state" class="card feedback-state">
            <div class="feedback-icon success-icon">
                <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h2 class="feedback-title" style="color: var(--success)">\u00a1Registro Exitoso!</h2>
            <p class="feedback-desc">Los datos del ni\u00f1o han sido guardados correctamente. \u00a1Gracias por tu registro!</p>
            <button class="btn-secondary" onclick="resetForm()">Registrar a otro ni\u00f1o</button>
        </div>
    </div>

    <script>
        const form = document.getElementById('registroForm');
        const card = document.getElementById('form-state');
        const successState = document.getElementById('success-state');
        const spinner = document.getElementById('btn-spinner');
        const btnText = document.getElementById('btn-text');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            spinner.style.display = 'block';
            btnText.textContent = 'Enviando...';
            document.querySelector('.btn-submit').disabled = true;

            const payload = {
                nombre: document.getElementById('nombre').value.trim(),
                apellido: document.getElementById('apellido').value.trim(),
                edad: parseInt(document.getElementById('edad').value) || undefined,
                tipoSangre: document.getElementById('tipoSangre').value,
                tallaSueter: document.getElementById('tallaSueter').value.trim(),
                grupo: document.getElementById('grupo').value,
                adultoResponsable: document.getElementById('adultoResponsable').value.trim(),
                telefono: document.getElementById('telefono').value.trim(),
                direccion: document.getElementById('direccion').value.trim(),
                alergiasMedicamentos: document.getElementById('alergiasMedicamentos').value.trim() || undefined,
                departamento: 'Kids'
            };

            try {
                const response = await fetch('/api/registro-detallado/publico', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    card.style.display = 'none';
                    successState.style.display = 'block';
                } else {
                    const errData = await response.json();
                    throw new Error(errData.message || 'Error en el servidor');
                }
            } catch (error) {
                console.error('Error registrando:', error);
                alert('Hubo un error al guardar tu registro: ' + error.message);
                card.classList.add('shake');
                setTimeout(() => card.classList.remove('shake'), 400);
            } finally {
                spinner.style.display = 'none';
                btnText.textContent = 'Completar Registro';
                document.querySelector('.btn-submit').disabled = false;
            }
        });

        function resetForm() {
            form.reset();
            successState.style.display = 'none';
            card.style.display = 'block';
        }
    </script>
</body>
</html>`;
};

export const getRangerChefFormHtml = (initialCategory: string = '') => {
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inscripción Ranger Chef 2026 - Concurso de Cocina</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #ea580c;
            --primary-dark: #c2410c;
            --primary-light: #fb923c;
            --primary-glow: rgba(234, 88, 12, 0.35);
            --bg-color: #f8fafc;
            --card-bg: #ffffff;
            --text-main: #0f172a;
            --text-muted: #64748b;
            --border-color: #e2e8f0;
            --success: #10b981;
            --error: #ef4444;
            --badge-bg: rgba(234, 88, 12, 0.1);
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Outfit', 'Roboto', sans-serif;
            -webkit-tap-highlight-color: transparent;
        }

        body {
            background-color: var(--bg-color);
            color: var(--text-main);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px 14px 40px;
            background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
            background-size: 24px 24px;
            position: relative;
        }

        /* Subtle watermark logo in background */
        body::before {
            content: '';
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 580px;
            height: 580px;
            background-image: url('${rangerChefLogoBase64}');
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
            opacity: 0.035;
            pointer-events: none;
            z-index: 0;
        }

        .container {
            width: 100%;
            max-width: 680px;
            z-index: 1;
            position: relative;
        }

        .banner-card {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            overflow: hidden;
            margin-bottom: 16px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            text-align: center;
        }

        .banner-img-wrap {
            width: 100%;
            background: linear-gradient(135deg, #7c2d12 0%, #ea580c 50%, #f59e0b 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 22px 14px;
            position: relative;
        }

        .banner-img {
            max-width: 220px;
            max-height: 220px;
            width: auto;
            height: auto;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
            object-fit: contain;
            background: white;
            padding: 6px;
        }

        .card {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 14px;
            padding: 24px;
            margin-bottom: 16px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .card-header {
            border-top: 8px solid var(--primary);
            border-top-left-radius: 14px;
            border-top-right-radius: 14px;
        }

        .tag-pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 14px;
            background: var(--badge-bg);
            border: 1px solid rgba(234, 88, 12, 0.25);
            color: var(--primary);
            border-radius: 100px;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.5px;
            margin-bottom: 14px;
            text-transform: uppercase;
        }

        h1 {
            font-size: 28px;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 12px;
            letter-spacing: -0.5px;
            line-height: 1.25;
        }

        p.intro-text {
            font-size: 15px;
            color: #334155;
            line-height: 1.6;
            margin-bottom: 18px;
        }

        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 12px;
            margin: 16px 0;
        }

        .info-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 14px;
            display: flex;
            align-items: flex-start;
            gap: 12px;
        }

        .info-box-icon {
            font-size: 24px;
            line-height: 1;
        }

        .info-box-content {
            flex: 1;
        }

        .info-box-title {
            font-size: 12px;
            text-transform: uppercase;
            font-weight: 700;
            color: var(--text-muted);
            letter-spacing: 0.5px;
            margin-bottom: 2px;
        }

        .info-box-val {
            font-size: 14px;
            font-weight: 600;
            color: #1e293b;
            line-height: 1.4;
        }

        .section-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 16px;
            padding-bottom: 10px;
            border-bottom: 2px solid #f1f5f9;
        }

        .section-num {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: var(--primary);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: 700;
        }

        .section-title {
            font-size: 18px;
            font-weight: 700;
            color: #0f172a;
        }

        .pago-card {
            background: linear-gradient(135deg, rgba(234, 88, 12, 0.05) 0%, rgba(245, 158, 11, 0.08) 100%);
            border: 1.5px dashed rgba(234, 88, 12, 0.4);
            border-radius: 12px;
            padding: 16px;
            margin-top: 14px;
        }

        .pago-title {
            font-size: 15px;
            font-weight: 700;
            color: #9a3412;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .pago-detail {
            font-size: 14px;
            color: #334155;
            line-height: 1.5;
        }

        .pago-badge {
            display: inline-block;
            background: #ea580c;
            color: white;
            padding: 3px 10px;
            border-radius: 6px;
            font-weight: 700;
            font-size: 14px;
            letter-spacing: 0.5px;
        }

        .categoria-selector-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin: 12px 0 20px;
        }

        @media (max-width: 480px) {
            .categoria-selector-grid { grid-template-columns: 1fr; }
        }

        .cat-card {
            border: 2px solid var(--border-color);
            background: #f8fafc;
            border-radius: 10px;
            padding: 14px 12px;
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .cat-card:hover {
            border-color: #cbd5e1;
            background: #f1f5f9;
        }

        .cat-card.selected {
            border-color: var(--primary);
            background: rgba(234, 88, 12, 0.06);
            box-shadow: 0 0 0 2px var(--primary-glow);
        }

        .cat-card input[type="radio"] {
            width: 18px;
            height: 18px;
            accent-color: var(--primary);
            cursor: pointer;
        }

        .cat-card-text {
            font-size: 14px;
            font-weight: 700;
            color: #1e293b;
        }

        .cat-card-icon {
            font-size: 20px;
        }

        .platillos-showcase {
            margin: 16px 0;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .platillo-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 16px;
            border-left: 5px solid var(--primary);
            transition: all 0.2s;
        }

        .platillo-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;
        }

        .platillo-num {
            font-size: 12px;
            font-weight: 700;
            color: var(--primary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .platillo-title {
            font-size: 16px;
            font-weight: 700;
            color: #0f172a;
        }

        .platillo-ingredientes {
            font-size: 13.5px;
            color: #475569;
            line-height: 1.5;
            background: #ffffff;
            padding: 10px 12px;
            border-radius: 8px;
            border: 1px solid #edf2f7;
            margin-top: 8px;
        }

        .platillo-ingredientes strong {
            color: #1e293b;
        }

        /* Radio Choice for dish in form */
        .platillo-choice-cards {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-top: 8px;
        }

        .platillo-choice-card {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 14px 16px;
            border: 2px solid var(--border-color);
            background: #f8fafc;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .platillo-choice-card:hover {
            border-color: #cbd5e1;
            background: #f1f5f9;
        }

        .platillo-choice-card.selected {
            border-color: var(--primary);
            background: rgba(234, 88, 12, 0.05);
            box-shadow: 0 0 0 2px var(--primary-glow);
        }

        .platillo-choice-card input[type="radio"] {
            width: 20px;
            height: 20px;
            accent-color: var(--primary);
            margin-top: 2px;
            cursor: pointer;
        }

        .platillo-choice-info {
            flex: 1;
        }

        .platillo-choice-name {
            font-size: 15px;
            font-weight: 700;
            color: #0f172a;
        }

        .platillo-choice-desc {
            font-size: 13px;
            color: var(--text-muted);
            margin-top: 3px;
            line-height: 1.4;
        }

        .input-group {
            margin-bottom: 20px;
        }

        label.field-label {
            display: block;
            font-size: 14.5px;
            font-weight: 600;
            color: #334155;
            margin-bottom: 8px;
        }

        .required-star {
            color: var(--error);
            font-weight: 700;
        }

        input[type="text"],
        input[type="number"],
        input[type="tel"] {
            width: 100%;
            padding: 12px 14px;
            border: 1px solid var(--border-color);
            background: #f8fafc;
            border-radius: 8px;
            font-size: 15px;
            color: var(--text-main);
            outline: none;
            transition: all 0.2s ease;
        }

        input[type="text"]:focus,
        input[type="number"]:focus,
        input[type="tel"]:focus {
            background: #ffffff;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px var(--primary-glow);
        }

        .file-upload-box {
            border: 2px dashed #cbd5e1;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            background: #f8fafc;
            cursor: pointer;
            transition: all 0.2s;
            position: relative;
        }

        .file-upload-box:hover {
            border-color: var(--primary);
            background: rgba(234, 88, 12, 0.02);
        }

        .file-upload-icon {
            font-size: 32px;
            margin-bottom: 8px;
        }

        .file-upload-text {
            font-size: 14px;
            font-weight: 600;
            color: #334155;
        }

        .file-upload-hint {
            font-size: 12px;
            color: var(--text-muted);
            margin-top: 4px;
        }

        .file-preview-wrap {
            margin-top: 12px;
            display: none;
            align-items: center;
            gap: 12px;
            background: #ffffff;
            padding: 10px;
            border-radius: 8px;
            border: 1px solid var(--border-color);
        }

        .file-preview-img {
            width: 50px;
            height: 50px;
            object-fit: cover;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
        }

        .file-preview-name {
            font-size: 13px;
            font-weight: 600;
            color: #1e293b;
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .criterios-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 10px;
            margin-top: 12px;
        }

        .criterio-item {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 12px 14px;
            display: flex;
            align-items: flex-start;
            gap: 12px;
        }

        .criterio-icon {
            font-size: 22px;
            line-height: 1;
            margin-top: 2px;
        }

        .criterio-content {
            flex: 1;
        }

        .criterio-title {
            font-size: 14px;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 2px;
        }

        .criterio-desc {
            font-size: 13px;
            color: var(--text-muted);
            line-height: 1.4;
        }

        .btn-submit {
            width: 100%;
            background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%);
            color: white;
            border: none;
            border-radius: 10px;
            padding: 16px 24px;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 4px 14px var(--primary-glow);
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-top: 16px;
        }

        .btn-submit:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 18px rgba(234, 88, 12, 0.45);
        }

        .btn-submit:active {
            transform: translateY(1px);
        }

        .btn-submit:disabled {
            background: #94a3b8;
            cursor: not-allowed;
            box-shadow: none;
            transform: none;
        }

        .spinner {
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 0.8s linear infinite;
            display: none;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .feedback-state {
            display: none;
            text-align: center;
            padding: 40px 20px;
        }

        .success-icon-wrap {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: rgba(16, 185, 129, 0.12);
            border: 2px solid var(--success);
            color: var(--success);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            box-shadow: 0 0 24px rgba(16, 185, 129, 0.25);
        }

        .success-icon-wrap svg {
            width: 40px;
            height: 40px;
            fill: none;
            stroke: currentColor;
            stroke-width: 3;
            stroke-linecap: round;
            stroke-linejoin: round;
        }

        .feedback-title {
            font-size: 26px;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 8px;
        }

        .feedback-desc {
            color: var(--text-muted);
            font-size: 15px;
            line-height: 1.6;
            margin-bottom: 24px;
        }

        .btn-secondary {
            background: #f1f5f9;
            border: 1px solid #cbd5e1;
            color: #334155;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.2s;
        }

        .btn-secondary:hover {
            background: #e2e8f0;
        }

        .category-tab-active-pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 12px;
            background: rgba(234, 88, 12, 0.15);
            color: #c2410c;
            border-radius: 100px;
            font-size: 13px;
            font-weight: 700;
        }

        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        input[type=number] {
            -moz-appearance: textfield;
        }
    </style>
</head>
<body>
    <div class="container">
        
        <!-- Banner with Official Competition Logo -->
        <div class="banner-card">
            <div class="banner-img-wrap">
                <img src="${rangerChefLogoBase64}" alt="Ranger Chef 2026 Logo" class="banner-img">
            </div>
        </div>

        <div id="form-state">
            <!-- 1. PRIMERA SECCIÓN: Información del concurso y pago -->
            <div class="card card-header">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;">
                    <span class="tag-pill">👨‍🍳 Concurso Culinario</span>
                </div>
                
                <h1>CONCURSO RANGER CHEF 2026</h1>
                
                <p class="intro-text">
                    Inscríbete en nuestro concurso <strong>Ranger Chef</strong> y prepárate para presentar tu platillo, demostrando tu creatividad, habilidades culinarias y pasión por la cocina.
                </p>

                <div class="section-header" style="margin-top: 20px;">
                    <div class="section-num">1</div>
                    <div class="section-title">Información del Concurso</div>
                </div>

                <div class="info-grid">
                    <div class="info-box">
                        <div class="info-box-icon">💰</div>
                        <div class="info-box-content">
                            <div class="info-box-title">Costo de Inscripción</div>
                            <div class="info-box-val" style="color: #ea580c; font-size: 16px;">$5.00 por participante</div>
                        </div>
                    </div>

                    <div class="info-box">
                        <div class="info-box-icon">📅</div>
                        <div class="info-box-content">
                            <div class="info-box-title">Fecha de Entrega</div>
                            <div class="info-box-val">Sábado 17 de octubre</div>
                        </div>
                    </div>

                    <div class="info-box">
                        <div class="info-box-icon">⏰</div>
                        <div class="info-box-content">
                            <div class="info-box-title">Hora del Evento</div>
                            <div class="info-box-val">A partir de las 9:00 a. m.</div>
                        </div>
                    </div>

                    <div class="info-box">
                        <div class="info-box-icon">📍</div>
                        <div class="info-box-content">
                            <div class="info-box-title">Lugar</div>
                            <div class="info-box-val">Centro Internacional Maranatha, Panamá Oeste (Anclas Mall, 3.er piso)</div>
                        </div>
                    </div>
                </div>

                <!-- Platillos Preliminares de la Categoría Activa -->
                <div style="margin-top: 20px;">
                    <div style="font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 8px;">
                        🍲 Platillo Oficial para <span id="sectionPlatillosCategoryName" style="color: var(--primary);">Navegantes</span>:
                    </div>
                    <div class="platillos-showcase" id="platillosShowcaseContainer">
                        <!-- Generado dinámicamente -->
                    </div>
                </div>

                <!-- Información para el pago -->
                <div class="pago-card">
                    <div class="pago-title">💳 Información para el Pago</div>
                    <div class="pago-detail">
                        <strong>Yappy:</strong> <span class="pago-badge">6561-1406</span><br>
                        <strong>Nombre del Titular:</strong> Aris Jaramillo<br>
                        <span style="font-size: 13px; color: #78350f; display: block; margin-top: 6px;">
                            📌 Realizar el pago de <strong>$5.00</strong> y adjuntar una imagen del comprobante para validar la inscripción.
                        </span>
                    </div>
                </div>
            </div>

            <!-- FORMULARIO PRINCIPAL -->
            <form id="registroForm">
                
                <!-- 2. SEGUNDA SECCIÓN: Datos del participante y tutor -->
                <div class="card">
                    <div class="section-header">
                        <div class="section-num">2</div>
                        <div class="section-title">Datos del Participante</div>
                    </div>

                    <div class="input-group">
                        <label class="field-label" for="nombreCompleto">
                            1. Nombre completo del participante <span class="required-star">*</span>
                        </label>
                        <input type="text" id="nombreCompleto" name="nombreCompleto" placeholder="Ej: Lucas González" required>
                    </div>

                    <div class="input-group">
                        <label class="field-label" for="edad">
                            2. Edad <span class="required-star">*</span>
                        </label>
                        <input type="number" id="edad" name="edad" min="1" max="99" placeholder="Ej: 11" required>
                    </div>

                    <div class="input-group">
                        <label class="field-label">
                            3. Categoría <span class="required-star">*</span>
                        </label>
                        <div class="categoria-selector-grid">
                            <label class="cat-card" id="cat-navegantes">
                                <input type="radio" name="categoriaRadio" value="Navegantes" onchange="onCategoryChange(this.value)" checked>
                                <span class="cat-card-icon">🧭</span>
                                <div class="cat-card-text">Navegantes</div>
                            </label>

                            <label class="cat-card" id="cat-pioneros">
                                <input type="radio" name="categoriaRadio" value="Pioneros" onchange="onCategoryChange(this.value)">
                                <span class="cat-card-icon">🧗</span>
                                <div class="cat-card-text">Pioneros</div>
                            </label>

                            <label class="cat-card" id="cat-seguidores">
                                <input type="radio" name="categoriaRadio" value="Seguidores" onchange="onCategoryChange(this.value)">
                                <span class="cat-card-icon">👣</span>
                                <div class="cat-card-text">Seguidores</div>
                            </label>

                            <label class="cat-card" id="cat-exploradores">
                                <input type="radio" name="categoriaRadio" value="Exploradores" onchange="onCategoryChange(this.value)">
                                <span class="cat-card-icon">🏕️</span>
                                <div class="cat-card-text">Exploradores</div>
                            </label>
                        </div>
                    </div>

                    <div class="input-group">
                        <label class="field-label">
                            Platillo que vas a preparar <span class="required-star">*</span>
                        </label>
                        <div class="platillo-choice-cards" id="platilloChoiceContainer">
                            <!-- Generado dinámicamente según la categoría seleccionada -->
                        </div>
                    </div>

                    <hr style="border: none; border-top: 1px solid var(--border-color); margin: 24px 0 20px;">

                    <div style="font-size: 16px; font-weight: 700; color: #1e293b; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                        <span>👨‍👦</span> Datos del Tutor / Acudiente
                    </div>

                    <div class="input-group">
                        <label class="field-label" for="nombreTutor">
                            4. Nombre completo del tutor <span class="required-star">*</span>
                        </label>
                        <input type="text" id="nombreTutor" name="nombreTutor" placeholder="Ej: Aris Jaramillo (Padre / Madre / Tutor)" required>
                    </div>

                    <div class="input-group">
                        <label class="field-label" for="telefonoTutor">
                            5. Teléfono del tutor <span class="required-star">*</span>
                        </label>
                        <input type="tel" id="telefonoTutor" name="telefonoTutor" placeholder="Ej: 6561-1406" required>
                    </div>

                    <hr style="border: none; border-top: 1px solid var(--border-color); margin: 24px 0 20px;">

                    <div style="font-size: 16px; font-weight: 700; color: #1e293b; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
                        <span>🧾</span> Comprobante de Pago
                    </div>

                    <div class="input-group">
                        <label class="field-label">
                            6. Adjuntar comprobante de pago de inscripción ($5.00) <span class="required-star">*</span>
                        </label>
                        <div class="file-upload-box" onclick="document.getElementById('comprobantePago').click()">
                            <div class="file-upload-icon">📸</div>
                            <div class="file-upload-text">Haz clic aquí para subir la foto del comprobante</div>
                            <div class="file-upload-hint">Formatos: JPG, PNG, WEBP o PDF (Máximo 10 MB)</div>
                            <input type="file" id="comprobantePago" name="comprobantePago" accept="image/*, .pdf" style="display: none;" onchange="handleFileSelected(this)" required>
                        </div>
                        <div class="file-preview-wrap" id="filePreviewWrap">
                            <img id="filePreviewImg" src="" alt="Vista previa" class="file-preview-img">
                            <div class="file-preview-name" id="filePreviewName">comprobante.jpg</div>
                            <button type="button" onclick="clearSelectedFile()" style="background: none; border: none; color: var(--error); font-size: 18px; cursor: pointer;">✕</button>
                        </div>
                    </div>
                </div>

                <!-- 3. TERCERA SECCIÓN: Criterios de evaluación -->
                <div class="card">
                    <div class="section-header">
                        <div class="section-num">3</div>
                        <div class="section-title">Criterios de Evaluación</div>
                    </div>

                    <p style="font-size: 14px; color: var(--text-muted); line-height: 1.5; margin-bottom: 12px;">
                        Los platillos serán evaluados por el jurado tomando en cuenta los siguientes aspectos:
                    </p>

                    <div class="criterios-grid">
                        <div class="criterio-item">
                            <div class="criterio-icon">👁️</div>
                            <div class="criterio-content">
                                <div class="criterio-title">Presentación</div>
                                <div class="criterio-desc">Apariencia visual, decoración, orden y creatividad en el emplatado.</div>
                            </div>
                        </div>

                        <div class="criterio-item">
                            <div class="criterio-icon">👅</div>
                            <div class="criterio-content">
                                <div class="criterio-title">Sabor</div>
                                <div class="criterio-desc">Equilibrio de los ingredientes, sazón y sabor general del platillo.</div>
                            </div>
                        </div>

                        <div class="criterio-item">
                            <div class="criterio-icon">🥗</div>
                            <div class="criterio-content">
                                <div class="criterio-title">Textura</div>
                                <div class="criterio-desc">Consistencia adecuada de los ingredientes.</div>
                            </div>
                        </div>

                        <div class="criterio-item">
                            <div class="criterio-icon">🔥</div>
                            <div class="criterio-content">
                                <div class="criterio-title">Cocción</div>
                                <div class="criterio-desc">Punto de cocción adecuado de los ingredientes, según el platillo.</div>
                            </div>
                        </div>

                        <div class="criterio-item">
                            <div class="criterio-icon">✨</div>
                            <div class="criterio-content">
                                <div class="criterio-title">Creatividad</div>
                                <div class="criterio-desc">Originalidad en la preparación y presentación.</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Botón de Envío -->
                <button type="submit" class="btn-submit" id="btnSubmit">
                    <span id="btnText">Completar Inscripción</span>
                    <span class="spinner" id="btnSpinner"></span>
                </button>
            </form>
        </div>

        <!-- Feedback de Éxito -->
        <div id="successState" class="card feedback-state">
            <div class="success-icon-wrap">
                <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h2 class="feedback-title">¡Inscripción Exitosa!</h2>
            <p class="feedback-desc">
                Tus datos y comprobante han sido guardados correctamente para el concurso <strong>Ranger Chef 2026</strong>. ¡Muchos éxitos en la competencia!
            </p>
            <div style="background: #f8fafc; border: 1px solid var(--border-color); border-radius: 12px; padding: 16px; text-align: left; max-width: 400px; margin: 0 auto 24px;">
                <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 4px;">Detalles del Concurso:</div>
                <div style="font-size: 14px; font-weight: 600; color: #1e293b;">📅 Sábado 17 de octubre - 9:00 a. m.</div>
                <div style="font-size: 14px; color: #475569;">📍 Centro Internacional Maranatha (Anclas Mall, 3.er piso)</div>
            </div>
            <button class="btn-secondary" onclick="resetForm()">Inscribir a otro participante</button>
        </div>
    </div>

    <script>
        const initialCategoryParam = '${initialCategory}'.toLowerCase();

        const categoriasInfo = {
            'Navegantes': {
                color: '#ea580c',
                icon: '🧭',
                platillos: [
                    {
                        nombre: 'Pancake con Huevo Revuelto',
                        ingredientes: 'Mezcla de pancake y dos huevos revueltos.'
                    }
                ]
            },
            'Pioneros': {
                color: '#e11d48',
                icon: '🧗',
                platillos: [
                    {
                        nombre: 'Omelet con Tostadas',
                        ingredientes: 'Dos pan molde, mezcla de dos huevos con un toque de leche.'
                    }
                ]
            },
            'Seguidores': {
                color: '#7c3aed',
                icon: '👣',
                platillos: [
                    {
                        nombre: 'Pasta Boloñesa',
                        ingredientes: 'Pasta de su elección, carne molida, sal y pimienta, salsa pomodoro.'
                    }
                ]
            },
            'Exploradores': {
                color: '#059669',
                icon: '🏕️',
                platillos: [
                    {
                        nombre: 'Pollo o Bistec a Caballo',
                        ingredientes: 'Pechuga de pollo o carne, cebolla salteada, 1 huevo frito, 2 tortillas de base.'
                    }
                ]
            }
        };

        let activeCategory = 'Navegantes';

        function initCategory() {
            if (initialCategoryParam.includes('pion')) {
                activeCategory = 'Pioneros';
            } else if (initialCategoryParam.includes('seg')) {
                activeCategory = 'Seguidores';
            } else if (initialCategoryParam.includes('expl')) {
                activeCategory = 'Exploradores';
            } else {
                activeCategory = 'Navegantes';
            }

            const radio = document.querySelector('input[name="categoriaRadio"][value="' + activeCategory + '"]');
            if (radio) {
                radio.checked = true;
            }
            updateCategoryUI(activeCategory);
        }

        function onCategoryChange(selectedCat) {
            activeCategory = selectedCat;
            updateCategoryUI(selectedCat);
        }

        function updateCategoryUI(catName) {
            const data = categoriasInfo[catName] || categoriasInfo['Navegantes'];
            
            const sectionName = document.getElementById('sectionPlatillosCategoryName');
            if (sectionName) {
                sectionName.textContent = catName;
            }

            // Update radio cards visual selection
            document.querySelectorAll('.cat-card').forEach(card => card.classList.remove('selected'));
            const activeCard = document.getElementById('cat-' + catName.toLowerCase());
            if (activeCard) activeCard.classList.add('selected');

            // Render Platillos Showcase in Section 1
            const showcaseContainer = document.getElementById('platillosShowcaseContainer');
            showcaseContainer.innerHTML = data.platillos.map((p) => {
                return '<div class="platillo-card">' +
                    '<div class="platillo-header">' +
                        '<span class="platillo-num">Platillo Oficial</span>' +
                        '<span style="font-size: 18px;">🍳</span>' +
                    '</div>' +
                    '<div class="platillo-title">' + p.nombre + '</div>' +
                    '<div class="platillo-ingredientes">' +
                        '<strong>Ingredientes:</strong> ' + p.ingredientes +
                    '</div>' +
                '</div>';
            }).join('');

            // Render Platillos Choice Radio Cards in Section 2
            const choiceContainer = document.getElementById('platilloChoiceContainer');
            choiceContainer.innerHTML = data.platillos.map((p, idx) => {
                const isFirst = idx === 0;
                return '<label class="platillo-choice-card ' + (isFirst ? 'selected' : '') + '" onclick="selectChoiceCard(this)">' +
                    '<input type="radio" name="platilloElegido" value="' + p.nombre + '" ' + (isFirst ? 'checked' : '') + ' required>' +
                    '<div class="platillo-choice-info">' +
                        '<div class="platillo-choice-name">' + p.nombre + '</div>' +
                        '<div class="platillo-choice-desc">' + p.ingredientes + '</div>' +
                    '</div>' +
                '</label>';
            }).join('');
        }

        function selectChoiceCard(labelEl) {
            document.querySelectorAll('.platillo-choice-card').forEach(c => c.classList.remove('selected'));
            labelEl.classList.add('selected');
        }

        function handleFileSelected(input) {
            const file = input.files[0];
            if (!file) return;

            if (file.size > 10 * 1024 * 1024) {
                alert('El archivo seleccionado supera el límite de 10 MB.');
                input.value = '';
                clearSelectedFile();
                return;
            }

            const wrap = document.getElementById('filePreviewWrap');
            const img = document.getElementById('filePreviewImg');
            const nameEl = document.getElementById('filePreviewName');

            nameEl.textContent = file.name;

            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    img.src = e.target.result;
                    img.style.display = 'block';
                };
                reader.readAsDataURL(file);
            } else {
                img.style.display = 'none';
            }

            wrap.style.display = 'flex';
        }

        function clearSelectedFile() {
            document.getElementById('comprobantePago').value = '';
            document.getElementById('filePreviewWrap').style.display = 'none';
            document.getElementById('filePreviewImg').src = '';
        }

        function fileToBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        }

        const form = document.getElementById('registroForm');
        const formState = document.getElementById('form-state');
        const successState = document.getElementById('successState');
        const btnSubmit = document.getElementById('btnSubmit');
        const btnText = document.getElementById('btnText');
        const btnSpinner = document.getElementById('btnSpinner');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const fileInput = document.getElementById('comprobantePago');
            const file = fileInput.files[0];
            if (!file) {
                alert('Debe adjuntar el comprobante de pago de inscripción.');
                return;
            }

            btnSpinner.style.display = 'block';
            btnText.style.display = 'none';
            btnSubmit.disabled = true;

            try {
                const base64Comprobante = await fileToBase64(file);

                const nombreCompleto = document.getElementById('nombreCompleto').value.trim();
                const partes = nombreCompleto.split(' ');
                const nombre = partes[0] || 'Participante';
                const apellido = partes.length > 1 ? partes.slice(1).join(' ') : '.';

                const platilloSelected = document.querySelector('input[name="platilloElegido"]:checked');
                const platilloNombre = platilloSelected ? platilloSelected.value : 'No especificado';

                const payload = {
                    nombre: nombre,
                    apellido: apellido,
                    edad: parseInt(document.getElementById('edad').value) || undefined,
                    grupo: activeCategory, // Categoría (Navegantes, Pioneros, etc.)
                    ministerio: platilloNombre, // Platillo elegido
                    adultoResponsable: document.getElementById('nombreTutor').value.trim(),
                    telefono: document.getElementById('telefonoTutor').value.trim(),
                    metodoPago: 'Yappy',
                    montoPago: 5.00,
                    comprobantePago: base64Comprobante,
                    departamento: 'Ranger Chef'
                };

                const response = await fetch('/api/registro-detallado/publico', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    formState.style.display = 'none';
                    successState.style.display = 'block';
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    const errData = await response.json();
                    throw new Error(errData.message || 'Error en el servidor al procesar la inscripción.');
                }
            } catch (error) {
                console.error('Error registrando:', error);
                alert('Hubo un error al guardar tu registro: ' + error.message);
            } finally {
                btnSpinner.style.display = 'none';
                btnText.style.display = 'block';
                btnSubmit.disabled = false;
            }
        });

        function resetForm() {
            form.reset();
            clearSelectedFile();
            initCategory();
            successState.style.display = 'none';
            formState.style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Initialize on page load
        initCategory();
    </script>
</body>
</html>`;
};

export const getCampamentoFormHtml = (categoria: string = '') => getRangerChefFormHtml(categoria);

export const getConvencionFormHtml = () => {
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inscripción de Juegos - Convención de Jóvenes 2026</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #4361ee;
            --primary-dark: #3a0ca3;
            --primary-light: #4cc9f0;
            --primary-glow: rgba(67, 97, 238, 0.35);
            --bg-color: #f4f6fb;
            --card-bg: #ffffff;
            --text-main: #1e293b;
            --text-muted: #64748b;
            --border-color: #e2e8f0;
            --success: #10b981;
            --error: #ef4444;
            --badge-bg: rgba(67, 97, 238, 0.1);
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Outfit', 'Roboto', sans-serif;
        }

        body {
            background-color: var(--bg-color);
            color: var(--text-main);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 24px 14px;
            background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
            background-size: 24px 24px;
        }

        .container {
            width: 100%;
            max-width: 660px;
        }

        .card {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 16px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .card:hover {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.05);
        }

        .card-header {
            border-top: 10px solid var(--primary);
            border-top-left-radius: 12px;
            border-top-right-radius: 12px;
            position: relative;
            overflow: hidden;
        }

        .tag-pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 14px;
            background: var(--badge-bg);
            border: 1px solid rgba(67, 97, 238, 0.25);
            color: var(--primary);
            border-radius: 100px;
            font-size: 13px;
            font-weight: 600;
            letter-spacing: 0.5px;
            margin-bottom: 14px;
            text-transform: uppercase;
        }

        h1 {
            font-size: 28px;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 10px;
            letter-spacing: -0.5px;
            line-height: 1.25;
        }

        p.subtitle {
            font-size: 15px;
            color: var(--text-muted);
            line-height: 1.6;
            margin-bottom: 16px;
        }

        .games-summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: 10px;
            margin: 16px 0;
        }

        .game-badge {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
        }

        .game-badge-icon {
            font-size: 22px;
            margin-bottom: 4px;
        }

        .game-badge-title {
            font-size: 13px;
            font-weight: 600;
            color: #334155;
        }

        .game-badge-cap {
            font-size: 12px;
            color: var(--primary);
            font-weight: 700;
        }

        .game-badge-free {
            font-size: 12px;
            color: #10b981;
            font-weight: 700;
        }

        .required-notice {
            color: var(--error);
            font-size: 13px;
            margin-top: 14px;
            font-weight: 500;
        }

        .input-group {
            display: flex;
            flex-direction: column;
        }

        label {
            display: block;
            font-size: 15px;
            font-weight: 600;
            margin-bottom: 10px;
            color: #334155;
        }

        label .desc {
            display: block;
            font-size: 13px;
            font-weight: normal;
            color: var(--text-muted);
            margin-top: 2px;
        }

        input[type="text"],
        input[type="number"],
        input[type="tel"],
        select {
            width: 100%;
            padding: 12px 14px;
            border: 1px solid var(--border-color);
            background: #f8fafc;
            border-radius: 8px;
            font-size: 15px;
            color: var(--text-main);
            outline: none;
            transition: all 0.2s ease;
        }

        input[type="text"]:focus,
        input[type="number"]:focus,
        input[type="tel"]:focus,
        select:focus {
            background: #ffffff;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px var(--primary-glow);
        }

        .section-separator {
            font-size: 13px;
            font-weight: 700;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin: 14px 0 8px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .section-separator::after {
            content: '';
            flex: 1;
            height: 1px;
            background: var(--border-color);
        }

        .radio-game-cards, .checkbox-game-cards {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .radio-game-card, .checkbox-game-card {
            display: flex;
            align-items: center;
            padding: 12px 16px;
            border: 2px solid var(--border-color);
            background: #f8fafc;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
        }

        .radio-game-card:hover, .checkbox-game-card:hover {
            border-color: #cbd5e1;
            background: #f1f5f9;
        }

        .radio-game-card.selected, .checkbox-game-card.selected {
            border-color: var(--primary);
            background: rgba(67, 97, 238, 0.04);
            box-shadow: 0 0 0 2px var(--primary-glow);
        }

        .radio-game-card input[type="radio"], .checkbox-game-card input[type="checkbox"] {
            width: 20px;
            height: 20px;
            margin-right: 14px;
            cursor: pointer;
            accent-color: var(--primary);
        }

        .radio-game-card.disabled, .checkbox-game-card.disabled {
            opacity: 0.55;
            cursor: not-allowed;
            background: #f1f5f9;
            border-color: #e2e8f0;
        }

        .radio-game-card.disabled input[type="radio"], .checkbox-game-card.disabled input[type="checkbox"] {
            cursor: not-allowed;
        }

        .game-info {
            flex: 1;
        }

        .game-name {
            font-size: 15px;
            font-weight: 700;
            color: #1e293b;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .game-details {
            font-size: 13px;
            color: var(--text-muted);
            margin-top: 2px;
        }

        .game-cap-tag {
            font-size: 12px;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 100px;
            background: rgba(67, 97, 238, 0.12);
            color: var(--primary);
            white-space: nowrap;
        }

        .game-warning-tag {
            font-size: 12px;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 100px;
            background: rgba(245, 158, 11, 0.15);
            color: #d97706;
            white-space: nowrap;
        }

        .game-agotado-tag {
            font-size: 12px;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 100px;
            background: rgba(239, 68, 68, 0.12);
            color: #ef4444;
            white-space: nowrap;
        }

        .game-free-tag {
            font-size: 12px;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 100px;
            background: rgba(16, 185, 129, 0.12);
            color: #10b981;
            white-space: nowrap;
        }

        .radio-game-card.disabled {
            opacity: 0.55;
            cursor: not-allowed;
            background: #f1f5f9;
            border-color: #e2e8f0;
        }

        .radio-game-card.disabled input[type="radio"] {
            cursor: not-allowed;
        }

        .btn-submit {
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 14px 28px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 12px var(--primary-glow);
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .btn-submit:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 16px rgba(67, 97, 238, 0.45);
        }

        .btn-submit:active {
            transform: translateY(1px);
        }

        .btn-submit:disabled {
            background: #94a3b8;
            cursor: not-allowed;
            box-shadow: none;
            transform: none;
        }

        .spinner {
            width: 18px;
            height: 18px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 0.8s linear infinite;
            display: none;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .feedback-state {
            display: none;
            text-align: center;
            padding: 40px 24px;
        }

        .success-icon-wrap {
            width: 72px;
            height: 72px;
            border-radius: 50%;
            background: rgba(16, 185, 129, 0.12);
            border: 2px solid var(--success);
            color: var(--success);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            box-shadow: 0 0 20px rgba(16, 185, 129, 0.2);
        }

        .success-icon-wrap svg {
            width: 36px;
            height: 36px;
            fill: none;
            stroke: currentColor;
            stroke-width: 3;
            stroke-linecap: round;
            stroke-linejoin: round;
        }

        .feedback-title {
            font-size: 24px;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 8px;
        }

        .feedback-desc {
            color: var(--text-muted);
            font-size: 15px;
            line-height: 1.6;
            margin-bottom: 24px;
        }

        .footer-links {
            text-align: center;
            margin-top: 20px;
            font-size: 13px;
            color: var(--text-muted);
        }

        .footer-links a {
            color: var(--primary);
            text-decoration: none;
            font-weight: 600;
        }

        .footer-links a:hover {
            text-decoration: underline;
        }

        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        input[type=number] {
            -moz-appearance: textfield;
        }
    </style>
</head>
<body>
    <div class="container">
        
        <div id="form-state">
            <div class="card card-header">
                <span class="tag-pill">🏆 Convención de Jóvenes 2026</span>
                <h1>CONVENCIÓN DE JÓVENES 2026</h1>
                <p class="subtitle">
                    <strong>Inscripción para Juegos, Torneos y Estaciones de Actividades</strong><br>
                    Regístrate en una de las disciplinas o actividades disponibles. Los torneos de Vóleibol, Fútbol y Ping Pong cuentan con cupos limitados.
                </p>

                <div class="games-summary">
                    <div class="game-badge">
                        <span class="game-badge-icon">🏐</span>
                        <span class="game-badge-title">Vóleibol</span>
                        <span class="game-badge-cap" id="sum-cap-voleibol">24 Cupos</span>
                    </div>
                    <div class="game-badge">
                        <span class="game-badge-icon">⚽</span>
                        <span class="game-badge-title">Fútbol</span>
                        <span class="game-badge-cap" id="sum-cap-futbol">25 Cupos</span>
                    </div>
                    <div class="game-badge">
                        <span class="game-badge-icon">🏓</span>
                        <span class="game-badge-title">Ping Pong</span>
                        <span class="game-badge-cap" id="sum-cap-pingpong">25 Cupos</span>
                    </div>
                    <div class="game-badge">
                        <span class="game-badge-icon">🎮</span>
                        <span class="game-badge-title">+6 Estaciones</span>
                        <span class="game-badge-free">Acceso Libre</span>
                    </div>
                </div>

                <hr style="border: none; border-top: 1px solid var(--border-color); margin: 16px 0;">
                <p class="required-notice">* Indica que el campo es obligatorio</p>
            </div>

            <form id="registroForm">
                
                <div class="card">
                    <div class="input-group">
                        <label for="nombreCompleto">Nombre y Apellido del Participante <span style="color: var(--error);">*</span></label>
                        <input type="text" id="nombreCompleto" name="nombreCompleto" placeholder="Ej: Juan Pérez" required>
                    </div>
                </div>

                <div class="card">
                    <div class="input-group">
                        <label for="edad">Edad <span style="color: var(--error);">*</span></label>
                        <input type="number" min="1" max="99" id="edad" name="edad" placeholder="Ej: 16" required>
                    </div>
                </div>

                <div class="card">
                    <div class="input-group">
                        <label for="adultoResponsable">
                            Nombre del Acudiente o Dependiente <span style="color: var(--error);">*</span>
                            <span class="desc">Persona responsable, representante o tutor del joven / participante</span>
                        </label>
                        <input type="text" id="adultoResponsable" name="adultoResponsable" placeholder="Ej: Carlos Pérez (Padre / Tutor)" required>
                    </div>
                </div>

                <div class="card">
                    <div class="input-group">
                        <label for="telefono">Teléfono de Contacto <span style="color: var(--error);">*</span></label>
                        <input type="tel" id="telefono" name="telefono" placeholder="Ej: 6123-4567" required>
                    </div>
                </div>

                <div class="card">
                    <div class="input-group">
                        <label>
                            Selecciona los Juegos o Actividades <span style="color: var(--error);">*</span>
                            <span class="desc">Elige las actividades en las que deseas participar</span>
                        </label>
                        
                        <div class="section-separator">🏆 Torneos con Cupo Limitado (Opcional - Máximo 1)</div>
                        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 10px;">Puedes elegir un torneo deportivo con cupo limitado, o marcar "Ninguno" si solo deseas participar en estaciones libres:</p>
                        <div class="radio-game-cards">
                            <label class="radio-game-card selected" id="card-ninguno">
                                <input type="radio" name="juegoLimitado" value="" id="radio-ninguno" checked onchange="handleLimitedSelect(this)">
                                <div class="game-info">
                                    <div class="game-name">⭐ Ninguno / Solo actividades libres</div>
                                    <div class="game-details">No participaré en torneos de cupo limitado</div>
                                </div>
                                <span class="game-free-tag">Opcional</span>
                            </label>

                            <label class="radio-game-card" id="card-voleibol">
                                <input type="radio" name="juegoLimitado" value="Vóleibol" id="radio-voleibol" onchange="handleLimitedSelect(this)">
                                <div class="game-info">
                                    <div class="game-name">🏐 Vóleibol</div>
                                    <div class="game-details">Torneo Cuadrangular de Vóleibol</div>
                                </div>
                                <span class="game-cap-tag" id="tag-voleibol">Cupo: 24</span>
                            </label>

                            <label class="radio-game-card" id="card-futbol">
                                <input type="radio" name="juegoLimitado" value="Fútbol" id="radio-futbol" onchange="handleLimitedSelect(this)">
                                <div class="game-info">
                                    <div class="game-name">⚽ Fútbol</div>
                                    <div class="game-details">Torneo de Fútbol</div>
                                </div>
                                <span class="game-cap-tag" id="tag-futbol">Cupo: 25</span>
                            </label>

                            <label class="radio-game-card" id="card-pingpong">
                                <input type="radio" name="juegoLimitado" value="Estación de Ping Pong" id="radio-pingpong" onchange="handleLimitedSelect(this)">
                                <div class="game-info">
                                    <div class="game-name">🏓 Estación de Ping Pong</div>
                                    <div class="game-details">Torneo de Tenis de Mesa</div>
                                </div>
                                <span class="game-cap-tag" id="tag-pingpong">Cupo: 25</span>
                            </label>
                        </div>

                        <div class="section-separator" style="margin-top: 20px;">🎯 Estaciones y Actividades Libres (Selección Múltiple)</div>
                        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 10px;">Puedes marcar todas las estaciones libres en las que deseas participar:</p>
                        <div class="checkbox-game-cards">
                            <label class="checkbox-game-card" id="card-videojuegos">
                                <input type="checkbox" name="juegosLibres" value="Videojuegos (Mario Kart y FIFA)" onchange="handleFreeSelect(this)">
                                <div class="game-info">
                                    <div class="game-name">🎮 Videojuegos (Mario Kart y FIFA)</div>
                                    <div class="game-details">Área de consolas (abanicos del comedor)</div>
                                </div>
                                <span class="game-free-tag">Acceso Libre</span>
                            </label>

                            <label class="checkbox-game-card" id="card-tiro-arco">
                                <input type="checkbox" name="juegosLibres" value="Tiro al Arco o Flecha" onchange="handleFreeSelect(this)">
                                <div class="game-info">
                                    <div class="game-name">🏹 Tiro al Arco o Flecha</div>
                                    <div class="game-details">Estación de puntería y tiro con flechas</div>
                                </div>
                                <span class="game-free-tag">Acceso Libre</span>
                            </label>

                            <label class="checkbox-game-card" id="card-belleza">
                                <input type="checkbox" name="juegosLibres" value="Belleza (Trenzas, Neón y Estrellas)" onchange="handleFreeSelect(this)">
                                <div class="game-info">
                                    <div class="game-name">💅 Belleza (Muchachas)</div>
                                    <div class="game-details">Trenzas, maquillaje neón para la noche y estrellas</div>
                                </div>
                                <span class="game-free-tag">Ilimitado</span>
                            </label>

                            <label class="checkbox-game-card" id="card-arte">
                                <input type="checkbox" name="juegosLibres" value="Sesión de Arte" onchange="handleFreeSelect(this)">
                                <div class="game-info">
                                    <div class="game-name">🎨 Sesión de Arte</div>
                                    <div class="game-details">Taller y pintura creativa</div>
                                </div>
                                <span class="game-free-tag">Acceso Libre</span>
                            </label>

                            <label class="checkbox-game-card" id="card-square">
                                <input type="checkbox" name="juegosLibres" value="Square in the Air" onchange="handleFreeSelect(this)">
                                <div class="game-info">
                                    <div class="game-name">⬛ Square in the Air</div>
                                    <div class="game-details">Dinámica y juego Square in the air</div>
                                </div>
                                <span class="game-free-tag">Ilimitado</span>
                            </label>

                            <label class="checkbox-game-card" id="card-karaoke">
                                <input type="checkbox" name="juegosLibres" value="Karaoke" onchange="handleFreeSelect(this)">
                                <div class="game-info">
                                    <div class="game-name">🎤 Karaoke</div>
                                    <div class="game-details">Estación musical y canto</div>
                                </div>
                                <span class="game-free-tag">Acceso Libre</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; gap: 12px;">
                    <button type="submit" class="btn-submit" id="btnSubmit">
                        <span id="btn-text">Completar Inscripción</span>
                        <span class="spinner" id="btn-spinner"></span>
                    </button>
                    <button type="button" onclick="resetForm()" style="background: none; border: none; color: var(--primary); font-size: 14px; font-weight: 600; cursor: pointer; padding: 10px;">
                        Borrar formulario
                    </button>
                </div>
            </form>

            <div class="footer-links">
                <a href="/directorio-convencion" target="_blank">📋 Ver Lista de Inscritos en Directorio</a>
            </div>
        </div>

        <div id="success-state" class="card feedback-state">
            <div class="success-icon-wrap">
                <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h2 class="feedback-title" style="color: var(--success);">¡Inscripción Exitosa!</h2>
            <p class="feedback-desc" id="successDetails">Se ha guardado correctamente tu inscripción en la Convención de Jóvenes 2026.</p>
            <div style="display: flex; flex-direction: column; gap: 12px; max-width: 280px; margin: 0 auto;">
                <button class="btn-submit" style="width: 100%;" onclick="resetForm()">Inscribir a otra persona</button>
                <a href="/directorio-convencion" class="btn-submit" style="width: 100%; background: #334155; text-decoration: none; box-shadow: none;">Ver Directorio</a>
            </div>
        </div>
    </div>

    <script>
        const form = document.getElementById('registroForm');
        const card = document.getElementById('form-state');
        const successState = document.getElementById('success-state');
        const spinner = document.getElementById('btn-spinner');
        const btnText = document.getElementById('btn-text');
        const btnSubmit = document.getElementById('btnSubmit');

        function handleLimitedSelect(radio) {
            if (radio.disabled) return;
            document.querySelectorAll('.radio-game-card').forEach(c => c.classList.remove('selected'));
            if (radio.checked) {
                radio.closest('.radio-game-card').classList.add('selected');
            }
        }

        function handleFreeSelect(checkbox) {
            const parentCard = checkbox.closest('.checkbox-game-card');
            if (checkbox.checked) {
                parentCard.classList.add('selected');
            } else {
                parentCard.classList.remove('selected');
            }
        }

        async function loadCupos() {
            try {
                const res = await fetch('/api/registro-detallado/cupos-convencion');
                if (!res.ok) return;
                const data = await res.json();

                const sports = [
                    { key: 'voleibol', max: 24 },
                    { key: 'futbol', max: 25 },
                    { key: 'pingpong', max: 25 }
                ];

                sports.forEach(s => {
                    const info = data[s.key];
                    if (!info) return;

                    const sumEl = document.getElementById('sum-cap-' + s.key);
                    const tagEl = document.getElementById('tag-' + s.key);
                    const cardEl = document.getElementById('card-' + s.key);
                    const radioEl = document.getElementById('radio-' + s.key);

                    if (info.lleno) {
                        if (sumEl) sumEl.innerHTML = '<span style="color: var(--error); font-weight: 700;">Agotado</span>';
                        if (tagEl) {
                            tagEl.className = 'game-agotado-tag';
                            tagEl.textContent = 'AGOTADO (' + info.count + '/' + s.max + ')';
                        }
                        if (cardEl) cardEl.classList.add('disabled');
                        if (radioEl) {
                            if (radioEl.checked) {
                                document.getElementById('radio-ninguno').checked = true;
                                document.getElementById('card-ninguno').classList.add('selected');
                            }
                            radioEl.disabled = true;
                        }
                    } else {
                        if (sumEl) sumEl.textContent = info.count + ' / ' + s.max + ' Cupos';
                        if (tagEl) {
                            if (info.disponible <= 5) {
                                tagEl.className = 'game-warning-tag';
                                tagEl.textContent = '¡Solo quedan ' + info.disponible + ' cupos!';
                            } else {
                                tagEl.className = 'game-cap-tag';
                                tagEl.textContent = 'Quedan ' + info.disponible + ' de ' + s.max;
                            }
                        }
                        if (cardEl) cardEl.classList.remove('disabled');
                        if (radioEl) radioEl.disabled = false;
                    }
                });
            } catch (err) {
                console.warn('No se pudo cargar disponibilidad de cupos:', err);
            }
        }

        // Cargar cupos al inicio
        loadCupos();

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const limitedRadio = document.querySelector('input[name="juegoLimitado"]:checked');
            const freeCheckboxes = Array.from(document.querySelectorAll('input[name="juegosLibres"]:checked'));

            const selectedActivities = [];
            if (limitedRadio && limitedRadio.value) {
                selectedActivities.push(limitedRadio.value);
            }
            freeCheckboxes.forEach(cb => selectedActivities.push(cb.value));

            if (selectedActivities.length === 0) {
                alert('Por favor selecciona al menos una actividad (un torneo deportivo o al menos una estación libre).');
                return;
            }

            const nombreCompleto = document.getElementById('nombreCompleto').value.trim();
            const partes = nombreCompleto.split(' ');
            const nombre = partes[0];
            const apellido = partes.length > 1 ? partes.slice(1).join(' ') : '.';
            const edad = parseInt(document.getElementById('edad').value) || undefined;
            const adultoResponsable = document.getElementById('adultoResponsable').value.trim();
            const telefono = document.getElementById('telefono').value.trim();
            const juego = selectedActivities.join(', ');

            spinner.style.display = 'block';
            btnText.style.display = 'none';
            btnSubmit.disabled = true;

            const payload = {
                nombre: nombre,
                apellido: apellido,
                edad: edad,
                adultoResponsable: adultoResponsable,
                nombrePadres: adultoResponsable,
                telefono: telefono,
                grupo: juego,
                ministerio: juego,
                departamento: 'Convencion'
            };

            try {
                const response = await fetch('/api/registro-detallado/publico', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    const data = await response.json();
                    document.getElementById('successDetails').textContent = '¡Felicidades ' + nombre + '! Tu inscripción para ' + juego + ' ha sido registrada exitosamente.';
                    card.style.display = 'none';
                    successState.style.display = 'block';
                    window.scrollTo(0, 0);
                } else {
                    const errData = await response.json();
                    throw new Error(errData.message || 'Error en el servidor al procesar el registro.');
                }
            } catch (error) {
                console.error('Error registrando:', error);
                alert('Hubo un error al guardar tu registro: ' + error.message);
                loadCupos();
            } finally {
                spinner.style.display = 'none';
                btnText.style.display = 'block';
                btnSubmit.disabled = false;
            }
        });

        function resetForm() {
            form.reset();
            document.querySelectorAll('.radio-game-card').forEach(c => c.classList.remove('selected'));
            document.querySelectorAll('.checkbox-game-card').forEach(c => c.classList.remove('selected'));
            const ningunoCard = document.getElementById('card-ninguno');
            if (ningunoCard) ningunoCard.classList.add('selected');
            const ningunoRadio = document.getElementById('radio-ninguno');
            if (ningunoRadio) ningunoRadio.checked = true;
            successState.style.display = 'none';
            card.style.display = 'block';
            window.scrollTo(0, 0);
            loadCupos();
        }
    </script>
</body>
</html>`;
};

