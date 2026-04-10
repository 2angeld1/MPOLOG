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
  
  late DateTimeRange fechaRange;
  TimeOfDay horaInicio = const TimeOfDay(hour: 18, minute: 0);
  TimeOfDay horaFin = const TimeOfDay(hour: 20, minute: 0);

  @override
  void initState() {
    super.initState();
    fechaRange = DateTimeRange(
      start: widget.initialDate,
      end: widget.initialDate,
    );
  }

  @override
  Widget build(BuildContext context) {
    final store = context.read<EventosStore>();

    return DraggableScrollableSheet(
      initialChildSize: 0.8,
      maxChildSize: 0.95,
      minChildSize: 0.5,
      builder: (context, scrollController) => GlassContainer(
        borderRadius: 32,
        padding: const EdgeInsets.all(28),
        child: ListView(
          controller: scrollController,
          children: [
            Align(
              alignment: Alignment.center,
              child: Container(
                width: 32, height: 4, 
                margin: const EdgeInsets.only(bottom: 24), 
                decoration: BoxDecoration(color: Colors.white10, borderRadius: BorderRadius.circular(2))
              ),
            ),
            Text('NUEVO EVENTO', style: AppTextStyles.label(context).copyWith(letterSpacing: 2, color: Colors.white54)),
            const SizedBox(height: 24),
            
            _buildFieldLabel('Nombre del Evento'),
            TextField(
              controller: nombreController,
              style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
              decoration: _inputDecoration('Ej: Culto de Primicias'),
            ),
            const SizedBox(height: 20),

            _buildFieldLabel('Categoría'),
            _buildDropdown(
              value: tipoSeleccionado,
              items: ['Evangelismo', 'Ayuno', 'Vigilia', 'Culto de Adoración', 'Reunión Liderazgo'],
              onChanged: (v) => setState(() => tipoSeleccionado = v!),
            ),
            const SizedBox(height: 20),

            _buildFieldLabel('Responsable'),
            _buildDropdown(
              value: deptoSeleccionado,
              items: ['Media', 'Seguridad', 'Génesis', 'JEF', 'General', 'Logística', 'Servidores', 'Exploradores del Rey'],
              onChanged: (v) => setState(() => deptoSeleccionado = v!),
            ),
            const SizedBox(height: 20),

            _buildFieldLabel('Rango de Fechas'),
            InkWell(
              onTap: () async {
                final picked = await showDateRangePicker(
                  context: context,
                  initialDateRange: fechaRange,
                  firstDate: DateTime(2023),
                  lastDate: DateTime(2030),
                  builder: (context, child) {
                    return Theme(
                      data: Theme.of(context).copyWith(
                        colorScheme: const ColorScheme.dark(
                          primary: AppColors.primary,
                          onPrimary: Colors.white,
                          surface: AppColors.surface,
                          onSurface: Colors.white,
                        ),
                      ),
                      child: child!,
                    );
                  },
                );
                if (picked != null) setState(() => fechaRange = picked);
              },
              child: GlassContainer(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14), 
                child: Row(
                  children: [
                    const Icon(Icons.calendar_today, size: 18, color: AppColors.primary),
                    const SizedBox(width: 12),
                    Text(
                      '${DateFormat('dd MMM').format(fechaRange.start)} - ${DateFormat('dd MMM yyyy').format(fechaRange.end)}',
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildFieldLabel('Hora Inicio'),
                      InkWell(
                        onTap: () async {
                          final picked = await showTimePicker(context: context, initialTime: horaInicio);
                          if (picked != null) setState(() => horaInicio = picked);
                        },
                        child: GlassContainer(
                          padding: const EdgeInsets.all(14), 
                          child: Center(child: Text(horaInicio.format(context), style: const TextStyle(fontWeight: FontWeight.bold))),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildFieldLabel('Hora Fin'),
                      InkWell(
                        onTap: () async {
                          final picked = await showTimePicker(context: context, initialTime: horaFin);
                          if (picked != null) setState(() => horaFin = picked);
                        },
                        child: GlassContainer(
                          padding: const EdgeInsets.all(14), 
                          child: Center(child: Text(horaFin.format(context), style: const TextStyle(fontWeight: FontWeight.bold))),
                        ),
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
                
                final inicio = DateTime(
                  fechaRange.start.year, fechaRange.start.month, fechaRange.start.day, 
                  horaInicio.hour, horaInicio.minute
                );
                final fin = DateTime(
                  fechaRange.end.year, fechaRange.end.month, fechaRange.end.day, 
                  horaFin.hour, horaFin.minute
                );

                String tipoFinal = 'asignacion';
                switch(tipoSeleccionado) {
                  case 'Evangelismo': tipoFinal = 'evangelismo'; break;
                  case 'Ayuno': tipoFinal = 'ayuno'; break;
                  case 'Vigilia': tipoFinal = 'vigilia'; break;
                  case 'Culto de Adoración': tipoFinal = 'culto'; break;
                  case 'Reunión Liderazgo': tipoFinal = 'reunion'; break;
                }

                final success = await store.crearEvento({
                  'nombre': nombreController.text,
                  'tipo': tipoFinal,
                  'departamento': deptoSeleccionado,
                  'descripcion': '',
                  'fechaInicio': inicio.toIso8601String(),
                  'fechaFin': fin.toIso8601String(),
                  'color': 'primary',
                });

                if (success && mounted) {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                    content: Text('Evento agendado con éxito'), 
                    backgroundColor: AppColors.success
                  ));
                } else if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                    content: Text(store.errorMessage ?? 'Error al agendar'), 
                    backgroundColor: AppColors.error
                  ));
                }
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary, 
                minimumSize: const Size(double.infinity, 54), 
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                elevation: 0,
              ),
              child: const Text('GUARDAR ASIGNACIÓN', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white, letterSpacing: 1.2)),
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
        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        items: items.map((e) => DropdownMenuItem(value: e, child: Text(e))).toList(),
        onChanged: onChanged,
      ),
    );
  }
}

void showAddEventModal(BuildContext context, DateTime initialDate) {
  showModalBottomSheet(
    context: context,
    backgroundColor: Colors.transparent,
    isScrollControlled: true,
    builder: (context) => AddEventModal(initialDate: initialDate),
  );
}
