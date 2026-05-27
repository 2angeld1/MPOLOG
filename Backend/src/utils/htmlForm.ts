export const getTeenFormHtml = () => {
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formulario de Registro - MPOLOG</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #9d4edd;
            --primary-glow: rgba(157, 78, 221, 0.4);
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
            background: linear-gradient(135deg, #7b2cbf, var(--primary));
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
            background: linear-gradient(to right, #f3f0fc, #c8b6ff);
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
            background: rgba(157, 78, 221, 0.15);
            border: 1px solid rgba(157, 78, 221, 0.3);
            color: #d8b4fe;
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
        }

        .input-icon svg { width: 20px; height: 20px; fill: currentColor; }

        input, select {
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

        select { cursor: pointer; }

        .select-wrapper { position: relative; width: 100%; }

        .select-wrapper::after {
            content: "\25BC";
            font-size: 10px;
            color: var(--text-muted);
            position: absolute;
            right: 18px;
            top: 50%;
            transform: translateY(-50%);
            pointer-events: none;
        }

        input:focus, select:focus {
            border-color: var(--primary);
            background: rgba(255, 255, 255, 0.05);
            box-shadow: 0 0 0 4px var(--primary-glow);
        }

        input:focus + .input-icon, select:focus + .input-icon { color: var(--primary); }

        .btn-submit {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #7b2cbf 0%, var(--primary) 100%);
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
            box-shadow: 0 12px 30px rgba(157, 78, 221, 0.6);
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
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                        </svg>
                    </div>
                    <h1>Formulario de Registro</h1>
                </div>
            </div>

            <p class="subtitle">Ingresa la informaci\u00f3n detallada para completar el registro.</p>

            <form id="registroForm">
                <div class="form-grid">
                    <div class="input-group">
                        <label for="nombre">Nombre</label>
                        <div class="input-wrapper">
                            <input type="text" id="nombre" name="nombre" placeholder="Nombre" required>
                            <div class="input-icon">
                                <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                            </div>
                        </div>
                    </div>

                    <div class="input-group">
                        <label for="apellido">Apellido</label>
                        <div class="input-wrapper">
                            <input type="text" id="apellido" name="apellido" placeholder="Apellido" required>
                            <div class="input-icon">
                                <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                            </div>
                        </div>
                    </div>

                    <div class="input-group">
                        <label for="edad">Edad del Ni\u00f1o</label>
                        <div class="input-wrapper">
                            <input type="number" id="edad" name="edad" min="1" max="99" placeholder="Ej: 14" required>
                            <div class="input-icon">
                                <svg viewBox="0 0 24 24"><path d="M9 11.75c-.41 0-.75-.34-.75-.75V9c0-.41.34-.75.75-.75h2c.41 0 .75.34.75.75v2c0 .41-.34.75-.75.75H9zm6 0c-.41 0-.75-.34-.75-.75V9c0-.41.34-.75.75-.75h2c.41 0 .75.34.75.75v2c0 .41-.34.75-.75.75H15zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-2.2c1.78 0 3.37-.91 4.31-2.3H7.69c.94 1.39 2.53 2.3 4.31 2.3z"/></svg>
                            </div>
                        </div>
                    </div>

                    <div class="input-group">
                        <label for="tipoSangre">Tipo de Sangre</label>
                        <div class="input-wrapper select-wrapper">
                            <select id="tipoSangre" name="tipoSangre" required>
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
                        <label for="escuela">Escuela / Colegio</label>
                        <div class="input-wrapper">
                            <input type="text" id="escuela" name="escuela" placeholder="Nombre del colegio o escuela" required>
                            <div class="input-icon">
                                <svg viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5.89 12.55L12 15.89l6.11-3.34c.66-.36 1.11-1.05 1.11-1.83V9.7L12 13.7 4.78 9.7v1.02c0 .78.45 1.47 1.11 1.83z"/></svg>
                            </div>
                        </div>
                    </div>

                    <div class="input-group full-width">
                        <label for="nombrePadres">Nombre del Padre / Madre / Tutor</label>
                        <div class="input-wrapper">
                            <input type="text" id="nombrePadres" name="nombrePadres" placeholder="Nombre completo del representante" required>
                            <div class="input-icon">
                                <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                            </div>
                        </div>
                    </div>

                    <div class="input-group full-width">
                        <label for="telefono">Tel\u00e9fono de Contacto</label>
                        <div class="input-wrapper">
                            <input type="tel" id="telefono" name="telefono" placeholder="Ej: 04121234567" required>
                            <div class="input-icon">
                                <svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                            </div>
                        </div>
                    </div>

                    <div class="input-group full-width">
                        <label for="correo">Correo Electr\u00f3nico <span style="font-weight: normal; opacity: 0.6;">(Opcional)</span></label>
                        <div class="input-wrapper">
                            <input type="email" id="correo" name="correo" placeholder="correo@ejemplo.com">
                            <div class="input-icon">
                                <svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
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
            <p class="feedback-desc">Tus datos han sido guardados correctamente. \u00a1Muchas gracias por tu registro!</p>
            <button class="btn-secondary" onclick="resetForm()">Registrar a otra persona</button>
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
                telefono: document.getElementById('telefono').value.trim(),
                edad: parseInt(document.getElementById('edad').value) || undefined,
                escuela: document.getElementById('escuela').value.trim(),
                tipoSangre: document.getElementById('tipoSangre').value,
                nombrePadres: document.getElementById('nombrePadres').value.trim(),
                correo: document.getElementById('correo').value.trim() || undefined
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
            content: "\25BC";
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
