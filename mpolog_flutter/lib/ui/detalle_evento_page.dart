import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:mpolog_flutter/models/evento_model.dart';
import 'package:mpolog_flutter/models/persona_model.dart';
import 'dart:ui';
import '../logic/eventos_store.dart';
import '../styles/app_colors.dart';
import '../styles/app_text_styles.dart';
import '../widgets/cards/event_info_card.dart';
import '../widgets/sections/event_stats_row.dart';
import '../widgets/sections/event_person_list.dart';
import '../widgets/items/event_searchbar.dart';
import '../widgets/modals/persona_registration_modal.dart';
import '../widgets/sections/section_header.dart';

class DetalleEventoPage extends StatefulWidget {
  final EventoModel evento;
  const DetalleEventoPage({super.key, required this.evento});

  @override
  State<DetalleEventoPage> createState() => _DetalleEventoPageState();
}

class _DetalleEventoPageState extends State<DetalleEventoPage> {
  final _searchController = TextEditingController();
  String _searchQuery = '';


  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<EventosStore>().setSelectedEvento(widget.evento.id);
    });
  }

  @override
  Widget build(BuildContext context) {
    final store = context.watch<EventosStore>();
    final stats = store.estadisticas;

    return Scaffold(
      floatingActionButton: Padding(
        padding: const EdgeInsets.only(bottom: 10, right: 0),
        child: FloatingActionButton.extended(
          heroTag: 'fab_detalle_evento',
          onPressed: () =>
              showPersonaRegistrationModal(context, widget.evento.id),
          backgroundColor: AppColors.primary,
          icon: const Icon(Icons.person_add_rounded, color: Colors.white),
          label: const Text('REGISTRAR', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, letterSpacing: 1)),
        ),
      ),
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 240,
            pinned: true,
            backgroundColor: AppColors.background,
            flexibleSpace: FlexibleSpaceBar(
              title: Text(widget.evento.nombre.toUpperCase(), 
                style: AppTextStyles.h3(context).copyWith(fontSize: 16)),
              background: Stack(
                fit: StackFit.expand,
                children: [
                  Image.asset(
                    'assets/images/church_header.png',
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) => Container(color: AppColors.surface),
                  ),
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.black.withValues(alpha: 0.3),
                          AppColors.background,
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          SliverPadding(
            padding: const EdgeInsets.all(24),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                EventInfoCard(evento: widget.evento),
                const SizedBox(height: 32),

                if (stats != null) EventStatsRow(stats: stats),
                const SizedBox(height: 32),
                
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const SectionHeader(title: 'PERSONAS REGISTRADAS'),
                    Text('${store.personas.length}', style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold)),
                  ],
                ),
                const SizedBox(height: 16),
                
                EventSearchbar(
                  controller: _searchController,
                  searchQuery: _searchQuery,
                  onChanged: (v) =>
                      setState(() => _searchQuery = v.toLowerCase()),
                  onClear: () {
                    _searchController.clear();
                    setState(() => _searchQuery = '');
                  },
                ),
                const SizedBox(height: 16),

                EventPersonList(
                  personas: store.personas,
                  searchQuery: _searchQuery,
                  onEdit: (p) => showPersonaRegistrationModal(
                    context,
                    widget.evento.id,
                    persona: p,
                  ),
                  onDelete: (p) => _confirmDelete(p),
                ),
                const SizedBox(height: 120),
              ]),
            ),
          ),
        ],
      ),
    );
  }

  void _confirmDelete(PersonaModel p) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppColors.surface,
        title: const Text('¿Eliminar registro?'),
        content: Text('¿Deseas eliminar a ${p.nombre} de este evento?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('CANCELAR')),
          TextButton(
            onPressed: () {
              context.read<EventosStore>().eliminarPersona(widget.evento.id, p.id);
              Navigator.pop(context);
            }, 
            child: const Text('ELIMINAR', style: TextStyle(color: Colors.redAccent))
          ),
        ],
      ),
    );
  }

  // Los widgets auxiliares se han movido a componentes externos.

}
