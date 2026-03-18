import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'api_constants.dart';
import 'api_service.dart';

class RoleService {
  final ApiService _apiService = ApiService();

  Future<List<dynamic>> getRoles() async {
    try {
      final response = await _apiService.get(ApiConstants.roles);
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return [];
    } catch (e) {
      debugPrint('Error getting roles: $e');
      return [];
    }
  }

  Future<bool> createRole(Map<String, dynamic> role) async {
    try {
      final response = await _apiService.post(ApiConstants.roles, role);
      return response.statusCode == 201;
    } catch (e) {
      debugPrint('Error creating role: $e');
      return false;
    }
  }

  Future<bool> deleteRole(String id) async {
    try {
      final response = await _apiService.delete('${ApiConstants.roles}/$id');
      return response.statusCode == 200;
    } catch (e) {
      debugPrint('Error deleting role: $e');
      return false;
    }
  }
}
