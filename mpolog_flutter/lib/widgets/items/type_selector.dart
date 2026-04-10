import 'package:flutter/material.dart';
import '../../styles/app_colors.dart';

class TypeSelector extends StatelessWidget {
  final String selectedType;
  final Function(String) onTypeSelected;

  const TypeSelector({
    super.key,
    required this.selectedType,
    required this.onTypeSelected,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
      ),
      child: Row(
        children: [
          _buildTypeTab('Personas', Icons.people_rounded),
          _buildTypeTab('Materiales', Icons.inventory_2_rounded),
        ],
      ),
    );
  }

  Widget _buildTypeTab(String type, IconData icon) {
    final isSelected = selectedType == type;
    return Expanded(
      child: GestureDetector(
        onTap: () => onTypeSelected(type),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: isSelected ? AppColors.primary : Colors.transparent,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, color: isSelected ? Colors.white : Colors.white38, size: 18),
              const SizedBox(width: 8),
              Text(
                type, 
                style: TextStyle(
                  color: isSelected ? Colors.white : Colors.white38, 
                  fontWeight: FontWeight.bold, 
                  fontSize: 14
                )
              ),
            ],
          ),
        ),
      ),
    );
  }
}
