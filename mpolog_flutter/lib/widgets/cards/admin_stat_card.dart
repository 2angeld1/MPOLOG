import 'package:flutter/material.dart';
import '../glass_container.dart';
import '../../styles/app_text_styles.dart';

class AdminStatCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color color;

  const AdminStatCard({
    super.key,
    required this.label,
    required this.value,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return GlassContainer(
      padding: const EdgeInsets.all(16),
      borderRadius: 20,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: color.withValues(alpha: 0.8), size: 28),
          const SizedBox(height: 12),
          Text(value, style: AppTextStyles.h2(context).copyWith(fontSize: 22)),
          Text(
            label,
            style: AppTextStyles.body(context).copyWith(
              color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.5),
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }
}
