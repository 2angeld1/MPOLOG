import 'package:flutter/material.dart';
import '../data/auth_service.dart';
import '../data/user_service.dart';
import '../models/usuario_model.dart';

class AuthStore extends ChangeNotifier {
  final AuthService _authService = AuthService();
  bool _isLoggedIn = false;
  bool _isLoading = false;
  String? _errorMessage;
  UsuarioModel? _user;

  bool get isLoggedIn => _isLoggedIn;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  UsuarioModel? get user => _user;
  
  bool get isSuperAdmin => _user?.hasRole('superadmin') ?? false;
  bool get isLogisticAdmin => (_user?.hasRole('logisticadmin') ?? false) || (_user?.hasRole('sameadmin') ?? false);
  bool get canManageCounts => isSuperAdmin || isLogisticAdmin;

  AuthStore() {
    _checkStatus();
  }

  Future<void> _checkStatus() async {
    try {
      _isLoggedIn = await _authService.isLoggedIn();
      if (_isLoggedIn) {
        final userData = await _authService.getUser();
        if (userData != null) {
          _user = UsuarioModel.fromJson(userData);
          debugPrint('AuthStore: Usuario cargado con ID="${_user!.id}", rol="${_user!.rol}", roles=${_user!.roles}');
          // Auto-reparar sesión cacheada: re-guardar con formato normalizado (_id)
          if (_user!.id.isNotEmpty) {
            await _authService.saveUser(_user!.toJson());
          } else {
            debugPrint('AuthStore: ⚠️ ID de usuario vacío. Forzando logout para re-autenticar.');
            await _authService.logout();
            _isLoggedIn = false;
            _user = null;
          }
        }
      }
    } catch (e) {
      debugPrint("Error verificando estado de autenticación: $e");
      _isLoggedIn = false;
    } finally {
      notifyListeners();
    }
  }

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final result = await _authService.login(email, password);

      if (result['success'] == true) {
        _isLoggedIn = true;
        _isLoading = false;
        _user = UsuarioModel.fromJson(result['data']['user']);
        debugPrint('AuthStore login: ID="${_user!.id}", rol="${_user!.rol}"');
        // Guardar con formato normalizado (_id) para consistencia
        await _authService.saveUser(_user!.toJson());
        notifyListeners();
        return true;
      }

      _errorMessage = result['message'] ?? 'Error al iniciar sesión';
      _isLoading = false;
      notifyListeners();
      return false;
    } catch (e) {
      _errorMessage = 'Error de conexión. Verifica tu red.';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<Map<String, dynamic>> register({
    required String nombre,
    required String email,
    required String password,
    List<String> roles = const [],
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final result = await _authService.register(
        nombre: nombre,
        email: email,
        password: password,
        roles: roles,
      );

      _isLoading = false;

      if (result['success'] != true) {
        _errorMessage = result['message'] ?? 'Error al registrar';
      }

      notifyListeners();
      return result;
    } catch (e) {
      _errorMessage = 'Error de conexión. Verifica tu red.';
      _isLoading = false;
      notifyListeners();
      return {'success': false, 'message': _errorMessage};
    }
  }

  Future<void> logout() async {
    await _authService.logout();
    _isLoggedIn = false;
    _user = null;
    notifyListeners();
  }

  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }

  Future<bool> updateMyRoles(List<String> newRoles) async {
    if (_user == null) return false;
    if (newRoles.isEmpty) return false;
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final userService = UserService();
      final success = await userService.updateUserRoles(_user!.id, newRoles);
      if (success) {
        final primaryRol = newRoles.first;
        _user = UsuarioModel(
          id: _user!.id,
          nombre: _user!.nombre,
          email: _user!.email,
          rol: primaryRol,
          roles: newRoles,
        );
        await _authService.saveUser(_user!.toJson());
        notifyListeners();
        return true;
      }
      _errorMessage = 'No se pudo actualizar el rol en el servidor';
      return false;
    } catch (e) {
      _errorMessage = 'Error al actualizar el rol';
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> updateMyRole(String newRole) async {
    return updateMyRoles([newRole]);
  }
}
