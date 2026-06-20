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
    final List<int> counts = List.filled(12, 0);
    final List<String> monthLabels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    for (var i = 0; i < 12; i++) {
        counts[i] = conteos.where((c) {
            final d = c.fecha;
            return d.month == (i + 1) && d.year == now.year 
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
                    if (value.toInt() >= 0 && value.toInt() < 12) {
                      return Padding(
                        padding: const EdgeInsets.only(top: 10),
                        child: Text(
                          monthLabels[value.toInt()],
                          style: TextStyle(
                            color: value.toInt() == now.month - 1 ? AppColors.primary : Colors.white38, 
                            fontSize: 10,
                            fontWeight: value.toInt() == now.month - 1 ? FontWeight.bold : FontWeight.normal,
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
            barGroups: List.generate(12, (i) => BarChartGroupData(
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
                  width: 10,
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
