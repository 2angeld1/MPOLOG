class PersonaModel {
  final String id;
  final String nombre;
  final String apellido;
  final int edad;
  final String telefono;
  final String? equipo;
  final bool abono;
  final double montoAbono;
  final String tipoPago;
  final String? comprobanteYappy;
  final dynamic diasAlojamiento;
  final bool soloCulto;
  final String? color;

  PersonaModel({
    required this.id,
    required this.nombre,
    required this.apellido,
    required this.edad,
    required this.telefono,
    this.equipo,
    required this.abono,
    required this.montoAbono,
    required this.tipoPago,
    this.comprobanteYappy,
    this.diasAlojamiento,
    this.soloCulto = false,
    this.color,
  });

  factory PersonaModel.fromJson(Map<String, dynamic> json) {
    return PersonaModel(
      id: json['_id'] ?? '',
      nombre: json['nombre'] ?? '',
      apellido: json['apellido'] ?? '.',
      edad: json['edad'] ?? 0,
      telefono: json['telefono'] ?? '',
      equipo: json['equipo'],
      abono: json['abono'] ?? false,
      montoAbono: (json['montoAbono'] ?? 0.0).toDouble(),
      tipoPago: json['tipoPago'] ?? 'efectivo',
      comprobanteYappy: json['comprobanteYappy'],
      diasAlojamiento: json['diasAlojamiento'],
      soloCulto: json['soloCulto'] ?? false,
      color: json['color'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'nombre': nombre,
      'apellido': apellido,
      'edad': edad,
      'telefono': telefono,
      'equipo': equipo,
      'abono': abono,
      'montoAbono': montoAbono,
      'tipoPago': tipoPago,
      'comprobanteYappy': comprobanteYappy,
      'diasAlojamiento': diasAlojamiento,
      'soloCulto': soloCulto,
      'color': color,
    };
  }

  String get nombreCompleto => '$nombre ${apellido == '.' ? '' : apellido}'.trim();
}
