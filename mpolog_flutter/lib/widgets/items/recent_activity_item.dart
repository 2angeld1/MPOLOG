import 'package:flutter/material.dart';
import '../glass_container.dart';
import '../../styles/app_colors.dart';

class RecentActivityItem extends StatelessWidget {
  final Map<String, dynamic> conteo;

  const RecentActivityItem({
    super.key,
    required this.conteo,
  });

  @override
  Widget build(BuildContext context) {
    final date = DateTime.tryParse(conteo['fecha'] ?? '') ?? DateTime.now();
    final isToday = date.day == DateTime.now().day && date.month == DateTime.now().month;
    final isPersonas = conteo['tipo'] == 'personas';

    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: GlassContainer(
        padding: const EdgeInsets.all(16),
        borderRadius: 20,
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: (isPersonas ? AppColors.primary : AppColors.accent).withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                isPersonas ? Icons.people_rounded : Icons.inventory_2_rounded,
                color: isPersonas ? AppColors.primary : AppColors.accent,
                size: 20,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    conteo['area'] ?? 'General', 
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)
                  ),
                  Text(
                    isToday ? 'Hoy' : '${date.day}/${date.month}/${date.year}', 
                    style: const TextStyle(fontSize: 10, color: Colors.white38)
                  ),
                ],
              ),
            ),
            Text(
              '+${conteo['cantidad']}', 
              style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.primary)
            ),
          ],
        ),
      ),
    );
  }
}
