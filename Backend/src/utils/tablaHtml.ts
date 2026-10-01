import { rangerChefLogoBase64 } from './rangerChefLogoBase64';
export const getTablaNinosHtml = (personas: any[], baseUrl: string) => {
    const rowsHtml = personas.map(p => {
        const carnetUrl = `${baseUrl}/carnet/${p._id}`;
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(carnetUrl)}&color=f72585&bgcolor=ffffff`;
        
        return `
            <tr>
                <td><strong>${p.nombre} ${p.apellido}</strong></td>
                <td>${p.edad || '-'}</td>
                <td style="text-transform: capitalize;">
                    <span class="badge">${p.grupo || '-'}</span>
                </td>
                <td>${p.adultoResponsable || '-'}</td>
                <td>${p.telefono || '-'}</td>
                <td style="text-align: center; vertical-align: middle;">
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
                        <img src="${qrUrl}" alt="QR Code" width="90" height="90" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                        <a href="${carnetUrl}" target="_blank" class="btn-link">Ver Carnet</a>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lista de Niños - Mentor Club</title>
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
            padding: 40px 20px;
            position: relative;
        }

        .blob {
            position: fixed;
            width: 400px;
            height: 400px;
            border-radius: 50%;
            background: radial-gradient(circle, var(--primary) 0%, transparent 70%);
            opacity: 0.1;
            filter: blur(50px);
            z-index: 0;
            pointer-events: none;
        }

        .blob-1 { top: -100px; left: -100px; }
        .blob-2 { bottom: -100px; right: -100px; }

        .container {
            width: 100%;
            max-width: 1100px;
            margin: 0 auto;
            z-index: 1;
            position: relative;
        }

        .header {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
            margin-bottom: 40px;
        }

        .logo-icon {
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #b5179e, var(--primary));
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 20px var(--primary-glow);
        }

        .logo-icon svg { width: 28px; height: 28px; fill: white; }

        h1 {
            font-size: 32px;
            font-weight: 800;
            background: linear-gradient(to right, #f3f0fc, #ffb3d1);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: -0.5px;
        }

        .table-container {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            overflow-x: auto;
            padding: 20px;
        }

        table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            min-width: 800px;
        }

        th, td {
            padding: 18px 20px;
            text-align: left;
            border-bottom: 1px solid var(--border-color);
        }

        th {
            color: #ff8cb3;
            font-weight: 600;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 1px;
            background: rgba(255,255,255,0.02);
        }

        th:first-child { border-top-left-radius: 12px; }
        th:last-child { border-top-right-radius: 12px; }

        tr:last-child td { border-bottom: none; }
        tr:hover td { background: rgba(255,255,255,0.03); }

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
        }

        .btn-link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 8px 16px;
            background: linear-gradient(135deg, #b5179e 0%, var(--primary) 100%);
            border: none;
            border-radius: 10px;
            color: white;
            font-size: 12px;
            font-weight: 600;
            text-decoration: none;
            cursor: pointer;
            box-shadow: 0 4px 12px var(--primary-glow);
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .btn-link:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(247, 37, 133, 0.6);
        }
        
        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: var(--text-muted);
            font-size: 16px;
        }

    </style>
</head>
<body>
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>

    <div class="container">
        <div class="header">
            <div class="logo-icon">
                <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>
            <h1>Directorio Mentor Club (Kids)</h1>
        </div>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Nombre Completo</th>
                        <th>Edad</th>
                        <th>Grupo</th>
                        <th>Adulto Responsable</th>
                        <th>Teléfono</th>
                        <th style="text-align: center;">Carnet y QR</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
            </table>
            ${personas.length === 0 ? '<div class="empty-state">No hay niños registrados en el sistema todavía.</div>' : ''}
        </div>
    </div>
</body>
</html>`;
};

export const getRangerChefTableHtml = (personas: any[], baseUrl: string) => {
    // Clasificar y normalizar
    const normalizeText = (str: string = '') => 
        str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const getCategoryKey = (p: any) => {
        const text = normalizeText((p.grupo || '') + ' ' + (p.departamento || ''));
        if (text.includes('pion')) return 'Pioneros';
        if (text.includes('seg')) return 'Seguidores';
        if (text.includes('expl')) return 'Exploradores';
        return 'Navegantes';
    };

    const countNavegantes = personas.filter(p => getCategoryKey(p) === 'Navegantes').length;
    const countPioneros = personas.filter(p => getCategoryKey(p) === 'Pioneros').length;
    const countSeguidores = personas.filter(p => getCategoryKey(p) === 'Seguidores').length;
    const countExploradores = personas.filter(p => getCategoryKey(p) === 'Exploradores').length;
    const totalRecaudado = personas.reduce((acc: number, p: any) => acc + (p.montoPago || 5), 0);

    const rowsHtml = personas.map((p, idx) => {
        const cat = getCategoryKey(p);
        let badgeClass = 'badge-navegantes';
        let catIcon = '🧭';
        if (cat === 'Pioneros') { badgeClass = 'badge-pioneros'; catIcon = '🧗'; }
        else if (cat === 'Seguidores') { badgeClass = 'badge-seguidores'; catIcon = '👣'; }
        else if (cat === 'Exploradores') { badgeClass = 'badge-exploradores'; catIcon = '🏕️'; }

        let comprobanteBtn = '<span style="color: var(--text-muted);">-</span>';
        if (p.comprobantePago) {
            comprobanteBtn = '<button class="comprobante-btn" onclick="openComprobanteModal(\'' + p.comprobantePago + '\', \'' + (p.nombre + ' ' + (p.apellido || '')) + '\')">📸 Ver Recibo</button>';
        }

        const pJson = JSON.stringify(p).replace(/'/g, "&apos;").replace(/"/g, "&quot;");
        const platillo = p.ministerio || 'Platillo asignado';
        const tutor = p.adultoResponsable || p.nombrePadres || '-';
        const telefono = p.telefono || '-';
        const fechaStr = p.createdAt ? new Date(p.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';
        const searchTerms = normalizeText(p.nombre + ' ' + (p.apellido || '') + ' ' + cat + ' ' + platillo + ' ' + tutor + ' ' + telefono);

        return '<tr data-category="' + cat + '" data-search="' + searchTerms + '">' +
            '<td style="text-align: center; font-weight: 700; color: var(--text-muted);">' + (idx + 1) + '</td>' +
            '<td><strong>' + p.nombre + ' ' + (p.apellido && p.apellido !== '.' ? p.apellido : '') + '</strong></td>' +
            '<td style="text-align: center;">' + (p.edad || '-') + '</td>' +
            '<td><span class="cat-badge ' + badgeClass + '">' + catIcon + ' ' + cat + '</span></td>' +
            '<td><span class="dish-badge">🍲 ' + platillo + '</span></td>' +
            '<td>' + tutor + '</td>' +
            '<td><a href="tel:' + telefono + '" style="color: inherit; text-decoration: none; font-weight: 500;">' + telefono + '</a></td>' +
            '<td style="text-align: center;"><span class="paid-badge">$' + (p.montoPago ? p.montoPago.toFixed(2) : '5.00') + '</span></td>' +
            '<td style="text-align: center; vertical-align: middle;">' + comprobanteBtn + '</td>' +
            '<td style="font-size: 13px; color: var(--text-muted);">' + fechaStr + '</td>' +
            '<td style="text-align: center; vertical-align: middle;">' +
                '<button class="action-btn edit-btn" title="Editar" onclick="openEditModal(\'' + p._id + '\', \'' + pJson + '\')">✏️</button>' +
                '<button class="action-btn delete-btn" title="Eliminar" onclick="deleteRecord(\'' + p._id + '\')">🗑️</button>' +
            '</td>' +
        '</tr>';
    }).join('');

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Directorio - Concurso Ranger Chef 2026</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #ea580c;
            --primary-dark: #c2410c;
            --primary-light: #fb923c;
            --primary-glow: rgba(234, 88, 12, 0.25);
            --bg-color: #f8fafc;
            --card-bg: #ffffff;
            --text-main: #0f172a;
            --text-muted: #64748b;
            --border-color: #e2e8f0;
            --success: #10b981;
            --error: #ef4444;
            --navegantes-color: #ea580c;
            --pioneros-color: #e11d48;
            --seguidores-color: #7c3aed;
            --exploradores-color: #059669;
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
            padding: 24px 16px 60px;
            background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
            background-size: 24px 24px;
        }

        .container {
            width: 100%;
            max-width: 1260px;
            margin: 0 auto;
        }

        .header-card {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-top: 8px solid var(--primary);
            border-radius: 14px;
            padding: 20px 24px;
            margin-bottom: 20px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 16px;
        }

        .header-left {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .header-logo {
            width: 64px;
            height: 64px;
            border-radius: 12px;
            object-fit: contain;
            background: white;
            border: 1px solid var(--border-color);
            padding: 4px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
        }

        h1 {
            font-size: 24px;
            font-weight: 800;
            color: #0f172a;
            line-height: 1.2;
        }

        .subtitle {
            font-size: 14px;
            color: var(--text-muted);
            margin-top: 4px;
        }

        .header-actions {
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
        }

        .btn-register-link {
            background: #fff7ed;
            border: 1.5px solid #fdba74;
            color: #ea580c;
            padding: 10px 16px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s;
        }

        .btn-register-link:hover {
            background: #ffedd5;
            border-color: #fb923c;
        }

        .export-btn {
            background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
            color: white;
            border: none;
            padding: 10px 18px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 2px 8px rgba(22, 163, 74, 0.3);
            transition: all 0.2s;
        }

        .export-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(22, 163, 74, 0.4);
        }

        /* Stats Cards */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
            gap: 12px;
            margin-bottom: 20px;
        }

        .stat-card {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 14px 16px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .stat-icon {
            font-size: 26px;
        }

        .stat-info {
            flex: 1;
        }

        .stat-label {
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            color: var(--text-muted);
            letter-spacing: 0.5px;
        }

        .stat-value {
            font-size: 20px;
            font-weight: 800;
            color: #0f172a;
        }

        /* Controls: Search & Tabs */
        .controls-card {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 16px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
            display: flex;
            flex-direction: column;
            gap: 14px;
        }

        .search-wrap {
            position: relative;
            width: 100%;
        }

        .search-input {
            width: 100%;
            padding: 12px 14px 12px 42px;
            border: 1px solid var(--border-color);
            background: #f8fafc;
            border-radius: 8px;
            font-size: 14px;
            color: var(--text-main);
            outline: none;
            transition: all 0.2s;
        }

        .search-input:focus {
            background: #ffffff;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px var(--primary-glow);
        }

        .search-icon {
            position: absolute;
            left: 14px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 16px;
            color: var(--text-muted);
        }

        .category-tabs {
            display: flex;
            align-items: center;
            gap: 8px;
            overflow-x: auto;
            padding-bottom: 4px;
        }

        .cat-tab {
            padding: 8px 16px;
            border-radius: 8px;
            border: 1px solid var(--border-color);
            background: #f8fafc;
            color: #475569;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            white-space: nowrap;
            transition: all 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }

        .cat-tab:hover {
            background: #f1f5f9;
            border-color: #cbd5e1;
        }

        .cat-tab.active {
            background: var(--primary);
            border-color: var(--primary);
            color: white;
            box-shadow: 0 2px 8px var(--primary-glow);
        }

        .tab-count {
            background: rgba(0, 0, 0, 0.12);
            padding: 2px 6px;
            border-radius: 100px;
            font-size: 11px;
        }

        .cat-tab.active .tab-count {
            background: rgba(255, 255, 255, 0.25);
            color: white;
        }

        /* Table Styles */
        .table-container {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 14px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            overflow-x: auto;
            padding: 4px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            min-width: 1000px;
        }

        th, td {
            padding: 14px 16px;
            text-align: left;
            border-bottom: 1px solid var(--border-color);
            font-size: 14px;
        }

        th {
            background: #f8fafc;
            color: var(--text-muted);
            font-weight: 700;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        tr:last-child td { border-bottom: none; }
        tr:hover td { background: rgba(0, 0, 0, 0.015); }

        .cat-badge {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 4px 10px;
            border-radius: 100px;
            font-size: 12px;
            font-weight: 700;
        }

        .badge-navegantes { background: rgba(234, 88, 12, 0.12); color: #c2410c; }
        .badge-pioneros { background: rgba(225, 29, 72, 0.12); color: #be123c; }
        .badge-seguidores { background: rgba(124, 58, 237, 0.12); color: #6d28d9; }
        .badge-exploradores { background: rgba(5, 150, 105, 0.12); color: #047857; }

        .dish-badge {
            display: inline-block;
            background: #f1f5f9;
            border: 1px solid #e2e8f0;
            color: #334155;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 600;
        }

        .paid-badge {
            background: rgba(16, 185, 129, 0.12);
            color: #047857;
            padding: 4px 8px;
            border-radius: 6px;
            font-weight: 700;
            font-size: 13px;
        }

        .comprobante-btn {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            color: #1d4ed8;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }

        .comprobante-btn:hover {
            background: #dbeafe;
        }

        .action-btn {
            background: transparent;
            border: 1px solid var(--border-color);
            color: var(--text-main);
            border-radius: 6px;
            padding: 6px 8px;
            cursor: pointer;
            margin: 0 3px;
            transition: all 0.2s;
            font-size: 13px;
        }

        .action-btn:hover { background: #f1f5f9; }

        .empty-state {
            text-align: center;
            padding: 50px 20px;
            color: var(--text-muted);
            font-size: 15px;
        }

        /* Modal Styles */
        .modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            display: none; align-items: center; justify-content: center; z-index: 1000;
            padding: 16px;
        }
        .modal {
            background: var(--card-bg);
            border-radius: 14px;
            width: 100%; max-width: 520px; max-height: 90vh;
            overflow-y: auto; padding: 24px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
            border-top: 8px solid var(--primary);
        }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
        .modal-header h2 { font-size: 20px; font-weight: 700; }
        .close-btn { background: none; border: none; font-size: 24px; color: var(--text-muted); cursor: pointer; }
        
        .form-group { margin-bottom: 14px; }
        .form-group label { display: block; margin-bottom: 6px; font-size: 13.5px; font-weight: 600; color: #334155; }
        .form-group input, .form-group select {
            width: 100%; padding: 10px 12px; border-radius: 6px; border: 1px solid var(--border-color);
            background: #f8fafc; color: var(--text-main); outline: none; font-size: 14px;
        }
        .form-group input:focus, .form-group select:focus {
            border-color: var(--primary);
            background: #ffffff;
        }
        
        .btn-modal-save {
            width: 100%; padding: 12px; background: var(--primary); color: white; border: none; border-radius: 8px;
            font-weight: 700; cursor: pointer; font-size: 15px; margin-top: 10px;
        }
        .btn-modal-save:hover { background: var(--primary-dark); }

        /* Comprobante Image Modal */
        .img-modal-content {
            max-width: 600px;
            text-align: center;
        }
        .img-modal-preview {
            max-width: 100%;
            max-height: 70vh;
            border-radius: 8px;
            object-fit: contain;
            margin-top: 10px;
            border: 1px solid var(--border-color);
        }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header-card">
            <div class="header-left">
                <img src="${rangerChefLogoBase64}" alt="Ranger Chef" class="header-logo">
                <div>
                    <h1>Directorio Ranger Chef 2026</h1>
                    <div class="subtitle">Lista de Participantes e Inscripciones Oficiales</div>
                </div>
            </div>
            <div class="header-actions">
                <a href="${baseUrl}/registro-ranger-chef" target="_blank" class="btn-register-link">
                    <span>➕</span> Nuevo Registro
                </a>
                <button id="exportExcelBtn" class="export-btn" onclick="exportToExcel()">
                    <span>📥</span> Exportar a Excel
                </button>
            </div>
        </div>

        <!-- Stats Grid -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">👨‍🍳</div>
                <div class="stat-info">
                    <div class="stat-label">Total Inscritos</div>
                    <div class="stat-value">${personas.length}</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">🧭</div>
                <div class="stat-info">
                    <div class="stat-label">Navegantes</div>
                    <div class="stat-value" style="color: var(--navegantes-color);">${countNavegantes}</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">🧗</div>
                <div class="stat-info">
                    <div class="stat-label">Pioneros</div>
                    <div class="stat-value" style="color: var(--pioneros-color);">${countPioneros}</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">👣</div>
                <div class="stat-info">
                    <div class="stat-label">Seguidores</div>
                    <div class="stat-value" style="color: var(--seguidores-color);">${countSeguidores}</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">🏕️</div>
                <div class="stat-info">
                    <div class="stat-label">Exploradores</div>
                    <div class="stat-value" style="color: var(--exploradores-color);">${countExploradores}</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">💰</div>
                <div class="stat-info">
                    <div class="stat-label">Recaudado</div>
                    <div class="stat-value" style="color: var(--success); font-size: 18px;">$${totalRecaudado.toFixed(2)}</div>
                </div>
            </div>
        </div>

        <!-- Controls: Search & Category Tabs -->
        <div class="controls-card">
            <div class="search-wrap">
                <span class="search-icon">🔍</span>
                <input type="text" id="searchInput" class="search-input" placeholder="Buscar por nombre, tutor, teléfono o platillo..." oninput="filterTable()">
            </div>

            <div class="category-tabs">
                <button class="cat-tab active" onclick="setCategoryFilter('all', this)">
                    🌟 Todas las Categorías <span class="tab-count">${personas.length}</span>
                </button>
                <button class="cat-tab" onclick="setCategoryFilter('Navegantes', this)">
                    🧭 Navegantes <span class="tab-count">${countNavegantes}</span>
                </button>
                <button class="cat-tab" onclick="setCategoryFilter('Pioneros', this)">
                    🧗 Pioneros <span class="tab-count">${countPioneros}</span>
                </button>
                <button class="cat-tab" onclick="setCategoryFilter('Seguidores', this)">
                    👣 Seguidores <span class="tab-count">${countSeguidores}</span>
                </button>
                <button class="cat-tab" onclick="setCategoryFilter('Exploradores', this)">
                    🏕️ Exploradores <span class="tab-count">${countExploradores}</span>
                </button>
            </div>
        </div>

        <!-- Table -->
        <div class="table-container">
            <table id="rangerChefTable">
                <thead>
                    <tr>
                        <th style="text-align: center; width: 40px;">#</th>
                        <th>Participante</th>
                        <th style="text-align: center;">Edad</th>
                        <th>Categoría</th>
                        <th>Platillo Seleccionado</th>
                        <th>Tutor / Acudiente</th>
                        <th>Teléfono Tutor</th>
                        <th style="text-align: center;">Pago</th>
                        <th style="text-align: center;">Comprobante</th>
                        <th>Fecha Reg.</th>
                        <th style="text-align: center; width: 90px;">Acciones</th>
                    </tr>
                </thead>
                <tbody id="tableBody">
                    ${rowsHtml}
                </tbody>
            </table>
            ${personas.length === 0 ? '<div class="empty-state">No hay inscripciones registradas para Ranger Chef todavía.</div>' : ''}
            <div id="noResultsState" class="empty-state" style="display: none;">No se encontraron registros que coincidan con la búsqueda.</div>
        </div>
    </div>

    <!-- Edit Modal -->
    <div class="modal-overlay" id="editModal">
        <div class="modal">
            <div class="modal-header">
                <h2>Editar Inscripción</h2>
                <button class="close-btn" onclick="closeEditModal()">&times;</button>
            </div>
            <form id="editForm">
                <input type="hidden" id="editId">
                <div class="form-group">
                    <label>Nombre del Participante</label>
                    <input type="text" id="editNombre" required>
                </div>
                <div class="form-group">
                    <label>Apellido del Participante</label>
                    <input type="text" id="editApellido" required>
                </div>
                <div class="form-group">
                    <label>Edad</label>
                    <input type="number" id="editEdad" min="1" max="99">
                </div>
                <div class="form-group">
                    <label>Categoría</label>
                    <select id="editCategoria" onchange="updateEditDishes(this.value)" required>
                        <option value="Navegantes">Navegantes</option>
                        <option value="Pioneros">Pioneros</option>
                        <option value="Seguidores">Seguidores</option>
                        <option value="Exploradores">Exploradores</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Platillo Seleccionado</label>
                    <select id="editPlatillo" required>
                        <!-- Opciones dinámicas -->
                    </select>
                </div>
                <div class="form-group">
                    <label>Nombre del Tutor</label>
                    <input type="text" id="editTutor" required>
                </div>
                <div class="form-group">
                    <label>Teléfono del Tutor</label>
                    <input type="tel" id="editTelefono" required>
                </div>
                <div class="form-group">
                    <label>Monto Pagado ($)</label>
                    <input type="number" step="0.01" min="0" id="editMontoPago" required>
                </div>
                <button type="submit" class="btn-modal-save">Guardar Cambios</button>
            </form>
        </div>
    </div>

    <!-- Comprobante View Modal -->
    <div class="modal-overlay" id="comprobanteModal">
        <div class="modal img-modal-content">
            <div class="modal-header">
                <h2 id="comprobanteTitle">Comprobante de Pago</h2>
                <button class="close-btn" onclick="closeComprobanteModal()">&times;</button>
            </div>
            <img id="comprobanteImgPreview" src="" alt="Comprobante" class="img-modal-preview">
            <div style="margin-top: 14px;">
                <a id="comprobanteDirectLink" href="" target="_blank" class="export-btn" style="text-decoration: none; display: inline-flex;">
                    🔗 Abrir imagen original
                </a>
            </div>
        </div>
    </div>

    <script>
        const baseUrl = '${baseUrl}';
        const personasList = ${JSON.stringify(personas).replace(/</g, '\\u003c')};
        
        let currentFilterCategory = 'all';

        const categoryDishes = {
            'Navegantes': ['Derretidos de Jamón y Queso', 'Pancake con Huevo Revuelto'],
            'Pioneros': ['Brioche de Pollo', 'Omelet con Tostadas'],
            'Seguidores': ['Pasta Boloñesa', 'Club Sándwich'],
            'Exploradores': ['Desayuno Panameño', 'Pollo o Bistec a Caballo']
        };

        function setCategoryFilter(cat, btnEl) {
            currentFilterCategory = cat;
            document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
            btnEl.classList.add('active');
            filterTable();
        }

        function filterTable() {
            const query = (document.getElementById('searchInput').value || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
            const rows = document.querySelectorAll('#tableBody tr');
            let visibleCount = 0;

            rows.forEach(row => {
                const rowCat = row.getAttribute('data-category');
                const rowSearch = row.getAttribute('data-search') || '';

                const matchesCat = currentFilterCategory === 'all' || rowCat === currentFilterCategory;
                const matchesQuery = !query || rowSearch.includes(query);

                if (matchesCat && matchesQuery) {
                    row.style.display = '';
                    visibleCount++;
                } else {
                    row.style.display = 'none';
                }
            });

            document.getElementById('noResultsState').style.display = (visibleCount === 0 && rows.length > 0) ? 'block' : 'none';
        }

        function openComprobanteModal(imgUrl, nombre) {
            document.getElementById('comprobanteTitle').textContent = 'Comprobante: ' + nombre;
            document.getElementById('comprobanteImgPreview').src = imgUrl;
            document.getElementById('comprobanteDirectLink').href = imgUrl;
            document.getElementById('comprobanteModal').style.display = 'flex';
        }

        function closeComprobanteModal() {
            document.getElementById('comprobanteModal').style.display = 'none';
            document.getElementById('comprobanteImgPreview').src = '';
        }

        function updateEditDishes(category, selectedDish) {
            const select = document.getElementById('editPlatillo');
            const dishes = categoryDishes[category] || categoryDishes['Navegantes'];
            select.innerHTML = dishes.map(d => '<option value="' + d + '" ' + (d === selectedDish ? 'selected' : '') + '>' + d + '</option>').join('');
        }

        let currentRecord = null;

        function openEditModal(id, dataStr) {
            currentRecord = JSON.parse(dataStr);
            document.getElementById('editId').value = id;
            document.getElementById('editNombre').value = currentRecord.nombre || '';
            document.getElementById('editApellido').value = currentRecord.apellido || '';
            document.getElementById('editEdad').value = currentRecord.edad || '';
            
            const cat = currentRecord.grupo || 'Navegantes';
            document.getElementById('editCategoria').value = cat;
            updateEditDishes(cat, currentRecord.ministerio);
            
            document.getElementById('editTutor').value = currentRecord.adultoResponsable || '';
            document.getElementById('editTelefono').value = currentRecord.telefono || '';
            document.getElementById('editMontoPago').value = currentRecord.montoPago || 5.00;

            document.getElementById('editModal').style.display = 'flex';
        }

        function closeEditModal() {
            document.getElementById('editModal').style.display = 'none';
        }

        document.getElementById('editForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const payload = {
                ...currentRecord,
                nombre: document.getElementById('editNombre').value.trim(),
                apellido: document.getElementById('editApellido').value.trim(),
                edad: parseInt(document.getElementById('editEdad').value) || undefined,
                grupo: document.getElementById('editCategoria').value,
                ministerio: document.getElementById('editPlatillo').value,
                adultoResponsable: document.getElementById('editTutor').value.trim(),
                telefono: document.getElementById('editTelefono').value.trim(),
                montoPago: parseFloat(document.getElementById('editMontoPago').value) || 5.00,
                departamento: 'Ranger Chef'
            };

            try {
                const response = await fetch(baseUrl + '/api/registro-detallado/publico/' + payload._id, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (response.ok) {
                    location.reload();
                } else {
                    alert('Error al actualizar el registro');
                }
            } catch (e) {
                alert('Error de conexión');
            }
        });

        async function deleteRecord(id) {
            if (confirm('¿Está seguro de que desea eliminar este registro de Ranger Chef?')) {
                try {
                    const response = await fetch(baseUrl + '/api/registro-detallado/publico/' + id, {
                        method: 'DELETE'
                    });
                    if (response.ok) {
                        location.reload();
                    } else {
                        alert('Error al eliminar el registro');
                    }
                } catch (e) {
                    alert('Error de conexión');
                }
            }
        }

        function exportToExcel() {
            if (!personasList || personasList.length === 0) {
                alert('No hay inscritos para exportar');
                return;
            }

            const exportData = personasList.map((p, idx) => ({
                'N°': idx + 1,
                'Nombre del Participante': p.nombre || '',
                'Apellido': (p.apellido && p.apellido !== '.') ? p.apellido : '',
                'Edad': p.edad || '',
                'Categoría': p.grupo || '',
                'Platillo Asignado': p.ministerio || '',
                'Nombre del Tutor': p.adultoResponsable || '',
                'Teléfono del Tutor': p.telefono || '',
                'Método de Pago': p.metodoPago || 'Yappy',
                'Monto Pagado ($)': p.montoPago || 5.00,
                'Comprobante (URL)': p.comprobantePago || '',
                'Fecha de Registro': p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ''
            }));

            const worksheet = XLSX.utils.json_to_sheet(exportData);
            
            const max_len = exportData.reduce((acc, row) => {
                Object.keys(row).forEach((key) => {
                    const val = String(row[key] || '');
                    const cell_len = val.length;
                    const header_len = key.length;
                    const current_max = Math.max(cell_len, header_len);
                    acc[key] = Math.max(acc[key] || 0, current_max);
                });
                return acc;
            }, {});
            
            worksheet['!cols'] = Object.keys(max_len).map(key => ({ wch: max_len[key] + 3 }));

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Ranger Chef 2026');
            XLSX.writeFile(workbook, 'Directorio_Ranger_Chef_2026.xlsx');
        }
    </script>
</body>
</html>`;
};

export const getCampamentoTableHtml = (personas: any[], baseUrl: string) => getRangerChefTableHtml(personas, baseUrl);

export const getConvencionTableHtml = (personas: any[], baseUrl: string) => {
    // Normalizar texto eliminando tildes y diacríticos
    const normalizeText = (str: string = '') => 
        str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Clasificar listas por actividad / juego con normalización de tildes
    const isVoleibol = (p: any) => normalizeText((p.grupo || '') + ' ' + (p.ministerio || '')).includes('vol');
    const isFutbol = (p: any) => normalizeText((p.grupo || '') + ' ' + (p.ministerio || '')).includes('fut');
    const isPingPong = (p: any) => normalizeText((p.grupo || '') + ' ' + (p.ministerio || '')).includes('ping');
    const isVideojuegos = (p: any) => {
        const t = normalizeText((p.grupo || '') + ' ' + (p.ministerio || ''));
        return t.includes('video') || t.includes('mario') || t.includes('fifa');
    };
    const isTiroArco = (p: any) => {
        const t = normalizeText((p.grupo || '') + ' ' + (p.ministerio || ''));
        return t.includes('tiro') || t.includes('arco') || t.includes('flecha');
    };
    const isBelleza = (p: any) => {
        const t = normalizeText((p.grupo || '') + ' ' + (p.ministerio || ''));
        return t.includes('belleza') || t.includes('trenza') || t.includes('neon');
    };
    const isArte = (p: any) => normalizeText((p.grupo || '') + ' ' + (p.ministerio || '')).includes('arte');
    const isSquareAir = (p: any) => normalizeText((p.grupo || '') + ' ' + (p.ministerio || '')).includes('square');
    const isKaraoke = (p: any) => normalizeText((p.grupo || '') + ' ' + (p.ministerio || '')).includes('karaoke');

    const voleibolList = personas.filter(isVoleibol);
    const futbolList = personas.filter(isFutbol);
    const pingPongList = personas.filter(isPingPong);
    const videojuegosList = personas.filter(isVideojuegos);
    const tiroArcoList = personas.filter(isTiroArco);
    const bellezaList = personas.filter(isBelleza);
    const arteList = personas.filter(isArte);
    const squareAirList = personas.filter(isSquareAir);
    const karaokeList = personas.filter(isKaraoke);

    const libresCount = videojuegosList.length + tiroArcoList.length + bellezaList.length + arteList.length + squareAirList.length + karaokeList.length;

    const renderTableRows = (list: any[]) => {
        return list.map((p, idx) => {
            const pJson = JSON.stringify(p).replace(/'/g, "&apos;").replace(/"/g, "&quot;");
            const juego = p.grupo || p.ministerio || 'Sin asignar';
            const badges: string[] = [];
            if (isVoleibol(p)) badges.push('<span class="game-badge-tag badge-voleibol">🏐 Vóleibol</span>');
            if (isFutbol(p)) badges.push('<span class="game-badge-tag badge-futbol">⚽ Fútbol</span>');
            if (isPingPong(p)) badges.push('<span class="game-badge-tag badge-pingpong">🏓 Ping Pong</span>');
            if (isVideojuegos(p)) badges.push('<span class="game-badge-tag badge-videojuegos">🎮 Videojuegos</span>');
            if (isTiroArco(p)) badges.push('<span class="game-badge-tag badge-tiroarco">🏹 Tiro al Arco</span>');
            if (isBelleza(p)) badges.push('<span class="game-badge-tag badge-belleza">💅 Belleza</span>');
            if (isArte(p)) badges.push('<span class="game-badge-tag badge-arte">🎨 Arte</span>');
            if (isSquareAir(p)) badges.push('<span class="game-badge-tag badge-square">⬛ Square</span>');
            if (isKaraoke(p)) badges.push('<span class="game-badge-tag badge-karaoke">🎤 Karaoke</span>');

            const badgesDisplay = badges.length > 0
                ? '<div style="display: flex; flex-wrap: wrap; gap: 4px;">' + badges.join('') + '</div>'
                : '<span class="game-badge-tag badge-general">🎮 ' + juego + '</span>';

            const acudiente = p.adultoResponsable || p.nombrePadres || '-';
            const fechaStr = p.createdAt ? new Date(p.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';
            const searchTerms = normalizeText(p.nombre + ' ' + (p.apellido || '') + ' ' + acudiente + ' ' + (p.telefono || '') + ' ' + juego);

            return '<tr data-juego="' + (p.grupo || '') + '" data-search="' + searchTerms + '">' +
                '<td style="text-align: center; font-weight: 700; color: var(--text-muted);">' + (idx + 1) + '</td>' +
                '<td><strong>' + p.nombre + ' ' + (p.apellido && p.apellido !== '.' ? p.apellido : '') + '</strong></td>' +
                '<td style="text-align: center;">' + (p.edad || '-') + '</td>' +
                '<td>' + badgesDisplay + '</td>' +
                '<td>' + acudiente + '</td>' +
                '<td><a href="tel:' + (p.telefono || '') + '" style="color: inherit; text-decoration: none;">' + (p.telefono || '-') + '</a></td>' +
                '<td style="font-size: 13px; color: var(--text-muted);">' + fechaStr + '</td>' +
                '<td style="text-align: center; vertical-align: middle;">' +
                    '<button class="action-btn edit-btn" title="Editar" onclick="openEditModal(\'' + p._id + '\', \'' + pJson + '\')">✏️</button>' +
                    '<button class="action-btn delete-btn" title="Eliminar" onclick="deleteRecord(\'' + p._id + '\')">🗑️</button>' +
                '</td>' +
            '</tr>';
        }).join('');
    };

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Directorio de Juegos - Convención de Jóvenes 2026</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #4361ee;
            --primary-dark: #3a0ca3;
            --primary-light: #4cc9f0;
            --primary-glow: rgba(67, 97, 238, 0.25);
            --bg-color: #f4f6fb;
            --card-bg: #ffffff;
            --text-main: #1e293b;
            --text-muted: #64748b;
            --border-color: #e2e8f0;
            --success: #10b981;
            --error: #ef4444;
            --voleibol-color: #7209b7;
            --futbol-color: #10b981;
            --pingpong-color: #f72585;
            --videojuegos-color: #3a86ff;
            --tiro-color: #d97706;
            --belleza-color: #ec4899;
            --arte-color: #8b5cf6;
            --square-color: #0284c7;
            --karaoke-color: #e11d48;
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
            padding: 24px 14px;
            background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
            background-size: 24px 24px;
        }

        .container {
            width: 100%;
            max-width: 1280px;
            margin: 0 auto;
        }

        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 16px;
            margin-bottom: 24px;
        }

        .header-title-group h1 {
            font-size: 28px;
            font-weight: 800;
            color: #0f172a;
            letter-spacing: -0.5px;
        }

        .header-title-group p {
            font-size: 14px;
            color: var(--text-muted);
            margin-top: 4px;
        }

        .header-actions {
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
        }

        .btn-action {
            border: none;
            padding: 10px 18px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.06);
            transition: all 0.2s ease;
            text-decoration: none;
        }

        .btn-export {
            background-color: #16a34a;
            color: white;
        }
        .btn-export:hover {
            background-color: #15803d;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.12);
        }

        .btn-new {
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
            color: white;
        }
        .btn-new:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px var(--primary-glow);
        }

        /* Metrics Grid */
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
            gap: 14px;
            margin-bottom: 24px;
        }

        .metric-card {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 16px 18px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.04);
            display: flex;
            align-items: center;
            gap: 14px;
            position: relative;
            overflow: hidden;
        }

        .metric-icon {
            width: 44px;
            height: 44px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
        }

        .metric-info {
            flex: 1;
        }

        .metric-title {
            font-size: 12px;
            font-weight: 600;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .metric-value {
            font-size: 22px;
            font-weight: 800;
            color: #0f172a;
            margin-top: 2px;
        }

        .metric-cap {
            font-size: 13px;
            font-weight: 600;
            color: var(--text-muted);
        }

        .progress-bar-bg {
            width: 100%;
            height: 6px;
            background: #e2e8f0;
            border-radius: 100px;
            margin-top: 6px;
            overflow: hidden;
        }

        .progress-bar-fill {
            height: 100%;
            border-radius: 100px;
            transition: width 0.4s ease;
        }

        /* Tabs Styles */
        .tabs-header {
            display: flex;
            align-items: center;
            gap: 6px;
            border-bottom: 2px solid var(--border-color);
            margin-bottom: 20px;
            overflow-x: auto;
            padding-bottom: 4px;
            scrollbar-width: thin;
        }

        .tab-btn {
            background: transparent;
            border: none;
            padding: 10px 14px;
            font-size: 14px;
            font-weight: 600;
            color: var(--text-muted);
            cursor: pointer;
            border-radius: 8px 8px 0 0;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            position: relative;
            transition: all 0.2s ease;
            white-space: nowrap;
        }

        .tab-btn:hover {
            color: var(--primary);
            background: rgba(67, 97, 238, 0.05);
        }

        .tab-btn.active {
            color: var(--primary);
            font-weight: 700;
        }

        .tab-btn.active::after {
            content: '';
            position: absolute;
            bottom: -6px;
            left: 0;
            width: 100%;
            height: 3px;
            background: var(--primary);
            border-radius: 3px 3px 0 0;
        }

        .tab-pill {
            padding: 2px 7px;
            border-radius: 100px;
            font-size: 11px;
            font-weight: 700;
            background: #e2e8f0;
            color: var(--text-main);
        }

        .tab-btn.active .tab-pill {
            background: var(--primary);
            color: white;
        }

        /* Search bar */
        .search-bar-wrap {
            margin-bottom: 16px;
            display: flex;
            gap: 12px;
        }

        .search-input {
            width: 100%;
            max-width: 420px;
            padding: 10px 16px 10px 38px;
            border-radius: 8px;
            border: 1px solid var(--border-color);
            background: #ffffff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'%3E%3C/line%3E%3C/svg%3E") no-repeat 12px center;
            font-size: 14px;
            color: var(--text-main);
            outline: none;
            transition: all 0.2s ease;
        }

        .search-input:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 3px var(--primary-glow);
        }

        /* Table container */
        .table-container {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            overflow-x: auto;
            padding: 16px;
        }

        table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            min-width: 880px;
        }

        th, td {
            padding: 14px 16px;
            text-align: left;
            border-bottom: 1px solid var(--border-color);
            font-size: 14px;
        }

        th {
            color: var(--text-muted);
            font-weight: 600;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            background: #f8fafc;
        }

        th:first-child { border-top-left-radius: 8px; }
        th:last-child { border-top-right-radius: 8px; }

        tr:last-child td { border-bottom: none; }
        tr:hover td { background: #f8fafc; }

        .game-badge-tag {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 10px;
            border-radius: 100px;
            font-size: 12px;
            font-weight: 600;
            white-space: nowrap;
        }

        .badge-voleibol { background: rgba(114, 9, 183, 0.12); color: var(--voleibol-color); border: 1px solid rgba(114, 9, 183, 0.25); }
        .badge-futbol { background: rgba(16, 185, 129, 0.12); color: var(--futbol-color); border: 1px solid rgba(16, 185, 129, 0.25); }
        .badge-pingpong { background: rgba(247, 37, 133, 0.12); color: var(--pingpong-color); border: 1px solid rgba(247, 37, 133, 0.25); }
        .badge-videojuegos { background: rgba(58, 134, 255, 0.12); color: var(--videojuegos-color); border: 1px solid rgba(58, 134, 255, 0.25); }
        .badge-tiroarco { background: rgba(217, 119, 6, 0.12); color: var(--tiro-color); border: 1px solid rgba(217, 119, 6, 0.25); }
        .badge-belleza { background: rgba(236, 72, 153, 0.12); color: var(--belleza-color); border: 1px solid rgba(236, 72, 153, 0.25); }
        .badge-arte { background: rgba(139, 92, 246, 0.12); color: var(--arte-color); border: 1px solid rgba(139, 92, 246, 0.25); }
        .badge-square { background: rgba(2, 132, 199, 0.12); color: var(--square-color); border: 1px solid rgba(2, 132, 199, 0.25); }
        .badge-karaoke { background: rgba(225, 29, 72, 0.12); color: var(--karaoke-color); border: 1px solid rgba(225, 29, 72, 0.25); }
        .badge-general { background: rgba(67, 97, 238, 0.12); color: var(--primary); border: 1px solid rgba(67, 97, 238, 0.25); }

        .action-btn {
            background: transparent;
            border: 1px solid var(--border-color);
            color: var(--text-main);
            border-radius: 6px;
            padding: 6px 10px;
            cursor: pointer;
            margin: 0 3px;
            transition: all 0.2s ease;
            font-size: 14px;
        }

        .action-btn:hover {
            background: #f1f5f9;
            transform: scale(1.08);
        }

        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: var(--text-muted);
            font-size: 15px;
        }

        /* Modal Styles */
        .modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(15, 23, 42, 0.6);
            backdrop-filter: blur(4px);
            display: none; align-items: center; justify-content: center; z-index: 1000;
        }
        .modal {
            background: var(--card-bg);
            border-radius: 12px;
            width: 100%; max-width: 500px; max-height: 90vh;
            overflow-y: auto; padding: 24px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
            border-top: 8px solid var(--primary);
        }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .modal-header h2 { font-size: 20px; font-weight: 700; color: #0f172a; }
        .close-btn { background: none; border: none; font-size: 24px; color: var(--text-muted); cursor: pointer; }
        
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; margin-bottom: 6px; font-size: 14px; font-weight: 600; color: #334155; }
        .form-group input, .form-group select {
            width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border-color);
            background: #f8fafc; color: var(--text-main); outline: none; font-size: 14px;
        }
        .form-group input:focus, .form-group select:focus {
            border-color: var(--primary);
            background: #ffffff;
            box-shadow: 0 0 0 3px var(--primary-glow);
        }
        
        .btn-save-modal {
            width: 100%; padding: 12px; background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
            color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px; margin-top: 12px;
        }
        .btn-save-modal:hover { opacity: 0.95; }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>
</head>
<body>
    <div class="container">
        
        <div class="header">
            <div class="header-title-group">
                <h1>Directorio de Juegos - Convención 2026</h1>
                <p>Monitoreo de inscripciones por torneo y estaciones de actividades</p>
            </div>
            <div class="header-actions">
                <button id="exportExcelBtn" class="btn-action btn-export" onclick="exportToExcel()">📥 Exportar a Excel</button>
                <a href="/registro-convencion" target="_blank" class="btn-action btn-new">➕ Nueva Inscripción</a>
            </div>
        </div>

        <!-- Metrics Cards -->
        <div class="metrics-grid">
            <div class="metric-card">
                <div class="metric-icon" style="background: rgba(67, 97, 238, 0.12); color: var(--primary);">🏆</div>
                <div class="metric-info">
                    <div class="metric-title">Total Inscritos</div>
                    <div class="metric-value">${personas.length}</div>
                    <div class="metric-cap">En todas las actividades</div>
                </div>
            </div>

            <div class="metric-card">
                <div class="metric-icon" style="background: rgba(114, 9, 183, 0.12); color: var(--voleibol-color);">🏐</div>
                <div class="metric-info">
                    <div class="metric-title">Vóleibol</div>
                    <div class="metric-value">${voleibolList.length} <span class="metric-cap">/ 24</span></div>
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width: ${Math.min(100, Math.round((voleibolList.length / 24) * 100))}%; background: var(--voleibol-color);"></div>
                    </div>
                </div>
            </div>

            <div class="metric-card">
                <div class="metric-icon" style="background: rgba(16, 185, 129, 0.12); color: var(--futbol-color);">⚽</div>
                <div class="metric-info">
                    <div class="metric-title">Fútbol</div>
                    <div class="metric-value">${futbolList.length} <span class="metric-cap">/ 25</span></div>
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width: ${Math.min(100, Math.round((futbolList.length / 25) * 100))}%; background: var(--futbol-color);"></div>
                    </div>
                </div>
            </div>

            <div class="metric-card">
                <div class="metric-icon" style="background: rgba(247, 37, 133, 0.12); color: var(--pingpong-color);">🏓</div>
                <div class="metric-info">
                    <div class="metric-title">Ping Pong</div>
                    <div class="metric-value">${pingPongList.length} <span class="metric-cap">/ 25</span></div>
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width: ${Math.min(100, Math.round((pingPongList.length / 25) * 100))}%; background: var(--pingpong-color);"></div>
                    </div>
                </div>
            </div>

            <div class="metric-card">
                <div class="metric-icon" style="background: rgba(58, 134, 255, 0.12); color: var(--videojuegos-color);">🎯</div>
                <div class="metric-info">
                    <div class="metric-title">Actividades Libres</div>
                    <div class="metric-value">${libresCount}</div>
                    <div class="metric-cap">Videojuegos, Arte, etc.</div>
                </div>
            </div>
        </div>

        <!-- Tabs Navigation -->
        <div class="tabs-header">
            <button class="tab-btn active" onclick="switchTab('todos', this)">
                <span>📋 Todos</span>
                <span class="tab-pill" id="pill-todos">${personas.length}</span>
            </button>
            <button class="tab-btn" onclick="switchTab('voleibol', this)">
                <span>🏐 Vóleibol</span>
                <span class="tab-pill" id="pill-voleibol">${voleibolList.length} / 24</span>
            </button>
            <button class="tab-btn" onclick="switchTab('futbol', this)">
                <span>⚽ Fútbol</span>
                <span class="tab-pill" id="pill-futbol">${futbolList.length} / 25</span>
            </button>
            <button class="tab-btn" onclick="switchTab('pingpong', this)">
                <span>🏓 Ping Pong</span>
                <span class="tab-pill" id="pill-pingpong">${pingPongList.length} / 25</span>
            </button>
            <button class="tab-btn" onclick="switchTab('videojuegos', this)">
                <span>🎮 Videojuegos</span>
                <span class="tab-pill" id="pill-videojuegos">${videojuegosList.length}</span>
            </button>
            <button class="tab-btn" onclick="switchTab('tiro-arco', this)">
                <span>🏹 Tiro al Arco</span>
                <span class="tab-pill" id="pill-tiro-arco">${tiroArcoList.length}</span>
            </button>
            <button class="tab-btn" onclick="switchTab('belleza', this)">
                <span>💅 Belleza</span>
                <span class="tab-pill" id="pill-belleza">${bellezaList.length}</span>
            </button>
            <button class="tab-btn" onclick="switchTab('arte', this)">
                <span>🎨 Arte</span>
                <span class="tab-pill" id="pill-arte">${arteList.length}</span>
            </button>
            <button class="tab-btn" onclick="switchTab('square', this)">
                <span>⬛ Square in the Air</span>
                <span class="tab-pill" id="pill-square">${squareAirList.length}</span>
            </button>
            <button class="tab-btn" onclick="switchTab('karaoke', this)">
                <span>🎤 Karaoke</span>
                <span class="tab-pill" id="pill-karaoke">${karaokeList.length}</span>
            </button>
        </div>

        <!-- Search Bar -->
        <div class="search-bar-wrap">
            <input type="text" id="searchInput" class="search-input" placeholder="Buscar por participante, acudiente, teléfono o actividad..." oninput="handleSearch()">
        </div>

        <!-- Table Container -->
        <div class="table-container">
            <div id="tab-pane-todos" class="tab-pane">
                <table id="table-todos">
                    <thead>
                        <tr>
                            <th style="width: 50px; text-align: center;">#</th>
                            <th>Participante</th>
                            <th style="text-align: center;">Edad</th>
                            <th>Actividad / Disciplina</th>
                            <th>Acudiente / Dependiente</th>
                            <th>Teléfono</th>
                            <th>Fecha Registro</th>
                            <th style="text-align: center;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="tbody-todos">
                        ${renderTableRows(personas)}
                    </tbody>
                </table>
                ${personas.length === 0 ? '<div class="empty-state">No hay participantes registrados en los juegos todavía.</div>' : ''}
            </div>

            <div id="tab-pane-voleibol" class="tab-pane" style="display: none;">
                <table id="table-voleibol">
                    <thead>
                        <tr>
                            <th style="width: 50px; text-align: center;">#</th>
                            <th>Participante</th>
                            <th style="text-align: center;">Edad</th>
                            <th>Disciplina</th>
                            <th>Acudiente / Dependiente</th>
                            <th>Teléfono</th>
                            <th>Fecha Registro</th>
                            <th style="text-align: center;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="tbody-voleibol">
                        ${renderTableRows(voleibolList)}
                    </tbody>
                </table>
                ${voleibolList.length === 0 ? '<div class="empty-state">No hay inscritos en Vóleibol todavía.</div>' : ''}
            </div>

            <div id="tab-pane-futbol" class="tab-pane" style="display: none;">
                <table id="table-futbol">
                    <thead>
                        <tr>
                            <th style="width: 50px; text-align: center;">#</th>
                            <th>Participante</th>
                            <th style="text-align: center;">Edad</th>
                            <th>Disciplina</th>
                            <th>Acudiente / Dependiente</th>
                            <th>Teléfono</th>
                            <th>Fecha Registro</th>
                            <th style="text-align: center;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="tbody-futbol">
                        ${renderTableRows(futbolList)}
                    </tbody>
                </table>
                ${futbolList.length === 0 ? '<div class="empty-state">No hay inscritos en Fútbol todavía.</div>' : ''}
            </div>

            <div id="tab-pane-pingpong" class="tab-pane" style="display: none;">
                <table id="table-pingpong">
                    <thead>
                        <tr>
                            <th style="width: 50px; text-align: center;">#</th>
                            <th>Participante</th>
                            <th style="text-align: center;">Edad</th>
                            <th>Disciplina</th>
                            <th>Acudiente / Dependiente</th>
                            <th>Teléfono</th>
                            <th>Fecha Registro</th>
                            <th style="text-align: center;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="tbody-pingpong">
                        ${renderTableRows(pingPongList)}
                    </tbody>
                </table>
                ${pingPongList.length === 0 ? '<div class="empty-state">No hay inscritos en Estación de Ping Pong todavía.</div>' : ''}
            </div>

            <div id="tab-pane-videojuegos" class="tab-pane" style="display: none;">
                <table id="table-videojuegos">
                    <thead>
                        <tr>
                            <th style="width: 50px; text-align: center;">#</th>
                            <th>Participante</th>
                            <th style="text-align: center;">Edad</th>
                            <th>Actividad</th>
                            <th>Acudiente / Dependiente</th>
                            <th>Teléfono</th>
                            <th>Fecha Registro</th>
                            <th style="text-align: center;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="tbody-videojuegos">
                        ${renderTableRows(videojuegosList)}
                    </tbody>
                </table>
                ${videojuegosList.length === 0 ? '<div class="empty-state">No hay inscritos en Videojuegos todavía.</div>' : ''}
            </div>

            <div id="tab-pane-tiro-arco" class="tab-pane" style="display: none;">
                <table id="table-tiro-arco">
                    <thead>
                        <tr>
                            <th style="width: 50px; text-align: center;">#</th>
                            <th>Participante</th>
                            <th style="text-align: center;">Edad</th>
                            <th>Actividad</th>
                            <th>Acudiente / Dependiente</th>
                            <th>Teléfono</th>
                            <th>Fecha Registro</th>
                            <th style="text-align: center;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="tbody-tiro-arco">
                        ${renderTableRows(tiroArcoList)}
                    </tbody>
                </table>
                ${tiroArcoList.length === 0 ? '<div class="empty-state">No hay inscritos en Tiro al Arco todavía.</div>' : ''}
            </div>

            <div id="tab-pane-belleza" class="tab-pane" style="display: none;">
                <table id="table-belleza">
                    <thead>
                        <tr>
                            <th style="width: 50px; text-align: center;">#</th>
                            <th>Participante</th>
                            <th style="text-align: center;">Edad</th>
                            <th>Actividad</th>
                            <th>Acudiente / Dependiente</th>
                            <th>Teléfono</th>
                            <th>Fecha Registro</th>
                            <th style="text-align: center;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="tbody-belleza">
                        ${renderTableRows(bellezaList)}
                    </tbody>
                </table>
                ${bellezaList.length === 0 ? '<div class="empty-state">No hay inscritos en Belleza todavía.</div>' : ''}
            </div>

            <div id="tab-pane-arte" class="tab-pane" style="display: none;">
                <table id="table-arte">
                    <thead>
                        <tr>
                            <th style="width: 50px; text-align: center;">#</th>
                            <th>Participante</th>
                            <th style="text-align: center;">Edad</th>
                            <th>Actividad</th>
                            <th>Acudiente / Dependiente</th>
                            <th>Teléfono</th>
                            <th>Fecha Registro</th>
                            <th style="text-align: center;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="tbody-arte">
                        ${renderTableRows(arteList)}
                    </tbody>
                </table>
                ${arteList.length === 0 ? '<div class="empty-state">No hay inscritos en Sesión de Arte todavía.</div>' : ''}
            </div>

            <div id="tab-pane-square" class="tab-pane" style="display: none;">
                <table id="table-square">
                    <thead>
                        <tr>
                            <th style="width: 50px; text-align: center;">#</th>
                            <th>Participante</th>
                            <th style="text-align: center;">Edad</th>
                            <th>Actividad</th>
                            <th>Acudiente / Dependiente</th>
                            <th>Teléfono</th>
                            <th>Fecha Registro</th>
                            <th style="text-align: center;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="tbody-square">
                        ${renderTableRows(squareAirList)}
                    </tbody>
                </table>
                ${squareAirList.length === 0 ? '<div class="empty-state">No hay inscritos en Square in the Air todavía.</div>' : ''}
            </div>

            <div id="tab-pane-karaoke" class="tab-pane" style="display: none;">
                <table id="table-karaoke">
                    <thead>
                        <tr>
                            <th style="width: 50px; text-align: center;">#</th>
                            <th>Participante</th>
                            <th style="text-align: center;">Edad</th>
                            <th>Actividad</th>
                            <th>Acudiente / Dependiente</th>
                            <th>Teléfono</th>
                            <th>Fecha Registro</th>
                            <th style="text-align: center;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="tbody-karaoke">
                        ${renderTableRows(karaokeList)}
                    </tbody>
                </table>
                ${karaokeList.length === 0 ? '<div class="empty-state">No hay inscritos en Karaoke todavía.</div>' : ''}
            </div>
        </div>
    </div>

    <!-- Edit Modal -->
    <div class="modal-overlay" id="editModal">
        <div class="modal">
            <div class="modal-header">
                <h2>Editar Participante</h2>
                <button class="close-btn" onclick="closeEditModal()">&times;</button>
            </div>
            <form id="editForm">
                <input type="hidden" id="editId">
                
                <div class="form-group">
                    <label>Nombre</label>
                    <input type="text" id="editNombre" required>
                </div>
                
                <div class="form-group">
                    <label>Apellido</label>
                    <input type="text" id="editApellido" required>
                </div>
                
                <div class="form-group">
                    <label>Edad</label>
                    <input type="number" min="1" max="99" id="editEdad" required>
                </div>
                
                <div class="form-group">
                    <label>Acudiente / Dependiente</label>
                    <input type="text" id="editAdultoResponsable" required>
                </div>
                
                <div class="form-group">
                    <label>Teléfono de Contacto</label>
                    <input type="tel" id="editTelefono" required>
                </div>
                
                <div class="form-group">
                    <label>🏆 Torneo con Cupo Limitado (Máximo 1)</label>
                    <select id="editTorneoLimitado">
                        <option value="">-- Ninguno (Solo actividades libres) --</option>
                        <option value="Vóleibol">🏐 Vóleibol (Cupo: 24)</option>
                        <option value="Fútbol">⚽ Fútbol (Cupo: 25)</option>
                        <option value="Estación de Ping Pong">🏓 Estación de Ping Pong (Cupo: 25)</option>
                    </select>
                </div>

                <div class="form-group">
                    <label style="margin-bottom: 8px;">🎯 Estaciones y Actividades Libres</label>
                    <div style="display: flex; flex-direction: column; gap: 8px; background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid var(--border-color);">
                        <label style="display: flex; align-items: center; gap: 8px; margin: 0; font-size: 13px; cursor: pointer;">
                            <input type="checkbox" id="edit_videojuegos" value="Videojuegos (Mario Kart y FIFA)">
                            <span>🎮 Videojuegos (Mario Kart y FIFA)</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 8px; margin: 0; font-size: 13px; cursor: pointer;">
                            <input type="checkbox" id="edit_tiroarco" value="Tiro al Arco o Flecha">
                            <span>🏹 Tiro al Arco o Flecha</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 8px; margin: 0; font-size: 13px; cursor: pointer;">
                            <input type="checkbox" id="edit_belleza" value="Belleza (Trenzas, Neón y Estrellas)">
                            <span>💅 Belleza (Trenzas, Neón y Estrellas)</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 8px; margin: 0; font-size: 13px; cursor: pointer;">
                            <input type="checkbox" id="edit_arte" value="Sesión de Arte">
                            <span>🎨 Sesión de Arte</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 8px; margin: 0; font-size: 13px; cursor: pointer;">
                            <input type="checkbox" id="edit_square" value="Square in the Air">
                            <span>⬛ Square in the Air</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 8px; margin: 0; font-size: 13px; cursor: pointer;">
                            <input type="checkbox" id="edit_karaoke" value="Karaoke">
                            <span>🎤 Karaoke</span>
                        </label>
                    </div>
                </div>
                
                <button type="submit" class="btn-save-modal">Guardar Cambios</button>
            </form>
        </div>
    </div>

    <script>
        const baseUrl = '${baseUrl}';
        const personasList = ${JSON.stringify(personas).replace(/</g, '\\u003c')};
        const modal = document.getElementById('editModal');
        const form = document.getElementById('editForm');
        let currentRecord = null;
        let activeTabName = 'todos';

        function normalizeClientText(str) {
            return (str || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        }

        function switchTab(tabName, btn) {
            activeTabName = tabName;
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            if (btn) btn.classList.add('active');

            document.querySelectorAll('.tab-pane').forEach(p => p.style.display = 'none');
            const targetPane = document.getElementById('tab-pane-' + tabName);
            if (targetPane) {
                targetPane.style.display = 'block';
            }

            handleSearch();
        }

        function handleSearch() {
            const query = normalizeClientText(document.getElementById('searchInput').value || '').trim();
            const currentPane = document.getElementById('tab-pane-' + activeTabName);
            if (!currentPane) return;

            const rows = currentPane.querySelectorAll('tbody tr');
            rows.forEach(r => {
                const searchData = r.getAttribute('data-search') || '';
                if (!query || searchData.includes(query)) {
                    r.style.display = '';
                } else {
                    r.style.display = 'none';
                }
            });
        }

        function openEditModal(id, dataStr) {
            currentRecord = JSON.parse(dataStr);
            document.getElementById('editId').value = id;
            document.getElementById('editNombre').value = currentRecord.nombre || '';
            document.getElementById('editApellido').value = (currentRecord.apellido && currentRecord.apellido !== '.') ? currentRecord.apellido : '';
            document.getElementById('editEdad').value = currentRecord.edad || '';
            document.getElementById('editAdultoResponsable').value = currentRecord.adultoResponsable || currentRecord.nombrePadres || '';
            document.getElementById('editTelefono').value = currentRecord.telefono || '';
            
            const currentJuego = normalizeClientText(currentRecord.grupo || currentRecord.ministerio || '');
            const selectTorneo = document.getElementById('editTorneoLimitado');
            
            if (currentJuego.includes('vol')) {
                selectTorneo.value = 'Vóleibol';
            } else if (currentJuego.includes('fut')) {
                selectTorneo.value = 'Fútbol';
            } else if (currentJuego.includes('ping') || currentJuego.includes('pong')) {
                selectTorneo.value = 'Estación de Ping Pong';
            } else {
                selectTorneo.value = '';
            }

            document.getElementById('edit_videojuegos').checked = currentJuego.includes('video') || currentJuego.includes('mario') || currentJuego.includes('fifa');
            document.getElementById('edit_tiroarco').checked = currentJuego.includes('tiro') || currentJuego.includes('arco') || currentJuego.includes('flecha');
            document.getElementById('edit_belleza').checked = currentJuego.includes('belleza') || currentJuego.includes('trenza') || currentJuego.includes('neon');
            document.getElementById('edit_arte').checked = currentJuego.includes('arte');
            document.getElementById('edit_square').checked = currentJuego.includes('square');
            document.getElementById('edit_karaoke').checked = currentJuego.includes('karaoke');

            modal.style.display = 'flex';
        }

        function closeEditModal() {
            modal.style.display = 'none';
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const limitedVal = document.getElementById('editTorneoLimitado').value;
            const activities = [];
            if (limitedVal) activities.push(limitedVal);

            const freeIds = ['edit_videojuegos', 'edit_tiroarco', 'edit_belleza', 'edit_arte', 'edit_square', 'edit_karaoke'];
            freeIds.forEach(fid => {
                const el = document.getElementById(fid);
                if (el && el.checked) {
                    activities.push(el.value);
                }
            });

            if (activities.length === 0) {
                alert('Por favor selecciona al menos una disciplina o actividad.');
                return;
            }

            const juegoSelected = activities.join(', ');
            const payload = {
                ...currentRecord,
                nombre: document.getElementById('editNombre').value.trim(),
                apellido: document.getElementById('editApellido').value.trim() || '.',
                edad: parseInt(document.getElementById('editEdad').value) || undefined,
                adultoResponsable: document.getElementById('editAdultoResponsable').value.trim(),
                nombrePadres: document.getElementById('editAdultoResponsable').value.trim(),
                telefono: document.getElementById('editTelefono').value.trim(),
                grupo: juegoSelected,
                ministerio: juegoSelected,
                departamento: 'Convencion'
            };

            try {
                const response = await fetch(baseUrl + '/api/registro-detallado/publico/' + payload._id, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (response.ok) {
                    location.reload();
                } else {
                    alert('Error al actualizar el registro');
                }
            } catch (err) {
                console.error(err);
                alert('Error de conexión al servidor');
            }
        });

        async function deleteRecord(id) {
            if (confirm('¿Está seguro de que desea eliminar la inscripción de este participante?')) {
                try {
                    const response = await fetch(baseUrl + '/api/registro-detallado/publico/' + id, {
                        method: 'DELETE'
                    });
                    if (response.ok) {
                        location.reload();
                    } else {
                        alert('Error al eliminar el registro');
                    }
                } catch (err) {
                    console.error(err);
                    alert('Error de conexión al servidor');
                }
            }
        }

        function exportToExcel() {
            if (!personasList || personasList.length === 0) {
                alert('No hay participantes registrados para exportar');
                return;
            }

            const mapRow = (p, idx) => ({
                'N°': idx + 1,
                'Nombre': p.nombre || '',
                'Apellido': (p.apellido && p.apellido !== '.') ? p.apellido : '',
                'Edad': p.edad || '',
                'Actividad / Disciplina': p.grupo || p.ministerio || '',
                'Acudiente / Dependiente': p.adultoResponsable || p.nombrePadres || '',
                'Teléfono': p.telefono || '',
                'Fecha Registro': p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ''
            });

            const workbook = XLSX.utils.book_new();

            // Hoja 1: Todos
            const wsTodos = XLSX.utils.json_to_sheet(personasList.map(mapRow));
            XLSX.utils.book_append_sheet(workbook, wsTodos, 'Todos');

            // Hojas por actividad con normalización
            const isMatch = (p, term) => normalizeClientText((p.grupo || '') + ' ' + (p.ministerio || '')).includes(term);

            const sheetsConfig = [
                { name: 'Voleibol (24)', filter: (p) => isMatch(p, 'vol') },
                { name: 'Futbol (25)', filter: (p) => isMatch(p, 'fut') },
                { name: 'Ping Pong (25)', filter: (p) => isMatch(p, 'ping') },
                { name: 'Videojuegos', filter: (p) => isMatch(p, 'video') || isMatch(p, 'mario') || isMatch(p, 'fifa') },
                { name: 'Tiro al Arco', filter: (p) => isMatch(p, 'tiro') || isMatch(p, 'arco') || isMatch(p, 'flecha') },
                { name: 'Belleza', filter: (p) => isMatch(p, 'belleza') || isMatch(p, 'trenza') || isMatch(p, 'neon') },
                { name: 'Sesion de Arte', filter: (p) => isMatch(p, 'arte') },
                { name: 'Square in the Air', filter: (p) => isMatch(p, 'square') },
                { name: 'Karaoke', filter: (p) => isMatch(p, 'karaoke') }
            ];

            sheetsConfig.forEach(cfg => {
                const filteredRows = personasList.filter(cfg.filter).map(mapRow);
                if (filteredRows.length > 0) {
                    const ws = XLSX.utils.json_to_sheet(filteredRows);
                    XLSX.utils.book_append_sheet(workbook, ws, cfg.name.substring(0, 31));
                }
            });

            // Descargar archivo Excel
            XLSX.writeFile(workbook, 'Inscritos_Juegos_Convencion_2026.xlsx');
        }
    </script>
</body>
</html>`;
};

