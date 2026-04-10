import 'dart:typed_data';
import 'package:flutter/material.dart';
import '../glass_container.dart';

class ReportChartPreview extends StatelessWidget {
  final Uint8List? chartImage;
  final bool isLoading;

  const ReportChartPreview({
    super.key,
    required this.chartImage,
    required this.isLoading,
  });

  @override
  Widget build(BuildContext context) {
    return GlassContainer(
      padding: const EdgeInsets.all(12),
      borderRadius: 24,
      child: Column(
        children: [
          Container(
            height: 250,
            width: double.infinity,
            decoration: BoxDecoration(
              color: Colors.black26,
              borderRadius: BorderRadius.circular(16),
            ),
            child: isLoading
              ? const Center(child: CircularProgressIndicator())
              : chartImage != null
                ? ClipRRect(
                    borderRadius: BorderRadius.circular(16),
                    child: Image.memory(chartImage!, fit: BoxFit.contain),
                  )
                : const Center(child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.broken_image_rounded, color: Colors.white10, size: 48),
                      SizedBox(height: 8),
                      Text('Error al cargar gráfico', style: TextStyle(color: Colors.white10)),
                    ],
                  )),
          ),
          const SizedBox(height: 12),
          const Text(
            'Gráfico de distribución por áreas para el período seleccionado.',
            style: TextStyle(fontSize: 11, color: Colors.white24, fontStyle: FontStyle.italic),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}
