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
        final Map<String, dynamic> body = jsonDecode(response.body);
        return body['data'] as List<dynamic>? ?? [];
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

  Future<List<String>> getAreas({String? tipo}) async {
    try {
      final url = tipo != null ? '${ApiConstants.areas}?tipo=$tipo' : ApiConstants.areas;
      final response = await _apiService.get(url);
      if (response.statusCode == 200) {
        final Map<String, dynamic> body = jsonDecode(response.body);
        final List<dynamic> data = body['data'];
        return data.map((e) => e.toString()).toList();
      }
      return [];
    } catch (e) {
      debugPrint('Error obteniendo áreas: $e');
      return [];
    }
  }

  Future<List<String>> getIglesias() async {
    try {
      final response = await _apiService.get(ApiConstants.iglesias);
      if (response.statusCode == 200) {
        final Map<String, dynamic> body = jsonDecode(response.body);
        final List<dynamic> data = body['data'];
        return data.map((e) => e.toString()).toList();
      }
      return [];
    } catch (e) {
      debugPrint('Error obteniendo iglesias: $e');
      return [];
    }
  }

  Future<bool> actualizarConteo(String id, Map<String, dynamic> datos) async {
    try {
      final response = await _apiService.put('${ApiConstants.conteos}/$id', datos);
      return response.statusCode == 200;
    } catch (e) {
      debugPrint('Error actualizando conteo: $e');
      return false;
    }
  }

  Future<bool> eliminarConteo(String id) async {
    try {
      final response = await _apiService.delete('${ApiConstants.conteos}/$id');
      return response.statusCode == 200;
    } catch (e) {
      debugPrint('Error eliminando conteo: $e');
      return false;
    }
  }
}
