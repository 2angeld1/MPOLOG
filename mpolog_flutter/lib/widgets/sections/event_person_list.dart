import 'package:flutter/material.dart';
import 'package:mpolog_flutter/models/persona_model.dart';
import 'package:flutter_slidable/flutter_slidable.dart';
import 'package:url_launcher/url_launcher.dart';
import '../glass_container.dart';
import '../../styles/app_colors.dart';

class EventPersonList extends StatelessWidget {
  final List<PersonaModel> personas;
  final String searchQuery;
  final Function(PersonaModel) onEdit;
  final Function(PersonaModel) onDelete;

  const EventPersonList({
    super.key,
    required this.personas,
    required this.searchQuery,
    required this.onEdit,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    final filteredPersonas = personas.where((p) {
      if (searchQuery.isEmpty) return true;
      final nombre = p.nombre.toLowerCase();
      final apellido = p.apellido.toLowerCase();
      final equipo = p.equipo?.toLowerCase() ?? '';
      final query = searchQuery.toLowerCase();
      return nombre.contains(query) || 
             apellido.contains(query) || 
             equipo.contains(query);
    }).toList();

    if (filteredPersonas.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(40),
        alignment: Alignment.center,
        child: const Column(
          children: [
            Icon(Icons.group_outlined, color: Colors.white10, size: 48),
            SizedBox(height: 12),
            Text('Aún no hay registrados', style: TextStyle(color: Colors.white24)),
          ],
        ),
      );
    }

    return Column(
      children: filteredPersonas.map((p) => Padding(
        padding: const EdgeInsets.only(bottom: 12),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(20),
          child: Slidable(
            key: ValueKey(p.id),
            endActionPane: ActionPane(
              motion: const DrawerMotion(),
              extentRatio: 0.45,
              children: [
                CustomSlidableAction(
                  onPressed: (context) => onEdit(p),
                  backgroundColor: Colors.transparent,
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.amber.withValues(alpha: 0.2),
                      border: const Border(left: BorderSide(color: Colors.white12)),
                    ),
                    child: const Center(child: Icon(Icons.edit_rounded, color: Colors.amber, size: 22)),
                  ),
                ),
                CustomSlidableAction(
                  onPressed: (context) => onDelete(p),
                  backgroundColor: Colors.transparent,
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.redAccent.withValues(alpha: 0.2),
                      border: const Border(left: BorderSide(color: Colors.white12)),
                    ),
                    child: const Center(child: Icon(Icons.delete_rounded, color: Colors.redAccent, size: 22)),
                  ),
                ),
              ],
            ),
            child: GlassContainer(
              padding: const EdgeInsets.all(16),
              customBorderRadius: const BorderRadius.only(
                topLeft: Radius.circular(20),
                bottomLeft: Radius.circular(20),
              ),
              child: Row(
                children: [
                  CircleAvatar(
                    backgroundColor: AppColors.primary.withValues(alpha: 0.1),
                    child: Text(p.nombre[0].toUpperCase(), style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold)),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('${p.nombre} ${p.apellido == '.' ? '' : p.apellido}', style: const TextStyle(fontWeight: FontWeight.bold)),
                        Text('Edad: ${p.edad} • Tel: ${p.telefono}', style: const TextStyle(fontSize: 11, color: Colors.white38)),
                      ],
                    ),
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                       Text(p.abono ? '\$${p.montoAbono}' : 'PENDIENTE', 
                        style: TextStyle(
                          color: p.abono ? AppColors.success : Colors.redAccent, 
                          fontWeight: FontWeight.bold, 
                          fontSize: 12
                        )
                      ),
                      Text(p.tipoPago.toUpperCase(), style: const TextStyle(fontSize: 9, color: Colors.white24)),
                    ],
                  ),
                  if (p.comprobanteYappy != null) ...[
                    const SizedBox(width: 8),
                    IconButton(
                      icon: const Icon(Icons.image_search_rounded, color: AppColors.primary, size: 20),
                      onPressed: () => launchUrl(Uri.parse(p.comprobanteYappy!)),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ),
      )).toList(),
    );
  }
}
