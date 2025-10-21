import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import ConteoPersonas from '../models/ConteoPersonas';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear } from 'date-fns';

// Función para obtener rango de fechas según período
const obtenerRangoFechas = (periodo: string): { inicio: Date; fin: Date } => {
    const ahora = new Date();
    let inicio: Date;
    let fin: Date;

    switch (periodo) {
        case 'semana':
            inicio = startOfWeek(ahora, { weekStartsOn: 0 });
            fin = endOfWeek(ahora, { weekStartsOn: 0 });
            break;
        case 'mes':
            inicio = startOfMonth(ahora);
            fin = endOfMonth(ahora);
            break;
        case '6meses':
            inicio = startOfMonth(subMonths(ahora, 6));
            fin = endOfMonth(ahora);
            break;
        case 'año':
            inicio = startOfYear(ahora);
            fin = endOfYear(ahora);
            break;
        default:
            inicio = startOfMonth(ahora);
            fin = endOfMonth(ahora);
    }

    return { inicio, fin };
};

// Generar PDF
export const generarReportePDF = async (req: AuthRequest, res: Response) => {
    try {
        const { periodo, iglesia, tipo } = req.query; // Agrega iglesia y tipo
        const { inicio, fin } = obtenerRangoFechas(periodo as string || 'mes');

        const query: any = { fecha: { $gte: inicio, $lte: fin } };
        if (iglesia) query.iglesia = iglesia;
        if (tipo) query.tipo = tipo;

        const conteos = await ConteoPersonas.find(query)
            .populate('usuario', 'nombre');

        // Calcular estadísticas por iglesia y tipo
        const totalRegistros = conteos.length;
        const totalPersonas = conteos.reduce((sum, c) => sum + c.cantidad, 0);
        const promedioPersonas = totalRegistros > 0 ? (totalPersonas / totalRegistros).toFixed(2) : 0;

        const registrosPorArea: { [key: string]: { cantidad: number; totalPersonas: number } } = {};
        const registrosPorIglesia: { [key: string]: { cantidad: number; totalPersonas: number } } = {};
        conteos.forEach(conteo => {
            // Por área
            if (!registrosPorArea[conteo.area]) {
                registrosPorArea[conteo.area] = { cantidad: 0, totalPersonas: 0 };
            }
            registrosPorArea[conteo.area].cantidad++;
            registrosPorArea[conteo.area].totalPersonas += conteo.cantidad;

            // Por iglesia
            if (!registrosPorIglesia[conteo.iglesia]) {
                registrosPorIglesia[conteo.iglesia] = { cantidad: 0, totalPersonas: 0 };
            }
            registrosPorIglesia[conteo.iglesia].cantidad++;
            registrosPorIglesia[conteo.iglesia].totalPersonas += conteo.cantidad;
        });

        // Crear PDF
        const doc = new PDFDocument({ margin: 50 });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=reporte-${periodo}-${Date.now()}.pdf`);

        doc.pipe(res);

        // Encabezado
        doc.fontSize(24).fillColor('#3880ff').text('Reporte de Logística', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).fillColor('#666').text(`Período: ${inicio.toLocaleDateString()} - ${fin.toLocaleDateString()}`, { align: 'center' });
        if (iglesia) doc.text(`Iglesia: ${iglesia}`, { align: 'center' });
        if (tipo) doc.text(`Tipo: ${tipo}`, { align: 'center' });
        doc.moveDown(2);

        // Estadísticas generales
        doc.fontSize(16).fillColor('#000').text('Resumen General', { underline: true });
        doc.moveDown();
        doc.fontSize(12).fillColor('#333');
        doc.text(`Total de Registros: ${totalRegistros}`);
        doc.text(`Total de Personas/Materiales: ${totalPersonas}`);
        doc.text(`Promedio por Registro: ${promedioPersonas}`);
        doc.moveDown(2);

        // Registros por Iglesia
        doc.fontSize(16).fillColor('#000').text('Registros por Iglesia', { underline: true });
        doc.moveDown();
        doc.fontSize(12).fillColor('#333');
        Object.entries(registrosPorIglesia).forEach(([iglesiaKey, data]) => {
            doc.text(`${iglesiaKey}:`);
            doc.text(`  - Registros: ${data.cantidad}`, { indent: 20 });
            doc.text(`  - Total: ${data.totalPersonas}`, { indent: 20 });
            doc.moveDown(0.5);
        });
        doc.moveDown(2);

        // Registros por Área
        doc.fontSize(16).fillColor('#000').text('Registros por Área', { underline: true });
        doc.moveDown();
        doc.fontSize(12).fillColor('#333');
        Object.entries(registrosPorArea).forEach(([area, data]) => {
            doc.text(`${area}:`);
            doc.text(`  - Registros: ${data.cantidad}`, { indent: 20 });
            doc.text(`  - Total: ${data.totalPersonas}`, { indent: 20 });
            doc.moveDown(0.5);
        });
        doc.moveDown(2);

        // Tabla de registros detallados
        doc.fontSize(16).fillColor('#000').text('Detalle de Registros', { underline: true });
        doc.moveDown();

        // Encabezados de tabla
        const startY = doc.y;
        doc.fontSize(10).fillColor('#fff');
        doc.rect(50, startY, 500, 20).fill('#3880ff');
        doc.text('Fecha', 60, startY + 5, { width: 60 });
        doc.text('Iglesia', 120, startY + 5, { width: 80 }); // Nueva columna
        doc.text('Tipo', 200, startY + 5, { width: 50 }); // Nueva columna
        doc.text('Área', 250, startY + 5, { width: 100 });
        doc.text('Sub-Área', 350, startY + 5, { width: 100 }); // Nueva columna
        doc.text('Cantidad', 450, startY + 5, { width: 60 });

        // Filas de datos
        let y = startY + 25;
        doc.fillColor('#333');

        conteos.slice(0, 20).forEach((conteo, index) => {
            if (y > 700) {
                doc.addPage();
                y = 50;
            }

            const bgColor = index % 2 === 0 ? '#f5f5f5' : '#fff';
            doc.rect(50, y - 5, 500, 20).fill(bgColor);
            doc.fillColor('#333');
            doc.fontSize(9);
            doc.text(new Date(conteo.fecha).toLocaleDateString(), 60, y, { width: 60 });
            doc.text(conteo.iglesia, 120, y, { width: 80 });
            doc.text(conteo.tipo, 200, y, { width: 50 });
            doc.text(conteo.area, 250, y, { width: 100 });
            doc.text(conteo.subArea || '', 350, y, { width: 100 });
            doc.text(conteo.cantidad.toString(), 450, y, { width: 60 });

            y += 20;
        });

        if (conteos.length > 20) {
            doc.fontSize(10).fillColor('#666').text(`... y ${conteos.length - 20} registros más`, { align: 'center' });
        }

        // Pie de página
        doc.fontSize(8).fillColor('#999').text(
            `Generado el ${new Date().toLocaleString()}`,
            50,
            doc.page.height - 50,
            { align: 'center' }
        );

        doc.end();
    } catch (error: any) {
        console.error('❌ Error al generar PDF:', error);
        res.status(500).json({ success: false, message: 'Error al generar PDF', error: error.message });
    }
};

// Generar Excel
export const generarReporteExcel = async (req: AuthRequest, res: Response) => {
    try {
        const { periodo, iglesia, tipo } = req.query; // Agrega iglesia y tipo
        const { inicio, fin } = obtenerRangoFechas(periodo as string || 'mes');

        const query: any = { fecha: { $gte: inicio, $lte: fin } };
        if (iglesia) query.iglesia = iglesia;
        if (tipo) query.tipo = tipo;

        const conteos = await ConteoPersonas.find(query)
            .populate('usuario', 'nombre');

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Reporte de Logística');

        // Estilos
        const headerStyle = {
            font: { bold: true, color: { argb: 'FFFFFFFF' } },
            fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF3880FF' } } as ExcelJS.Fill,
            alignment: { vertical: 'middle', horizontal: 'center' } as ExcelJS.Alignment
        };

        // Título
        worksheet.mergeCells('A1:G1'); // Ajusta para más columnas
        worksheet.getCell('A1').value = 'Reporte de Logística';
        worksheet.getCell('A1').font = { size: 18, bold: true };
        worksheet.getCell('A1').alignment = { horizontal: 'center' };

        // Período
        worksheet.mergeCells('A2:G2');
        worksheet.getCell('A2').value = `Período: ${inicio.toLocaleDateString()} - ${fin.toLocaleDateString()}`;
        worksheet.getCell('A2').alignment = { horizontal: 'center' };

        // Estadísticas
        const totalRegistros = conteos.length;
        const totalPersonas = conteos.reduce((sum, c) => sum + c.cantidad, 0);

        worksheet.addRow([]);
        worksheet.addRow(['Total de Registros:', totalRegistros]);
        worksheet.addRow(['Total de Personas/Materiales:', totalPersonas]);
        worksheet.addRow(['Promedio por Registro:', (totalPersonas / totalRegistros).toFixed(2)]);

        // Encabezados de tabla
        worksheet.addRow([]);
        const headerRow = worksheet.addRow(['Fecha', 'Iglesia', 'Tipo', 'Área', 'Sub-Área', 'Cantidad', 'Usuario']); // Agrega iglesia, tipo, subArea
        headerRow.eachCell((cell) => {
            cell.style = headerStyle;
        });

        // Datos
        conteos.forEach(conteo => {
            worksheet.addRow([
                new Date(conteo.fecha).toLocaleDateString(),
                conteo.iglesia, // Nueva columna
                conteo.tipo, // Nueva columna
                conteo.area,
                conteo.subArea || '', // Nueva columna
                conteo.cantidad,
                (conteo.usuario as any)?.nombre || 'N/A'
            ]);
        });

        // Ajustar anchos de columna
        worksheet.columns = [
            { width: 15 }, // Fecha
            { width: 15 }, // Iglesia
            { width: 10 }, // Tipo
            { width: 20 }, // Área
            { width: 20 }, // Sub-Área
            { width: 12 }, // Cantidad
            { width: 20 }  // Usuario
        ];

        // Enviar archivo
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=reporte-${periodo}-${Date.now()}.xlsx`);

        await workbook.xlsx.write(res);
        res.end();
    } catch (error: any) {
        console.error('❌ Error al generar Excel:', error);
        res.status(500).json({ success: false, message: 'Error al generar Excel', error: error.message });
    }
};

// Generar PNG (gráfico)
export const generarReportePNG = async (req: AuthRequest, res: Response) => {
    try {
        const { periodo, iglesia, tipo } = req.query; // Agrega iglesia y tipo
        const { inicio, fin } = obtenerRangoFechas(periodo as string || 'mes');

        const query: any = { fecha: { $gte: inicio, $lte: fin } };
        if (iglesia) query.iglesia = iglesia;
        if (tipo) query.tipo = tipo;

        const conteos = await ConteoPersonas.find(query);

        // Agrupar por iglesia y área
        const registrosPorIglesiaArea: { [key: string]: number } = {};
        conteos.forEach(conteo => {
            const key = `${conteo.iglesia} - ${conteo.area}`;
            registrosPorIglesiaArea[key] = (registrosPorIglesiaArea[key] || 0) + conteo.cantidad;
        });

        const labels = Object.keys(registrosPorIglesiaArea);
        const cantidades = Object.values(registrosPorIglesiaArea);

        // Crear gráfico
        const width = 800;
        const height = 600;
        const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

        const configuration = {
            type: 'bar' as const,
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total por Iglesia y Área',
                    data: cantidades,
                    backgroundColor: [
                        'rgba(56, 128, 255, 0.8)',
                        'rgba(76, 217, 100, 0.8)',
                        'rgba(255, 204, 0, 0.8)',
                        'rgba(255, 59, 48, 0.8)',
                        'rgba(88, 86, 214, 0.8)',
                        'rgba(255, 149, 0, 0.8)',
                        'rgba(175, 82, 222, 0.8)'
                    ],
                    borderColor: [
                        'rgba(56, 128, 255, 1)',
                        'rgba(76, 217, 100, 1)',
                        'rgba(255, 204, 0, 1)',
                        'rgba(255, 59, 48, 1)',
                        'rgba(88, 86, 214, 1)',
                        'rgba(255, 149, 0, 1)',
                        'rgba(175, 82, 222, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: `Reporte de Logística - ${periodo}`,
                        font: { size: 20 }
                    },
                    legend: {
                        display: true,
                        position: 'bottom' as const
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Cantidad'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Iglesia - Área'
                        }
                    }
                }
            }
        };

        const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);

        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', `attachment; filename=reporte-${periodo}-${Date.now()}.png`);
        res.send(imageBuffer);
    } catch (error: any) {
        console.error('❌ Error al generar PNG:', error);
        res.status(500).json({ success: false, message: 'Error al generar PNG', error: error.message });
    }
};