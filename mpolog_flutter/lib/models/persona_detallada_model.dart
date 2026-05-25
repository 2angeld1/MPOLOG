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
  final String? tallaSueter;
  final String? grupo;
  final String? adultoResponsable;
  final String? direccion;
  final String? alergiasMedicamentos;
  final List<DateTime> asistencias;
  final String departamento;
  final String? foto;

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
    this.tallaSueter,
    this.grupo,
    this.adultoResponsable,
    this.direccion,
    this.alergiasMedicamentos,
    this.asistencias = const [],
    this.departamento = 'Teen',
    this.foto,
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
      tallaSueter: json['tallaSueter'],
      grupo: json['grupo'],
      adultoResponsable: json['adultoResponsable'],
      direccion: json['direccion'],
      alergiasMedicamentos: json['alergiasMedicamentos'],
      asistencias: (json['asistencias'] as List?)
              ?.map((e) => DateTime.parse(e))
              .toList() ??
          [],
      departamento: json['departamento'] ?? 'Teen',
      foto: json['foto'],
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
      'tallaSueter': tallaSueter,
      'grupo': grupo,
      'adultoResponsable': adultoResponsable,
      'direccion': direccion,
      'alergiasMedicamentos': alergiasMedicamentos,
      'departamento': departamento,
      if (foto != null) 'foto': foto,
    };
  }

  bool asistioHoy() {
    final hoy = DateTime.now();
    return asistencias.any((d) =>
        d.year == hoy.year && d.month == hoy.month && d.day == hoy.day);
  }
}
