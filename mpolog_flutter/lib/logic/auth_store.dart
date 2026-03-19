import 'package:flutter/material.dart';
import '../data/auth_service.dart';

class AuthStore extends ChangeNotifier {
  final AuthService _authService = AuthService();
  bool _isLoggedIn = false;
  bool _isLoading = false;
  String? _errorMessage;
  Map<String, dynamic>? _user;

  bool get isLoggedIn => _isLoggedIn;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  Map<String, dynamic>? get user => _user;
  bool get isSuperAdmin => _user?['rol'] == 'superadmin';
  bool get isLogisticAdmin => _user?['rol'] == 'logisticadmin' || _user?['rol'] == 'sameadmin';
  bool get canManageCounts => isSuperAdmin || isLogisticAdmin;

  AuthStore() {
    _checkStatus();
  }

  Future<void> _checkStatus() async {
    _isLoggedIn = await _authService.isLoggedIn();
    if (_isLoggedIn) {
      _user = await _authService.getUser();
    }
    notifyListeners();
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
        _user = result['data']['user'];
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
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final result = await _authService.register(
        nombre: nombre,
        email: email,
        password: password,
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
    notifyListeners();
  }

  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }
}
