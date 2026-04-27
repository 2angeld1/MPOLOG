import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../logic/registro_detallado_store.dart';
import '../logic/auth_store.dart';
import '../models/persona_detallada_model.dart';
import '../styles/app_colors.dart';
import '../styles/app_text_styles.dart';
import '../widgets/glass_container.dart';
import '../widgets/glass_text_field.dart';

class RegistroDetalladoPage extends StatefulWidget {
  const RegistroDetalladoPage({super.key});

  @override
  State<RegistroDetalladoPage> createState() => _RegistroDetalladoPageState();
}

class _RegistroDetalladoPageState extends State<RegistroDetalladoPage> {
  final Set<String> _selectedIds = {};
  final _nombreController = TextEditingController();
  final _apellidoController = TextEditingController();
  final _telefonoController = TextEditingController();

  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      if (mounted) context.read<RegistroDetalladoStore>().fetchPersonas();
    });
  }

  void _showAddDialog({PersonaDetalladaModel? persona}) {
    if (persona != null) {
      _nombreController.text = persona.nombre;
      _apellidoController.text = persona.apellido;
      _telefonoController.text = persona.telefono;
    } else {
      _nombreController.clear();
      _apellidoController.clear();
      _telefonoController.clear();
    }

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppColors.surface,
        title: Text(persona == null ? 'Nuevo Registro' : 'Editar Registro'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            GlassTextField(label: 'Nombre', controller: _nombreController),
            const SizedBox(height: 16),
            GlassTextField(label: 'Apellido', controller: _apellidoController),
            const SizedBox(height: 16),
            GlassTextField(label: 'Teléfono', controller: _telefonoController, keyboardType: TextInputType.phone),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('CANCELAR')),
          ElevatedButton(
            onPressed: () async {
              final store = context.read<RegistroDetalladoStore>();
              final data = {
                'nombre': _nombreController.text,
                'apellido': _apellidoController.text,
                'telefono': _telefonoController.text,
              };

              bool success;
              if (persona == null) {
                success = await store.crearPersona(data);
              } else {
                success = await store.actualizarPersona(persona.id, data);
              }

              if (!mounted) return;
              Navigator.pop(context);
              if (success) {
                ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(persona == null ? 'Creado' : 'Actualizado')));
              }
            },
            child: const Text('GUARDAR'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final store = context.watch<RegistroDetalladoStore>();
    final user = context.watch<AuthStore>().user;

    return Scaffold(
      backgroundColor: AppColors.background,
      floatingActionButton: Padding(
        padding: const EdgeInsets.only(bottom: 80), // Subir el botón para que no choque con el menú
        child: FloatingActionButton.extended(
          onPressed: () => _showAddDialog(),
          backgroundColor: AppColors.primary,
          icon: const Icon(Icons.add_rounded, color: Colors.white),
          label: const Text('NUEVO', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        ),
      ),
      body: RefreshIndicator(
        onRefresh: () => store.fetchPersonas(),
        child: CustomScrollView(
          slivers: [
            SliverAppBar(
              expandedHeight: 220,
              pinned: true,
              backgroundColor: AppColors.background,
              flexibleSpace: FlexibleSpaceBar(
                title: const Text('REGISTRO DETALLADO', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, letterSpacing: 2)),
                background: Stack(
                  fit: StackFit.expand,
                  children: [
                    Image.asset(
                      'assets/images/church_header.png',
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) => Container(color: AppColors.primary.withValues(alpha: 0.2)),
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
            if (_selectedIds.isNotEmpty)
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(24, 24, 24, 0),
                  child: GlassContainer(
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                    borderRadius: 16,
                    color: AppColors.primary.withValues(alpha: 0.1),
                    child: Row(
                      children: [
                        Text('${_selectedIds.length} ${_selectedIds.length == 1 ? 'seleccionado' : 'seleccionados'}', 
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                        const Spacer(),
                        ElevatedButton.icon(
                          onPressed: () async {
                            final success = await store.guardarAsistencias(_selectedIds.toList());
                            if (success && mounted) {
                              setState(() => _selectedIds.clear());
                              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Asistencias guardadas')));
                            }
                          },
                          icon: const Icon(Icons.check_rounded, size: 18, color: Colors.white),
                          label: const Text('MARCAR', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primary,
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            SliverPadding(
              padding: const EdgeInsets.all(24),
              sliver: store.isLoading
                  ? const SliverFillRemaining(child: Center(child: CircularProgressIndicator()))
                  : store.personas.isEmpty
                      ? const SliverFillRemaining(child: Center(child: Text('No hay registros')))
                      : SliverList(
                          delegate: SliverChildBuilderDelegate(
                            (context, index) {
                              final p = store.personas[index];
                              final isSelected = _selectedIds.contains(p.id);
                              final asistioHoy = p.asistioHoy();

                              return Padding(
                                padding: const EdgeInsets.only(bottom: 12),
                                child: GestureDetector(
                                  onLongPress: () => _showAddDialog(persona: p),
                                  onTap: () {
                                    setState(() {
                                      if (isSelected) {
                                        _selectedIds.remove(p.id);
                                      } else {
                                        _selectedIds.add(p.id);
                                      }
                                    });
                                  },
                                  child: GlassContainer(
                                    padding: const EdgeInsets.all(16),
                                    borderRadius: 20,
                                    border: isSelected ? Border.all(color: AppColors.primary, width: 2) : null,
                                    child: Row(
                                      children: [
                                        CircleAvatar(
                                          radius: 24,
                                          backgroundColor: asistioHoy ? AppColors.success.withValues(alpha: 0.2) : Colors.white10,
                                          child: Text(p.nombre[0].toUpperCase(), style: TextStyle(color: asistioHoy ? AppColors.success : Colors.white, fontWeight: FontWeight.bold)),
                                        ),
                                        const SizedBox(width: 16),
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              Text('${p.nombre} ${p.apellido}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                                              const SizedBox(height: 4),
                                              Row(
                                                children: [
                                                  const Icon(Icons.phone_rounded, size: 12, color: Colors.white38),
                                                  const SizedBox(width: 4),
                                                  Text(p.telefono, style: const TextStyle(fontSize: 12, color: Colors.white38)),
                                                ],
                                              ),
                                              const SizedBox(height: 4),
                                              Text('Asistencias: ${p.asistencias.length}', style: const TextStyle(fontSize: 11, color: AppColors.primary, fontWeight: FontWeight.w600)),
                                            ],
                                          ),
                                        ),
                                        if (isSelected) const Icon(Icons.check_circle, color: AppColors.primary),
                                        if (asistioHoy && !isSelected) const Icon(Icons.star, color: Colors.amber, size: 20),
                                        IconButton(
                                          icon: const Icon(Icons.delete_outline, color: Colors.redAccent, size: 20),
                                          onPressed: () async {
                                            final confirm = await showDialog<bool>(
                                              context: context,
                                              builder: (context) => AlertDialog(
                                                backgroundColor: AppColors.surface,
                                                title: const Text('¿Eliminar registro?'),
                                                content: Text('¿Deseas eliminar a ${p.nombre}?'),
                                                actions: [
                                                  TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('CANCELAR')),
                                                  TextButton(
                                                      onPressed: () => Navigator.pop(context, true),
                                                      child: const Text('ELIMINAR', style: TextStyle(color: Colors.redAccent))),
                                                ],
                                              ),
                                            );
                                            if (confirm == true) {
                                              await store.eliminarPersona(p.id);
                                            }
                                          },
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              );
                            },
                            childCount: store.personas.length,
                          ),
                        ),
            ),
            const SliverToBoxAdapter(child: SizedBox(height: 120)),
          ],
        ),
      ),
    );
  }
}
