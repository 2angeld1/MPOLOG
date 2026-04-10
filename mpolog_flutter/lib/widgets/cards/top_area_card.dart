import 'package:flutter/material.dart';
import 'package:mpolog_flutter/models/conteo_model.dart';
import '../glass_container.dart';
import '../../styles/app_text_styles.dart';
import '../../styles/app_colors.dart';

class TopAreaCard extends StatelessWidget {
  final List<ConteoModel> conteos;
  final String selectedType;

  const TopAreaCard({
    super.key,
    required this.conteos,
    required this.selectedType,
  });

  @override
  Widget build(BuildContext context) {
    if (conteos.isEmpty) return const SizedBox.shrink();
    
    final Map<String, int> areaCounts = {};
    for (var c in conteos) {
      if (c.tipo.toLowerCase() == selectedType.toLowerCase()) {
        final area = c.area;
        areaCounts[area] = (areaCounts[area] ?? 0) + c.cantidad;
      }
    }
    
    if (areaCounts.isEmpty) return const SizedBox.shrink();
    
    final sortedAreas = areaCounts.entries.toList()..sort((a,b) => b.value.compareTo(a.value));
    final topArea = sortedAreas.first;

    return GlassContainer(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
      borderRadius: 24,
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(color: AppColors.primary, borderRadius: BorderRadius.circular(16)),
            child: const Icon(Icons.workspace_premium_rounded, color: Colors.white),
          ),
          const SizedBox(width: 20),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'TOP ÁREA ESTA SEMANA', 
                  style: AppTextStyles.label(context).copyWith(fontSize: 10, letterSpacing: 1, color: Colors.white54)
                ),
                Text(topArea.key, style: AppTextStyles.h3(context).copyWith(fontSize: 18)),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                '${topArea.value}', 
                style: AppTextStyles.h2(context).copyWith(color: AppColors.primary, fontSize: 24)
              ),
              Text(selectedType.toLowerCase(), style: const TextStyle(fontSize: 10, color: Colors.white38)),
            ],
          ),
        ],
      ),
    );
  }
}
