import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'dart:ui';
import '../logic/conteo_store.dart';
import '../logic/config_store.dart';
import '../widgets/glass_container.dart';
import '../widgets/glass_button.dart';
import '../styles/app_text_styles.dart';
import '../styles/app_colors.dart';
import '../utils/app_notifications.dart';
import 'package:flutter_slidable/flutter_slidable.dart';

class AddConteoPage extends StatefulWidget {
  const AddConteoPage({super.key});

  @override
  State<AddConteoPage> createState() => _AddConteoPageState();
}

class _AddConteoPageState extends State<AddConteoPage> {
  final _formKey = GlobalKey<FormState>();
  
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
                  // 1. PANORAMA SEMANAL
                  _buildSectionTitle('PANORAMA SEMANAL (PERSONAS)'),
                  const SizedBox(height: 16),
                  _buildWeeklySummary(conteoStore, currentIglesia),
                  const SizedBox(height: 32),

                  // 2. REGISTRO RÁPIDO
                  _buildSectionTitle('REGISTRO RÁPIDO'),
                  const SizedBox(height: 16),
                  _buildAreaSuggestions(conteoStore),
                  const SizedBox(height: 32),

                  // 3. RESUMEN DE HOY
                  _buildSectionTitle('RESUMEN DE HOY'),
                  const SizedBox(height: 16),
                  _buildDailyRecords(conteoStore, currentIglesia),
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

  Widget _buildWeeklySummary(ConteoStore store, String iglesia) {
    // 1. Obtener todas las fechas únicas que tienen registros para esta iglesia y tipo personas
    final Map<String, int> dailyTotals = {};
    for (var c in store.conteos) {
      if (c['iglesia'] == iglesia && c['tipo'] == 'personas') {
        final cDate = DateTime.tryParse(c['fecha'] ?? '');
        if (cDate != null) {
          final dateKey = '${cDate.year}-${cDate.month.toString().padLeft(2,'0')}-${cDate.day.toString().padLeft(2,'0')}';
          dailyTotals[dateKey] = (dailyTotals[dateKey] ?? 0) + (c['cantidad'] as int? ?? 0);
        }
      }
    }

    // 2. Ordenar fechas y tomar las últimas 5 (o menos si hay menos)
    final sortedDates = dailyTotals.keys.toList()..sort();
    final lastActiveDates = sortedDates.reversed.take(5).toList().reversed.toList();

    if (lastActiveDates.isEmpty) return const SizedBox();

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: lastActiveDates.map((dateKey) {
          final date = DateTime.parse(dateKey);
          final now = DateTime.now();
          final isToday = date.day == now.day && date.month == now.month && date.year == now.year;
          final total = dailyTotals[dateKey] ?? 0;

          return Container(
            margin: const EdgeInsets.only(right: 12),
            padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 20),
            decoration: BoxDecoration(
              color: isToday ? AppColors.primary.withValues(alpha: 0.1) : Colors.white.withValues(alpha: 0.03),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: isToday ? AppColors.primary : Colors.white.withValues(alpha: 0.05)),
            ),
            child: Column(
              children: [
                Text(
                  isToday ? 'HOY' : '${['D','L','M','M','J','V','S'][date.weekday % 7]} ${date.day}/${date.month}',
                  style: TextStyle(fontSize: 10, color: isToday ? AppColors.primary : Colors.white38, fontWeight: FontWeight.bold)
                ),
                const SizedBox(height: 8),
                Text('$total', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildAreaSuggestions(ConteoStore store) {
    final areas = _selectedTipo == 'personas' 
      ? ['Bloque 1 y 2', 'Bloque 3 y 4', 'Altar y Media', 'Genesis']
      : ['cafeteria', 'baños', 'comedor'];

    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: areas.map((area) => GestureDetector(
        onTap: () {
          setState(() => _selectedArea = area);
          _showAddConteoModal();
        },
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.05),
            borderRadius: BorderRadius.circular(30),
            border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.flash_on_rounded, size: 14, color: Colors.amber),
              const SizedBox(width: 8),
              Text(area, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
            ],
          ),
        ),
      )).toList(),
    );
  }

  Widget _buildDailyRecords(ConteoStore store, String iglesia) {
    final dailyRecords = store.conteos.where((c) {
      final cDate = DateTime.tryParse(c['fecha'] ?? '');
      return cDate != null && cDate.day == DateTime.now().day && cDate.month == DateTime.now().month && c['iglesia'] == iglesia;
    }).toList();

    if (dailyRecords.isEmpty) return const Center(child: Padding(padding: EdgeInsets.all(40), child: Text('No hay registros hoy', style: TextStyle(color: Colors.white10))));

    final Map<String, List<dynamic>> grouped = {};
    for (var r in dailyRecords) {
      final area = r['area'] ?? 'General';
      grouped.containsKey(area) ? grouped[area]!.add(r) : grouped[area] = [r];
    }

    return Column(
      children: grouped.entries.map((g) {
        final total = g.value.fold<int>(0, (s, i) => s + (i['cantidad'] as int? ?? 0));
        return Container(
          margin: const EdgeInsets.only(bottom: 16),
          decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.03), borderRadius: BorderRadius.circular(24), border: Border.all(color: Colors.white.withValues(alpha: 0.05))),
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    const Icon(Icons.location_on_rounded, color: AppColors.primary, size: 16),
                    const SizedBox(width: 12),
                    Expanded(child: Text(g.key.toUpperCase(), style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 2))),
                    Text('$total', style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: 18)),
                  ],
                ),
              ),
              const Divider(height: 1, color: Colors.white10),
              ...g.value.map((c) => Slidable(
                key: Key(c['_id']),
                endActionPane: ActionPane(motion: const DrawerMotion(), children: [
                  SlidableAction(onPressed: (_) => _showAddConteoModal(c), backgroundColor: Colors.blue.withValues(alpha: 0.1), foregroundColor: Colors.blueAccent, icon: Icons.edit_rounded),
                  SlidableAction(onPressed: (_) async {
                    final success = await store.deleteConteo(c['_id']);
                    if (success && mounted) AppNotifications.showTopToast(context, 'Eliminado');
                  }, backgroundColor: Colors.red.withValues(alpha: 0.1), foregroundColor: Colors.redAccent, icon: Icons.delete_outline_rounded),
                ]),
                child: ListTile(
                  dense: true,
                  title: Text(c['tipo'] == 'personas' ? 'Personas' : c['subArea'] ?? 'Material', style: const TextStyle(fontSize: 13)),
                  trailing: Text('${c['cantidad']}', style: const TextStyle(fontWeight: FontWeight.bold)),
                ),
              )),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(title, style: AppTextStyles.label(context).copyWith(fontSize: 10, letterSpacing: 2.5, color: Colors.white38));
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
