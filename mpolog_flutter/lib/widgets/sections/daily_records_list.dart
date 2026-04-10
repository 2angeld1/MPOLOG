import 'package:flutter/material.dart';
import 'package:mpolog_flutter/models/conteo_model.dart';
import 'package:flutter_slidable/flutter_slidable.dart';
import '../../styles/app_colors.dart';

class DailyRecordsList extends StatelessWidget {
  final List<ConteoModel> records;
  final Function(ConteoModel) onEdit;
  final Function(String) onDelete;

  const DailyRecordsList({
    super.key,
    required this.records,
    required this.onEdit,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    if (records.isEmpty) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(40), 
          child: Text('No hay registros hoy', style: TextStyle(color: Colors.white10))
        )
      );
    }

    final Map<String, List<ConteoModel>> grouped = {};
    for (var r in records) {
      final area = r.area;
      grouped.containsKey(area) ? grouped[area]!.add(r) : grouped[area] = [r];
    }

    return Column(
      children: grouped.entries.map((g) {
        final total = g.value.fold<int>(0, (s, i) => s + i.cantidad);
        return Container(
          margin: const EdgeInsets.only(bottom: 16),
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.03), 
            borderRadius: BorderRadius.circular(24), 
            border: Border.all(color: Colors.white.withValues(alpha: 0.05))
          ),
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    const Icon(Icons.location_on_rounded, color: AppColors.primary, size: 16),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        g.key.toUpperCase(), 
                        style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 2)
                      )
                    ),
                    Text(
                      '$total', 
                      style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: 18)
                    ),
                  ],
                ),
              ),
              const Divider(height: 1, color: Colors.white10),
              ...g.value.map((c) => _buildSlidableItem(c)),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildSlidableItem(ConteoModel c) {
    return Slidable(
      key: Key(c.id),
      endActionPane: ActionPane(
        motion: const DrawerMotion(), 
        children: [
          SlidableAction(
            onPressed: (_) => onEdit(c), 
            backgroundColor: Colors.blue.withValues(alpha: 0.1), 
            foregroundColor: Colors.blueAccent, 
            icon: Icons.edit_rounded
          ),
          SlidableAction(
            onPressed: (_) => onDelete(c.id), 
            backgroundColor: Colors.red.withValues(alpha: 0.1), 
            foregroundColor: Colors.redAccent, 
            icon: Icons.delete_outline_rounded
          ),
        ]
      ),
      child: ListTile(
        dense: true,
        title: Text(
          c.tipo == 'personas' ? 'Personas' : c.subArea ?? 'Material', 
          style: const TextStyle(fontSize: 13)
        ),
        trailing: Text(
          '${c.cantidad}', 
          style: const TextStyle(fontWeight: FontWeight.bold)
        ),
      ),
    );
  }
}
