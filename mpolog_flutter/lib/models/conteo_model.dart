class ConteoModel {
  final String id;
  final String area;
  final String? subArea;
  final String tipo;
  final int cantidad;
  final DateTime fecha;
  final String iglesia;
  final String? registradoPor;

  ConteoModel({
    required this.id,
    required this.area,
    this.subArea,
    required this.tipo,
    required this.cantidad,
    required this.fecha,
    required this.iglesia,
    this.registradoPor,
  });

  factory ConteoModel.fromJson(Map<String, dynamic> json) {
    return ConteoModel(
      id: json['_id'] ?? '',
      area: json['area'] ?? '',
      subArea: json['subArea'],
      tipo: json['tipo'] ?? 'personas',
      cantidad: json['cantidad'] ?? 0,
      fecha: json['fecha'] != null ? DateTime.parse(json['fecha']) : DateTime.now(),
      iglesia: json['iglesia'] ?? '',
      registradoPor: json['registradoPor']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'area': area,
      if (subArea != null) 'subArea': subArea,
      'tipo': tipo,
      'cantidad': cantidad,
      'fecha': fecha.toIso8601String(),
      'iglesia': iglesia,
      'registradoPor': registradoPor,
    };
  }
}
