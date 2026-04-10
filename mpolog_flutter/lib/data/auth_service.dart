import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'api_constants.dart';
import 'api_service.dart';
import 'network_exception.dart';

class AuthService {
  final ApiService _apiService = ApiService();

  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final data = await _apiService.post(ApiConstants.login, {
        'email': email,
        'password': password,
      });

      final token = data['token'];
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('token', token);

      if (data['user'] != null) {
        await prefs.setString('user', jsonEncode(data['user']));
      }

      return {'success': true, 'data': data};
    } on NetworkException catch (e) {
      return {'success': false, 'message': e.message};
    } catch (e) {
      return {'success': false, 'message': 'Error inesperado'};
    }
  }

  Future<Map<String, dynamic>> register({
    required String nombre,
    required String email,
    required String password,
  }) async {
    try {
      final data = await _apiService.post(ApiConstants.register, {
        'nombre': nombre,
        'email': email,
        'password': password,
      });
      return {'success': true, 'data': data};
    } on NetworkException catch (e) {
      return {'success': false, 'message': e.message};
    } catch (e) {
      return {'success': false, 'message': 'Error inesperado'};
    }
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
