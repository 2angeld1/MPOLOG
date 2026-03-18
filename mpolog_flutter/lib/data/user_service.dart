import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'api_constants.dart';
import 'api_service.dart';

class UserService {
  final ApiService _apiService = ApiService();

  Future<List<dynamic>> getUsers() async {
    try {
      final response = await _apiService.get(ApiConstants.usuarios);
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return [];
    } catch (e) {
      debugPrint('Error getting users: $e');
      return [];
    }
  }

  Future<bool> updateUserRole(String id, String newRole) async {
    try {
      final response = await _apiService.put(
        '${ApiConstants.usuarios}/$id/role',
        {'rol': newRole},
      );
      return response.statusCode == 200;
    } catch (e) {
      debugPrint('Error updating role: $e');
      return false;
    }
  }

  Future<bool> deleteUser(String id) async {
    try {
      final response = await _apiService.delete('${ApiConstants.usuarios}/$id');
      return response.statusCode == 200;
    } catch (e) {
      debugPrint('Error deleting user: $e');
      return false;
    }
  }
}
