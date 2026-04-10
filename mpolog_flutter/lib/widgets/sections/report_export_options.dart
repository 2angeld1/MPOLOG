import 'package:flutter/material.dart';
import '../glass_container.dart';

class ReportExportOptions extends StatelessWidget {
  final Function(String) onDownload;

  const ReportExportOptions({
    super.key,
    required this.onDownload,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: _buildExportButton(
            label: 'PDF DOCUMENT',
            icon: Icons.picture_as_pdf_rounded,
            color: Colors.redAccent,
            onTap: () => onDownload('pdf'),
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: _buildExportButton(
            label: 'EXCEL SHEET',
            icon: Icons.table_view_rounded,
            color: Colors.greenAccent,
            onTap: () => onDownload('excel'),
          ),
        ),
      ],
    );
  }

  Widget _buildExportButton({required String label, required IconData icon, required Color color, required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: GlassContainer(
        padding: const EdgeInsets.symmetric(vertical: 24),
        borderRadius: 24,
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: color, size: 28),
            ),
            const SizedBox(height: 12),
            Text(label, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1)),
          ],
        ),
      ),
    );
  }
}
