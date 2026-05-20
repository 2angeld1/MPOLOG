import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../logic/registro_detallado_store.dart';
import '../logic/auth_store.dart';
import '../models/persona_detallada_model.dart';
import '../styles/app_colors.dart';
import '../styles/app_text_styles.dart';
import '../widgets/glass_container.dart';
import '../widgets/glass_text_field.dart';
import '../data/api_constants.dart';

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
  final _edadController = TextEditingController();
  final _escuelaController = TextEditingController();
  final _tipoSangreController = TextEditingController();
  final _nombrePadresController = TextEditingController();
  final _correoController = TextEditingController();

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
      _edadController.text = persona.edad?.toString() ?? '';
      _escuelaController.text = persona.escuela ?? '';
      _tipoSangreController.text = persona.tipoSangre ?? '';
      _nombrePadresController.text = persona.nombrePadres ?? '';
      _correoController.text = persona.correo ?? '';
    } else {
      _nombreController.clear();
      _apellidoController.clear();
      _telefonoController.clear();
      _edadController.clear();
      _escuelaController.clear();
      _tipoSangreController.clear();
      _nombrePadresController.clear();
      _correoController.clear();
    }

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppColors.surface,
        title: Text(persona == null ? 'Nuevo Registro' : 'Editar Registro'),
        content: SizedBox(
          width: 400,
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                GlassTextField(label: 'Nombre', controller: _nombreController),
                const SizedBox(height: 16),
                GlassTextField(label: 'Apellido', controller: _apellidoController),
                const SizedBox(height: 16),
                GlassTextField(label: 'Edad del Niño', controller: _edadController, keyboardType: TextInputType.number),
                const SizedBox(height: 16),
                GlassTextField(label: 'Escuela / Colegio', controller: _escuelaController),
                const SizedBox(height: 16),
                GlassTextField(label: 'Tipo de Sangre', controller: _tipoSangreController),
                const SizedBox(height: 16),
                GlassTextField(label: 'Nombre de los Padres', controller: _nombrePadresController),
                const SizedBox(height: 16),
                GlassTextField(label: 'Teléfono', controller: _telefonoController, keyboardType: TextInputType.phone),
                const SizedBox(height: 16),
                GlassTextField(label: 'Correo (Opcional)', controller: _correoController, keyboardType: TextInputType.emailAddress),
              ],
            ),
          ),
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
                'edad': int.tryParse(_edadController.text),
                'escuela': _escuelaController.text,
                'tipoSangre': _tipoSangreController.text,
                'nombrePadres': _nombrePadresController.text,
                'correo': _correoController.text.trim().isEmpty ? null : _correoController.text.trim(),
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

  void _showQRDialog(BuildContext context) {
    final formUrl = '${ApiConstants.baseUrl.replaceAll('/api', '')}/registro-teen';
    final qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${Uri.encodeComponent(formUrl)}&color=9d4edd&bgcolor=ffffff';

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppColors.surface,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: Row(
          children: [
            const Icon(Icons.qr_code_2_rounded, color: AppColors.primary, size: 28),
            const SizedBox(width: 12),
            const Text(
              'QR de Registro',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20, color: Colors.white),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              'Escanea este código QR para abrir el formulario de captación de datos de JEF Teen en cualquier celular.',
              style: TextStyle(color: Colors.white70, fontSize: 13, height: 1.4),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 20),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.1),
                    blurRadius: 10,
                    spreadRadius: 2,
                  ),
                ],
              ),
              child: Image.network(
                qrUrl,
                width: 200,
                height: 200,
                loadingBuilder: (context, child, loadingProgress) {
                  if (loadingProgress == null) return child;
                  return const SizedBox(
                    width: 200,
                    height: 200,
                    child: Center(
                      child: CircularProgressIndicator(color: AppColors.primary),
                    ),
                  );
                },
                errorBuilder: (context, error, stackTrace) => Container(
                  width: 200,
                  height: 200,
                  color: Colors.white,
                  child: const Center(
                    child: Icon(Icons.error_outline_rounded, color: Colors.red, size: 40),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 20),
            GestureDetector(
              onTap: () async {
                final uri = Uri.parse(formUrl);
                if (await canLaunchUrl(uri)) {
                  await launchUrl(uri, mode: LaunchMode.externalApplication);
                }
              },
              child: Text(
                formUrl,
                style: const TextStyle(
                  color: AppColors.primary,
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  decoration: TextDecoration.underline,
                ),
                textAlign: TextAlign.center,
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('CERRAR', style: TextStyle(color: Colors.white54, fontWeight: FontWeight.bold)),
          ),
          ElevatedButton.icon(
            onPressed: () async {
              final uri = Uri.parse(formUrl);
              if (await canLaunchUrl(uri)) {
                await launchUrl(uri, mode: LaunchMode.externalApplication);
              }
            },
            icon: const Icon(Icons.open_in_browser_rounded, size: 18),
            label: const Text('ABRIR ENLACE'),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
        ],
      ),
    );
  }

  void _showDetailsSheet(BuildContext context, PersonaDetalladaModel p) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      isScrollControlled: true,
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.6,
        maxChildSize: 0.9,
        minChildSize: 0.4,
        expand: false,
        builder: (context, scrollController) => SingleChildScrollView(
          controller: scrollController,
          padding: const EdgeInsets.all(28),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Top drag indicator
              Center(
                child: Container(
                  width: 48,
                  height: 5,
                  decoration: BoxDecoration(
                    color: Colors.white24,
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  CircleAvatar(
                    radius: 28,
                    backgroundColor: AppColors.primary.withValues(alpha: 0.1),
                    child: Text(
                      p.nombre[0].toUpperCase(),
                      style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: 24),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Text(
                      '${p.nombre} ${p.apellido}',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 22, color: Colors.white),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 32),
              const Text(
                'INFORMACIÓN GENERAL',
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white38, letterSpacing: 1.5),
              ),
              const SizedBox(height: 16),
              _buildDetailItem(Icons.cake_rounded, 'Edad del Niño', p.edad != null ? '${p.edad} años' : 'No registrada'),
              _buildDetailItem(Icons.school_rounded, 'Escuela / Colegio', p.escuela != null && p.escuela!.isNotEmpty ? p.escuela! : 'No registrada'),
              _buildDetailItem(Icons.bloodtype_rounded, 'Tipo de Sangre', p.tipoSangre != null && p.tipoSangre!.isNotEmpty ? p.tipoSangre! : 'No registrado', iconColor: Colors.redAccent),
              _buildDetailItem(Icons.family_restroom_rounded, 'Representante / Padres', p.nombrePadres != null && p.nombrePadres!.isNotEmpty ? p.nombrePadres! : 'No registrado'),
              _buildDetailItem(Icons.phone_rounded, 'Teléfono', p.telefono),
              _buildDetailItem(Icons.email_rounded, 'Correo Electrónico', p.correo != null && p.correo!.isNotEmpty ? p.correo! : 'No registrado'),
              const SizedBox(height: 32),
              Row(
                children: [
                  Expanded(
                    child: TextButton(
                      onPressed: () => Navigator.pop(context),
                      style: TextButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      child: const Text('CERRAR', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white54)),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: () {
                        Navigator.pop(context);
                        _showAddDialog(persona: p);
                      },
                      icon: const Icon(Icons.edit_rounded, size: 18),
                      label: const Text('EDITAR', style: TextStyle(fontWeight: FontWeight.bold)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDetailItem(IconData icon, String label, String value, {Color? iconColor}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: iconColor ?? Colors.white70, size: 22),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: const TextStyle(fontSize: 12, color: Colors.white38)),
                const SizedBox(height: 4),
                Text(value, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Colors.white)),
              ],
            ),
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
              actions: [
                IconButton(
                  icon: const Icon(Icons.qr_code_2_rounded, size: 28),
                  tooltip: 'Mostrar QR de Registro',
                  onPressed: () => _showQRDialog(context),
                ),
                const SizedBox(width: 8),
              ],
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
                                          icon: const Icon(Icons.info_outline_rounded, color: Colors.white70, size: 20),
                                          tooltip: 'Ver detalles',
                                          onPressed: () => _showDetailsSheet(context, p),
                                        ),
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
