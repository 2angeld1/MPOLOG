import 'package:flutter/material.dart';
import 'package:mpolog_flutter/models/evento_model.dart';
import 'package:table_calendar/table_calendar.dart';
import '../glass_container.dart';
import '../../styles/app_colors.dart';

class EventCalendar extends StatelessWidget {
  final DateTime focusedDay;
  final DateTime? selectedDay;
  final CalendarFormat calendarFormat;
  final List<EventoModel> allEvents;
  final Function(DateTime, DateTime) onDaySelected;
  final Function(CalendarFormat) onFormatChanged;
  final Function(DateTime) onPageChanged;
  final List<EventoModel> Function(DateTime) eventLoader;
  final Color Function(String) getDeptColor;

  const EventCalendar({
    super.key,
    required this.focusedDay,
    required this.selectedDay,
    required this.calendarFormat,
    required this.allEvents,
    required this.onDaySelected,
    required this.onFormatChanged,
    required this.onPageChanged,
    required this.eventLoader,
    required this.getDeptColor,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: GlassContainer(
        borderRadius: 24,
        padding: const EdgeInsets.all(8),
        child: TableCalendar(
          firstDay: DateTime.utc(2023, 1, 1),
          lastDay: DateTime.utc(2030, 12, 31),
          focusedDay: focusedDay,
          calendarFormat: calendarFormat,
          selectedDayPredicate: (day) => isSameDay(selectedDay, day),
          onDaySelected: onDaySelected,
          eventLoader: eventLoader,
          onFormatChanged: onFormatChanged,
          onPageChanged: onPageChanged,
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
                    final color = getDeptColor((event as EventoModel).departamento ?? 'General');
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
}
