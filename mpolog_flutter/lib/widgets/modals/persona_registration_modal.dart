import 'package:mpolog_flutter/models/persona_model.dart';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:math';
import '../glass_container.dart';
import '../glass_button.dart';
import '../../logic/eventos_store.dart';
import '../../styles/app_colors.dart';
import '../../styles/app_text_styles.dart';
import '../items/yappy_comprobante_picker.dart';

class PersonaRegistrationModal extends StatefulWidget {
  final String eventoId;
  final PersonaModel? persona;

  const PersonaRegistrationModal({
    super.key,
    required this.eventoId,
    this.persona,
  });

  @override
  State<PersonaRegistrationModal> createState() => _PersonaRegistrationModalState();
}

class _PersonaRegistrationModalState extends State<PersonaRegistrationModal> {
  final _formKey = GlobalKey<FormState>();
  final _nombreController = TextEditingController();
  final _apellidoController = TextEditingController();
  final _edadController = TextEditingController();
  final _telefonoController = TextEditingController();
  final _montoAbonoController = TextEditingController();
  final _equipoController = TextEditingController();
  final _diasAlojamientoController = TextEditingController();
  
  bool _tieneAbono = false;
  String _tipoPago = 'efectivo';
  bool _soloCulto = false;
  bool _isSaving = false;
  String? _comprobanteYappyBase64;
  final ImagePicker _picker = ImagePicker();

  @override
  void initState() {
    super.initState();
    if (widget.persona != null) {
      _nombreController.text = widget.persona!.nombre;
      _apellidoController.text = widget.persona!.apellido == '.' ? '' : widget.persona!.apellido;
      _edadController.text = widget.persona!.edad.toString();
      _telefonoController.text = widget.persona!.telefono;
      _montoAbonoController.text = widget.persona!.montoAbono.toString();
      _tieneAbono = widget.persona!.abono;
      _tipoPago = widget.persona!.tipoPago;
      _equipoController.text = widget.persona!.equipo ?? '';
      _diasAlojamientoController.text = (widget.persona!.diasAlojamiento ?? '').toString();
      _soloCulto = widget.persona!.soloCulto;
    }
  }

  Future<void> _pickImage(ImageSource source) async {
    final XFile? image = await _picker.pickImage(
      source: source,
      maxWidth: 1000,
      maxHeight: 1000,
      imageQuality: 70,
    );

    if (image != null) {
      final bytes = await image.readAsBytes();
      final base64String = 'data:image/jpeg;base64,${base64Encode(bytes)}';
      setState(() {
        _comprobanteYappyBase64 = base64String;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final store = context.watch<EventosStore>();
    final currentEvento = store.eventos.firstWhere(
      (e) => e.id == widget.eventoId,
      orElse: () => store.eventos.first,
    );

    return Container(
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
                  widget.persona == null ? 'REGISTRAR PERSONA' : 'EDITAR PERSONA', 
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
                const SizedBox(height: 16),

                if (currentEvento.tipo == 'convencion' && (currentEvento.requiereAlojamiento == true)) ...[
                  Row(
                    children: [
                      Expanded(
                        child: _buildField('Días de Alojamiento (Todos: vacío)', _diasAlojamientoController, Icons.hotel, keyboardType: TextInputType.number),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Column(
                          children: [
                            const Text('¿Solo Culto?', style: TextStyle(color: Colors.white, fontSize: 10)),
                            Switch(
                              value: _soloCulto,
                              onChanged: (val) => setState(() => _soloCulto = val),
                              activeColor: AppColors.primary,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                ],
                
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('¿Tiene abono?', style: AppTextStyles.body(context)),
                    Switch(
                      value: _tieneAbono,
                      onChanged: (v) => setState(() => _tieneAbono = v),
                      activeThumbColor: AppColors.primary,
                    ),
                  ],
                ),
                
                if (_tieneAbono) ...[
                  const SizedBox(height: 16),
                  _buildField('Monto de Abono', _montoAbonoController, Icons.attach_money_rounded, keyboardType: TextInputType.number),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      _buildPaymentChip('Efectivo', Icons.money_rounded, _tipoPago == 'efectivo', () => setState(() => _tipoPago = 'efectivo')),
                      const SizedBox(width: 12),
                      _buildPaymentChip('Yappy', Icons.qr_code_rounded, _tipoPago == 'yappy', () => setState(() => _tipoPago = 'yappy')),
                    ],
                  ),
                  
                  if (_tipoPago == 'yappy') ...[
                    const SizedBox(height: 20),
                    YappyComprobantePicker(
                      comprobanteYappyBase64: _comprobanteYappyBase64,
                      existingUrl: widget.persona?.comprobanteYappy,
                      onPickImage: _pickImage,
                      onRemoveImage: () => setState(() => _comprobanteYappyBase64 = null),
                    ),
                  ],
                ],
                
                const SizedBox(height: 32),
                GlassButton(
                  text: _isSaving ? 'GUARDANDO...' : (widget.persona == null ? 'REGISTRAR AHORA' : 'GUARDAR CAMBIOS'),
                  icon: widget.persona == null ? Icons.person_add_alt_1_rounded : Icons.save_rounded,
                  onPressed: _isSaving ? null : () async {
                    if (!_formKey.currentState!.validate()) return;
                    setState(() => _isSaving = true);
                    
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
                      'diasAlojamiento': int.tryParse(_diasAlojamientoController.text),
                      'soloCulto': _soloCulto,
                      'color': Colors.primaries[Random().nextInt(Colors.primaries.length)].value.toRadixString(16).substring(2),
                    };

                    final bool success;
                    if (widget.persona == null) {
                      success = await store.registrarPersona(widget.eventoId, data);
                    } else {
                      success = await store.actualizarPersona(widget.eventoId, widget.persona!.id, data);
                    }
                    
                    if (context.mounted) {
                      setState(() => _isSaving = false);
                      if (success) {
                        Navigator.pop(context);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text(widget.persona == null ? 'Persona registrada correctamente' : 'Datos actualizados correctamente'))
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
}

// Helper function
void showPersonaRegistrationModal(BuildContext context, String eventoId, {PersonaModel? persona}) {
  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    builder: (context) => PersonaRegistrationModal(eventoId: eventoId, persona: persona),
  );
}
