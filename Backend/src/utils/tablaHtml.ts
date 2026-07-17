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

export const getCampamentoTableHtml = (personas: any[], baseUrl: string) => {
    const rowsHtml = personas.map(p => {
        let comprobanteBtn = '-';
        if (p.comprobantePago) {
            comprobanteBtn = '<a href="' + p.comprobantePago + '" target="_blank" class="btn-link">Ver Comprobante</a>';
        }
        
        const pJson = JSON.stringify(p).replace(/'/g, "&apos;").replace(/"/g, "&quot;");
        
        let montoTxt = '';
        if (p.montoPago) {
            montoTxt = '<br><small style="color:var(--success)">$' + p.montoPago + '</small>';
        }
        
        return '<tr>' +
            '<td><strong>' + p.nombre + ' ' + (p.apellido !== '.' ? p.apellido : '') + '</strong></td>' +
            '<td>' + (p.sexo || '-') + '</td>' +
            '<td><span class="badge">' + (p.ministerio || '-') + '</span></td>' +
            '<td>' + (p.necesitaTransporte || '-') + '</td>' +
            
            '<td>' + (p.metodoPago || '-') + montoTxt + '</td>' +
            '<td style="text-align: center; vertical-align: middle;">' + comprobanteBtn + '</td>' +
            '<td style="text-align: center; vertical-align: middle;">' +
                '<button class="action-btn edit-btn" onclick="openEditModal(\'' + p._id + '\', \'' + pJson + '\')">✏️</button>' +
                '<button class="action-btn delete-btn" onclick="deleteRecord(\'' + p._id + '\')">🗑️</button>' +
            '</td>' +
        '</tr>';
    }).join('');

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Directorio - Campamento de Servidores 2026</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #FF8C00; 
            --bg-color: #F0EBEC; 
            --card-bg: #FFFFFF;
            --text-main: #202124;
            --text-muted: #5f6368;
            --border-color: #dadce0;
            --success: #1a73e8; 
            --error: #d93025;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Roboto', sans-serif;
            -webkit-tap-highlight-color: transparent;
        }

        body {
            background-color: var(--bg-color);
            color: var(--text-main);
            min-height: 100vh;
            padding: 24px 12px;
        }

        .container {
            width: 100%;
            max-width: 1200px;
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

        .export-btn {
            background-color: #1e7e34;
            color: white;
            border: none;
            padding: 10px 18px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.08);
            transition: all 0.2s ease;
        }
        .export-btn:hover {
            background-color: #155d27;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.12);
        }
        .export-btn:active {
            transform: translateY(0);
            box-shadow: 0 1px 2px rgba(0,0,0,0.08);
        }

        h1 {
            font-size: 28px;
            font-weight: 500;
            color: var(--text-main);
        }

        .table-container {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-top: 8px solid var(--primary);
            border-radius: 8px;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
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
            padding: 16px;
            text-align: left;
            border-bottom: 1px solid var(--border-color);
            font-size: 14px;
        }

        th {
            color: var(--text-muted);
            font-weight: 500;
        }

        tr:last-child td { border-bottom: none; }
        tr:hover td { background: rgba(0,0,0,0.02); }

        .badge {
            display: inline-block;
            padding: 4px 10px;
            background: rgba(255, 140, 0, 0.1);
            border: 1px solid rgba(255, 140, 0, 0.3);
            color: var(--primary);
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
        }

        .btn-link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 6px 12px;
            background-color: var(--success);
            border: none;
            border-radius: 4px;
            color: white;
            font-size: 12px;
            font-weight: 500;
            text-decoration: none;
            cursor: pointer;
            transition: opacity 0.2s;
        }
        .btn-link:hover { opacity: 0.9; }
        
        .empty-state {
            text-align: center;
            padding: 40px 20px;
            color: var(--text-muted);
            font-size: 14px;
        }

        .action-btn {
            background: transparent;
            border: 1px solid var(--border-color);
            color: var(--text-main);
            border-radius: 4px;
            padding: 6px;
            cursor: pointer;
            margin: 0 4px;
            transition: all 0.2s;
        }

        .action-btn:hover { background: rgba(0,0,0,0.05); }

        /* Modal Styles */
        .modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: none; align-items: center; justify-content: center; z-index: 1000;
        }
        .modal {
            background: var(--card-bg);
            border-radius: 8px;
            width: 100%; max-width: 500px; max-height: 90vh;
            overflow-y: auto; padding: 24px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            border-top: 8px solid var(--primary);
        }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .modal-header h2 { font-size: 20px; font-weight: 500; }
        .close-btn { background: none; border: none; font-size: 24px; color: var(--text-muted); cursor: pointer; }
        
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; margin-bottom: 6px; font-size: 14px; font-weight: 500; color: var(--text-muted); }
        .form-group input, .form-group select {
            width: 100%; padding: 10px; border-radius: 4px; border: 1px solid var(--border-color);
            background: transparent; color: var(--text-main); outline: none; font-size: 14px;
        }
        
        .btn-submit {
            width: 100%; padding: 12px; background: var(--success); color: white; border: none; border-radius: 4px;
            font-weight: 500; cursor: pointer; font-size: 14px; margin-top: 10px;
        }

        /* Checkboxes */
        .checkbox-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
        }
        .checkbox-option {
            display: flex;
            align-items: center;
            font-size: 13px;
        }
        .checkbox-option input {
            margin-right: 6px;
        }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Directorio Campamento de Servidores 2026</h1>
            <button id="exportExcelBtn" class="export-btn" onclick="exportToExcel()">📥 Exportar a Excel</button>
        </div>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Nombre Completo</th>
                        <th>Sexo</th>
                        <th>Ministerios</th>
                        <th>Transporte</th>
                        
                        <th>Pago</th>
                        <th style="text-align: center;">Comprobante</th>
                        <th style="text-align: center;">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
            </table>
            ${personas.length === 0 ? '<div class="empty-state">No hay registros en el sistema todavía.</div>' : ''}
        </div>
    </div>

    <!-- Edit Modal -->
    <div class="modal-overlay" id="editModal">
        <div class="modal">
            <div class="modal-header">
                <h2>Editar Registro</h2>
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
                    <label>Sexo</label>
                    <select id="editSexo" required>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Ministerios</label>
                    <div class="checkbox-grid">
                        <label class="checkbox-option"><input type="checkbox" name="editMin" value="Media"> Media</label>
                        <label class="checkbox-option"><input type="checkbox" name="editMin" value="Cafetería"> Cafetería</label>
                        <label class="checkbox-option"><input type="checkbox" name="editMin" value="Protocolo"> Protocolo</label>
                        <label class="checkbox-option"><input type="checkbox" name="editMin" value="Logística"> Logística</label>
                        <label class="checkbox-option"><input type="checkbox" name="editMin" value="Seguridad"> Seguridad</label>
                        <label class="checkbox-option"><input type="checkbox" name="editMin" value="Música"> Música</label>
                        <label class="checkbox-option"><input type="checkbox" name="editMin" value="Casa de Luz"> Casa de Luz</label>
                        <label class="checkbox-option"><input type="checkbox" name="editMin" value="Jef (Jef Ten, Jef, Jef Plus +)"> Jef</label>
                        <label class="checkbox-option"><input type="checkbox" name="editMin" value="Génesis"> Génesis</label>
                        <label class="checkbox-option"><input type="checkbox" name="editMin" value="Evangelio Cambio"> Evangelio C.</label>
                        <label class="checkbox-option"><input type="checkbox" name="editMin" value="Otros"> Otros</label>
                    </div>
                </div>
                <div class="form-group">
                    <label>Necesita Transporte</label>
                    <select id="editTransporte" required>
                        <option value="Sí">Sí</option>
                        <option value="No">No</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Método de Pago</label>
                    <select id="editMetodoPago" required>
                        <option value="Yappy">Yappy</option>
                        <option value="Transferencia">Transferencia</option>
                        <option value="Efectivo">Efectivo</option>
                        <option value="Otro">Otro</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Monto Pagado ($)</label>
                    <input type="number" step="0.01" min="0" id="editMontoPago" required>
                </div>
                <button type="submit" class="btn-submit">Guardar Cambios</button>
            </form>
        </div>
    </div>

    <script>
        const baseUrl = '${baseUrl}';
        const personasList = ${JSON.stringify(personas).replace(/</g, '\\u003c')};
        const modal = document.getElementById('editModal');
        const form = document.getElementById('editForm');
        
        let currentRecord = null;

        function openEditModal(id, dataStr) {
            currentRecord = JSON.parse(dataStr);
            document.getElementById('editId').value = id;
            document.getElementById('editNombre').value = currentRecord.nombre || '';
            document.getElementById('editApellido').value = currentRecord.apellido || '';
            document.getElementById('editSexo').value = currentRecord.sexo || 'Masculino';
            document.getElementById('editTransporte').value = currentRecord.necesitaTransporte || 'No';
            
            document.getElementById('editMetodoPago').value = currentRecord.metodoPago || 'Yappy';
            document.getElementById('editMontoPago').value = currentRecord.montoPago || 0;
            
            const ministerios = (currentRecord.ministerio || '').split(',').map(s => s.trim());
            document.querySelectorAll('input[name="editMin"]').forEach(cb => {
                if (ministerios.includes(cb.value)) {
                    cb.checked = true;
                } else {
                    cb.checked = false;
                }
            });

            modal.style.display = 'flex';
        }

        function closeEditModal() {
            modal.style.display = 'none';
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const checkedMin = Array.from(document.querySelectorAll('input[name="editMin"]:checked')).map(cb => cb.value);

            const payload = {
                ...currentRecord,
                nombre: document.getElementById('editNombre').value,
                apellido: document.getElementById('editApellido').value,
                sexo: document.getElementById('editSexo').value,
                ministerio: checkedMin.join(', '),
                necesitaTransporte: document.getElementById('editTransporte').value,
                
                metodoPago: document.getElementById('editMetodoPago').value,
                montoPago: parseFloat(document.getElementById('editMontoPago').value) || 0
            };

            try {
                const response = await fetch(baseUrl + '/api/registro-detallado/publico/' + payload._id, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if(response.ok) {
                    location.reload();
                } else {
                    alert('Error al actualizar');
                }
            } catch(e) {
                alert('Error de red');
            }
        });

        async function deleteRecord(id) {
            if(confirm('¿Está seguro que desea eliminar este registro?')) {
                try {
                    const response = await fetch(baseUrl + '/api/registro-detallado/publico/' + id, {
                        method: 'DELETE'
                    });
                    if(response.ok) {
                        location.reload();
                    } else {
                        alert('Error al eliminar');
                    }
                } catch(e) {
                    alert('Error de red');
                }
            }
        }

        function exportToExcel() {
            if (!personasList || personasList.length === 0) {
                alert('No hay datos para exportar');
                return;
            }

            // Map standard and extra database fields to clean headers
            const exportData = personasList.map(p => ({
                'Nombre': p.nombre || '',
                'Apellido': (p.apellido && p.apellido !== '.') ? p.apellido : '',
                'Sexo': p.sexo || '',
                'Ministerios': p.ministerio || '',
                'Transporte': p.necesitaTransporte || '',
                'Método de Pago': p.metodoPago || '',
                'Monto Pago ($)': p.montoPago || 0,
                'Comprobante': p.comprobantePago || '',
                'Teléfono': p.telefono || '',
                'Fecha Registro': p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ''
            }));

            // Create worksheet from data
            const worksheet = XLSX.utils.json_to_sheet(exportData);
            
            // Auto-fit column widths
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

            // Create workbook and append worksheet
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Servidores');

            // Download file
            XLSX.writeFile(workbook, 'Directorio_Campamento_Servidores_2026.xlsx');
        }
    </script>
</body>
</html>`;
};
