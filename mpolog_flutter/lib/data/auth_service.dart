import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'api_constants.dart';
import 'api_service.dart';

class AuthService {
  final ApiService _apiService = ApiService();

  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await _apiService.post(ApiConstants.login, {
      'email': email,
      'password': password,
    });

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final token = data['token'];

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('token', token);

      if (data['user'] != null) {
        await prefs.setString('user', jsonEncode(data['user']));
      }

      return {'success': true, 'data': data};
    }

    final errorBody = jsonDecode(response.body);
    return {
      'success': false,
      'message': errorBody['message'] ?? 'Error al iniciar sesión',
    };
  }

  Future<Map<String, dynamic>> register({
    required String nombre,
    required String email,
    required String password,
  }) async {
    final response = await _apiService.post(ApiConstants.register, {
      'nombre': nombre,
      'email': email,
      'password': password,
    });

    if (response.statusCode == 200 || response.statusCode == 201) {
      final data = jsonDecode(response.body);
      return {'success': true, 'data': data};
    }

    final errorBody = jsonDecode(response.body);
    return {
      'success': false,
      'message': errorBody['message'] ?? 'Error al registrar usuario',
    };
  }

  Future<Map<String, dynamic>?> getUser() async {
    final prefs = await SharedPreferences.getInstance();
    final userStr = prefs.getString('user');
    if (userStr != null) {
      return jsonDecode(userStr);
    }
    return null;
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    await prefs.remove('user');
  }

  Future<bool> isLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.containsKey('token');
  }
}
