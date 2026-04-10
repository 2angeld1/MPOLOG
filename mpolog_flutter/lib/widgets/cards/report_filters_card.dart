import 'package:flutter/material.dart';
import '../glass_container.dart';
import '../glass_button.dart';
import '../../logic/reportes_store.dart';
import '../../styles/app_colors.dart';
import '../../styles/app_text_styles.dart';

class ReportFiltersCard extends StatelessWidget {
  final ReportesStore store;
  final VoidCallback onApply;

  const ReportFiltersCard({
    super.key,
    required this.store,
    required this.onApply,
  });

  @override
  Widget build(BuildContext context) {
    return GlassContainer(
      padding: const EdgeInsets.all(24),
      borderRadius: 32,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.filter_list_rounded, color: AppColors.primary, size: 18),
              const SizedBox(width: 8),
              Text('FILTROS DE REPORTE', style: AppTextStyles.label(context)),
            ],
          ),
          const SizedBox(height: 20),
          
          _buildSmallLabel('PERÍODO DE TIEMPO'),
          const SizedBox(height: 8),
          _buildPeriodSelector(),
          const SizedBox(height: 20),
          
          _buildSmallLabel('CATEGORÍA'),
          const SizedBox(height: 8),
          _buildTypeSelector(),
          const SizedBox(height: 20),
          
          GlassButton(
            text: 'ACTUALIZAR ANÁLISIS',
            icon: Icons.refresh_rounded,
            onPressed: onApply,
          ),
        ],
      ),
    );
  }

  Widget _buildSmallLabel(String text) {
    return Text(
      text, 
      style: const TextStyle(fontSize: 9, color: Colors.white24, fontWeight: FontWeight.bold, letterSpacing: 1.2)
    );
  }

  Widget _buildPeriodSelector() {
    final periods = {
      'semana': 'Esta Semana',
      'mes': 'Este Mes',
      '6meses': '6 Meses',
      'año': 'Este Año',
    };

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: periods.entries.map((p) {
          final isSelected = store.selectedPeriodo == p.key;
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: GestureDetector(
              onTap: () => store.setPeriodo(p.key),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(
                  color: isSelected ? AppColors.primary : Colors.white.withValues(alpha: 0.05),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: isSelected ? AppColors.primary : Colors.white10),
                ),
                child: Text(
                  p.value,
                  style: TextStyle(
                    color: isSelected ? Colors.white : Colors.white60,
                    fontSize: 12,
                    fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                  ),
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildTypeSelector() {
    return Row(
      children: [
        _buildChoiceChip(
          label: 'Personas', 
          isSelected: store.selectedTipo == 'personas',
          onTap: () => store.setTipo('personas'),
        ),
        const SizedBox(width: 12),
        _buildChoiceChip(
          label: 'Materiales', 
          isSelected: store.selectedTipo == 'materiales',
          onTap: () => store.setTipo('materiales'),
        ),
      ],
    );
  }

  Widget _buildChoiceChip({required String label, required bool isSelected, required VoidCallback onTap}) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          padding: const EdgeInsets.symmetric(vertical: 12),
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: isSelected ? AppColors.primary.withValues(alpha: 0.2) : Colors.transparent,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: isSelected ? AppColors.primary : Colors.white.withValues(alpha: 0.05)),
          ),
          child: Text(label, style: TextStyle(
            color: isSelected ? Colors.white : Colors.white38,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          )),
        ),
      ),
    );
  }
}
