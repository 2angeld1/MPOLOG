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
    return Row(
      children: [
        Expanded(child: _buildStatCard(context, 'TOTAL', '${stats['totalPersonas']}', Icons.people_rounded, AppColors.primary)),
        const SizedBox(width: 12),
        Expanded(child: _buildStatCard(context, 'PAGOS', '\$${stats['montoTotalRecaudado']}', Icons.attach_money_rounded, AppColors.success)),
        const SizedBox(width: 12),
        Expanded(child: _buildStatCard(context, 'PEND', '${stats['personasSinAbono']}', Icons.pending_actions_rounded, AppColors.accent)),
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
