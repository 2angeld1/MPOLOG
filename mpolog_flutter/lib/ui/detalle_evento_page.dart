import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'dart:ui';
import '../logic/eventos_store.dart';
import '../styles/app_colors.dart';
import '../styles/app_text_styles.dart';
import '../widgets/glass_container.dart';
import '../widgets/glass_button.dart';
import 'package:flutter_slidable/flutter_slidable.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:convert';
import 'package:url_launcher/url_launcher.dart';

class DetalleEventoPage extends StatefulWidget {
  final Map<String, dynamic> evento;
  const DetalleEventoPage({super.key, required this.evento});

  @override
  State<DetalleEventoPage> createState() => _DetalleEventoPageState();
}

class _DetalleEventoPageState extends State<DetalleEventoPage> {
  final _formKey = GlobalKey<FormState>();
  final _nombreController = TextEditingController();
  final _apellidoController = TextEditingController();
  final _edadController = TextEditingController();
  final _telefonoController = TextEditingController();
  final _montoAbonoController = TextEditingController();
  final _equipoController = TextEditingController();
  final _searchController = TextEditingController();
  
  String _searchQuery = '';
  
  bool _tieneAbono = false;
  String _tipoPago = 'efectivo';
  bool _isSaving = false;
  String? _editingPersonaId;
  String? _comprobanteYappyBase64;
  final ImagePicker _picker = ImagePicker();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<EventosStore>().setSelectedEvento(widget.evento['_id']);
    });
  }

  // ... (showAddPersonaModal method stays same)

  Widget _buildImagePickerSection(StateSetter setModalState, Map<String, dynamic>? persona) {
    // Si ya existe una imagen en el servidor (URL) se la pasamos al preview
    final String? existingUrl = persona != null && persona['comprobanteYappy'] != null 
        ? persona['comprobanteYappy'].toString() 
        : null;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('COMPROBANTE YAPPY', style: TextStyle(fontSize: 9, color: Colors.white38, fontWeight: FontWeight.bold, letterSpacing: 1)),
        const SizedBox(height: 12),
        GestureDetector(
          onTap: () {
            showModalBottomSheet(
              context: context,
              backgroundColor: AppColors.surface,
              builder: (context) => SafeArea(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    ListTile(
                      leading: const Icon(Icons.photo_library_outlined, color: Colors.white),
                      title: const Text('Galería', style: TextStyle(color: Colors.white)),
                      onTap: () {
                        _pickImage(setModalState, ImageSource.gallery);
                        Navigator.pop(context);
                      },
                    ),
                    ListTile(
                      leading: const Icon(Icons.camera_alt_outlined, color: Colors.white),
                      title: const Text('Cámara', style: TextStyle(color: Colors.white)),
                      onTap: () {
                        _pickImage(setModalState, ImageSource.camera);
                        Navigator.pop(context);
                      },
                    ),
                  ],
                ),
              ),
            );
          },
          child: Container(
            height: 160,
            width: double.infinity,
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.05),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Colors.white10),
            ),
            child: _comprobanteYappyBase64 != null
              ? ClipRRect(
                  borderRadius: BorderRadius.circular(18),
                  child: Stack(
                    fit: StackFit.expand,
                    children: [
                      Image.memory(base64Decode(_comprobanteYappyBase64!.split(',').last), fit: BoxFit.cover),
                      Container(color: Colors.black26),
                      const Center(child: Icon(Icons.refresh_rounded, color: Colors.white, size: 32)),
                    ],
                  ),
                )
              : existingUrl != null
                ? ClipRRect(
                    borderRadius: BorderRadius.circular(18),
                    child: Stack(
                      fit: StackFit.expand,
                      children: [
                        Image.network(existingUrl, fit: BoxFit.cover),
                        Container(color: Colors.black26),
                        const Center(child: Icon(Icons.edit_rounded, color: Colors.white, size: 32)),
                      ],
                    ),
                  )
                : Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.add_a_photo_outlined, color: AppColors.primary, size: 32),
                      const SizedBox(height: 8),
                      const Text('Toca para subir foto', style: TextStyle(fontSize: 12, color: Colors.white38)),
                    ],
                  ),
          ),
        ),
        if (_comprobanteYappyBase64 != null)
          Padding(
            padding: const EdgeInsets.only(top: 8),
            child: TextButton.icon(
              onPressed: () => setModalState(() => _comprobanteYappyBase64 = null),
              icon: const Icon(Icons.delete_outline_rounded, size: 16, color: Colors.redAccent),
              label: const Text('Eliminar captura', style: TextStyle(color: Colors.redAccent, fontSize: 12)),
            ),
          ),
      ],
    );
  }

  Future<void> _pickImage(StateSetter setModalState, ImageSource source) async {
    final XFile? image = await _picker.pickImage(
      source: source,
      maxWidth: 1000,
      maxHeight: 1000,
      imageQuality: 70,
    );

    if (image != null) {
      final bytes = await image.readAsBytes();
      final base64String = 'data:image/jpeg;base64,${base64Encode(bytes)}';
      setModalState(() {
        _comprobanteYappyBase64 = base64String;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final store = context.watch<EventosStore>();
    final stats = store.estadisticas;

    return Scaffold(
      backgroundColor: AppColors.background,
      floatingActionButton: Padding(
        padding: const EdgeInsets.only(bottom: 10, right: 0),
        child: FloatingActionButton.extended(
          heroTag: 'fab_detalle_evento',
          onPressed: _showAddPersonaModal,
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
              title: Text(widget.evento['nombre']?.toString().toUpperCase() ?? 'EVENTO', 
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
                // INFORMACIÓN DEL EVENTO (NUEVO)
                _buildEventInfo(widget.evento),
                const SizedBox(height: 32),

                // Estadísticas
                if (stats != null) _buildStats(stats),
                const SizedBox(height: 32),
                
                // Lista de Personas
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    _buildSectionTitle('PERSONAS REGISTRADAS'),
                    Text('${store.personas.length}', style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold)),
                  ],
                ),
                const SizedBox(height: 16),
                
                // BUSCADOR (NUEVO)
                _buildSearchbar(),
                const SizedBox(height: 16),
                _buildPersonasList(store),
                const SizedBox(height: 120),
              ]),
            ),
          ),
        ],
      ),
    );
  }

  void _showAddPersonaModal({Map<String, dynamic>? persona}) {
    if (persona != null) {
      _nombreController.text = persona['nombre'].toString();
      _apellidoController.text = persona['apellido'] == '.' ? '' : persona['apellido'].toString();
      _edadController.text = persona['edad'].toString();
      _telefonoController.text = persona['telefono'].toString();
      _montoAbonoController.text = persona['montoAbono'].toString();
      _editingPersonaId = persona['_id'];
      _tieneAbono = persona['abono'] ?? false;
      _tipoPago = persona['tipoPago'] ?? 'efectivo';
      _equipoController.text = persona['equipo']?.toString() ?? '';
    } else {
      _nombreController.clear();
      _apellidoController.clear();
      _edadController.clear();
      _telefonoController.clear();
      _montoAbonoController.clear();
      _equipoController.clear();
      _editingPersonaId = null;
      _tieneAbono = false;
      _tipoPago = 'efectivo';
      _comprobanteYappyBase64 = null;
    }

    setState(() {});

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => StatefulBuilder(
        builder: (context, setModalState) => Container(
          padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
          child: GlassContainer(
            padding: const EdgeInsets.all(24),
            borderRadius: 32,
            child: SingleChildScrollView(
              child: Form(
                key: _formKey,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 40,
                      height: 4,
                      margin: const EdgeInsets.only(bottom: 24),
                      decoration: BoxDecoration(color: Colors.white24, borderRadius: BorderRadius.circular(2)),
                    ),
                    Text(
                      _editingPersonaId == null ? 'REGISTRAR PERSONA' : 'EDITAR PERSONA', 
                      style: AppTextStyles.h3(context)
                    ),
                    const SizedBox(height: 24),
                    _buildField('Nombre *', _nombreController, Icons.person_outline),
                    const SizedBox(height: 16),
                    _buildField('Apellido', _apellidoController, Icons.person_outline),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(child: _buildField('Edad', _edadController, Icons.cake_outlined, keyboardType: TextInputType.number)),
                        const SizedBox(width: 16),
                        Expanded(child: _buildField('Teléfono', _telefonoController, Icons.phone_outlined, keyboardType: TextInputType.phone)),
                      ],
                    ),
                    const SizedBox(height: 16),
                    _buildField('Equipo / Grupo', _equipoController, Icons.group_work_outlined),
                    const SizedBox(height: 24),
                    
                    // Abono Toggle
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('¿Tiene abono?', style: AppTextStyles.body(context)),
                        Switch(
                          value: _tieneAbono,
                          onChanged: (v) => setModalState(() => _tieneAbono = v),
                          activeColor: AppColors.primary,
                        ),
                      ],
                    ),
                    
                    if (_tieneAbono) ...[
                      const SizedBox(height: 16),
                      _buildField('Monto de Abono', _montoAbonoController, Icons.attach_money_rounded, keyboardType: TextInputType.number),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          _buildPaymentChip('Efectivo', Icons.money_rounded, _tipoPago == 'efectivo', () => setModalState(() => _tipoPago = 'efectivo')),
                          const SizedBox(width: 12),
                          _buildPaymentChip('Yappy', Icons.qr_code_rounded, _tipoPago == 'yappy', () => setModalState(() => _tipoPago = 'yappy')),
                        ],
                      ),
                      
                      // Selector de foto para Yappy
                      if (_tipoPago == 'yappy') ...[
                        const SizedBox(height: 20),
                        _buildImagePickerSection(setModalState, persona),
                      ],
                    ],
                    
                    const SizedBox(height: 32),
                    GlassButton(
                      text: _isSaving ? 'GUARDANDO...' : (_editingPersonaId == null ? 'REGISTRAR AHORA' : 'GUARDAR CAMBIOS'),
                      icon: _editingPersonaId == null ? Icons.person_add_alt_1_rounded : Icons.save_rounded,
                      onPressed: _isSaving ? null : () async {
                        if (!_formKey.currentState!.validate()) return;
                        setModalState(() => _isSaving = true);
                        
                        final store = context.read<EventosStore>();
                        final data = {
                          'nombre': _nombreController.text,
                          'apellido': _apellidoController.text.isEmpty ? '.' : _apellidoController.text,
                          'edad': int.tryParse(_edadController.text) ?? 0,
                          'telefono': _telefonoController.text,
                          'abono': _tieneAbono,
                          'montoAbono': _tieneAbono ? (double.tryParse(_montoAbonoController.text) ?? 0.0) : 0.0,
                          'tipoPago': _tipoPago,
                          'comprobanteYappy': _comprobanteYappyBase64,
                          'equipo': _equipoController.text,
                        };

                        final bool success;
                        if (_editingPersonaId == null) {
                          success = await store.registrarPersona(widget.evento['_id'], data);
                        } else {
                          success = await store.actualizarPersona(widget.evento['_id'], _editingPersonaId!, data);
                        }
                        
                        if (mounted) {
                          setModalState(() => _isSaving = false);
                          if (success) {
                            Navigator.pop(context);
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text(_editingPersonaId == null ? 'Persona registrada correctamente' : 'Datos actualizados correctamente'))
                            );
                          }
                        }
                      },
                    ),
                    const SizedBox(height: 16),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }



  Widget _buildSectionTitle(String title) {
    return Text(title, style: AppTextStyles.label(context).copyWith(fontSize: 10, letterSpacing: 2, color: Colors.white38));
  }

  Widget _buildStats(Map<String, dynamic> stats) {
    return Row(
      children: [
        Expanded(child: _buildStatCard('TOTAL', '${stats['totalPersonas']}', Icons.people_rounded, AppColors.primary)),
        const SizedBox(width: 12),
        Expanded(child: _buildStatCard('PAGOS', '\$${stats['montoTotalRecaudado']}', Icons.attach_money_rounded, AppColors.success)),
        const SizedBox(width: 12),
        Expanded(child: _buildStatCard('PEND', '${stats['personasSinAbono']}', Icons.pending_actions_rounded, AppColors.accent)),
      ],
    );
  }

  Widget _buildStatCard(String label, String value, IconData icon, Color color) {
    return GlassContainer(
      padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 12),
      borderRadius: 20,
      child: Column(
        children: [
          Icon(icon, color: color, size: 20),
          const SizedBox(height: 8),
          Text(value, style: AppTextStyles.h2(context).copyWith(fontSize: 20)),
          Text(label, style: const TextStyle(fontSize: 8, color: Colors.white24, letterSpacing: 1, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }


  Widget _buildField(String label, TextEditingController controller, IconData icon, {TextInputType? keyboardType}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label.toUpperCase(), style: const TextStyle(fontSize: 9, color: Colors.white38, fontWeight: FontWeight.bold, letterSpacing: 1)),
        const SizedBox(height: 8),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.05),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.white10),
          ),
          child: TextFormField(
            controller: controller,
            keyboardType: keyboardType,
            style: const TextStyle(color: Colors.white, fontSize: 14),
            decoration: InputDecoration(
              icon: Icon(icon, color: AppColors.primary, size: 18),
              border: InputBorder.none,
              hintText: 'Ingresa ${label.toLowerCase()}',
              hintStyle: const TextStyle(color: Colors.white24, fontSize: 13),
            ),
            validator: (v) => (label.contains('*') && (v == null || v.isEmpty)) ? 'Requerido' : null,
          ),
        ),
      ],
    );
  }

  Widget _buildPaymentChip(String label, IconData icon, bool isSelected, VoidCallback onTap) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: isSelected ? AppColors.primary.withValues(alpha: 0.2) : Colors.transparent,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: isSelected ? AppColors.primary : Colors.white10),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 16, color: isSelected ? Colors.white : Colors.white38),
              const SizedBox(width: 8),
              Text(label, style: TextStyle(color: isSelected ? Colors.white : Colors.white38, fontSize: 12, fontWeight: isSelected ? FontWeight.bold : FontWeight.normal)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSearchbar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white10),
      ),
      child: TextField(
        controller: _searchController,
        style: const TextStyle(color: Colors.white, fontSize: 14),
        onChanged: (v) => setState(() => _searchQuery = v.toLowerCase()),
        decoration: InputDecoration(
          icon: const Icon(Icons.search_rounded, color: AppColors.primary, size: 20),
          border: InputBorder.none,
          hintText: 'Buscar por nombre o equipo...',
          hintStyle: const TextStyle(color: Colors.white24, fontSize: 13),
          suffixIcon: _searchQuery.isNotEmpty 
            ? IconButton(
                icon: const Icon(Icons.close_rounded, color: Colors.white24, size: 18),
                onPressed: () {
                  _searchController.clear();
                  setState(() => _searchQuery = '');
                },
              )
            : null,
        ),
      ),
    );
  }

  Widget _buildPersonasList(EventosStore store) {
    final filteredPersonas = store.personas.where((p) {
      if (_searchQuery.isEmpty) return true;
      final nombre = p['nombre']?.toString().toLowerCase() ?? '';
      final apellido = p['apellido']?.toString().toLowerCase() ?? '';
      final equipo = p['equipo']?.toString().toLowerCase() ?? '';
      return nombre.contains(_searchQuery) || 
             apellido.contains(_searchQuery) || 
             equipo.contains(_searchQuery);
    }).toList();

    if (filteredPersonas.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(40),
        alignment: Alignment.center,
        child: Column(
          children: [
            Icon(Icons.group_outlined, color: Colors.white10, size: 48),
            const SizedBox(height: 12),
            const Text('Aún no hay registrados', style: TextStyle(color: Colors.white24)),
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
            key: ValueKey(p['_id']),
            endActionPane: ActionPane(
              motion: const DrawerMotion(),
              extentRatio: 0.45,
              children: [
                CustomSlidableAction(
                  onPressed: (context) => _showAddPersonaModal(persona: p),
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
                  onPressed: (context) => _confirmDelete(p),
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
                    child: Text(p['nombre'][0].toString().toUpperCase(), style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold)),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('${p['nombre']} ${p['apellido'] == '.' ? '' : p['apellido']}', style: const TextStyle(fontWeight: FontWeight.bold)),
                        Text('Edad: ${p['edad']} • Tel: ${p['telefono']}', style: const TextStyle(fontSize: 11, color: Colors.white38)),
                      ],
                    ),
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                       Text(p['abono'] ? '\$${p['montoAbono']}' : 'PENDIENTE', 
                        style: TextStyle(
                          color: p['abono'] ? AppColors.success : Colors.redAccent, 
                          fontWeight: FontWeight.bold, 
                          fontSize: 12
                        )
                      ),
                      Text(p['tipoPago'].toString().toUpperCase(), style: const TextStyle(fontSize: 9, color: Colors.white24)),
                    ],
                  ),
                  if (p['comprobanteYappy'] != null) ...[
                    const SizedBox(width: 8),
                    IconButton(
                      icon: const Icon(Icons.image_search_rounded, color: AppColors.primary, size: 20),
                      onPressed: () => launchUrl(Uri.parse(p['comprobanteYappy'].toString())),
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

  void _confirmDelete(dynamic p) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppColors.surface,
        title: const Text('¿Eliminar registro?'),
        content: Text('¿Deseas eliminar a ${p['nombre']} de este evento?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('CANCELAR')),
          TextButton(
            onPressed: () {
              context.read<EventosStore>().eliminarPersona(widget.evento['_id'], p['_id']);
              Navigator.pop(context);
            }, 
            child: const Text('ELIMINAR', style: TextStyle(color: Colors.redAccent))
          ),
        ],
      ),
    );
  }

  Widget _buildEventInfo(dynamic evento) {
    final ubicacion = evento['ubicacion']?['nombreLugar'] ?? 'Ubicación por definir';
    final precio = evento['precioTotal']?.toString() ?? '0';

    return GlassContainer(
      padding: const EdgeInsets.all(20),
      borderRadius: 24,
      child: Column(
        children: [
          _buildInfoRow(Icons.location_on_rounded, 'UBICACIÓN', ubicacion, AppColors.accent),
          const Padding(padding: EdgeInsets.symmetric(vertical: 12), child: Divider(color: Colors.white10)),
          _buildInfoRow(Icons.calendar_month_rounded, 'FECHAS', 
            'Del ${_formatDate(evento['fechaInicio'])} al ${_formatDate(evento['fechaFin'])}', 
            Colors.white38),
          const Padding(padding: EdgeInsets.symmetric(vertical: 12), child: Divider(color: Colors.white10)),
          _buildInfoRow(Icons.payments_rounded, 'PRECIO TOTAL', '\$$precio', AppColors.primary),
          const SizedBox(height: 20),
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () => _openMap(evento['ubicacion']),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppColors.accent,
                    side: const BorderSide(color: AppColors.accent),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                  icon: const Icon(Icons.map_outlined, size: 18),
                  label: const Text('VER MAPA', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1)),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () => _shareLocation(evento),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.white70,
                    side: const BorderSide(color: Colors.white10),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                  icon: const Icon(Icons.share_outlined, size: 18),
                  label: const Text('COMPARTIR', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1)),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Future<void> _openMap(dynamic ubicacion) async {
    if (ubicacion == null || ubicacion['lat'] == null) return;
    final url = 'https://www.google.com/maps/search/?api=1&query=${ubicacion['lat']},${ubicacion['lng']}';
    if (await canLaunchUrl(Uri.parse(url))) {
      await launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
    }
  }

  Future<void> _shareLocation(dynamic evento) async {
    final ubicacion = evento['ubicacion'];
    if (ubicacion == null) return;
    
    final text = '📍 EVENTO: ${evento['nombre']}\n📍 Lugar: ${ubicacion['nombreLugar']}\nhttps://www.google.com/maps/search/?api=1&query=${ubicacion['lat']},${ubicacion['lng']}';
    
    // Usamos el launcher para mandar por WhatsApp u otras apps compartiendo el texto
    final url = 'whatsapp://send?text=${Uri.encodeComponent(text)}';
    if (await canLaunchUrl(Uri.parse(url))) {
      await launchUrl(Uri.parse(url));
    } else {
      // Fallback a correo o compartir general
      final mailUrl = 'mailto:?subject=Ubicación del Evento&body=${Uri.encodeComponent(text)}';
      launchUrl(Uri.parse(mailUrl));
    }
  }

  Widget _buildInfoRow(IconData icon, String label, String value, Color color) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(10)),
          child: Icon(icon, size: 16, color: color),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: const TextStyle(fontSize: 8, color: Colors.white38, letterSpacing: 1.5)),
              Text(value, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
            ],
          ),
        ),
      ],
    );
  }

  String _formatDate(String? dateStr) {
    if (dateStr == null) return '--/--/--';
    final date = DateTime.tryParse(dateStr);
    if (date == null) return dateStr;
    return '${date.day}/${date.month}/${date.year}';
  }
}
