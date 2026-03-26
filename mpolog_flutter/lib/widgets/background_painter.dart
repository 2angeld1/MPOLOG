import 'package:flutter/material.dart';
import '../styles/app_colors.dart';

class BackgroundPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint();

    // Blobs de colores sutiles
    // Blob 1: Rojo Primario (Superior Izquierda)
    paint.color = AppColors.primary.withValues(alpha: 0.15);
    canvas.drawCircle(Offset(size.width * 0.2, size.height * 0.1), size.width * 0.5, paint);

    // Blob 2: Dorado/Acento (Centro Derecha)
    paint.color = AppColors.accent.withValues(alpha: 0.1);
    canvas.drawCircle(Offset(size.width * 0.9, size.height * 0.4), size.width * 0.4, paint);

    // Blob 3: Segundo Rojo (Inferior Izquierda)
    paint.color = AppColors.primary.withValues(alpha: 0.1);
    canvas.drawCircle(Offset(size.width * 0.0, size.height * 0.9), size.width * 0.6, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
