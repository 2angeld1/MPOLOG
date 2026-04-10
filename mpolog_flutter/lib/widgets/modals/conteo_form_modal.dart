import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../logic/conteo_store.dart';
import '../../logic/config_store.dart';
import '../../models/conteo_model.dart';
import '../../styles/app_colors.dart';
import '../../styles/app_text_styles.dart';
import '../../utils/app_notifications.dart';
import '../glass_container.dart';
import '../glass_button.dart';

class ConteoFormModal extends StatefulWidget {
  final ConteoModel? initialConteo;
  final String? initialArea;
  final String? initialTipo;

  const ConteoFormModal({
    super.key,
    this.initialConteo,
    this.initialArea,
    this.initialTipo,
  });

  @override
  State<ConteoFormModal> createState() => _ConteoFormModalState();
}

class _ConteoFormModalState extends State<ConteoFormModal> {
  final _formKey = GlobalKey<FormState>();
  
  late String _selectedTipo;
  String? _selectedArea;
  
  final _cantidadController = TextEditingController();
  final _subAreaController = TextEditingController();
  late DateTime _selectedDate;
  String? _editingId;

  bool get _isEditing => _editingId != null;

  @override
  void initState() {
    super.initState();
    if (widget.initialConteo != null) {
      _editingId = widget.initialConteo!.id;
      _selectedTipo = widget.initialConteo!.tipo;
      _selectedArea = widget.initialConteo!.area;
      _selectedDate = widget.initialConteo!.fecha;
      _subAreaController.text = widget.initialConteo!.subArea ?? '';
      _cantidadController.text = widget.initialConteo!.cantidad.toString();
    } else {
      _editingId = null;
      _selectedTipo = widget.initialTipo ?? 'personas';
      _selectedArea = widget.initialArea;
      _selectedDate = DateTime.now();
    }
    
    _updateAreas();
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
                      _buildTypeTab('personas', Icons.people_rounded),
                      _buildTypeTab('materiales', Icons.inventory_2_rounded),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                _buildDatePicker(),
                const SizedBox(height: 16),

                _buildDropdown(
                  label: 'Área',
                  value: _selectedArea,
                  items: conteoStore.areas,
                  icon: Icons.location_on_rounded,
                  onChanged: (val) => setState(() => _selectedArea = val),
                ),
                const SizedBox(height: 16),

                if (_selectedTipo == 'materiales') ...[
                  _buildTextField(
                    controller: _subAreaController,
                    label: 'Referencia/Objeto',
                    icon: Icons.inventory_2_outlined,
                  ),
                  const SizedBox(height: 16),
                ],

                _buildTextField(
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
                    if (!_formKey.currentState!.validate()) return;
                    
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
  }

  Widget _buildTypeTab(String type, IconData icon) {
    final isSelected = _selectedTipo == type;
    return Expanded(
      child: GestureDetector(
        onTap: () {
          setState(() {
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

  Widget _buildDatePicker() {
    return GestureDetector(
      onTap: () async {
        final picked = await showDatePicker(
          context: context, 
          initialDate: _selectedDate, 
          firstDate: DateTime(2020), 
          lastDate: DateTime.now()
        );
        if (picked != null) setState(() => _selectedDate = picked);
      },
      child: _buildInputWrapper(
        icon: Icons.calendar_month_rounded, label: 'Día',
        child: Text('${_selectedDate.day}/${_selectedDate.month}/${_selectedDate.year}', style: const TextStyle(fontWeight: FontWeight.bold)),
      ),
    );
  }

  Widget _buildDropdown({required String label, required String? value, required List<String> items, required IconData icon, required Function(String?) onChanged}) {
    return _buildInputWrapper(
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

  Widget _buildTextField({required TextEditingController controller, required String label, required IconData icon, TextInputType keyboardType = TextInputType.text}) {
    return _buildInputWrapper(
      icon: icon, label: label,
      child: TextField(
        controller: controller, keyboardType: keyboardType,
        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
        decoration: const InputDecoration(isDense: true, contentPadding: EdgeInsets.zero, border: InputBorder.none, hintText: '0', hintStyle: TextStyle(color: Colors.white10)),
      ),
    );
  }

  Widget _buildInputWrapper({required Widget child, required IconData icon, required String label}) {
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

void showConteoFormModal(BuildContext context, {ConteoModel? initialConteo, String? initialArea, String? initialTipo}) {
  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    builder: (context) => ConteoFormModal(
      initialConteo: initialConteo,
      initialArea: initialArea,
      initialTipo: initialTipo,
    ),
  );
}
