import 'package:flutter/material.dart';
import '../../styles/app_colors.dart';

class EventSearchbar extends StatelessWidget {
  final TextEditingController controller;
  final String searchQuery;
  final Function(String) onChanged;
  final VoidCallback onClear;

  const EventSearchbar({
    super.key,
    required this.controller,
    required this.searchQuery,
    required this.onChanged,
    required this.onClear,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white10),
      ),
      child: TextField(
        controller: controller,
        style: const TextStyle(color: Colors.white, fontSize: 14),
        onChanged: onChanged,
        decoration: InputDecoration(
          icon: const Icon(Icons.search_rounded, color: AppColors.primary, size: 20),
          border: InputBorder.none,
          hintText: 'Buscar por nombre o equipo...',
          hintStyle: const TextStyle(color: Colors.white24, fontSize: 13),
          suffixIcon: searchQuery.isNotEmpty 
            ? IconButton(
                icon: const Icon(Icons.close_rounded, color: Colors.white24, size: 18),
                onPressed: onClear,
              )
            : null,
        ),
      ),
    );
  }
}
