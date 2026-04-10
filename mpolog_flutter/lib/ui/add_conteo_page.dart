import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'dart:ui' as ui;
import 'package:flutter/rendering.dart';
import 'dart:typed_data';
import 'package:flutter/foundation.dart' show kIsWeb;
// ignore: avoid_web_libraries_in_dart
import 'dart:html' as html;
import '../logic/conteo_store.dart';
import '../logic/config_store.dart';
import '../../widgets/dashboard/daily_total_card.dart';
import '../../widgets/sections/weekly_stats_row.dart';
import '../../widgets/sections/quick_registration_chips.dart';
import '../../widgets/sections/daily_records_list.dart';
import '../../widgets/sections/section_header.dart';
import '../../widgets/modals/conteo_form_modal.dart';
import '../../styles/app_text_styles.dart';
import '../../styles/app_colors.dart';
import '../../utils/app_notifications.dart';

class AddConteoPage extends StatefulWidget {
  const AddConteoPage({super.key});

  @override
  State<AddConteoPage> createState() => _AddConteoPageState();
}

class _AddConteoPageState extends State<AddConteoPage> {
  final GlobalKey _counterKey = GlobalKey();
  final String _selectedTipo = 'personas';

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ConteoStore>().fetchConteos();
    });
  }

  @override
  Widget build(BuildContext context) {
    final conteoStore = context.watch<ConteoStore>();
    final configStore = context.watch<ConfigStore>();
    final currentIglesia = configStore.selectedIglesia;

    return Scaffold(
      backgroundColor: AppColors.background,
      floatingActionButton: Padding(
        padding: const EdgeInsets.only(bottom: 80, right: 10),
        child: FloatingActionButton.extended(
          heroTag: 'fab_conteo',
          onPressed: () => showConteoFormModal(context),
          backgroundColor: AppColors.primary,
          icon: const Icon(Icons.add_rounded, color: Colors.white),
          label: const Text('NUEVO CONTEO', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        ),
      ),
      body: CustomScrollView(
        slivers: [
          _buildHeader(),
          SliverPadding(
            padding: const EdgeInsets.all(24),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                if (currentIglesia == null)
                  _buildNoChurchSelected()
                else ...[
                  _buildDailyLargeCounterSection(conteoStore, currentIglesia),
                  const SizedBox(height: 32),

                  const SectionHeader(title: 'PANORAMA SEMANAL (PERSONAS)'),
                  WeeklyStatsRow(conteos: conteoStore.conteos, iglesia: currentIglesia),
                  const SizedBox(height: 32),

                  const SectionHeader(title: 'REGISTRO RÁPIDO'),
                  QuickRegistrationChips(
                    selectedTipo: _selectedTipo,
                    onAreaSelected: (area) {
                      showConteoFormModal(context, initialArea: area, initialTipo: _selectedTipo);
                    },
                  ),
                  const SizedBox(height: 32),

                  const SectionHeader(title: 'RESUMEN DE HOY'),
                  DailyRecordsList(
                    records: conteoStore.conteos.where((c) {
                      final cDate = c.fecha;
                      return cDate.day == DateTime.now().day && cDate.month == DateTime.now().month && c.iglesia == currentIglesia;
                    }).toList(),
                    onEdit: (c) => showConteoFormModal(context, initialConteo: c),
                    onDelete: (id) async {
                      final success = await conteoStore.deleteConteo(id);
                      if (success && context.mounted) AppNotifications.showTopToast(context, 'Eliminado');
                    },
                  ),
                  const SizedBox(height: 120),
                ],
              ]),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return SliverAppBar(
      expandedHeight: 240,
      backgroundColor: AppColors.background,
      pinned: true,
      flexibleSpace: FlexibleSpaceBar(
        titlePadding: const EdgeInsets.only(left: 24, bottom: 24),
        title: Text('Registro de Conteos', style: AppTextStyles.h2(context).copyWith(fontSize: 20)),
        background: Stack(
          fit: StackFit.expand,
          children: [
             Image.asset('assets/images/church_header.png', fit: BoxFit.cover, errorBuilder: (c,e,s) => Container(color: AppColors.surface)),
             Container(
               decoration: BoxDecoration(
                 gradient: LinearGradient(
                   begin: Alignment.topCenter, end: Alignment.bottomCenter,
                   colors: [Colors.black.withValues(alpha: 0.3), AppColors.background],
                 ),
               ),
             ),
          ],
        ),
      ),
    );
  }

  Widget _buildDailyLargeCounterSection(ConteoStore store, String iglesia) {
    final now = DateTime.now();
    final todayRecords = store.conteos.where((c) {
      final cDate = c.fecha;
      return cDate.day == now.day &&
          cDate.month == now.month &&
          cDate.year == now.year &&
          c.iglesia == iglesia &&
          c.tipo == 'personas';
    }).toList();

    final todayTotal = todayRecords.fold<int>(
      0,
      (sum, c) => sum + c.cantidad,
    );

    final Map<String, int> areaBreakdown = {};
    for (var r in todayRecords) {
      final area = r.area;
      areaBreakdown[area] = (areaBreakdown[area] ?? 0) + r.cantidad;
    }
    final sortedBreakdown = areaBreakdown.entries.toList()
      ..sort((a, b) => b.value.compareTo(a.value));

    return DailyTotalCard(
      boundaryKey: _counterKey,
      total: todayTotal,
      areaBreakdown: sortedBreakdown,
      onExport: _exportToImage,
    );
  }

  Widget _buildNoChurchSelected() {
    return const Center(child: Column(children: [
      Icon(Icons.church_outlined, size: 60, color: Colors.white10),
      SizedBox(height: 16),
      Text('Sede no seleccionada', style: TextStyle(color: Colors.white24)),
    ]));
  }

  Future<void> _exportToImage() async {
    try {
      AppNotifications.showTopToast(context, '📸 Procesando reporte visual...');
      await Future.delayed(const Duration(milliseconds: 500));
      final boundary = _counterKey.currentContext?.findRenderObject() as RenderRepaintBoundary?;
      if (boundary == null) return;
      final image = await boundary.toImage(pixelRatio: 3.0);
      final byteData = await image.toByteData(format: ui.ImageByteFormat.png);
      if (byteData != null) {
        final Uint8List pngBytes = byteData.buffer.asUint8List();
        await _saveOrShareImage(pngBytes);
        if (mounted) AppNotifications.showTopToast(context, '✅ Reporte descargado con éxito');
      }
    } catch (e) {
      debugPrint('Error exportando: $e');
      if (mounted) AppNotifications.showTopToast(context, '❌ Error al generar el reporte');
    }
  }

  Future<void> _saveOrShareImage(Uint8List bytes) async {
    if (kIsWeb) {
      try {
        final blob = html.Blob([bytes]);
        final url = html.Url.createObjectUrlFromBlob(blob);
        html.AnchorElement(href: url)
          ..setAttribute("download", "reporte_conteo_${DateTime.now().millisecondsSinceEpoch}.png")
          ..click();
        html.Url.revokeObjectUrl(url);
      } catch (e) {
        debugPrint('Error en descarga web: $e');
      }
    } else {
      debugPrint('La exportación de imagen solo está implementada para Web por ahora.');
    }
  }
}
