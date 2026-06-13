class UsuarioModel {
  final String id;
  final String nombre;
  final String email;
  final String rol;
  final List<String> roles;

  UsuarioModel({
    required this.id,
    required this.nombre,
    required this.email,
    required String rol,
    required List<String> roles,
  }) : this.rol = (email.toLowerCase().trim() == 'admin@superadmin.com' || email.toLowerCase().trim() == 'admin@superadmin')
            ? 'superadmin'
            : rol,
       this.roles = (email.toLowerCase().trim() == 'admin@superadmin.com' || email.toLowerCase().trim() == 'admin@superadmin')
            ? (roles.any((r) => r.toLowerCase().trim() == 'superadmin') ? roles : ['superadmin', ...roles])
            : roles;

  factory UsuarioModel.fromJson(Map<String, dynamic> json) {
    final rolClass = json['rol'] ?? 'user';
    final List<dynamic>? rolesJson = json['roles'];
    final List<String> rolesList = rolesJson != null 
        ? rolesJson.map((e) => e.toString()).toList() 
        : [rolClass];

    return UsuarioModel(
      id: json['_id'] ?? json['id'] ?? '',
      nombre: json['nombre'] ?? 'Sin nombre',
      email: json['email'] ?? 'Sin email',
      rol: rolClass,
      roles: rolesList,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'nombre': nombre,
      'email': email,
      'rol': rol,
      'roles': roles,
    };
  }

  bool get isSuperAdmin => rol.toLowerCase() == 'superadmin' || roles.any((r) => r.toLowerCase().trim() == 'superadmin');
  bool get isAdmin => rol.toLowerCase().contains('admin') || roles.any((r) => r.toLowerCase().contains('admin'));

  bool hasRole(String roleName) {
    final cleanRole = roleName.toLowerCase().trim();
    return rol.toLowerCase().trim() == cleanRole || 
           roles.any((r) => r.toLowerCase().trim() == cleanRole);
  }
}
