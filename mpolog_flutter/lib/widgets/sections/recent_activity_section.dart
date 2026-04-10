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
    final recent = conteos.take(5).toList();
    if (recent.isEmpty) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.symmetric(vertical: 20),
          child: Text('Sin actividad reciente', style: TextStyle(color: Colors.white10)),
        )
      );
    }

    return Column(
      children: recent.map((c) => RecentActivityItem(conteo: c)).toList(),
    );
  }
}
