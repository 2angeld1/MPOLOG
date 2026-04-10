class UsuarioModel {
  final String id;
  final String nombre;
  final String email;
  final String rol;

  UsuarioModel({
    required this.id,
    required this.nombre,
    required this.email,
    required this.rol,
  });

  factory UsuarioModel.fromJson(Map<String, dynamic> json) {
    return UsuarioModel(
      id: json['_id'] ?? '',
      nombre: json['nombre'] ?? 'Sin nombre',
      email: json['email'] ?? 'Sin email',
      rol: json['rol'] ?? 'user',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'nombre': nombre,
      'email': email,
      'rol': rol,
    };
  }

  bool get isSuperAdmin => rol.toLowerCase() == 'superadmin';
  bool get isAdmin => rol.toLowerCase().contains('admin');
}
