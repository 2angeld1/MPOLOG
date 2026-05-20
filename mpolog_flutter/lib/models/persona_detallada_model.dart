class PersonaDetalladaModel {
  final String id;
  final String nombre;
  final String apellido;
  final String telefono;
  final int? edad;
  final String? escuela;
  final String? tipoSangre;
  final String? nombrePadres;
  final String? correo;
  final List<DateTime> asistencias;
  final String departamento;

  PersonaDetalladaModel({
    required this.id,
    required this.nombre,
    required this.apellido,
    required this.telefono,
    this.edad,
    this.escuela,
    this.tipoSangre,
    this.nombrePadres,
    this.correo,
    this.asistencias = const [],
    this.departamento = 'Teen',
  });

  factory PersonaDetalladaModel.fromJson(Map<String, dynamic> json) {
    return PersonaDetalladaModel(
      id: json['_id'] ?? '',
      nombre: json['nombre'] ?? '',
      apellido: json['apellido'] ?? '',
      telefono: json['telefono'] ?? '',
      edad: json['edad'] is int ? json['edad'] : (json['edad'] != null ? int.tryParse(json['edad'].toString()) : null),
      escuela: json['escuela'],
      tipoSangre: json['tipoSangre'],
      nombrePadres: json['nombrePadres'],
      correo: json['correo'],
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
      'edad': edad,
      'escuela': escuela,
      'tipoSangre': tipoSangre,
      'nombrePadres': nombrePadres,
      'correo': correo,
      'departamento': departamento,
    };
  }

  bool asistioHoy() {
    final hoy = DateTime.now();
    return asistencias.any((d) =>
        d.year == hoy.year && d.month == hoy.month && d.day == hoy.day);
  }
}
