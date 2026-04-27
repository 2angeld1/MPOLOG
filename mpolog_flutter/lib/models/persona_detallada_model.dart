class PersonaDetalladaModel {
  final String id;
  final String nombre;
  final String apellido;
  final String telefono;
  final List<DateTime> asistencias;
  final String departamento;

  PersonaDetalladaModel({
    required this.id,
    required this.nombre,
    required this.apellido,
    required this.telefono,
    this.asistencias = const [],
    this.departamento = 'Teen',
  });

  factory PersonaDetalladaModel.fromJson(Map<String, dynamic> json) {
    return PersonaDetalladaModel(
      id: json['_id'] ?? '',
      nombre: json['nombre'] ?? '',
      apellido: json['apellido'] ?? '',
      telefono: json['telefono'] ?? '',
      asistencias: (json['asistencias'] as List?)
              ?.map((e) => DateTime.parse(e))
              .toList() ??
          [],
      departamento: json['departamento'] ?? 'Teen',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'nombre': nombre,
      'apellido': apellido,
      'telefono': telefono,
      'departamento': departamento,
    };
  }

  bool asistioHoy() {
    final hoy = DateTime.now();
    return asistencias.any((d) =>
        d.year == hoy.year && d.month == hoy.month && d.day == hoy.day);
  }
}
