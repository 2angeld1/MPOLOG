import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../glass_container.dart';
import '../../styles/app_colors.dart';
import 'package:mpolog_flutter/models/evento_model.dart';

class EventInfoCard extends StatelessWidget {
  final EventoModel evento;

  const EventInfoCard({
    super.key,
    required this.evento,
  });

  @override
  Widget build(BuildContext context) {
    final ubicacion = evento.ubicacion?.nombreLugar ?? 'Ubicación por definir';
    final precio = evento.precioTotal.toString();

    return GlassContainer(
      padding: const EdgeInsets.all(20),
      borderRadius: 24,
      child: Column(
        children: [
          _buildInfoRow(Icons.location_on_rounded, 'UBICACIÓN', ubicacion, AppColors.accent),
          const Padding(padding: EdgeInsets.symmetric(vertical: 12), child: Divider(color: Colors.white10)),
          _buildInfoRow(Icons.calendar_month_rounded, 'FECHAS', 
            'Del ${_formatDate(evento.fechaInicio)} al ${_formatDate(evento.fechaFin)}', 
            Colors.white38),
          const Padding(padding: EdgeInsets.symmetric(vertical: 12), child: Divider(color: Colors.white10)),
          _buildInfoRow(Icons.payments_rounded, 'PRECIO TOTAL', '\$$precio', AppColors.primary),
          const SizedBox(height: 20),
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () => _openMap(evento.ubicacion),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppColors.accent,
                    side: const BorderSide(color: AppColors.accent),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                  icon: const Icon(Icons.map_outlined, size: 18),
                  label: const Text('VER MAPA', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1)),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () => _shareLocation(evento),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.white70,
                    side: const BorderSide(color: Colors.white10),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                  icon: const Icon(Icons.share_outlined, size: 18),
                  label: const Text('COMPARTIR', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1)),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value, Color color) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(10)),
          child: Icon(icon, size: 16, color: color),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: const TextStyle(fontSize: 8, color: Colors.white38, letterSpacing: 1.5)),
              Text(value, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
            ],
          ),
        ),
      ],
    );
  }

  Future<void> _openMap(UbicacionModel? ubicacion) async {
    if (ubicacion == null || ubicacion.lat == null) return;
    final url = 'https://www.google.com/maps/search/?api=1&query=${ubicacion.lat},${ubicacion.lng}';
    if (await canLaunchUrl(Uri.parse(url))) {
      await launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
    }
  }

  Future<void> _shareLocation(EventoModel evento) async {
    final ubicacion = evento.ubicacion;
    if (ubicacion == null) return;
    
    final text = '📍 EVENTO: ${evento.nombre}\n📍 Lugar: ${ubicacion.nombreLugar}\nhttps://www.google.com/maps/search/?api=1&query=${ubicacion.lat},${ubicacion.lng}';
    
    final url = 'whatsapp://send?text=${Uri.encodeComponent(text)}';
    if (await canLaunchUrl(Uri.parse(url))) {
      await launchUrl(Uri.parse(url));
    } else {
      final mailUrl = 'mailto:?subject=Ubicación del Evento&body=${Uri.encodeComponent(text)}';
      launchUrl(Uri.parse(mailUrl));
    }
  }

  String _formatDate(DateTime? date) {
    if (date == null) return '--/--/--';
    return '${date.day}/${date.month}/${date.year}';
  }
}
