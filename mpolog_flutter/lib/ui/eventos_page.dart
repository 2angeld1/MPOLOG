import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:provider/provider.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../logic/eventos_store.dart';
import '../styles/app_colors.dart';
import '../styles/app_text_styles.dart';
import '../widgets/glass_text_field.dart';
import '../widgets/glass_container.dart';
import 'detalle_evento_page.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class EventosPage extends StatefulWidget {
  const EventosPage({super.key});

  @override
  State<EventosPage> createState() => _EventosPageState();
}

class _EventosPageState extends State<EventosPage> {
  final _nameController = TextEditingController();
  final _descController = TextEditingController();
  final _precioController = TextEditingController();
  final _lugarController = TextEditingController();
  DateTime _fechaInicio = DateTime.now();
  DateTime _fechaFin = DateTime.now().add(const Duration(days: 3));
  String _tipoEvento = 'campamento';
  LatLng? _selectedLocation;

  @override
  void initState() {
    super.initState();
    Future.microtask(() => context.read<EventosStore>().fetchEventos());
  }

  Future<void> _selectDate(BuildContext context, bool isInicio) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: isInicio ? _fechaInicio : _fechaFin,
      firstDate: DateTime(2020),
      lastDate: DateTime(2101),
      builder: (context, child) => Theme(
        data: Theme.of(context).copyWith(
          colorScheme: ColorScheme.dark(primary: AppColors.primary, onPrimary: Colors.white, surface: AppColors.surface, onSurface: Colors.white),
        ),
        child: child!,
      ),
    );
    if (picked != null) {
      setState(() {
        if (isInicio) {
          _fechaInicio = picked;
          if (_fechaFin.isBefore(_fechaInicio)) _fechaFin = _fechaInicio.add(const Duration(days: 1));
        } else {
          _fechaFin = picked;
        }
      });
    }
  }

  void _showAddEventoDialog() {
    _nameController.clear();
    _descController.clear();
    _precioController.clear();
    _lugarController.clear();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => StatefulBuilder(
        builder: (context, setDialogState) => Container(
          padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
          child: GlassContainer(
            padding: const EdgeInsets.all(24),
            borderRadius: 32,
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 40, height: 4, margin: const EdgeInsets.only(bottom: 24),
                    decoration: BoxDecoration(color: Colors.white24, borderRadius: BorderRadius.circular(2)),
                  ),
                  const SizedBox(height: 24),
                  GlassTextField(label: 'Nombre del Evento *', controller: _nameController),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(child: GlassTextField(label: 'Lugar / Ubicación *', controller: _lugarController)),
                      const SizedBox(width: 8),
                      GestureDetector(
                        onTap: () => _showMapPicker(setDialogState),
                        child: GlassContainer(
                          padding: const EdgeInsets.all(16),
                          borderRadius: 16,
                          child: Icon(Icons.map_rounded, color: _selectedLocation != null ? AppColors.primary : Colors.white38, size: 24),
                        ),
                      ),
                    ],
                  ),
                  if (_selectedLocation != null)
                    Padding(
                      padding: const EdgeInsets.only(top: 8),
                      child: Text('Ubicación fijada: ${_selectedLocation!.latitude.toStringAsFixed(4)}, ${_selectedLocation!.longitude.toStringAsFixed(4)}', 
                        style: const TextStyle(fontSize: 9, color: AppColors.success)),
                    ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('INICIO', style: TextStyle(fontSize: 10, color: Colors.white38)),
                            TextButton(
                              onPressed: () async {
                                await _selectDate(context, true);
                                setDialogState(() {});
                              },
                              child: Text('${_fechaInicio.day}/${_fechaInicio.month}/${_fechaInicio.year}', style: const TextStyle(color: AppColors.primary)),
                            ),
                          ],
                        ),
                      ),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('FIN', style: TextStyle(fontSize: 10, color: Colors.white38)),
                            TextButton(
                              onPressed: () async {
                                await _selectDate(context, false);
                                setDialogState(() {});
                              },
                              child: Text('${_fechaFin.day}/${_fechaFin.month}/${_fechaFin.year}', style: const TextStyle(color: AppColors.primary)),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  GlassTextField(label: 'Costo Total *', controller: _precioController, keyboardType: TextInputType.number),
                  const SizedBox(height: 16),
                  DropdownButtonFormField<String>(
                    initialValue: _tipoEvento,
                    dropdownColor: AppColors.surface,
                    decoration: InputDecoration(
                      labelText: 'Tipo de Evento',
                      filled: true,
                      fillColor: Colors.white.withValues(alpha: 0.05),
                      labelStyle: const TextStyle(color: Colors.white38, fontSize: 12),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                    ),
                    items: ['campamento', 'retiro', 'conferencia', 'otro'].map((t) => DropdownMenuItem(value: t, child: Text(t.toUpperCase(), style: const TextStyle(color: Colors.white, fontSize: 13)))).toList(),
                    onChanged: (val) => setDialogState(() => _tipoEvento = val!),
                  ),
                  const SizedBox(height: 16),
                  GlassTextField(label: 'Descripción (opcional)', controller: _descController),
                  const SizedBox(height: 32),
                  SizedBox(
                    width: double.infinity,
                    height: 55,
                    child: ElevatedButton(
                      onPressed: () async {
                        if (_nameController.text.isEmpty || _precioController.text.isEmpty || _lugarController.text.isEmpty) return;
                        final success = await context.read<EventosStore>().crearEvento({
                          'nombre': _nameController.text,
                          'descripcion': _descController.text,
                          'fechaInicio': _fechaInicio.toIso8601String(),
                          'fechaFin': _fechaFin.toIso8601String(),
                          'precioTotal': double.tryParse(_precioController.text) ?? 0.0,
                          'tipo': _tipoEvento,
                          'activo': true,
                          'ubicacion': {
                            'nombreLugar': _lugarController.text,
                            'lat': _selectedLocation?.latitude ?? 0.0,
                            'lng': _selectedLocation?.longitude ?? 0.0
                          }
                        });
                        if (mounted) Navigator.pop(context);
                        if (success) {
                          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Evento creado correctamente')));
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      child: const Text('CREAR EVENTO', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, letterSpacing: 1.5)),
                    ),
                  ),
                  const SizedBox(height: 16),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final store = context.watch<EventosStore>();

    return Scaffold(
      backgroundColor: AppColors.background,
      floatingActionButton: Padding(
        padding: const EdgeInsets.only(bottom: 80, right: 10),
        child: FloatingActionButton(
          heroTag: 'fab_eventos',
          onPressed: _showAddEventoDialog,
          backgroundColor: AppColors.primary,
          child: const Icon(Icons.add_rounded, color: Colors.white, size: 30),
        ),
      ),
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 280,
            backgroundColor: AppColors.background,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              titlePadding: const EdgeInsets.only(left: 24, bottom: 24),
              title: Text('Eventos Especiales', 
                style: AppTextStyles.h2(context).copyWith(fontSize: 24, fontWeight: FontWeight.bold)),
              background: Stack(
                fit: StackFit.expand,
                children: [
                  Image.asset(
                    'assets/images/church_header.png',
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) => Container(color: AppColors.background),
                  ),
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter, end: Alignment.bottomCenter,
                        stops: const [0.0, 0.5, 1.0],
                        colors: [Colors.transparent, Colors.black.withValues(alpha: 0.3), AppColors.background],
                      ),
                    ),
                  ),
                ],
              ),
            ),
            actions: [
               IconButton(onPressed: () => store.fetchEventos(), icon: const Icon(Icons.refresh_rounded, color: Colors.white70)),
            ],
          ),
          SliverPadding(
            padding: const EdgeInsets.fromLTRB(24, 24, 24, 100),
            sliver: store.isLoading 
              ? const SliverFillRemaining(child: Center(child: CircularProgressIndicator()))
              : store.eventos.isEmpty
                ? SliverFillRemaining(
                    child: Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.event_busy_rounded, size: 64, color: Colors.white10),
                          const SizedBox(height: 16),
                          Text('No hay eventos registrados', style: AppTextStyles.body(context).copyWith(color: Colors.white24)),
                        ],
                      ),
                    ),
                  )
                : SliverList(
                    delegate: SliverChildBuilderDelegate(
                      (context, index) {
                        final evento = store.eventos[index];
                        final ubicacion = evento['ubicacion']?['nombreLugar'] ?? 'Ubicación por definir';
                        final precio = evento['precioTotal']?.toString() ?? '0';

                        return Padding(
                          padding: const EdgeInsets.only(bottom: 16),
                          child: GestureDetector(
                            onTap: () => Navigator.push(
                              context,
                              MaterialPageRoute(builder: (context) => DetalleEventoPage(evento: evento)),
                            ),
                            child: GlassContainer(
                              padding: const EdgeInsets.all(20),
                              borderRadius: 24,
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Expanded(
                                        child: Text(
                                          evento['nombre']?.toString().toUpperCase() ?? 'EVENTO SIN NOMBRE',
                                          style: AppTextStyles.h3(context).copyWith(fontSize: 16, fontWeight: FontWeight.bold),
                                        ),
                                      ),
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                        decoration: BoxDecoration(
                                          color: AppColors.primary.withValues(alpha: 0.1),
                                          borderRadius: BorderRadius.circular(12),
                                          border: Border.all(color: AppColors.primary.withValues(alpha: 0.2)),
                                        ),
                                        child: Text('\$$precio', style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: 13)),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 12),
                                  Row(
                                    children: [
                                      const Icon(Icons.location_on_rounded, size: 14, color: AppColors.accent),
                                      const SizedBox(width: 8),
                                      Expanded(child: Text(ubicacion, style: const TextStyle(fontSize: 12, color: Colors.white70))),
                                    ],
                                  ),
                                  const SizedBox(height: 12),
                                  Row(
                                    children: [
                                      const Icon(Icons.calendar_month_rounded, size: 14, color: Colors.white38),
                                      const SizedBox(width: 8),
                                      Text(
                                        'Del ${_formatDate(evento['fechaInicio'])} al ${_formatDate(evento['fechaFin'])}',
                                        style: const TextStyle(fontSize: 11, color: Colors.white38),
                                      ),
                                      const Spacer(),
                                      const Icon(Icons.chevron_right_rounded, color: Colors.white24, size: 20),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ),
                        );
                      },
                      childCount: store.eventos.length,
                    ),
                  ),
          ),
        ],
      ),
    );
  }

  void _showMapPicker(StateSetter setDialogState) {
    LatLng initialPos = const LatLng(8.9833, -79.5167); // Panamá por defecto
    LatLng currentMarker = _selectedLocation ?? initialPos;

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setMapState) => AlertDialog(
          backgroundColor: AppColors.surface,
          title: const Text('Seleccionar Ubicación'),
          content: ClipRRect(
            borderRadius: BorderRadius.circular(16),
            child: SizedBox(
              width: 500,
              height: 400,
              child: (Theme.of(context).platform == TargetPlatform.windows && !kIsWeb) 
                ? Container(
                    padding: const EdgeInsets.all(24),
                    color: Colors.white10,
                    child: const Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.computer_rounded, size: 48, color: Colors.white24),
                        SizedBox(height: 16),
                        Text(
                          'El mapa no es compatible con el modo Windows Desktop nativo.\n\nPor favor, usa la versión WEB o MOBILE para seleccionar en el mapa.',
                          textAlign: TextAlign.center,
                          style: TextStyle(fontSize: 12, color: Colors.white60),
                        ),
                      ],
                    ),
                  )
                : GoogleMap(
                    initialCameraPosition: CameraPosition(target: currentMarker, zoom: 15),
                    onTap: (pos) => setMapState(() => currentMarker = pos),
                    markers: { Marker(markerId: const MarkerId('selected'), position: currentMarker) },
                    myLocationEnabled: true,
                    myLocationButtonEnabled: true,
                  ),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context), 
              child: const Text('CANCELAR', style: TextStyle(color: Colors.white38))
            ),
            if (Theme.of(context).platform != TargetPlatform.windows || kIsWeb)
              ElevatedButton(
                onPressed: () async {
                  setDialogState(() => _selectedLocation = currentMarker);
                  Navigator.pop(context);
                  
                  // MAGIA DE SENIOR DEV: Reverse Geocoding
                  _fetchPlaceName(currentMarker);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                ),
                child: const Text('CONFIRMAR SITIO', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
              ),
          ],
        ),
      ),
    );
  }

  Future<void> _fetchPlaceName(LatLng pos) async {
    const apiKey = 'AIzaSyBC_tPGHgdjsRanleoXtDzqbk00ewSATQo';
    final url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=${pos.latitude},${pos.longitude}&key=$apiKey';

    try {
      final response = await http.get(Uri.parse(url));
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['status'] == 'OK' && data['results'].isNotEmpty) {
          final address = data['results'][0]['formatted_address'];
          setState(() {
            _lugarController.text = address;
          });
        }
      }
    } catch (e) {
      debugPrint('Error geocodificando: $e');
    }
  }

  String _formatDate(String? dateStr) {
    if (dateStr == null) return '--/--/--';
    final date = DateTime.tryParse(dateStr);
    if (date == null) return dateStr;
    return '${date.day}/${date.month}/${date.year}';
  }
}
