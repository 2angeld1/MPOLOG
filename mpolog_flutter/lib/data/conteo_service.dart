import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'api_constants.dart';
import 'api_service.dart';

class ConteoService {
  final ApiService _apiService = ApiService();

  Future<List<dynamic>> getConteos() async {
    try {
      final response = await _apiService.get(ApiConstants.conteos);
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return [];
    } catch (e) {
      debugPrint('Error obteniendo conteos: $e');
      return [];
    }
  }

  Future<bool> crearConteo(Map<String, dynamic> datos) async {
    try {
      final response = await _apiService.post(ApiConstants.conteos, datos);
      return response.statusCode == 201 || response.statusCode == 200;
    } catch (e) {
      debugPrint('Error creando conteo: $e');
      return false;
    }
  }

  Future<List<String>> getAreas() async {
    try {
      final response = await _apiService.get(ApiConstants.areas);
      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((e) => e.toString()).toList();
      }
      return [];
    } catch (e) {
      debugPrint('Error obteniendo áreas: $e');
      return [];
    }
  }
}
