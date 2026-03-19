import 'package:flutter/material.dart';

class AppColors {
  static const Color primary = Color(0xFF990000); // Crimson Red
  static const Color primaryLight = Color(0xFFCC0000);
  static const Color accent = Color(0xFFD4AF37); // Warm Gold
  static const Color success = Color(0xFF10B981); 
  static const Color error = Color(0xFFEF4444); 
  
  static const Color background = Color(0xFF000000); // YouVersion Black
  static const Color surface = Color(0xFF121212); // Card Charcoal
  static const Color surfaceLight = Color(0xFF1E1E1E); // Lighter Card

  // Glass styles (Sharp, not blurry borders)
  static final Color glassPrimary = const Color(0xFFFFFFFF).withValues(alpha: 0.05);
  static final Color glassBorder = const Color(0xFFFFFFFF).withValues(alpha: 0.1);

  // Still useful for background meshes but more subtle
  static final List<Color> bgGradient = [
    const Color(0xFF000000),
    const Color(0xFF0A0A0A),
  ];
}
