import 'package:flutter/material.dart';
import '../glass_container.dart';
import '../../styles/app_colors.dart';
import '../../styles/app_text_styles.dart';

class EventStatsRow extends StatelessWidget {
  final Map<String, dynamic> stats;

  const EventStatsRow({
    super.key,
    required this.stats,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          children: [
            Expanded(child: _buildStatCard(context, 'TOTAL', '${stats['totalPersonas']}', Icons.people_rounded, AppColors.primary)),
            const SizedBox(width: 12),
            Expanded(child: _buildStatCard(context, 'PAGOS', '\$${stats['montoTotalRecaudado']}', Icons.attach_money_rounded, AppColors.success)),
            const SizedBox(width: 12),
            Expanded(child: _buildStatCard(context, 'PEND', '${stats['personasSinAbono']}', Icons.pending_actions_rounded, AppColors.accent)),
          ],
        ),
        const SizedBox(height: 16),
        _buildVisualGraph(context),
      ],
    );
  }

  Widget _buildVisualGraph(BuildContext context) {
    final int total = stats['totalPersonas'] ?? 0;
    if (total == 0) return const SizedBox.shrink();

    final int abonados = stats['personasConAbono'] ?? 0;
    final int sinAbono = stats['personasSinAbono'] ?? 0;

    final double abonadosPct = abonados / total;
    final double sinAbonoPct = sinAbono / total;

    return GlassContainer(
      padding: const EdgeInsets.all(20),
      borderRadius: 20,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Resumen de Registros', style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold)),
              Icon(Icons.bar_chart_rounded, color: AppColors.primary, size: 20),
            ],
          ),
          const SizedBox(height: 16),
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: Row(
              children: [
                if (abonadosPct > 0)
                  Expanded(
                    flex: (abonadosPct * 100).toInt(),
                    child: Container(
                      height: 14,
                      color: AppColors.success,
                    ),
                  ),
                if (sinAbonoPct > 0)
                  Expanded(
                    flex: (sinAbonoPct * 100).toInt(),
                    child: Container(
                      height: 14,
                      color: AppColors.accent,
                    ),
                  ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildLegend(AppColors.success, 'Con Abono ($abonados)'),
              _buildLegend(AppColors.accent, 'Sin Abono ($sinAbono)'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildLegend(Color color, String text) {
    return Row(
      children: [
        Container(
          width: 10,
          height: 10,
          decoration: BoxDecoration(color: color, shape: BoxShape.circle),
        ),
        const SizedBox(width: 8),
        Text(text, style: const TextStyle(color: Colors.white70, fontSize: 11)),
      ],
    );
  }

  Widget _buildStatCard(BuildContext context, String label, String value, IconData icon, Color color) {
    return GlassContainer(
      padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 12),
      borderRadius: 20,
      child: Column(
        children: [
          Icon(icon, color: color, size: 20),
          const SizedBox(height: 8),
          Text(value, style: AppTextStyles.h2(context).copyWith(fontSize: 20)),
          Text(label, style: const TextStyle(fontSize: 8, color: Colors.white24, letterSpacing: 1, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
