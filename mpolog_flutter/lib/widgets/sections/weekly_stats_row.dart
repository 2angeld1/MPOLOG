import 'package:flutter/material.dart';
import '../../styles/app_colors.dart';

class WeeklyStatsRow extends StatelessWidget {
  final List<dynamic> conteos;
  final String iglesia;

  const WeeklyStatsRow({
    super.key,
    required this.conteos,
    required this.iglesia,
  });

  @override
  Widget build(BuildContext context) {
    final Map<String, int> dailyTotals = {};
    for (var c in conteos) {
      if (c['iglesia'] == iglesia && c['tipo'] == 'personas') {
        final cDate = DateTime.tryParse(c['fecha'] ?? '');
        if (cDate != null) {
          final dateKey = '${cDate.year}-${cDate.month.toString().padLeft(2,'0')}-${cDate.day.toString().padLeft(2,'0')}';
          dailyTotals[dateKey] = (dailyTotals[dateKey] ?? 0) + (c['cantidad'] as int? ?? 0);
        }
      }
    }

    final sortedDates = dailyTotals.keys.toList()..sort();
    final lastActiveDates = sortedDates.reversed.take(5).toList().reversed.toList();

    if (lastActiveDates.isEmpty) return const SizedBox();

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: lastActiveDates.map((dateKey) {
          final date = DateTime.parse(dateKey);
          final now = DateTime.now();
          final isToday = date.day == now.day && date.month == now.month && date.year == now.year;
          final total = dailyTotals[dateKey] ?? 0;

          return Container(
            margin: const EdgeInsets.only(right: 12),
            padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 20),
            decoration: BoxDecoration(
              color: isToday ? AppColors.primary.withValues(alpha: 0.1) : Colors.white.withValues(alpha: 0.03),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: isToday ? AppColors.primary : Colors.white.withValues(alpha: 0.05)),
            ),
            child: Column(
              children: [
                Text(
                  isToday ? 'HOY' : '${['D','L','M','M','J','V','S'][date.weekday % 7]} ${date.day}/${date.month}',
                  style: TextStyle(fontSize: 10, color: isToday ? AppColors.primary : Colors.white38, fontWeight: FontWeight.bold)
                ),
                const SizedBox(height: 8),
                Text('$total', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }
}
