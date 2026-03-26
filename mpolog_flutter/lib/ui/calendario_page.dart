import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:table_calendar/table_calendar.dart';
import 'package:intl/intl.dart';
import 'package:excel/excel.dart';
import 'package:flutter/foundation.dart';
import 'dart:io' as io;
import 'package:path_provider/path_provider.dart';
import '../logic/eventos_store.dart';
import '../styles/app_colors.dart';
import '../styles/app_text_styles.dart';
import '../widgets/glass_container.dart';

class CalendarioPage extends StatefulWidget {
  const CalendarioPage({super.key});

  @override
  State<CalendarioPage> createState() => _CalendarioPageState();
}

class _CalendarioPageState extends State<CalendarioPage> {
  CalendarFormat _calendarFormat = CalendarFormat.month;
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;

  @override
  void initState() {
    super.initState();
    _selectedDay = _focusedDay;
    Future.microtask(() => context.read<EventosStore>().fetchEventos());
  }

  Color _getColorForDept(String dept) {
    switch (dept.toLowerCase()) {
      case 'media': return Colors.blueAccent;
      case 'altar': return Colors.amber;
      case 'seguridad': return Colors.redAccent;
      case 'cafetería': return Colors.teal;
      case 'génesis': return Colors.purpleAccent;
      case 'jef teen': return Colors.orange;
      default: return AppColors.primary;
    }
  }

  List<dynamic> _getEventsForDay(DateTime day, List<dynamic> allEvents) {
    return allEvents.where((event) {
      if (event['fechaInicio'] == null) return false;
      final start = DateTime.parse(event['fechaInicio']);
      final end = event['fechaFin'] != null ? DateTime.parse(event['fechaFin']) : start;
      final dayOnly = DateTime(day.year, day.month, day.day);
      final startOnly = DateTime(start.year, start.month, start.day);
      final endOnly = DateTime(end.year, end.month, end.day);
      
      return (dayOnly.isAtSameMomentAs(startOnly) || dayOnly.isAfter(startOnly)) &&
             (dayOnly.isAtSameMomentAs(endOnly) || dayOnly.isBefore(endOnly));
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final store = context.watch<EventosStore>();

    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        slivers: [
          _buildAppBar(),
          SliverToBoxAdapter(
            child: Column(
              children: [
                if (store.isLoading && store.eventos.isEmpty)
                  const Center(child: Padding(padding: EdgeInsets.all(100), child: CircularProgressIndicator())),
                _buildCalendar(store.eventos),
                const SizedBox(height: 24),
                _buildEventsList(store.eventos),
                const SizedBox(height: 120),
              ],
            ),
          ),
        ],
      ),
      floatingActionButton: _buildFloatingActions(context),
    );
  }

  Widget _buildAppBar() {
    return SliverAppBar(
      expandedHeight: 80,
      pinned: true,
      backgroundColor: AppColors.background,
      elevation: 0,
      leading: null,
      flexibleSpace: FlexibleSpaceBar(
        centerTitle: false,
        titlePadding: const EdgeInsets.only(left: 56, bottom: 16),
        title: Text('AGENDA MENSUAL', style: AppTextStyles.h3(context).copyWith(fontSize: 16, color: Colors.white, letterSpacing: 1.2)),
      ),
    );
  }

  Widget _buildFloatingActions(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 80),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          FloatingActionButton(
            heroTag: 'export',
            onPressed: () => _exportToExcel(),
            backgroundColor: Colors.white10,
            child: const Icon(Icons.download_rounded, color: Colors.white),
          ),
          const SizedBox(height: 16),
          FloatingActionButton(
            heroTag: 'add',
            onPressed: () => _mostrarModalNuevaAsignacion(context),
            backgroundColor: AppColors.primary,
            child: const Icon(Icons.add_rounded, color: Colors.white),
          ),
        ],
      ),
    );
  }

  Widget _buildCalendar(List<dynamic> allEvents) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: GlassContainer(
        borderRadius: 24,
        padding: const EdgeInsets.all(8),
        child: TableCalendar(
          firstDay: DateTime.utc(2023, 1, 1),
          lastDay: DateTime.utc(2030, 12, 31),
          focusedDay: _focusedDay,
          calendarFormat: _calendarFormat,
          selectedDayPredicate: (day) => isSameDay(_selectedDay, day),
          onDaySelected: (selectedDay, focusedDay) {
            setState(() {
              _selectedDay = selectedDay;
              _focusedDay = focusedDay;
            });
          },
          eventLoader: (day) => _getEventsForDay(day, allEvents),
          onFormatChanged: (format) {
            setState(() => _calendarFormat = format);
          },
          onPageChanged: (focusedDay) {
            _focusedDay = focusedDay;
          },
          calendarStyle: CalendarStyle(
            defaultTextStyle: const TextStyle(color: Colors.white70, fontSize: 13),
            weekendTextStyle: const TextStyle(color: Colors.white24, fontSize: 13),
            todayDecoration: BoxDecoration(color: AppColors.primary.withValues(alpha: 0.2), shape: BoxShape.circle),
            selectedDecoration: const BoxDecoration(color: AppColors.primary, shape: BoxShape.circle),
            markerSize: 5,
          ),
          headerStyle: HeaderStyle(
            formatButtonVisible: false,
            titleCentered: true,
            titleTextStyle: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
            leftChevronIcon: const Icon(Icons.chevron_left, color: Colors.white38),
            rightChevronIcon: const Icon(Icons.chevron_right, color: Colors.white38),
          ),
          calendarBuilders: CalendarBuilders(
            markerBuilder: (context, day, events) {
              if (events.isEmpty) return const SizedBox.shrink();
              return Positioned(
                bottom: 1,
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: events.take(4).map((event) {
                    final color = _getColorForDept((event as dynamic)['departamento'] ?? '');
                    return Container(
                      margin: const EdgeInsets.symmetric(horizontal: 1),
                      width: 5,
                      height: 5,
                      decoration: BoxDecoration(color: color, shape: BoxShape.circle),
                    );
                  }).toList(),
                ),
              );
            },
          ),
        ),
      ),
    );
  }

  Widget _buildEventsList(List<dynamic> allEvents) {
    final dayEvents = _getEventsForDay(_selectedDay ?? _focusedDay, allEvents);

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.only(left: 8, bottom: 16),
            child: Text(
              DateFormat('EEEE, d MMMM').format(_selectedDay ?? _focusedDay).toUpperCase(),
              style: const TextStyle(color: Colors.white38, fontSize: 10, letterSpacing: 1.5),
            ),
          ),
          if (dayEvents.isEmpty)
            const Center(
              child: Padding(
                padding: EdgeInsets.symmetric(vertical: 40),
                child: Text('Sin asignaciones para hoy', style: TextStyle(color: Colors.white10)),
              ),
            ),
          ...dayEvents.map((event) {
            final color = _getColorForDept((event as dynamic)['departamento'] ?? '');
            return Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: GlassContainer(
                padding: const EdgeInsets.all(16),
                borderRadius: 20,
                child: Row(
                  children: [
                    Container(width: 3, height: 30, decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(1.5))),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                          Text((event as dynamic)['nombre'] ?? 'Tarea', style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white, fontSize: 14)),
                          Text((event as dynamic)['departamento'] ?? 'General', style: TextStyle(color: color.withValues(alpha: 0.7), fontSize: 11)),
                      ]),
                    ),
                    _buildTimeTag(event),
                  ],
                ),
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _buildTimeTag(dynamic event) {
    if (event['fechaInicio'] == null) return const SizedBox.shrink();
    final start = DateTime.parse(event['fechaInicio']);
    return Text(DateFormat('HH:mm').format(start), style: const TextStyle(color: Colors.white38, fontSize: 11, fontWeight: FontWeight.bold));
  }

  // --- FORMULARIO DE NUEVO EVENTO ---
  void _mostrarModalNuevaAsignacion(BuildContext context) {
    final store = context.read<EventosStore>();
    final TextEditingController nombreController = TextEditingController();
    final TextEditingController descController = TextEditingController();
    
    String tipoSeleccionado = 'Culto de Adoración';
    String deptoSeleccionado = 'Media';
    DateTime fechaSeleccionada = _selectedDay ?? DateTime.now();
    TimeOfDay horaSeleccionada = TimeOfDay.now();

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => StatefulBuilder(
        builder: (context, setModalState) => DraggableScrollableSheet(
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
                
                // NOMBRE / TÍTULO
                _buildFieldLabel('Nombre del Evento'),
                TextField(
                  controller: nombreController,
                  style: const TextStyle(color: Colors.white),
                  decoration: _inputDecoration('Ej: Culto de Primicias'),
                ),
                const SizedBox(height: 20),

                // TIPO DE EVENTO
                _buildFieldLabel('Categoría'),
                _buildDropdown(
                  value: tipoSeleccionado,
                  items: ['Hoja Semanal', 'Ayuno', 'Vigilia', 'Culto de Adoración', 'Reunión Liderazgo'],
                  onChanged: (v) => setModalState(() => tipoSeleccionado = v!),
                ),
                const SizedBox(height: 20),

                // DEPARTAMENTO
                _buildFieldLabel('Responsable'),
                _buildDropdown(
                  value: deptoSeleccionado,
                  items: ['Media', 'Altar', 'Seguridad', 'Cafetería', 'Génesis', 'JEF Teen', 'General'],
                  onChanged: (v) => setModalState(() => deptoSeleccionado = v!),
                ),
                const SizedBox(height: 20),

                // FECHA Y HORA
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
                              if (picked != null) setModalState(() => fechaSeleccionada = picked);
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
                              if (picked != null) setModalState(() => horaSeleccionada = picked);
                            },
                            child: GlassContainer(padding: const EdgeInsets.all(14), child: Text(horaSeleccionada.format(context))),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 32),

                // BOTÓN GUARDAR
                ElevatedButton(
                  onPressed: () async {
                    if (nombreController.text.isEmpty) return;
                    
                    final inicio = DateTime(fechaSeleccionada.year, fechaSeleccionada.month, fechaSeleccionada.day, horaSeleccionada.hour, horaSeleccionada.minute);
                    final fin = inicio.add(const Duration(hours: 2));

                    // Mapear el nombre visual al enum exacto del backend
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
                      'color': 'primary', // Se autodefine en el backend o frontend
                    });

                    if (success) {
                      Navigator.pop(context);
                      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Evento agendado con éxito'), backgroundColor: Colors.green));
                    } else {
                      // El store ya maneja el mensaje de conflicto en store.errorMessage
                      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(store.errorMessage ?? 'Error al agendar'), backgroundColor: Colors.redAccent));
                    }
                  },
                  style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, minimumSize: const Size(double.infinity, 54), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))),
                  child: const Text('GUARDAR ASIGNACIÓN', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
                ),
                const SizedBox(height: 40),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildFieldLabel(String label) {
    return Padding(padding: const EdgeInsets.only(bottom: 8, left: 4), child: Text(label.toUpperCase(), style: const TextStyle(fontSize: 10, color: Colors.white38, letterSpacing: 1.2, fontWeight: FontWeight.bold)));
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

  Future<void> _exportToExcel() async {
    final store = context.read<EventosStore>();
    final excel = Excel.createExcel();
    final Sheet sheet = excel.sheets[excel.getDefaultSheet()]!;

    sheet.appendRow([TextCellValue('FECHA'), TextCellValue('EVENTO'), TextCellValue('DEPARTAMENTO'), TextCellValue('HORA')]);
    for (var ev in store.eventos) {
      if (ev['fechaInicio'] == null) continue;
      final start = DateTime.parse(ev['fechaInicio']);
      sheet.appendRow([TextCellValue(DateFormat('yyyy-MM-dd').format(start)), TextCellValue(ev['nombre']?.toString() ?? ''), TextCellValue(ev['departamento']?.toString() ?? 'General'), TextCellValue(DateFormat('HH:mm').format(start))]);
    }

    try {
      final bytes = excel.save();
      if (bytes != null) {
        if (kIsWeb) {
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Reporte Excel generado en el navegador.')));
        } else {
          final directory = await getApplicationDocumentsDirectory();
          final file = io.File('${directory.path}/calendario_mpolog.xlsx');
          await file.writeAsBytes(bytes);
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Excel guardado: ${file.path}')));
        }
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
    }
  }
}
