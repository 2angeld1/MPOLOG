class EventoModel {
  final String id;
  final String nombre;
  final String? descripcion;
  final DateTime? fechaInicio;
  final DateTime? fechaFin;
  final bool activo;
  final String? departamento;
  final double precioTotal;
  final UbicacionModel? ubicacion;

  EventoModel({
    required this.id,
    required this.nombre,
    this.descripcion,
    this.fechaInicio,
    this.fechaFin,
    this.activo = true,
    this.departamento,
    this.precioTotal = 0.0,
    this.ubicacion,
  });

  factory EventoModel.fromJson(Map<String, dynamic> json) {
    return EventoModel(
      id: json['_id'] ?? '',
      nombre: json['nombre'] ?? '',
      descripcion: json['descripcion'],
      fechaInicio: json['fechaInicio'] != null ? DateTime.tryParse(json['fechaInicio']) : null,
      fechaFin: json['fechaFin'] != null ? DateTime.tryParse(json['fechaFin']) : null,
      activo: json['activo'] ?? true,
      departamento: json['departamento'],
      precioTotal: (json['precioTotal'] ?? 0.0).toDouble(),
      ubicacion: json['ubicacion'] != null ? UbicacionModel.fromJson(json['ubicacion']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'nombre': nombre,
      'descripcion': descripcion,
      'fechaInicio': fechaInicio?.toIso8601String(),
      'fechaFin': fechaFin?.toIso8601String(),
      'activo': activo,
      'departamento': departamento,
      'precioTotal': precioTotal,
      'ubicacion': ubicacion?.toJson(),
    };
  }
}

class UbicacionModel {
  final String nombreLugar;
  final double? lat;
  final double? lng;

  UbicacionModel({
    required this.nombreLugar,
    this.lat,
    this.lng,
  });

  factory UbicacionModel.fromJson(Map<String, dynamic> json) {
    return UbicacionModel(
      nombreLugar: json['nombreLugar'] ?? '',
      lat: (json['lat'] != null) ? (json['lat'] as num).toDouble() : null,
      lng: (json['lng'] != null) ? (json['lng'] as num).toDouble() : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'nombreLugar': nombreLugar,
      'lat': lat,
      'lng': lng,
    };
  }
}
