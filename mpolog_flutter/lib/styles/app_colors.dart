import 'package:flutter/material.dart';

class AppColors {
  static const Color primary = Color(0xFF1A237E); // Azul Iglesia
  static const Color background = Colors.black;
  static const Color glassWhite = Color(0x1AFFFFFF); // Blanco traslúcido (10%)
  static const Color glassBorder = Color(0x33FFFFFF); // Borde traslúcido (20%)
  static const Color textMain = Colors.white;
  static const Color textDim = Color(0x99FFFFFF); // Texto atenuado (60%)
  static const Color error = Colors.redAccent;
  
  // Gradiente cinemático para fondos
  static final List<Color> bgGradient = [
    Colors.black.withValues(alpha: 0.4),
    Colors.black.withValues(alpha: 0.8),
  ];
}
