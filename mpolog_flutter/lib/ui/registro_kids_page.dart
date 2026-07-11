import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:file_picker/file_picker.dart';
import 'package:csv/csv.dart';
import '../logic/registro_kids_store.dart';
import '../logic/auth_store.dart';
import '../models/persona_detallada_model.dart';
import '../styles/app_colors.dart';
import '../widgets/glass_container.dart';
import '../widgets/glass_text_field.dart';
import '../data/api_constants.dart';

class RegistroKidsPage extends StatefulWidget {
  const RegistroKidsPage({super.key});

  @override
  State<RegistroKidsPage> createState() => _RegistroKidsPageState();
}

class _RegistroKidsPageState extends State<RegistroKidsPage>
    with SingleTickerProviderStateMixin {
  late final TabController _tabController;
  int _selectedTabIndex = 0;
  final Set<String> _selectedIds = {};
  final _nombreController = TextEditingController();
  final _apellidoController = TextEditingController();
  final _telefonoController = TextEditingController();
  final _edadController = TextEditingController();
  final _tipoSangreController = TextEditingController();
  final _tallaSueterController = TextEditingController();
  final _adultoResponsableController = TextEditingController();
  final _direccionController = TextEditingController();
  final _alergiasMedicamentosController = TextEditingController();
  String? _grupoSeleccionado;
  String? _fotoBase64;
  bool _esComandanteSeleccionado = false;

  static const _tabs = [
    _GrupoTab(valor: 'exploradores', label: 'Exploradores'),
    _GrupoTab(valor: 'seguidores de la senda', label: 'Seguidores'),
    _GrupoTab(valor: 'pioneros', label: 'Pioneros'),
    _GrupoTab(valor: 'navegantes', label: 'Navegantes'),
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _tabs.length, vsync: this);
    Future.microtask(() {
      if (mounted) {
        context.read<RegistroKidsStore>().fetchPersonas();
      }
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    _nombreController.dispose();
    _apellidoController.dispose();
    _telefonoController.dispose();
    _edadController.dispose();
    _tipoSangreController.dispose();
    _tallaSueterController.dispose();
    _adultoResponsableController.dispose();
    _direccionController.dispose();
    _alergiasMedicamentosController.dispose();
    super.dispose();
  }

  String _grupoActual() => _tabs[_selectedTabIndex].valor;

  List<PersonaDetalladaModel> _filtrarPorGrupo(
    List<PersonaDetalladaModel> personas,
  ) {
    final grupo = _grupoActual();
    return personas.where((p) => p.grupo?.toLowerCase() == grupo).toList();
  }

  void _showAddDialog({PersonaDetalladaModel? persona}) {
    if (persona != null) {
      _nombreController.text = persona.nombre;
      _apellidoController.text = persona.apellido;
      _telefonoController.text = persona.telefono;
      _edadController.text = persona.edad?.toString() ?? '';
      _tipoSangreController.text = persona.tipoSangre ?? '';
      _tallaSueterController.text = persona.tallaSueter ?? '';
      _adultoResponsableController.text = persona.adultoResponsable ?? '';
      _direccionController.text = persona.direccion ?? '';
      _alergiasMedicamentosController.text = persona.alergiasMedicamentos ?? '';
      _grupoSeleccionado = persona.grupo;
      _fotoBase64 = persona.foto;
      _esComandanteSeleccionado = persona.esComandante;
    } else {
      _nombreController.clear();
      _apellidoController.clear();
      _telefonoController.clear();
      _edadController.clear();
      _tipoSangreController.clear();
      _tallaSueterController.clear();
      _adultoResponsableController.clear();
      _direccionController.clear();
      _alergiasMedicamentosController.clear();
      _grupoSeleccionado = null;
      _fotoBase64 = null;
      _esComandanteSeleccionado = false;
    }

    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.surface,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (context) {
        return DraggableScrollableSheet(
          initialChildSize: 0.85,
          maxChildSize: 0.95,
          minChildSize: 0.5,
          expand: false,
          builder: (context, scrollController) {
            return StatefulBuilder(
              builder: (context, setDialogState) {
                return SingleChildScrollView(
                  controller: scrollController,
                  padding: const EdgeInsets.all(28),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
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
                      Text(
                        persona == null ? 'Nuevo Registro' : 'Editar Registro',
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 22,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 24),
                      Center(
                        child: Column(
                          children: [
                            GestureDetector(
                              onTap: () async {
                                final picker = ImagePicker();
                                final XFile? image = await picker.pickImage(
                                  source: ImageSource.camera,
                                  imageQuality: 50,
                                );
                                if (image != null) {
                                  final bytes = await image.readAsBytes();
                                  final base64String =
                                      'data:image/jpeg;base64,${base64Encode(bytes)}';
                                  setDialogState(() {
                                    _fotoBase64 = base64String;
                                  });
                                }
                              },
                              child: Container(
                                width: 100,
                                height: 100,
                                decoration: BoxDecoration(
                                  color: Colors.white.withValues(alpha: 0.05),
                                  shape: BoxShape.circle,
                                  border: Border.all(
                                    color: AppColors.primary,
                                    width: 2,
                                  ),
                                  boxShadow: [
                                    BoxShadow(
                                      color: AppColors.primary.withValues(
                                        alpha: 0.15,
                                      ),
                                      blurRadius: 10,
                                      spreadRadius: 2,
                                    ),
                                  ],
                                ),
                                child: _fotoBase64 != null
                                    ? ClipRRect(
                                        borderRadius: BorderRadius.circular(50),
                                        child: _fotoBase64!.startsWith('http')
                                            ? Image.network(
                                                _fotoBase64!,
                                                fit: BoxFit.cover,
                                                width: 100,
                                                height: 100,
                                              )
                                            : Image.memory(
                                                base64Decode(
                                                  _fotoBase64!.split(',')[1],
                                                ),
                                                fit: BoxFit.cover,
                                                width: 100,
                                                height: 100,
                                              ),
                                      )
                                    : const Icon(
                                        Icons.camera_alt_rounded,
                                        color: Colors.white54,
                                        size: 32,
                                      ),
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              _esComandanteSeleccionado ? 'Foto (Toca para capturar)' : 'Foto del Niño (Toca para capturar)',
                              style: const TextStyle(
                                color: Colors.white38,
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 24),
                      GlassTextField(
                        label: _esComandanteSeleccionado ? 'Nombre Completo *' : 'Nombre Completo del Niño *',
                        controller: _nombreController,
                      ),
                      const SizedBox(height: 16),
                      GlassTextField(
                        label: 'Apellido *',
                        controller: _apellidoController,
                      ),
                      const SizedBox(height: 16),
                      GlassTextField(
                        label: 'Edad *',
                        controller: _edadController,
                        keyboardType: TextInputType.number,
                      ),
                      const SizedBox(height: 16),
                      GlassTextField(
                        label: 'Talla de Suéter (Dryfit) *',
                        controller: _tallaSueterController,
                      ),
                      const SizedBox(height: 16),
                      DropdownButtonFormField<String>(
                        dropdownColor: AppColors.surface,
                        value: _grupoSeleccionado,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 15,
                        ),
                        decoration: InputDecoration(
                          labelText: 'Grupo Perteneciente *',
                          labelStyle: const TextStyle(color: Colors.white54),
                          filled: true,
                          fillColor: Colors.white.withValues(alpha: 0.05),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: BorderSide.none,
                          ),
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 12,
                          ),
                        ),
                        items: const [
                          DropdownMenuItem(
                            value: 'exploradores',
                            child: Text('Exploradores'),
                          ),
                          DropdownMenuItem(
                            value: 'seguidores de la senda',
                            child: Text('Seguidores de la Senda'),
                          ),
                          DropdownMenuItem(
                            value: 'pioneros',
                            child: Text('Pioneros'),
                          ),
                          DropdownMenuItem(
                            value: 'navegantes',
                            child: Text('Navegantes'),
                          ),
                        ],
                        onChanged: (val) {
                          setDialogState(() => _grupoSeleccionado = val);
                        },
                      ),
                      const SizedBox(height: 16),
                      SwitchListTile(
                        contentPadding: EdgeInsets.zero,
                        title: const Text(
                          'Es Comandante de este grupo',
                          style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w600),
                        ),
                        value: _esComandanteSeleccionado,
                        activeColor: AppColors.accent,
                        onChanged: (val) {
                          setDialogState(() {
                            _esComandanteSeleccionado = val;
                          });
                        },
                      ),
                      if (!_esComandanteSeleccionado) ...[
                        const SizedBox(height: 16),
                        GlassTextField(
                          label: 'Nombre del Adulto Responsable *',
                          controller: _adultoResponsableController,
                        ),
                      ],
                      const SizedBox(height: 16),
                      GlassTextField(
                        label: _esComandanteSeleccionado ? 'Teléfono *' : 'Teléfono del Adulto *',
                        controller: _telefonoController,
                        keyboardType: TextInputType.phone,
                      ),
                      const SizedBox(height: 16),
                      GlassTextField(
                        label: 'Dirección de Residencia *',
                        controller: _direccionController,
                      ),
                      const SizedBox(height: 16),
                      GlassTextField(
                        label: 'Alergias y Medicamentos (separados por comas)',
                        controller: _alergiasMedicamentosController,
                        maxLines: 2,
                      ),
                      const SizedBox(height: 16),
                      GlassTextField(
                        label: 'Tipo de Sangre',
                        controller: _tipoSangreController,
                      ),
                      const SizedBox(height: 32),
                      Row(
                        children: [
                          Expanded(
                            child: TextButton(
                              onPressed: () => Navigator.pop(context),
                              style: TextButton.styleFrom(
                                padding: const EdgeInsets.symmetric(vertical: 16),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(16),
                                ),
                              ),
                              child: const Text(
                                'CANCELAR',
                                style: TextStyle(
                                  color: Colors.white54,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: ElevatedButton(
                              onPressed: () async {
                                if (_nombreController.text.trim().isEmpty ||
                                    _apellidoController.text.trim().isEmpty ||
                                    _telefonoController.text.trim().isEmpty ||
                                    _edadController.text.trim().isEmpty ||
                                    _tallaSueterController.text.trim().isEmpty ||
                                    _grupoSeleccionado == null ||
                                    (!_esComandanteSeleccionado && _adultoResponsableController.text.trim().isEmpty) ||
                                    _direccionController.text.trim().isEmpty) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(
                                      content: Text(
                                        'Por favor, completa los campos requeridos (*).',
                                      ),
                                    ),
                                  );
                                  return;
                                }

                                final store = context.read<RegistroKidsStore>();
                                final data = {
                                  'nombre': _nombreController.text,
                                  'apellido': _apellidoController.text,
                                  'telefono': _telefonoController.text,
                                  'edad': int.tryParse(_edadController.text),
                                  'tipoSangre': _tipoSangreController.text,
                                  'departamento': 'Kids',
                                  if (_fotoBase64 != null) 'foto': _fotoBase64,
                                  'tallaSueter': _tallaSueterController.text,
                                  'grupo': _grupoSeleccionado,
                                  'adultoResponsable': _esComandanteSeleccionado ? '' : _adultoResponsableController.text,
                                  'direccion': _direccionController.text,
                                  'alergiasMedicamentos': _alergiasMedicamentosController.text,
                                  'esComandante': _esComandanteSeleccionado,
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
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(
                                      content: Text(
                                        persona == null
                                            ? 'Creado correctamente'
                                            : 'Actualizado correctamente',
                                      ),
                                    ),
                                  );
                                }
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppColors.primary,
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(vertical: 16),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(16),
                                ),
                              ),
                              child: const Text(
                                'GUARDAR',
                                style: TextStyle(fontWeight: FontWeight.bold),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                );
              },
            );
          },
        );
      },
    );
  }

  Future<bool> _askIfComandante(String nombreCompleto, int edad) async {
    final result = await showDialog<bool>(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        backgroundColor: AppColors.surface,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text(
          'Confirmar Comandante',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        content: Text(
          '¿$nombreCompleto ($edad años) es comandante de su grupo?',
          style: const TextStyle(color: Colors.white70),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text(
              'NO',
              style: TextStyle(color: Colors.white54, fontWeight: FontWeight.bold),
            ),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: const Text('SÍ', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
    return result ?? false;
  }

  Future<void> _importarCSV() async {
    try {
      final result = await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['csv'],
        withData: true,
      );

      if (result == null || result.files.isEmpty) return;

      final fileBytes = result.files.first.bytes;
      if (fileBytes == null) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('No se pudo leer el archivo.')),
          );
        }
        return;
      }

      final csvString = utf8.decode(fileBytes, allowMalformed: true);
      final List<List<dynamic>> rows = const CsvToListConverter(eol: '\n', fieldDelimiter: ',').convert(csvString);

      if (rows.length <= 1) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('El archivo CSV está vacío o sin datos.')),
          );
        }
        return;
      }

      List<Map<String, dynamic>> listaPersonas = [];

      for (int i = 1; i < rows.length; i++) {
        final row = rows[i];
        if (row.length < 10) continue; 

        String nombreCompleto = row[1].toString().trim();
        List<String> partes = nombreCompleto.split(' ');
        String nombre = partes.isNotEmpty ? partes.first : '';
        String apellido = partes.length > 1 ? partes.sublist(1).join(' ') : '';
        
        int? edad = int.tryParse(row[2].toString().trim());
        String tallaSueter = row[3].toString().trim();
        
        String grupoStr = row[4].toString().toLowerCase().trim();
        String grupoSeleccionado = 'exploradores';
        if (grupoStr.contains('pionero')) grupoSeleccionado = 'pioneros';
        else if (grupoStr.contains('navegante')) grupoSeleccionado = 'navegantes';
        else if (grupoStr.contains('seguidor')) grupoSeleccionado = 'seguidores de la senda';

        String tipoSangre = row[5].toString().trim();
        String adultoResponsable = row[6].toString().trim();
        String telefono = row[7].toString().trim();
        String direccion = row[8].toString().trim();
        String alergias = row[9].toString().trim();

        bool esComandante = false;
        if (edad != null) {
          if (edad > 19) {
            esComandante = true;
          } else if (edad >= 18) {
            esComandante = await _askIfComandante(nombreCompleto, edad);
          }
        }

        listaPersonas.add({
          'nombre': nombre,
          'apellido': apellido,
          'telefono': telefono,
          'edad': edad,
          'tipoSangre': tipoSangre,
          'departamento': 'Kids',
          'tallaSueter': tallaSueter,
          'grupo': grupoSeleccionado,
          'adultoResponsable': esComandante ? '' : adultoResponsable,
          'direccion': direccion,
          'alergiasMedicamentos': alergias,
          'esComandante': esComandante,
        });
      }

      if (listaPersonas.isEmpty) return;

      if (!mounted) return;
      final store = context.read<RegistroKidsStore>();
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Importando \${listaPersonas.length} registros, por favor espera...')),
      );

      final importados = await store.importarListaPersonas(listaPersonas);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Se importaron $importados registros correctamente.')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error al importar: $e')),
        );
      }
    }
  }

  void _showQRDialog(BuildContext context) {
    final formUrl =
        '${ApiConstants.baseUrl.replaceAll('/api', '')}/registro-mentor-club';
    final qrUrl =
        'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${Uri.encodeComponent(formUrl)}&color=f72585&bgcolor=ffffff';

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppColors.surface,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: Row(
          children: const [
            Icon(Icons.qr_code_2_rounded, color: AppColors.primary, size: 28),
            SizedBox(width: 12),
            Text(
              'QR de Registro Kids',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 20,
                color: Colors.white,
              ),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              'Escanea este código QR para abrir el formulario de captación de datos de Mentor Club en cualquier celular.',
              style: TextStyle(
                color: Colors.white70,
                fontSize: 13,
                height: 1.4,
              ),
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
                      child: CircularProgressIndicator(
                        color: AppColors.primary,
                      ),
                    ),
                  );
                },
                errorBuilder: (context, error, stackTrace) => Container(
                  width: 200,
                  height: 200,
                  color: Colors.white,
                  child: const Center(
                    child: Icon(
                      Icons.error_outline_rounded,
                      color: Colors.red,
                      size: 40,
                    ),
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
            child: const Text(
              'CERRAR',
              style: TextStyle(
                color: Colors.white54,
                fontWeight: FontWeight.bold,
              ),
            ),
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
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showChildQRDialog(BuildContext context, PersonaDetalladaModel p) {
    final carnetUrl =
        '${ApiConstants.baseUrl.replaceAll('/api', '')}/carnet/${p.id}';
    final qrUrl =
        'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${Uri.encodeComponent(carnetUrl)}&color=f72585&bgcolor=ffffff';

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppColors.surface,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: Row(
          children: const [
            Icon(Icons.qr_code_2_rounded, color: AppColors.primary, size: 28),
            SizedBox(width: 12),
            Text(
              'Código QR del Niño',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 18,
                color: Colors.white,
              ),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Escanea este QR para ver el Carnet Digital de ${p.nombre} ${p.apellido} en la web.',
              style: const TextStyle(
                color: Colors.white70,
                fontSize: 13,
                height: 1.4,
              ),
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
                      child: CircularProgressIndicator(
                        color: AppColors.primary,
                      ),
                    ),
                  );
                },
                errorBuilder: (context, error, stackTrace) => Container(
                  width: 200,
                  height: 200,
                  color: Colors.white,
                  child: const Center(
                    child: Icon(
                      Icons.error_outline_rounded,
                      color: Colors.red,
                      size: 40,
                    ),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 20),
            GestureDetector(
              onTap: () async {
                final uri = Uri.parse(carnetUrl);
                if (await canLaunchUrl(uri)) {
                  await launchUrl(uri, mode: LaunchMode.externalApplication);
                }
              },
              child: Text(
                carnetUrl,
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
            child: const Text(
              'CERRAR',
              style: TextStyle(
                color: Colors.white54,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          ElevatedButton.icon(
            onPressed: () async {
              final uri = Uri.parse(carnetUrl);
              if (await canLaunchUrl(uri)) {
                await launchUrl(uri, mode: LaunchMode.externalApplication);
              }
            },
            icon: const Icon(Icons.open_in_browser_rounded, size: 18),
            label: const Text('ABRIR EN WEB'),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
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
                    backgroundImage: p.foto != null && p.foto!.isNotEmpty
                        ? NetworkImage(p.foto!)
                        : null,
                    child: p.foto == null || p.foto!.isEmpty
                        ? Text(
                            p.nombre[0].toUpperCase(),
                            style: const TextStyle(
                              color: AppColors.primary,
                              fontWeight: FontWeight.bold,
                              fontSize: 24,
                            ),
                          )
                        : null,
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '${p.nombre} ${p.apellido}',
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 22,
                            color: Colors.white,
                          ),
                        ),
                        if (p.esComandante) ...[
                          const SizedBox(height: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: AppColors.accent.withValues(alpha: 0.15),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: AppColors.accent, width: 1),
                            ),
                            child: const Text(
                              'COMANDANTE',
                              style: TextStyle(
                                color: AppColors.accent,
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 32),
              const Text(
                'INFORMACIÓN GENERAL',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: Colors.white38,
                  letterSpacing: 1.5,
                ),
              ),
              const SizedBox(height: 16),
              _buildDetailItem(
                Icons.cake_rounded,
                'Edad',
                p.edad != null ? '${p.edad} años' : 'No registrada',
              ),
              _buildDetailItem(
                Icons.bloodtype_rounded,
                'Tipo de Sangre',
                p.tipoSangre != null && p.tipoSangre!.isNotEmpty
                    ? p.tipoSangre!
                    : 'No registrado',
                iconColor: Colors.redAccent,
              ),
              _buildDetailItem(
                Icons.checkroom_rounded,
                'Talla de Suéter (Dryfit)',
                p.tallaSueter?.isNotEmpty == true
                    ? p.tallaSueter!
                    : 'No registrada',
              ),
              _buildDetailItem(
                Icons.group_work_rounded,
                'Grupo Perteneciente',
                p.grupo?.isNotEmpty == true
                    ? p.grupo!.toUpperCase()
                    : 'No registrado',
              ),
              if (!p.esComandante) ...[
                _buildDetailItem(
                  Icons.family_restroom_rounded,
                  'Adulto Responsable',
                  p.adultoResponsable?.isNotEmpty == true
                      ? p.adultoResponsable!
                      : 'No registrado',
                ),
                _buildDetailItem(
                  Icons.phone_rounded,
                  'Teléfono del Adulto',
                  p.telefono,
                ),
              ] else ...[
                _buildDetailItem(
                  Icons.phone_rounded,
                  'Teléfono del Comandante',
                  p.telefono,
                ),
              ],
              _buildDetailItem(
                Icons.location_on_rounded,
                'Dirección de Residencia',
                p.direccion?.isNotEmpty == true
                    ? p.direccion!
                    : 'No registrada',
              ),
              _buildDetailItem(
                Icons.healing_rounded,
                'Alergias y Medicamentos',
                p.alergiasMedicamentos?.isNotEmpty == true
                    ? p.alergiasMedicamentos!
                    : 'Ninguna registrada',
                iconColor: Colors.orangeAccent,
              ),
              const SizedBox(height: 24),
              ElevatedButton.icon(
                onPressed: () => _showChildQRDialog(context, p),
                icon: const Icon(Icons.qr_code_rounded, size: 20),
                label: const Text(
                  'VER CARNET / CÓDIGO QR',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary.withValues(alpha: 0.15),
                  foregroundColor: AppColors.primary,
                  side: const BorderSide(color: AppColors.primary, width: 1.5),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  minimumSize: const Size(double.infinity, 50),
                ),
              ),
              const SizedBox(height: 32),
              Row(
                children: [
                  Expanded(
                    child: TextButton(
                      onPressed: () => Navigator.pop(context),
                      style: TextButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                      ),
                      child: const Text(
                        'CERRAR',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          color: Colors.white54,
                        ),
                      ),
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
                      label: const Text(
                        'EDITAR',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
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

  Widget _buildDetailItem(
    IconData icon,
    String label,
    String value, {
    Color? iconColor,
  }) {
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
                Text(
                  label,
                  style: const TextStyle(fontSize: 12, color: Colors.white38),
                ),
                const SizedBox(height: 4),
                Text(
                  value,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final store = context.watch<RegistroKidsStore>();

    return Scaffold(
      backgroundColor: AppColors.background,
      floatingActionButton: Padding(
        padding: const EdgeInsets.only(bottom: 80),
        child: FloatingActionButton.extended(
          onPressed: () => _showAddDialog(),
          backgroundColor: AppColors.primary,
          icon: const Icon(Icons.add_rounded, color: Colors.white),
          label: const Text(
            'NUEVO',
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
          ),
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
                  icon: const Icon(Icons.upload_file_rounded, size: 28),
                  tooltip: 'Importar CSV',
                  onPressed: _importarCSV,
                ),
                IconButton(
                  icon: const Icon(Icons.qr_code_2_rounded, size: 28),
                  tooltip: 'Mostrar QR de Registro Kids',
                  onPressed: () => _showQRDialog(context),
                ),
                const SizedBox(width: 8),
              ],
              flexibleSpace: FlexibleSpaceBar(
                title: const Text(
                  'REGISTRO KIDS',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 2,
                  ),
                ),
                background: Stack(
                  fit: StackFit.expand,
                  children: [
                    Image.asset(
                      'assets/images/church_header.png',
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) => Container(
                        color: AppColors.primary.withValues(alpha: 0.2),
                      ),
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
            SliverPersistentHeader(
              pinned: true,
              delegate: _TabHeaderDelegate(
                tabController: _tabController,
                tabs: _tabs,
                onTap: (index) {
                  setState(() {
                    _selectedTabIndex = index;
                  });
                },
              ),
            ),
            if (_selectedIds.isNotEmpty)
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(24, 24, 24, 0),
                  child: GlassContainer(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 20,
                      vertical: 12,
                    ),
                    borderRadius: 16,
                    color: AppColors.primary.withValues(alpha: 0.1),
                    child: Row(
                      children: [
                        Text(
                          '${_selectedIds.length} ${_selectedIds.length == 1 ? 'seleccionado' : 'seleccionados'}',
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                          ),
                        ),
                        const Spacer(),
                        ElevatedButton.icon(
                          onPressed: () async {
                            final success = await store.guardarAsistencias(
                              _selectedIds.toList(),
                            );
                            if (success && mounted) {
                              setState(() => _selectedIds.clear());
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Asistencias guardadas'),
                                ),
                              );
                            }
                          },
                          icon: const Icon(
                            Icons.check_rounded,
                            size: 18,
                            color: Colors.white,
                          ),
                          label: const Text(
                            'MARCAR',
                            style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 12,
                            ),
                          ),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primary,
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            padding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 8,
                            ),
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
                  ? const SliverFillRemaining(
                      child: Center(child: CircularProgressIndicator()),
                    )
                  : _buildGroupList(store),
            ),
            const SliverToBoxAdapter(child: SizedBox(height: 120)),
          ],
        ),
      ),
    );
  }

  Widget _buildGroupList(RegistroKidsStore store) {
    final personasFiltradas = _filtrarPorGrupo(store.personas);

    if (personasFiltradas.isEmpty) {
      return const SliverFillRemaining(
        child: Center(
          child: Text(
            'No hay registros en este grupo',
            style: TextStyle(color: Colors.white54),
          ),
        ),
      );
    }

    return SliverList(
      delegate: SliverChildBuilderDelegate((context, index) {
        final p = personasFiltradas[index];
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
              border: isSelected
                  ? Border.all(color: AppColors.primary, width: 2)
                  : p.esComandante
                      ? Border.all(color: AppColors.accent, width: 2)
                      : null,
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 24,
                    backgroundColor: asistioHoy
                        ? AppColors.success.withValues(alpha: 0.2)
                        : p.esComandante
                            ? AppColors.accent.withValues(alpha: 0.2)
                            : Colors.white10,
                    backgroundImage: p.foto != null && p.foto!.isNotEmpty
                        ? NetworkImage(p.foto!)
                        : null,
                    child: p.foto == null || p.foto!.isEmpty
                        ? Text(
                            p.nombre[0].toUpperCase(),
                            style: TextStyle(
                              color: asistioHoy
                                  ? AppColors.success
                                  : p.esComandante
                                      ? AppColors.accent
                                      : Colors.white,
                              fontWeight: FontWeight.bold,
                            ),
                          )
                        : null,
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: Text(
                                '${p.nombre} ${p.apellido}',
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                ),
                              ),
                            ),
                            if (p.esComandante)
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                decoration: BoxDecoration(
                                  color: AppColors.accent.withValues(alpha: 0.15),
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(color: AppColors.accent, width: 1),
                                ),
                                child: const Text(
                                  'COMANDANTE',
                                  style: TextStyle(
                                    color: AppColors.accent,
                                    fontSize: 8,
                                    fontWeight: FontWeight.bold,
                                    letterSpacing: 0.5,
                                  ),
                                ),
                              ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            const Icon(
                              Icons.phone_rounded,
                              size: 12,
                              color: Colors.white38,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              p.telefono,
                              style: const TextStyle(
                                fontSize: 12,
                                color: Colors.white38,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Asistencias: ${p.asistencias.length}',
                          style: const TextStyle(
                            fontSize: 11,
                            color: AppColors.primary,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                  if (isSelected)
                    const Icon(Icons.check_circle, color: AppColors.primary),
                  if (asistioHoy && !isSelected)
                    const Icon(Icons.star, color: Colors.amber, size: 20),
                  IconButton(
                    icon: const Icon(
                      Icons.info_outline_rounded,
                      color: Colors.white70,
                      size: 20,
                    ),
                    tooltip: 'Ver detalles',
                    onPressed: () => _showDetailsSheet(context, p),
                  ),
                  IconButton(
                    icon: const Icon(
                      Icons.delete_outline,
                      color: Colors.redAccent,
                      size: 20,
                    ),
                    onPressed: () async {
                      final confirm = await showDialog<bool>(
                        context: context,
                        builder: (context) => AlertDialog(
                          backgroundColor: AppColors.surface,
                          title: const Text('¿Eliminar registro?'),
                          content: Text('¿Deseas eliminar a ${p.nombre}?'),
                          actions: [
                            TextButton(
                              onPressed: () => Navigator.pop(context, false),
                              child: const Text('CANCELAR'),
                            ),
                            TextButton(
                              onPressed: () => Navigator.pop(context, true),
                              child: const Text(
                                'ELIMINAR',
                                style: TextStyle(color: Colors.redAccent),
                              ),
                            ),
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
      }, childCount: personasFiltradas.length),
    );
  }
}

class _GrupoTab {
  final String valor;
  final String label;
  const _GrupoTab({required this.valor, required this.label});
}

class _TabHeaderDelegate extends SliverPersistentHeaderDelegate {
  final TabController tabController;
  final List<_GrupoTab> tabs;
  final ValueChanged<int> onTap;

  _TabHeaderDelegate({required this.tabController, required this.tabs, required this.onTap});

  @override
  Widget build(
    BuildContext context,
    double shrinkOffset,
    bool overlapsContent,
  ) {
    return Container(
      color: AppColors.background,
      child: TabBar(
        controller: tabController,
        indicatorColor: AppColors.primary,
        labelColor: AppColors.primary,
        unselectedLabelColor: Colors.white54,
        labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
        unselectedLabelStyle: const TextStyle(
          fontWeight: FontWeight.w600,
          fontSize: 13,
        ),
        onTap: onTap,
        tabs: tabs.map((t) => Tab(text: t.label)).toList(),
      ),
    );
  }

  @override
  double get maxExtent => 48;
  @override
  double get minExtent => 48;
  @override
  bool shouldRebuild(covariant _TabHeaderDelegate oldDelegate) => true;
}
