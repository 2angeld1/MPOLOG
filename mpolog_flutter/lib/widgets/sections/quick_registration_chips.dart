import 'package:flutter/material.dart';

class QuickRegistrationChips extends StatelessWidget {
  final String selectedTipo;
  final Function(String) onAreaSelected;

  const QuickRegistrationChips({
    super.key,
    required this.selectedTipo,
    required this.onAreaSelected,
  });

  @override
  Widget build(BuildContext context) {
    final areas = selectedTipo == 'personas' 
      ? ['Bloque 1 y 2', 'Bloque 3 y 4', 'Altar y Media', 'Genesis']
      : ['cafeteria', 'baños', 'comedor'];

    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: areas.map((area) => GestureDetector(
        onTap: () => onAreaSelected(area),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.05),
            borderRadius: BorderRadius.circular(30),
            border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.flash_on_rounded, size: 14, color: Colors.amber),
              const SizedBox(width: 8),
              Text(area, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
            ],
          ),
        ),
      )).toList(),
    );
  }
}
