import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../glass_container.dart';
import '../sections/section_header.dart';

class EventListSection extends StatelessWidget {
  final DateTime selectedDay;
  final List<dynamic> events;
  final Color Function(String) getDeptColor;

  const EventListSection({
    super.key,
    required this.selectedDay,
    required this.events,
    required this.getDeptColor,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SectionHeader(
            title: DateFormat('EEEE, d MMMM').format(selectedDay).toUpperCase(),
          ),
          if (events.isEmpty)
            const Center(
              child: Padding(
                padding: EdgeInsets.symmetric(vertical: 40),
                child: Text('Sin asignaciones para hoy', style: TextStyle(color: Colors.white10)),
              ),
            ),
          ...events.map((event) {
            final color = getDeptColor((event as dynamic)['departamento'] ?? '');
            return Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: GlassContainer(
                padding: const EdgeInsets.all(16),
                borderRadius: 20,
                child: Row(
                  children: [
                    Container(
                      width: 3, 
                      height: 30, 
                      decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(1.5))
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start, 
                        children: [
                          Text(
                            (event as dynamic)['nombre'] ?? 'Tarea', 
                            style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white, fontSize: 14)
                          ),
                          Text(
                            (event as dynamic)['departamento'] ?? 'General', 
                            style: TextStyle(color: color.withValues(alpha: 0.7), fontSize: 11)
                          ),
                        ]
                      ),
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
    return Text(
      DateFormat('HH:mm').format(start), 
      style: const TextStyle(color: Colors.white38, fontSize: 11, fontWeight: FontWeight.bold)
    );
  }
}
