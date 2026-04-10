import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../glass_container.dart';
import '../../logic/eventos_store.dart';
import '../../styles/app_colors.dart';
import '../../styles/app_text_styles.dart';

class AddEventModal extends StatefulWidget {
  final DateTime initialDate;

  const AddEventModal({
    super.key,
    required this.initialDate,
  });

  @override
  State<AddEventModal> createState() => _AddEventModalState();
}

class _AddEventModalState extends State<AddEventModal> {
  final TextEditingController nombreController = TextEditingController();
  final TextEditingController descController = TextEditingController();
  
  String tipoSeleccionado = 'Culto de Adoración';
  String deptoSeleccionado = 'Media';
  late DateTime fechaSeleccionada;
  TimeOfDay horaSeleccionada = TimeOfDay.now();

  @override
  void initState() {
    super.initState();
    fechaSeleccionada = widget.initialDate;
  }

  @override
  Widget build(BuildContext context) {
    final store = context.read<EventosStore>();

    return DraggableScrollableSheet(
      initialChildSize: 0.75,
      maxChildSize: 0.9,
      builder: (context, scrollController) => GlassContainer(
        borderRadius: 32,
        padding: const EdgeInsets.all(28),
        child: ListView(
          controller: scrollController,
          children: [
            Container(width: 40, height: 4, margin: const EdgeInsets.only(bottom: 24), decoration: BoxDecoration(color: Colors.white10, borderRadius: BorderRadius.circular(2))),
            Text('NUEVO EVENTO', style: AppTextStyles.label(context).copyWith(letterSpacing: 2, color: Colors.white54)),
            const SizedBox(height: 24),
            
            _buildFieldLabel('Nombre del Evento'),
            TextField(
              controller: nombreController,
              style: const TextStyle(color: Colors.white),
              decoration: _inputDecoration('Ej: Culto de Primicias'),
            ),
            const SizedBox(height: 20),

            _buildFieldLabel('Categoría'),
            _buildDropdown(
              value: tipoSeleccionado,
              items: ['Hoja Semanal', 'Ayuno', 'Vigilia', 'Culto de Adoración', 'Reunión Liderazgo'],
              onChanged: (v) => setState(() => tipoSeleccionado = v!),
            ),
            const SizedBox(height: 20),

            _buildFieldLabel('Responsable'),
            _buildDropdown(
              value: deptoSeleccionado,
              items: ['Media', 'Altar', 'Seguridad', 'Cafetería', 'Génesis', 'JEF Teen', 'General'],
              onChanged: (v) => setState(() => deptoSeleccionado = v!),
            ),
            const SizedBox(height: 20),

            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildFieldLabel('Fecha'),
                      InkWell(
                        onTap: () async {
                          final picked = await showDatePicker(
                            context: context,
                            initialDate: fechaSeleccionada,
                            firstDate: DateTime(2023),
                            lastDate: DateTime(2030),
                          );
                          if (picked != null) setState(() => fechaSeleccionada = picked);
                        },
                        child: GlassContainer(padding: const EdgeInsets.all(14), child: Text(DateFormat('dd/MM/yyyy').format(fechaSeleccionada))),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildFieldLabel('Hora'),
                      InkWell(
                        onTap: () async {
                          final picked = await showTimePicker(context: context, initialTime: horaSeleccionada);
                          if (picked != null) setState(() => horaSeleccionada = picked);
                        },
                        child: GlassContainer(padding: const EdgeInsets.all(14), child: Text(horaSeleccionada.format(context))),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 32),

            ElevatedButton(
              onPressed: () async {
                if (nombreController.text.isEmpty) return;
                
                final inicio = DateTime(fechaSeleccionada.year, fechaSeleccionada.month, fechaSeleccionada.day, horaSeleccionada.hour, horaSeleccionada.minute);
                final fin = inicio.add(const Duration(hours: 2));

                String tipoFinal = 'asignacion';
                switch(tipoSeleccionado) {
                  case 'Hoja Semanal': tipoFinal = 'hoja semanal'; break;
                  case 'Ayuno': tipoFinal = 'ayuno'; break;
                  case 'Vigilia': tipoFinal = 'vigilia'; break;
                  case 'Culto de Adoración': tipoFinal = 'culto'; break;
                  case 'Reunión Liderazgo': tipoFinal = 'reunion'; break;
                }

                final success = await store.crearEvento({
                  'nombre': nombreController.text,
                  'tipo': tipoFinal,
                  'departamento': deptoSeleccionado,
                  'descripcion': descController.text,
                  'fechaInicio': inicio.toIso8601String(),
                  'fechaFin': fin.toIso8601String(),
                  'color': 'primary',
                });

                if (success && mounted) {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Evento agendado con éxito'), backgroundColor: Colors.green));
                } else if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(store.errorMessage ?? 'Error al agendar'), backgroundColor: Colors.redAccent));
                }
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary, 
                minimumSize: const Size(double.infinity, 54), 
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))
              ),
              child: const Text('GUARDAR ASIGNACIÓN', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildFieldLabel(String label) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8, left: 4), 
      child: Text(
        label.toUpperCase(), 
        style: const TextStyle(fontSize: 10, color: Colors.white38, letterSpacing: 1.2, fontWeight: FontWeight.bold)
      )
    );
  }

  InputDecoration _inputDecoration(String hint) {
    return InputDecoration(
      hintText: hint,
      hintStyle: const TextStyle(color: Colors.white10),
      filled: true,
      fillColor: Colors.white.withValues(alpha: 0.03),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
    );
  }

  Widget _buildDropdown({required String value, required List<String> items, required Function(String?) onChanged}) {
    return GlassContainer(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: DropdownButton<String>(
        value: value,
        isExpanded: true,
        underline: const SizedBox(),
        dropdownColor: AppColors.surface,
        style: const TextStyle(color: Colors.white),
        items: items.map((e) => DropdownMenuItem(value: e, child: Text(e))).toList(),
        onChanged: onChanged,
      ),
    );
  }
}

// Helper function
void showAddEventModal(BuildContext context, DateTime initialDate) {
  showModalBottomSheet(
    context: context,
    backgroundColor: Colors.transparent,
    isScrollControlled: true,
    builder: (context) => AddEventModal(initialDate: initialDate),
  );
}
