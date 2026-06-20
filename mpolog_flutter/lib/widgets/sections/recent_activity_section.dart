import 'package:flutter/material.dart';
import 'package:mpolog_flutter/models/conteo_model.dart';
import '../items/recent_activity_item.dart';

class RecentActivitySection extends StatelessWidget {
  final List<ConteoModel> conteos;

  const RecentActivitySection({
    super.key,
    required this.conteos,
  });

  @override
  Widget build(BuildContext context) {
    final recent = conteos.take(20).toList();
    if (recent.isEmpty) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.symmetric(vertical: 20),
          child: Text('Sin actividad reciente', style: TextStyle(color: Colors.white10)),
        )
      );
    }

    final Map<String, List<ConteoModel>> groupedConteos = {};
    for (var c in recent) {
      if (!groupedConteos.containsKey(c.area)) {
        groupedConteos[c.area] = [];
      }
      groupedConteos[c.area]!.add(c);
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: groupedConteos.entries.map((entry) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.only(left: 8, bottom: 12, top: 8),
              child: Text(
                entry.key.toUpperCase(),
                style: const TextStyle(
                  color: Colors.white54,
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.2,
                ),
              ),
            ),
            ...entry.value.map((c) => RecentActivityItem(conteo: c)),
          ],
        );
      }).toList(),
    );
  }
}
