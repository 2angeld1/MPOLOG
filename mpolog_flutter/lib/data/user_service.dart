import 'package:flutter/foundation.dart';
import 'api_constants.dart';
import 'api_service.dart';

class UserService {
  final ApiService _apiService = ApiService();

  Future<List<dynamic>> getUsers() async {
    try {
      final body = await _apiService.get(ApiConstants.usuarios);
      return body as List<dynamic>? ?? [];
    } catch (e) {
      debugPrint('Error getting users: $e');
      return [];
    }
  }

  Future<bool> updateUserRoles(String id, List<String> newRoles) async {
    try {
      await _apiService.put(
        '${ApiConstants.usuarios}/$id/role',
        {'roles': newRoles},
      );
      return true;
    } catch (e) {
      debugPrint('Error updating roles: $e');
      return false;
    }
  }

  Future<bool> updateUserRole(String id, String newRole) async {
    return updateUserRoles(id, [newRole]);
  }

  Future<bool> deleteUser(String id) async {
    try {
      await _apiService.delete('${ApiConstants.usuarios}/$id');
      return true;
    } catch (e) {
      debugPrint('Error deleting user: $e');
      return false;
    }
  }
}
