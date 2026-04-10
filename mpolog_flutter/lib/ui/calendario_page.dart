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
import '../widgets/charts/event_calendar.dart';
import '../widgets/sections/event_list_section.dart';
import '../widgets/modals/add_event_modal.dart';
import '../styles/app_text_styles.dart';
import '../models/evento_model.dart';

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
    _focusedDay = DateTime.now();
    _selectedDay = _focusedDay;
    Future.microtask(() {
      if (!mounted) return;
      context.read<EventosStore>().fetchEventos();
    });
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

  List<EventoModel> _getEventsForDay(DateTime day, List<EventoModel> allEvents) {
    return allEvents.where((event) {
      final start = event.fechaInicio;
      if (start == null) return false;
      
      final end = event.fechaFin ?? start;
      
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
                
                EventCalendar(
                  focusedDay: _focusedDay,
                  selectedDay: _selectedDay,
                  calendarFormat: _calendarFormat,
                  allEvents: store.eventos,
                  onDaySelected: (selectedDay, focusedDay) {
                    setState(() {
                      _selectedDay = selectedDay;
                      _focusedDay = focusedDay;
                    });
                  },
                  onFormatChanged: (format) => setState(() => _calendarFormat = format),
                  onPageChanged: (focusedDay) => _focusedDay = focusedDay,
                  eventLoader: (day) => _getEventsForDay(day, store.eventos),
                  getDeptColor: _getColorForDept,
                ),
                const SizedBox(height: 32),

                EventListSection(
                  selectedDay: _selectedDay ?? _focusedDay,
                  events: _getEventsForDay(_selectedDay ?? _focusedDay, store.eventos),
                  getDeptColor: _getColorForDept,
                ),
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
            onPressed: () => showAddEventModal(context, _selectedDay ?? DateTime.now()),
            backgroundColor: AppColors.primary,
            child: const Icon(Icons.add_rounded, color: Colors.white),
          ),
        ],
      ),
    );
  }


  Future<void> _exportToExcel() async {
    final store = context.read<EventosStore>();
    final excel = Excel.createExcel();
    final Sheet sheet = excel.sheets[excel.getDefaultSheet()]!;

    sheet.appendRow([TextCellValue('FECHA'), TextCellValue('EVENTO'), TextCellValue('DEPARTAMENTO'), TextCellValue('HORA')]);
    for (var ev in store.eventos) {
      final start = ev.fechaInicio;
      if (start == null) continue;

      sheet.appendRow([
        TextCellValue(DateFormat('yyyy-MM-dd').format(start)), 
        TextCellValue(ev.nombre), 
        TextCellValue(ev.departamento ?? 'General'), 
        TextCellValue(DateFormat('HH:mm').format(start))
      ]);
    }

    try {
      final bytes = excel.save();
      if (bytes != null) {
        if (kIsWeb) {
          if (!mounted) return;
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Reporte Excel generado en el navegador.')));
        } else {
          final directory = await getApplicationDocumentsDirectory();
          final file = io.File('${directory.path}/calendario_mpolog.xlsx');
          await file.writeAsBytes(bytes);
          if (!mounted) return;
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Excel guardado: ${file.path}')));
        }
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
    }
  }
}
