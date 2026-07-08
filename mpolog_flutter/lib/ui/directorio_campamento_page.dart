import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../logic/registro_detallado_store.dart';
import '../styles/app_colors.dart';
import '../styles/app_text_styles.dart';

class DirectorioCampamentoPage extends StatefulWidget {
  const DirectorioCampamentoPage({super.key});

  @override
  State<DirectorioCampamentoPage> createState() => _DirectorioCampamentoPageState();
}

class _DirectorioCampamentoPageState extends State<DirectorioCampamentoPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<RegistroDetalladoStore>().fetchPersonas(departamento: 'Campamento');
    });
  }

  void _showEditDialog(BuildContext context, dynamic persona) {
    final nombreCtrl = TextEditingController(text: persona.nombre);
    final apellidoCtrl = TextEditingController(text: persona.apellido);
    final telefonoCtrl = TextEditingController(text: persona.telefono);
    String ministerio = persona.ministerio ?? 'Ninguno';

    showDialog(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          backgroundColor: AppColors.cardBackground,
          title: Text('Editar Registro', style: AppTextStyles.h3(context)),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: nombreCtrl,
                  style: const TextStyle(color: Colors.white),
                  decoration: const InputDecoration(labelText: 'Nombre', labelStyle: TextStyle(color: Colors.white54)),
                ),
                TextField(
                  controller: apellidoCtrl,
                  style: const TextStyle(color: Colors.white),
                  decoration: const InputDecoration(labelText: 'Apellido', labelStyle: TextStyle(color: Colors.white54)),
                ),
                TextField(
                  controller: telefonoCtrl,
                  style: const TextStyle(color: Colors.white),
                  decoration: const InputDecoration(labelText: 'Teléfono', labelStyle: TextStyle(color: Colors.white54)),
                ),
                const SizedBox(height: 16),
                DropdownButtonFormField<String>(
                  value: ministerio.isEmpty ? 'Ninguno' : ministerio,
                  dropdownColor: AppColors.cardBackground,
                  style: const TextStyle(color: Colors.white),
                  decoration: const InputDecoration(labelText: 'Ministerio', labelStyle: TextStyle(color: Colors.white54)),
                  items: const [
                    DropdownMenuItem(value: 'Ministerio de Logística', child: Text('Ministerio de Logística')),
                    DropdownMenuItem(value: 'Ministerio de Media', child: Text('Ministerio de Media')),
                    DropdownMenuItem(value: 'Ministerio de Exploradores', child: Text('Ministerio de Exploradores')),
                    DropdownMenuItem(value: 'Otro', child: Text('Otro Ministerio')),
                    DropdownMenuItem(value: 'Ninguno', child: Text('Ninguno')),
                  ],
                  onChanged: (val) {
                    if (val != null) ministerio = val;
                  },
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Cancelar', style: TextStyle(color: Colors.white54)),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
              onPressed: () async {
                final success = await context.read<RegistroDetalladoStore>().actualizarPersona(
                  persona.id,
                  {
                    'nombre': nombreCtrl.text,
                    'apellido': apellidoCtrl.text,
                    'telefono': telefonoCtrl.text,
                    'ministerio': ministerio,
                  },
                );
                if (mounted) {
                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text(success ? 'Actualizado' : 'Error al actualizar')),
                  );
                }
              },
              child: const Text('Guardar'),
            ),
          ],
        );
      },
    );
  }

  void _confirmDelete(BuildContext context, String id) {
    showDialog(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          backgroundColor: AppColors.cardBackground,
          title: Text('Eliminar', style: AppTextStyles.h3(context)),
          content: const Text('¿Seguro que deseas eliminar este registro?', style: TextStyle(color: Colors.white70)),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Cancelar', style: TextStyle(color: Colors.white54)),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: AppColors.error),
              onPressed: () async {
                final success = await context.read<RegistroDetalladoStore>().eliminarPersona(id);
                if (mounted) {
                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text(success ? 'Eliminado' : 'Error al eliminar')),
                  );
                }
              },
              child: const Text('Eliminar', style: TextStyle(color: Colors.white)),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Directorio Campamento'),
        backgroundColor: AppColors.background,
        elevation: 0,
      ),
      body: Consumer<RegistroDetalladoStore>(
        builder: (context, store, child) {
          if (store.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          final personas = store.personas.where((p) => p.departamento == 'Campamento').toList();

          if (personas.isEmpty) {
            return Center(
              child: Text(
                'No hay registros de campamento',
                style: AppTextStyles.body(context).copyWith(color: Colors.white54),
              ),
            );
          }

          return ListView.builder(
            itemCount: personas.length,
            padding: const EdgeInsets.all(16),
            itemBuilder: (context, index) {
              final p = personas[index];
              return Card(
                color: AppColors.cardBackground,
                margin: const EdgeInsets.only(bottom: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                child: ExpansionTile(
                  title: Text(p.nombreCompleto, style: AppTextStyles.h3(context).copyWith(fontSize: 16)),
                  subtitle: Text(p.ministerio ?? 'Sin Ministerio', style: const TextStyle(color: AppColors.primary)),
                  childrenPadding: const EdgeInsets.all(16),
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Teléfono:', style: TextStyle(color: Colors.white54)),
                        Text(p.telefono, style: const TextStyle(color: Colors.white)),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Asistencia:', style: TextStyle(color: Colors.white54)),
                        Text('${p.asistenciaFamilia ?? 'Solo'} ${p.miembrosFamilia != null && p.miembrosFamilia! > 0 ? '(+${p.miembrosFamilia})' : ''}', style: const TextStyle(color: Colors.white)),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Pago:', style: TextStyle(color: Colors.white54)),
                        Text(p.metodoPago ?? '-', style: const TextStyle(color: Colors.white)),
                      ],
                    ),
                    if (p.comprobantePago != null) ...[
                      const SizedBox(height: 16),
                      SizedBox(
                        width: double.infinity,
                        child: OutlinedButton.icon(
                          onPressed: () async {
                            final url = Uri.parse(p.comprobantePago!);
                            if (await canLaunchUrl(url)) {
                              await launchUrl(url);
                            }
                          },
                          icon: const Icon(Icons.receipt_long, size: 18),
                          label: const Text('Ver Comprobante'),
                          style: OutlinedButton.styleFrom(
                            foregroundColor: AppColors.primary,
                            side: const BorderSide(color: AppColors.primary),
                          ),
                        ),
                      ),
                    ],
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        TextButton.icon(
                          onPressed: () => _showEditDialog(context, p),
                          icon: const Icon(Icons.edit, size: 16, color: Colors.white70),
                          label: const Text('Editar', style: TextStyle(color: Colors.white70)),
                        ),
                        TextButton.icon(
                          onPressed: () => _confirmDelete(context, p.id),
                          icon: const Icon(Icons.delete, size: 16, color: AppColors.error),
                          label: const Text('Eliminar', style: TextStyle(color: AppColors.error)),
                        ),
                      ],
                    ),
                  ],
                ),
              );
            },
          );
        },
      ),
    );
  }
}
