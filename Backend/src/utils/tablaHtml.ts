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
            comprobanteBtn = `<a href="${p.comprobantePago}" target="_blank" class="btn-link">Ver Comprobante</a>`;
        }
        
        const pJson = JSON.stringify(p).replace(/'/g, "&apos;").replace(/"/g, "&quot;");
        
        return `
            <tr>
                <td><strong>${p.nombre} ${p.apellido}</strong></td>
                <td>${p.telefono || '-'}</td>
                <td>
                    <span class="badge">${p.ministerio || '-'}</span>
                </td>
                <td>
                    ${p.asistenciaFamilia === 'Solo' ? 'Solo(a)' : 'Con Familia'} 
                    ${p.miembrosFamilia > 0 ? `(+${p.miembrosFamilia})` : ''}
                </td>
                <td>${p.metodoPago || '-'}</td>
                <td style="text-align: center; vertical-align: middle;">
                    ${comprobanteBtn}
                </td>
                <td style="text-align: center; vertical-align: middle;">
                    <button class="action-btn edit-btn" onclick="openEditModal('${p._id}', '${pJson}')">✏️</button>
                    <button class="action-btn delete-btn" onclick="deleteRecord('${p._id}')">🗑️</button>
                </td>
            </tr>
        `;
    }).join('');

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lista de Registros - Campamento</title>
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

        .action-btn {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border-color);
            color: white;
            border-radius: 8px;
            padding: 6px 10px;
            cursor: pointer;
            margin: 0 4px;
            transition: all 0.2s;
        }

        .action-btn:hover { background: rgba(255, 255, 255, 0.1); }
        .delete-btn:hover { background: rgba(255, 0, 0, 0.2); border-color: rgba(255, 0, 0, 0.4); }

        /* Modal Styles */
        .modal-overlay {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
            display: none; justify-content: center; align-items: center;
            z-index: 1000;
        }
        .modal {
            background: var(--card-bg); border: 1px solid var(--border-color);
            border-radius: 20px; padding: 30px; width: 90%; max-width: 500px;
            max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        }
        .modal h2 { margin-bottom: 20px; font-size: 24px; }
        .form-group { margin-bottom: 15px; text-align: left; }
        .form-group label { display: block; margin-bottom: 5px; font-size: 13px; color: var(--text-muted); }
        .form-group input, .form-group select {
            width: 100%; padding: 10px 15px; border-radius: 10px;
            background: rgba(255,255,255,0.05); border: 1px solid var(--border-color);
            color: white; outline: none;
        }
        .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 25px; }
        .btn { padding: 10px 20px; border-radius: 10px; cursor: pointer; border: none; font-weight: 600; }
        .btn-cancel { background: transparent; border: 1px solid var(--border-color); color: white; }
        .btn-save { background: var(--primary); color: white; }

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
            <h1>Directorio del Campamento</h1>
        </div>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Nombres y Apellidos</th>
                        <th>Teléfono</th>
                        <th>Ministerio</th>
                        <th>Asistencia y Familia</th>
                        <th>Método Pago</th>
                        <th style="text-align: center;">Comprobante</th>
                        <th style="text-align: center;">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
            </table>
            ${personas.length === 0 ? '<div class="empty-state">No hay personas registradas en el sistema todavía.</div>' : ''}
        </div>
    </div>

    <!-- Edit Modal -->
    <div class="modal-overlay" id="editModalOverlay">
        <div class="modal">
            <h2>Editar Registro</h2>
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
                    <label>Teléfono</label>
                    <input type="text" id="editTelefono" required>
                </div>
                <div class="form-group">
                    <label>Ministerio</label>
                    <select id="editMinisterio">
                        <option value="Ministerio de Logística">Ministerio de Logística</option>
                        <option value="Ministerio de Media">Ministerio de Media</option>
                        <option value="Ministerio de Exploradores">Ministerio de Exploradores</option>
                        <option value="Otro">Otro Ministerio</option>
                        <option value="Ninguno">Ninguno</option>
                    </select>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-cancel" onclick="closeModal()">Cancelar</button>
                    <button type="submit" class="btn btn-save">Guardar Cambios</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        function openEditModal(id, dataStr) {
            const data = JSON.parse(dataStr);
            document.getElementById('editId').value = id;
            document.getElementById('editNombre').value = data.nombre || '';
            document.getElementById('editApellido').value = data.apellido || '';
            document.getElementById('editTelefono').value = data.telefono || '';
            document.getElementById('editMinisterio').value = data.ministerio || 'Ninguno';
            document.getElementById('editModalOverlay').style.display = 'flex';
        }

        function closeModal() {
            document.getElementById('editModalOverlay').style.display = 'none';
        }

        async function deleteRecord(id) {
            if(confirm('¿Seguro que deseas eliminar este registro? Esta acción no se puede deshacer.')) {
                try {
                    const response = await fetch('/api/registro-detallado/publico/' + id, { method: 'DELETE' });
                    if(response.ok) {
                        alert('Eliminado exitosamente');
                        location.reload();
                    } else {
                        alert('Error al eliminar');
                    }
                } catch(e) {
                    alert('Error de conexión');
                }
            }
        }

        document.getElementById('editForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('editId').value;
            const payload = {
                nombre: document.getElementById('editNombre').value,
                apellido: document.getElementById('editApellido').value,
                telefono: document.getElementById('editTelefono').value,
                ministerio: document.getElementById('editMinisterio').value
            };
            try {
                const response = await fetch('/api/registro-detallado/publico/' + id, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if(response.ok) {
                    alert('Actualizado exitosamente');
                    location.reload();
                } else {
                    alert('Error al actualizar');
                }
            } catch(e) {
                alert('Error de conexión');
            }
        });
    </script>
</body>
</html>`;
};
