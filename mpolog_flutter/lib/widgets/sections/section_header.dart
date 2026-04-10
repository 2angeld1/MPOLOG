import 'package:flutter/material.dart';
import '../../styles/app_text_styles.dart';

class SectionHeader extends StatelessWidget {
  final String title;
  final bool showArrow;

  const SectionHeader({
    super.key,
    required this.title,
    this.showArrow = false,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            title.toUpperCase(), 
            style: AppTextStyles.label(context).copyWith(
              letterSpacing: 2.5, 
              fontWeight: FontWeight.bold,
              fontSize: 10,
              color: Colors.white.withValues(alpha: 0.4)
            )
          ),
          if (showArrow)
            const Icon(Icons.arrow_forward_ios_rounded, size: 12, color: Colors.white24),
        ],
      ),
    );
  }
}
