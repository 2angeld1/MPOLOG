import 'package:flutter/material.dart';
import '../glass_container.dart';

class QuickActionItem extends StatelessWidget {
  final String label;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;

  const QuickActionItem({
    super.key,
    required this.label,
    required this.icon,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: GlassContainer(
          padding: const EdgeInsets.symmetric(vertical: 20),
          borderRadius: 24,
          child: Column(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.1), 
                  shape: BoxShape.circle
                ),
                child: Icon(icon, color: color, size: 24),
              ),
              const SizedBox(height: 12),
              Text(
                label, 
                style: const TextStyle(
                  fontSize: 10, 
                  fontWeight: FontWeight.bold, 
                  color: Colors.white70
                )
              ),
            ],
          ),
        ),
      ),
    );
  }
}
