import 'package:flutter/material.dart';
import 'package:mpolog_flutter/models/conteo_model.dart';
import 'package:fl_chart/fl_chart.dart';
import '../glass_container.dart';
import '../../styles/app_colors.dart';

class ActivityBarChart extends StatelessWidget {
  final List<ConteoModel> conteos;
  final String selectedType;

  const ActivityBarChart({
    super.key,
    required this.conteos,
    required this.selectedType,
  });

  @override
  Widget build(BuildContext context) {
    final now = DateTime.now();
    final List<int> counts = List.filled(7, 0);
    final List<String> weekdays = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
    final List<String> currentWeekLabels = [];

    for (var i = 0; i < 7; i++) {
        final date = now.subtract(Duration(days: 6 - i));
        currentWeekLabels.add(weekdays[date.weekday - 1]);
        
        counts[i] = conteos.where((c) {
            final d = c.fecha;
            return d.day == date.day && d.month == date.month && d.year == date.year 
                && c.tipo.toLowerCase() == selectedType.toLowerCase();
        }).fold(0, (sum, c) => sum + c.cantidad);
    }

    double maxVal = counts.isNotEmpty ? counts.reduce((a, b) => a > b ? a : b).toDouble() : 0;
    if (maxVal < 5) maxVal = 5;

    return GlassContainer(
      padding: const EdgeInsets.only(top: 24, left: 16, right: 16, bottom: 8),
      borderRadius: 32,
      child: SizedBox(
        height: 220,
        child: BarChart(
          BarChartData(
            maxY: maxVal * 1.2,
            gridData: FlGridData(
              show: true,
              drawVerticalLine: false,
              horizontalInterval: maxVal / 4,
              getDrawingHorizontalLine: (value) => FlLine(
                color: Colors.white.withValues(alpha: 0.05),
                strokeWidth: 1,
              ),
            ),
            titlesData: FlTitlesData(
              show: true,
              rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
              topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
              leftTitles: AxisTitles(
                sideTitles: SideTitles(
                  showTitles: true,
                  reservedSize: 35,
                  interval: maxVal / 4,
                  getTitlesWidget: (value, meta) => Text(
                    value.toInt().toString(),
                    style: TextStyle(color: Colors.white.withValues(alpha: 0.2), fontSize: 10),
                  ),
                ),
              ),
              bottomTitles: AxisTitles(
                sideTitles: SideTitles(
                  showTitles: true,
                  getTitlesWidget: (value, meta) {
                    if (value.toInt() >= 0 && value.toInt() < currentWeekLabels.length) {
                      return Padding(
                        padding: const EdgeInsets.only(top: 10),
                        child: Text(
                          currentWeekLabels[value.toInt()],
                          style: TextStyle(
                            color: value.toInt() == 6 ? AppColors.primary : Colors.white38, 
                            fontSize: 10,
                            fontWeight: value.toInt() == 6 ? FontWeight.bold : FontWeight.normal,
                          ),
                        ),
                      );
                    }
                    return const SizedBox.shrink();
                  },
                ),
              ),
            ),
            borderData: FlBorderData(show: false),
            barGroups: List.generate(7, (i) => BarChartGroupData(
              x: i,
              barRods: [
                BarChartRodData(
                  toY: counts[i].toDouble(),
                  gradient: LinearGradient(
                    colors: [
                        AppColors.primary,
                        AppColors.primary.withValues(alpha: 0.6),
                    ],
                    begin: Alignment.bottomCenter,
                    end: Alignment.topCenter,
                  ),
                  width: 14,
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(6)),
                  backDrawRodData: BackgroundBarChartRodData(
                    show: true,
                    toY: maxVal * 1.2,
                    color: Colors.white.withValues(alpha: 0.02),
                  ),
                )
              ],
            )),
            barTouchData: BarTouchData(
              touchTooltipData: BarTouchTooltipData(
                getTooltipColor: (_) => AppColors.surface,
                getTooltipItem: (group, groupIndex, rod, rodIndex) {
                  return BarTooltipItem(
                    '${rod.toY.toInt()}',
                    const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                  );
                },
              ),
            ),
          ),
        ),
      ),
    );
  }
}
