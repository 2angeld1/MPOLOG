import 'package:flutter/material.dart';
import 'package:mpolog_flutter/models/conteo_model.dart';
import 'package:fl_chart/fl_chart.dart';
import '../glass_container.dart';
import '../../styles/app_colors.dart';

class DistributionDonutChart extends StatelessWidget {
  final List<ConteoModel> conteos;
  final String selectedType;

  const DistributionDonutChart({
    super.key,
    required this.conteos,
    required this.selectedType,
  });

  @override
  Widget build(BuildContext context) {
    final Map<String, int> areaData = {};
    for (var c in conteos) {
      if (c.tipo.toLowerCase() == selectedType.toLowerCase()) {
        final area = c.area;
        areaData[area] = (areaData[area] ?? 0) + c.cantidad;
      }
    }
    final total = areaData.values.fold(0, (a, b) => a + b);
    
    if (total == 0 || areaData.isEmpty) {
      return const SizedBox(
        height: 180, 
        child: GlassContainer(child: Center(child: Text('Sin datos', style: TextStyle(color: Colors.white10, fontSize: 12))))
      );
    }

    final List<Color> chartColors = [
      AppColors.primary, 
      AppColors.primary.withValues(alpha: 0.7), 
      AppColors.primary.withValues(alpha: 0.4), 
      AppColors.primary.withValues(alpha: 0.2),
    ];
    
    final sortedItems = areaData.entries.toList()..sort((a, b) => b.value.compareTo(a.value));
    final displayItems = sortedItems.take(4).toList();

    return GlassContainer(
      padding: const EdgeInsets.symmetric(vertical: 32, horizontal: 16),
      borderRadius: 32,
      child: Column(
        children: [
          SizedBox(
            height: 160,
            child: Stack(
              children: [
                PieChart(
                  PieChartData(
                    sectionsSpace: 0,
                    centerSpaceRadius: 70,
                    startDegreeOffset: -90,
                    sections: displayItems.asMap().entries.map((entry) {
                      return PieChartSectionData(
                        value: entry.value.value.toDouble(),
                        color: chartColors[entry.key % chartColors.length],
                        radius: 12,
                        title: '',
                      );
                    }).toList(),
                  ),
                ),
                Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        '$total',
                        style: const TextStyle(
                          fontSize: 38, 
                          fontWeight: FontWeight.w200, 
                          color: Colors.white, 
                          letterSpacing: -2
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        selectedType.toUpperCase(),
                        style: TextStyle(
                          fontSize: 8, 
                          color: Colors.white.withValues(alpha: 0.2), 
                          fontWeight: FontWeight.bold, 
                          letterSpacing: 3
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),
          Wrap(
            spacing: 20,
            runSpacing: 10,
            alignment: WrapAlignment.center,
            children: displayItems.asMap().entries.map((e) {
              final percent = ((e.value.value / total) * 100).toInt();
              return Column(
                children: [
                  Text(
                    '$percent%',
                    style: TextStyle(
                      fontSize: 12, 
                      fontWeight: FontWeight.bold, 
                      color: chartColors[e.key % chartColors.length]
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    e.value.key.toUpperCase(),
                    style: const TextStyle(fontSize: 7, color: Colors.white38, letterSpacing: 1, fontWeight: FontWeight.w600),
                  ),
                ],
              );
            }).toList(),
          ),
        ],
      ),
    );
  }
}
