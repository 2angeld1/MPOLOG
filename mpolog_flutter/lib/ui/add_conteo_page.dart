import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../logic/conteo_store.dart';
import '../logic/config_store.dart';
import '../widgets/glass_container.dart';
import '../widgets/glass_text_field.dart';
import '../widgets/glass_button.dart';
import '../styles/app_text_styles.dart';
import '../utils/app_notifications.dart';

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
  
  bool _isLoadingData = false;

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

  @override
  Widget build(BuildContext context) {
    final conteoStore = context.watch<ConteoStore>();
    final configStore = context.watch<ConfigStore>();
    final currentIglesia = configStore.selectedIglesia;

    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surface,
      appBar: AppBar(
        title: Text('Nuevo Registro', style: AppTextStyles.title(context)),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: _isLoadingData 
        ? const Center(child: CircularProgressIndicator())
        : currentIglesia == null
          ? _buildNoChurchSelected()
          : ListView(
            padding: const EdgeInsets.all(24),
            children: [
              Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('SEDE: $currentIglesia', style: AppTextStyles.body(context).copyWith(
                      color: Theme.of(context).colorScheme.primary,
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    )),
                    const SizedBox(height: 24),
                    Text('TIPO DE CONTEO', style: AppTextStyles.body(context).copyWith(
                      color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.5),
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                      letterSpacing: 1.2
                    )),
                    const SizedBox(height: 16),

                    // Selector de Tipo
                    _buildDropdown(
                      label: 'Tipo de Conteo',
                      value: _selectedTipo,
                      items: ['personas', 'materiales'],
                      icon: Icons.category_rounded,
                      onChanged: (val) => setState(() {
                        _selectedTipo = val;
                        _selectedArea = null;
                        _updateAreas();
                      }),
                    ),
                    const SizedBox(height: 32),

                    Text('DETALLES DEL CONTEO', style: AppTextStyles.body(context).copyWith(
                      color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.5),
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                      letterSpacing: 1.2
                    )),
                    const SizedBox(height: 16),

                    // Fecha
                    GlassContainer(
                      padding: const EdgeInsets.all(16),
                      borderRadius: 16,
                      child: InkWell(
                        onTap: () async {
                          final picked = await showDatePicker(
                            context: context,
                            initialDate: _selectedDate,
                            firstDate: DateTime(2020),
                            lastDate: DateTime.now(),
                          );
                          if (picked != null) setState(() => _selectedDate = picked);
                        },
                        child: Row(
                          children: [
                            Icon(Icons.calendar_today_rounded, color: Theme.of(context).colorScheme.primary, size: 20),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text('Fecha', style: TextStyle(fontSize: 12, color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.5))),
                                  Text('${_selectedDate.day}/${_selectedDate.month}/${_selectedDate.year}', 
                                    style: AppTextStyles.body(context).copyWith(fontWeight: FontWeight.bold)),
                                ],
                              ),
                            ),
                            Icon(Icons.edit_calendar_rounded, size: 18, color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.3)),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Área
                    _buildDropdown(
                      label: 'Área',
                      value: _selectedArea,
                      items: conteoStore.areas,
                      icon: Icons.location_on_rounded,
                      hint: conteoStore.isLoading ? 'Cargando...' : 'Selecciona un área',
                      onChanged: (val) => setState(() => _selectedArea = val),
                    ),
                    const SizedBox(height: 16),

                    // Sub-área (solo si es materiales)
                    if (_selectedTipo == 'materiales') ...[
                      GlassTextField(
                        controller: _subAreaController,
                        label: 'Referencia / Objeto',
                        prefixIcon: const Icon(Icons.inventory_2_outlined),
                        hintText: 'Ej: Juguetes, Biblias...',
                      ),
                      const SizedBox(height: 16),
                    ],

                    // Cantidad
                    GlassTextField(
                      controller: _cantidadController,
                      label: _selectedTipo == 'personas' ? 'Cantidad de Personas' : 'Cantidad de Unidades',
                      prefixIcon: Icon(_selectedTipo == 'personas' ? Icons.people_outline_rounded : Icons.numbers_rounded),
                      keyboardType: TextInputType.number,
                      hintText: '0',
                    ),
                    const SizedBox(height: 40),

                    GlassButton(
                      text: _isEditing ? 'ACTUALIZAR REGISTRO' : 'GUARDAR REGISTRO',
                      icon: _isEditing ? Icons.update_rounded : Icons.save_rounded,
                      isLoading: conteoStore.isLoading,
                      onPressed: _handleSave,
                    ),
                    if (_isEditing) ...[
                      const SizedBox(height: 12),
                      GlassButton(
                        text: 'CANCELAR EDICIÓN',
                        isOutlined: true,
                        onPressed: _cancelEditing,
                      ),
                    ],
                    const SizedBox(height: 48),

                    // Lista de registros del día
                    Text('REGISTROS DEL DÍA', style: AppTextStyles.body(context).copyWith(
                      color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.5),
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                      letterSpacing: 1.2
                    )),
                    const SizedBox(height: 16),
                    _buildDailyRecords(conteoStore, currentIglesia),
                    const SizedBox(height: 100),
                  ],
                ),
              ),
            ],
          ),
    );
  }

  Widget _buildDailyRecords(ConteoStore store, String iglesia) {
    final dailyRecords = store.conteos.where((c) {
      final cDate = DateTime.tryParse(c['fecha'] ?? '');
      if (cDate == null) return false;
      return cDate.year == _selectedDate.year &&
             cDate.month == _selectedDate.month &&
             cDate.day == _selectedDate.day &&
             c['iglesia'] == iglesia &&
             (c['tipo']?.toString().toLowerCase().trim() == _selectedTipo?.toLowerCase().trim());
    }).toList();

    if (dailyRecords.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 24),
          child: Text('No hay registros para este día', 
            style: AppTextStyles.body(context).copyWith(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.4))),
        ),
      );
    }

    // Agrupar por área
    final Map<String, List<dynamic>> grouped = {};
    for (var record in dailyRecords) {
      final area = record['area'] ?? 'General';
      if (!grouped.containsKey(area)) {
        grouped[area] = [];
      }
      grouped[area]!.add(record);
    }

    return Column(
      children: grouped.entries.map((group) {
        final area = group.key;
        final records = group.value;
        final total = records.fold<int>(0, (sum, item) => sum + (item['cantidad'] as int? ?? 0));
        final tipo = records.first['tipo'];

        return Padding(
          padding: const EdgeInsets.only(bottom: 16),
          child: GlassContainer(
            padding: const EdgeInsets.all(16),
            borderRadius: 20,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(area.toUpperCase(), 
                      style: AppTextStyles.body(context).copyWith(fontWeight: FontWeight.bold, letterSpacing: 1.1, fontSize: 13)),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: (tipo == 'personas' ? Colors.blue : Colors.orange).withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text('TOTAL: $total', 
                        style: TextStyle(
                          color: tipo == 'personas' ? Colors.blue : Colors.orange, 
                          fontWeight: FontWeight.bold, 
                          fontSize: 12
                        )
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                const Divider(height: 1),
                const SizedBox(height: 8),
                ...records.map((conteo) => Padding(
                  padding: const EdgeInsets.symmetric(vertical: 4),
                  child: Row(
                    children: [
                      Icon(
                        conteo['tipo'] == 'personas' ? Icons.person_outline : Icons.inventory_2_outlined, 
                        size: 14, 
                        color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.4)
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          conteo['tipo'] == 'personas' 
                            ? 'Registro individual' 
                            : '${conteo['subArea'] ?? 'Material'}',
                          style: AppTextStyles.body(context).copyWith(fontSize: 13, color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.7)),
                        ),
                      ),
                      Text('${conteo['cantidad']}', 
                        style: AppTextStyles.body(context).copyWith(fontWeight: FontWeight.w600, fontSize: 13)),
                      const SizedBox(width: 8),
                      IconButton(
                        icon: const Icon(Icons.edit_outlined, color: Colors.blueAccent, size: 16),
                        padding: EdgeInsets.zero,
                        constraints: const BoxConstraints(),
                        onPressed: () => _startEditing(conteo),
                      ),
                      const SizedBox(width: 8),
                      IconButton(
                        icon: const Icon(Icons.delete_outline, color: Colors.redAccent, size: 16),
                        padding: EdgeInsets.zero,
                        constraints: const BoxConstraints(),
                        onPressed: () => _handleDelete(conteo['_id']),
                      ),
                    ],
                  ),
                )).toList(),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }

  void _startEditing(dynamic conteo) {
    setState(() {
      _editingId = conteo['_id'];
      _selectedTipo = conteo['tipo'];
      _selectedArea = conteo['area'];
      _selectedDate = DateTime.tryParse(conteo['fecha'] ?? '') ?? DateTime.now();
      _subAreaController.text = conteo['subArea'] ?? '';
      _cantidadController.text = (conteo['cantidad'] ?? 0).toString();
      _updateAreas();
    });
  }

  void _cancelEditing() {
    setState(() {
      _editingId = null;
      _cantidadController.clear();
      _subAreaController.clear();
      _selectedArea = null;
      _formKey.currentState?.reset();
    });
  }

  void _handleDelete(String id) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Eliminar registro'),
        content: const Text('¿Estás seguro de que quieres eliminar este registro?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancelar')),
          TextButton(onPressed: () => Navigator.pop(context, true), child: const Text('Eliminar', style: TextStyle(color: Colors.red))),
        ],
      ),
    );

    if (confirmed == true && mounted) {
      final success = await context.read<ConteoStore>().deleteConteo(id);
      if (success && mounted) {
        AppNotifications.showTopToast(context, 'Registro eliminado');
      }
    }
  }

  Widget _buildDropdown({
    required String label,
    required String? value,
    required List<String> items,
    required IconData icon,
    String? hint,
    required Function(String?) onChanged,
  }) {
    return GlassContainer(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      borderRadius: 16,
      child: DropdownButtonHideUnderline(
        child: DropdownButtonFormField<String>(
          value: value,
          onChanged: onChanged,
          decoration: InputDecoration(
            icon: Icon(icon, color: Theme.of(context).colorScheme.primary, size: 20),
            labelText: label,
            labelStyle: TextStyle(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.5), fontSize: 13),
            border: InputBorder.none,
          ),
          hint: hint != null ? Text(hint, style: AppTextStyles.body(context)) : null,
          dropdownColor: Theme.of(context).colorScheme.surface,
          items: items.map((e) => DropdownMenuItem(
            value: e,
            child: Text(e, style: AppTextStyles.body(context)),
          )).toList(),
          validator: (val) => val == null ? 'Campo requerido' : null,
        ),
      ),
    );
  }

  void _handleSave() async {
    if (_formKey.currentState!.validate()) {
      final configStore = context.read<ConfigStore>();
      final data = {
        'fecha': _selectedDate.toIso8601String(),
        'iglesia': configStore.selectedIglesia,
        'tipo': _selectedTipo,
        'area': _selectedArea,
        'subArea': _subAreaController.text,
        'cantidad': int.tryParse(_cantidadController.text) ?? 0,
      };

      final success = _isEditing
          ? await context.read<ConteoStore>().updateConteo(_editingId!, data)
          : await context.read<ConteoStore>().registerConteo(data);

      if (success && mounted) {
        AppNotifications.showTopToast(context, _isEditing ? 'Registro actualizado' : 'Registro guardado');
        _cancelEditing();
      }
    }
  }

  Widget _buildNoChurchSelected() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.church_outlined, size: 80, color: Theme.of(context).colorScheme.primary.withValues(alpha: 0.2)),
            const SizedBox(height: 24),
            Text('Sede no seleccionada', style: AppTextStyles.h2(context)),
            const SizedBox(height: 12),
            Text(
              'Por favor, selecciona tu sede principal en la configuración para poder realizar registros.',
              textAlign: TextAlign.center,
              style: AppTextStyles.body(context).copyWith(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.6)),
            ),
            const SizedBox(height: 32),
            GlassButton(
              text: 'IR A CONFIGURACIÓN', 
              onPressed: () {
                // This depends on how we want to navigate, but since it's in Tabs, 
                // we might need a way to switch tabs. For now, just a hint.
              }
            ),
          ],
        ),
      ),
    );
  }
}
