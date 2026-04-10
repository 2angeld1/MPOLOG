import 'package:flutter/foundation.dart';
import 'api_constants.dart';
import 'api_service.dart';

class RoleService {
  final ApiService _apiService = ApiService();

  Future<List<dynamic>> getRoles() async {
    try {
      final body = await _apiService.get(ApiConstants.roles);
      return body as List<dynamic>? ?? [];
    } catch (e) {
      debugPrint('Error getting roles: $e');
      return [];
    }
  }

  Future<bool> createRole(Map<String, dynamic> role) async {
    try {
      await _apiService.post(ApiConstants.roles, role);
      return true;
    } catch (e) {
      debugPrint('Error creating role: $e');
      return false;
    }
  }

  Future<bool> deleteRole(String id) async {
    try {
      await _apiService.delete('${ApiConstants.roles}/$id');
      return true;
    } catch (e) {
      debugPrint('Error deleting role: $e');
      return false;
    }
  }
}
