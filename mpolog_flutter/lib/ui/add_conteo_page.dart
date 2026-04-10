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
import '../../widgets/glass_container.dart';
import '../../widgets/glass_button.dart';
import '../../widgets/dashboard/daily_total_card.dart';
import '../../widgets/sections/weekly_stats_row.dart';
import '../../widgets/sections/quick_registration_chips.dart';
import '../../widgets/sections/daily_records_list.dart';
import '../../widgets/sections/section_header.dart';
import '../../styles/app_text_styles.dart';
import '../../styles/app_colors.dart';
import '../../utils/app_notifications.dart';

class AddConteoPage extends StatefulWidget {
  const AddConteoPage({super.key});

  @override
  State<AddConteoPage> createState() => _AddConteoPageState();
}

class _AddConteoPageState extends State<AddConteoPage> {
  final _formKey = GlobalKey<FormState>();
  final GlobalKey _counterKey = GlobalKey();
  
  String? _selectedTipo = 'personas';
  String? _selectedArea;
  
  final _cantidadController = TextEditingController();
  final _subAreaController = TextEditingController();
  DateTime _selectedDate = DateTime.now();
  String? _editingId;

  bool get _isEditing => _editingId != null;

  @override
  void initState() {
    super.initState();
    _loadInitialData();
  }

  void _loadInitialData() {
    _updateAreas();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ConteoStore>().fetchConteos();
    });
  }

  void _updateAreas() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ConteoStore>().fetchAreas(tipo: _selectedTipo);
    });
  }

  void _showAddConteoModal([dynamic initialConteo]) {
    if (initialConteo != null) {
      _editingId = initialConteo['_id'];
      _selectedTipo = initialConteo['tipo'];
      _selectedArea = initialConteo['area'];
      _selectedDate = DateTime.tryParse(initialConteo['fecha'] ?? '') ?? DateTime.now();
      _subAreaController.text = initialConteo['subArea'] ?? '';
      _cantidadController.text = (initialConteo['cantidad'] ?? 0).toString();
      _updateAreas();
    } else {
      _editingId = null;
      _cantidadController.clear();
      _subAreaController.clear();
      // No reseteamos _selectedArea si se pasó desde un chip
    }

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => StatefulBuilder(
        builder: (context, setModalState) {
          final conteoStore = context.watch<ConteoStore>();
          final configStore = context.watch<ConfigStore>();
          final currentIglesia = configStore.selectedIglesia;

          return Container(
            padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
            child: GlassContainer(
              padding: const EdgeInsets.all(24),
              borderRadius: 32,
              child: SingleChildScrollView(
                child: Form(
                  key: _formKey,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 40, height: 4, margin: const EdgeInsets.only(bottom: 24),
                        decoration: BoxDecoration(color: Colors.white24, borderRadius: BorderRadius.circular(2)),
                      ),
                      Text(_isEditing ? 'EDITAR REGISTRO' : 'NUEVO REGISTRO', style: AppTextStyles.h3(context)),
                      const SizedBox(height: 24),
                      
                      // Selector de Tipo
                      Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.05),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
                        ),
                        child: Row(
                          children: [
                            _buildTypeTabModal('personas', Icons.people_rounded, setModalState),
                            _buildTypeTabModal('materiales', Icons.inventory_2_rounded, setModalState),
                          ],
                        ),
                      ),
                      const SizedBox(height: 24),

                      _buildDatePickerModal(setModalState),
                      const SizedBox(height: 16),

                      _buildDropdownModal(
                        label: 'Área',
                        value: _selectedArea,
                        items: conteoStore.areas,
                        icon: Icons.location_on_rounded,
                        onChanged: (val) => setModalState(() => _selectedArea = val),
                      ),
                      const SizedBox(height: 16),

                      if (_selectedTipo == 'materiales') ...[
                        _buildTextFieldModal(
                          controller: _subAreaController,
                          label: 'Referencia/Objeto',
                          icon: Icons.inventory_2_outlined,
                        ),
                        const SizedBox(height: 16),
                      ],

                      _buildTextFieldModal(
                        controller: _cantidadController,
                        label: 'Cantidad',
                        icon: Icons.numbers_rounded,
                        keyboardType: TextInputType.number,
                      ),
                      const SizedBox(height: 32),

                      GlassButton(
                        text: _isEditing ? 'ACTUALIZAR' : 'GUARDAR',
                        isLoading: conteoStore.isLoading,
                        onPressed: () async {
                          if (currentIglesia == null) return;
                          final data = {
                            'fecha': _selectedDate.toIso8601String(),
                            'iglesia': currentIglesia,
                            'tipo': _selectedTipo,
                            'area': _selectedArea,
                            'subArea': _subAreaController.text,
                            'cantidad': int.tryParse(_cantidadController.text) ?? 0,
                          };

                          final success = _isEditing
                              ? await context.read<ConteoStore>().updateConteo(_editingId!, data)
                              : await context.read<ConteoStore>().registerConteo(data);

                          if (success && mounted) {
                            if (!context.mounted) return;
                            Navigator.pop(context);
                            AppNotifications.showTopToast(context, _isEditing ? 'Actualizado' : 'Guardado');
                          }
                        },
                      ),
                      const SizedBox(height: 16),
                    ],
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
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
        
        // Lógica de descarga según la plataforma
        await _saveOrShareImage(pngBytes);
        
        if (mounted) {
          AppNotifications.showTopToast(context, '✅ Reporte descargado con éxito');
        }
      }
    } catch (e) {
      debugPrint('Error exportando: $e');
      if (mounted) {
        AppNotifications.showTopToast(context, '❌ Error al generar el reporte');
      }
    }
  }

  Future<void> _saveOrShareImage(Uint8List bytes) async {
    if (kIsWeb) {
      _downloadWeb(bytes);
    } else {
      // Aquí iría la lógica para móvil usando path_provider e share_plus
      debugPrint('La exportación de imagen solo está implementada para Web por ahora.');
    }
  }

  void _downloadWeb(Uint8List bytes) {
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
          onPressed: () => _showAddConteoModal(),
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
                  // 1. TOTAL DE HOY (EN GRANDE)
                  _buildDailyLargeCounterSection(conteoStore, currentIglesia),
                  const SizedBox(height: 32),

                  // 2. PANORAMA SEMANAL
                  const SectionHeader(title: 'PANORAMA SEMANAL (PERSONAS)'),
                  WeeklyStatsRow(conteos: conteoStore.conteos, iglesia: currentIglesia),
                  const SizedBox(height: 32),

                  // 3. REGISTRO RÁPIDO
                  const SectionHeader(title: 'REGISTRO RÁPIDO'),
                  QuickRegistrationChips(
                    selectedTipo: _selectedTipo ?? 'personas',
                    onAreaSelected: (area) {
                      setState(() => _selectedArea = area);
                      _showAddConteoModal();
                    },
                  ),
                  const SizedBox(height: 32),

                  // 4. RESUMEN DE HOY
                  const SectionHeader(title: 'RESUMEN DE HOY'),
                  DailyRecordsList(
                    records: conteoStore.conteos.where((c) {
                      final cDate = DateTime.tryParse(c['fecha'] ?? '');
                      return cDate != null && cDate.day == DateTime.now().day && cDate.month == DateTime.now().month && c['iglesia'] == currentIglesia;
                    }).toList(),
                    onEdit: (c) => _showAddConteoModal(c),
                    onDelete: (id) async {
                      final success = await conteoStore.deleteConteo(id);
                      if (success && mounted) AppNotifications.showTopToast(context, 'Eliminado');
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
      final cDate = DateTime.tryParse(c['fecha'] ?? '');
      return cDate != null &&
          cDate.day == now.day &&
          cDate.month == now.month &&
          cDate.year == now.year &&
          c['iglesia'] == iglesia &&
          c['tipo'] == 'personas';
    }).toList();

    final todayTotal = todayRecords.fold(
      0,
      (sum, c) => sum + (c['cantidad'] as int? ?? 0),
    );

    final Map<String, int> areaBreakdown = {};
    for (var r in todayRecords) {
      final area = r['area'] ?? 'General';
      areaBreakdown[area] =
          (areaBreakdown[area] ?? 0) + (r['cantidad'] as int? ?? 0);
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

  // --- WIDGETS AUXILIARES DEL MODAL ---

  Widget _buildTypeTabModal(String type, IconData icon, StateSetter setModalState) {
    final isSelected = _selectedTipo == type;
    return Expanded(
      child: GestureDetector(
        onTap: () {
          setModalState(() {
            _selectedTipo = type;
            _selectedArea = null;
            _updateAreas();
          });
        },
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: isSelected ? AppColors.primary : Colors.transparent,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, color: isSelected ? Colors.white : Colors.white38, size: 18),
              const SizedBox(width: 8),
              Text(type.toUpperCase(), style: TextStyle(color: isSelected ? Colors.white : Colors.white38, fontSize: 12, fontWeight: FontWeight.bold)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDatePickerModal(StateSetter setModalState) {
    return GestureDetector(
      onTap: () async {
        final picked = await showDatePicker(context: context, initialDate: _selectedDate, firstDate: DateTime(2020), lastDate: DateTime.now());
        if (picked != null) setModalState(() => _selectedDate = picked);
      },
      child: _buildInputWrapperModal(
        icon: Icons.calendar_month_rounded, label: 'Día',
        child: Text('${_selectedDate.day}/${_selectedDate.month}/${_selectedDate.year}', style: const TextStyle(fontWeight: FontWeight.bold)),
      ),
    );
  }

  Widget _buildDropdownModal({required String label, required String? value, required List<String> items, required IconData icon, required Function(String?) onChanged}) {
    return _buildInputWrapperModal(
      icon: icon, label: label,
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: value, isExpanded: true, isDense: true,
          hint: const Text('Seleccionar...', style: TextStyle(color: Colors.white24, fontSize: 14)),
          dropdownColor: AppColors.surface,
          items: items.map((e) => DropdownMenuItem(value: e, child: Text(e, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold)))).toList(),
          onChanged: onChanged,
        ),
      ),
    );
  }

  Widget _buildTextFieldModal({required TextEditingController controller, required String label, required IconData icon, TextInputType keyboardType = TextInputType.text}) {
    return _buildInputWrapperModal(
      icon: icon, label: label,
      child: TextField(
        controller: controller, keyboardType: keyboardType,
        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
        decoration: const InputDecoration(isDense: true, contentPadding: EdgeInsets.zero, border: InputBorder.none, hintText: '0', hintStyle: TextStyle(color: Colors.white10)),
      ),
    );
  }

  Widget _buildInputWrapperModal({required Widget child, required IconData icon, required String label}) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.05), borderRadius: BorderRadius.circular(20), border: Border.all(color: Colors.white10)),
      child: Row(
        children: [
          Icon(icon, color: AppColors.primary, size: 20),
          const SizedBox(width: 16),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(label.toUpperCase(), style: const TextStyle(fontSize: 8, color: Colors.white38, letterSpacing: 1.5)),
            child,
          ])),
        ],
      ),
    );
  }
}
