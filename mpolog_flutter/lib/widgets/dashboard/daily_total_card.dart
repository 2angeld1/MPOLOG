import 'package:flutter/material.dart';
import '../glass_container.dart';
import '../../styles/app_colors.dart';

class DailyTotalCard extends StatelessWidget {
  final GlobalKey boundaryKey;
  final int total;
  final List<MapEntry<String, int>> areaBreakdown;
  final VoidCallback onExport;

  const DailyTotalCard({
    super.key,
    required this.boundaryKey,
    required this.total,
    required this.areaBreakdown,
    required this.onExport,
  });

  @override
  Widget build(BuildContext context) {
    return RepaintBoundary(
      key: boundaryKey,
      child: GlassContainer(
        padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 32),
        borderRadius: 40,
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const SizedBox(width: 24),
                Text(
                  'TOTAL DE HOY',
                  style: TextStyle(
                    fontSize: 10,
                    color: Colors.white.withValues(alpha: 0.3),
                    fontWeight: FontWeight.bold,
                    letterSpacing: 4,
                  ),
                ),
                IconButton(
                  onPressed: onExport,
                  icon: const Icon(
                    Icons.share_rounded,
                    size: 18,
                    color: Colors.white24,
                  ),
                  padding: EdgeInsets.zero,
                  constraints: const BoxConstraints(),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              '$total',
              style: const TextStyle(
                fontSize: 90,
                fontWeight: FontWeight.w200,
                color: AppColors.primary,
                letterSpacing: -4,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'PERSONAS REGISTRADAS',
              style: TextStyle(
                fontSize: 8,
                color: AppColors.primary.withValues(alpha: 0.4),
                fontWeight: FontWeight.bold,
                letterSpacing: 2,
              ),
            ),

            if (areaBreakdown.isNotEmpty) ...[
              const SizedBox(height: 48),
              Container(
                width: 50,
                height: 1.5,
                decoration: BoxDecoration(
                  color: AppColors.primary.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(1),
                ),
              ),
              const SizedBox(height: 32),
              ...areaBreakdown.map((entry) => _buildAreaRow(entry)),
              const SizedBox(height: 32),
              _buildExportButton(),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildAreaRow(MapEntry<String, int> entry) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        children: [
          Text(
            entry.key.toUpperCase(),
            style: const TextStyle(
              fontSize: 10,
              color: Colors.white60,
              letterSpacing: 1,
              fontWeight: FontWeight.normal,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Container(
              height: 1,
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [Colors.white10, Colors.transparent],
                  begin: Alignment.centerLeft,
                  end: Alignment.centerRight,
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Text(
            '${entry.value}',
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildExportButton() {
    return GestureDetector(
      onTap: onExport,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: AppColors.primary.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: AppColors.primary.withValues(alpha: 0.2),
          ),
        ),
        child: const Center(
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                Icons.camera_enhance_rounded,
                color: AppColors.primary,
                size: 16,
              ),
              const SizedBox(width: 12),
              Text(
                'GENERAR REPORTE VISUAL',
                style: TextStyle(
                  color: AppColors.primary,
                  fontWeight: FontWeight.bold,
                  fontSize: 10,
                  letterSpacing: 1,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
