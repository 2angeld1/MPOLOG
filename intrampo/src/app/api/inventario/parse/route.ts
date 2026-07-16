import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const safeRoles = session.roles?.map((r: string) => r.toLowerCase()) || [];
  const canManage = safeRoles.some((r: string) => ['admin', 'superadmin', 'logisticadmin', 'pastor', 'logistica', 'logística'].includes(r));
  if (!canManage) {
    return NextResponse.json({ error: 'Acceso denegado. Solo pastores y encargados del ministerio de logística pueden procesar archivos.' }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No se recibió archivo' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name.toLowerCase();
    let extractedItems: any[] = [];

    if (fileName.endsWith('.pdf')) {
      // Parse PDF
      const pdfParse = (await import('pdf-parse')).default;
      const pdfData = await pdfParse(buffer);
      extractedItems = parseTextToItems(pdfData.text);
    } else if (fileName.endsWith('.docx')) {
      // Parse Word
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ buffer });
      extractedItems = parseTextToItems(result.value);
    } else {
      return NextResponse.json({ error: 'Formato no soportado. Use PDF o Word (.docx)' }, { status: 400 });
    }

    return NextResponse.json({ items: extractedItems });
  } catch (error) {
    console.error('Error parseando archivo:', error);
    return NextResponse.json({ error: 'Error al procesar el archivo' }, { status: 500 });
  }
}

function parseTextToItems(text: string): any[] {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const items: any[] = [];
  
  // Strategy 1: Try to detect tabular data (tab or pipe separated)
  const tabularLines = lines.filter(l => l.includes('\t') || l.includes('|'));
  
  if (tabularLines.length > 1) {
    // Assume first tabular line is header
    const separator = tabularLines[0].includes('\t') ? '\t' : '|';
    const headers = tabularLines[0].split(separator).map(h => h.trim().toLowerCase());
    
    for (let i = 1; i < tabularLines.length; i++) {
      const values = tabularLines[i].split(separator).map(v => v.trim());
      if (values.length < 2 || values.every(v => v === '' || v === '-' || v === '---')) continue;
      
      const item: any = {};
      headers.forEach((header, idx) => {
        const val = values[idx] || '';
        if (header.includes('nombre') || header.includes('material') || header.includes('item') || header.includes('articulo') || header.includes('artículo') || header.includes('producto')) {
          item.nombre = val;
        } else if (header.includes('descripcion') || header.includes('descripción') || header.includes('detalle')) {
          item.descripcion = val;
        } else if (header.includes('estado') || header.includes('condicion') || header.includes('condición')) {
          item.estado = val;
        } else if (header.includes('ministerio') || header.includes('area') || header.includes('área') || header.includes('departamento')) {
          item.ministerioNombre = val;
        } else if (header.includes('cantidad') || header.includes('qty') || header.includes('unidades')) {
          item.cantidad = val;
        } else if (header.includes('ubicacion') || header.includes('ubicación') || header.includes('lugar')) {
          item.ubicacion = val;
        } else if (header.includes('nota') || header.includes('observ')) {
          item.notas = val;
        }
      });
      
      // If no nombre was mapped, use first non-empty column
      if (!item.nombre && values[0]) {
        item.nombre = values[0];
        if (!item.descripcion && values[1]) item.descripcion = values[1];
      }
      
      if (item.nombre) items.push(item);
    }
  }
  
  // Strategy 2: If no tabular data found, treat each line as an item name
  if (items.length === 0) {
    for (const line of lines) {
      // Skip very short lines and common headers
      if (line.length < 3) continue;
      if (/^(inventario|lista|materiales|items|artículos|articulos|#|---)/i.test(line)) continue;
      
      // Try to extract comma-separated values
      const parts = line.split(',').map(p => p.trim());
      if (parts.length >= 2) {
        items.push({
          nombre: parts[0],
          descripcion: parts[1] || '',
          estado: parts[2] || 'Bueno',
          ministerioNombre: parts[3] || null,
          cantidad: parts[4] || '1',
        });
      } else {
        // Single value per line
        items.push({
          nombre: line,
          descripcion: '',
          estado: 'Bueno',
        });
      }
    }
  }
  
  return items;
}
