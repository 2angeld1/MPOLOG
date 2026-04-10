import 'package:flutter/foundation.dart';
import 'api_constants.dart';
import 'api_service.dart';

class ConteoService {
  final ApiService _apiService = ApiService();

  Future<List<dynamic>> getConteos() async {
    try {
      final body = await _apiService.get(ApiConstants.conteos);
      return body['data'] as List<dynamic>? ?? [];
    } catch (e) {
      debugPrint('Error obteniendo conteos: $e');
      return [];
    }
  }

  Future<bool> crearConteo(Map<String, dynamic> datos) async {
    try {
      await _apiService.post(ApiConstants.conteos, datos);
      return true;
    } catch (e) {
      debugPrint('Error creando conteo: $e');
      return false;
    }
  }

  Future<List<String>> getAreas({String? tipo}) async {
    try {
      final url = tipo != null ? '${ApiConstants.areas}?tipo=$tipo' : ApiConstants.areas;
      final body = await _apiService.get(url);
      final List<dynamic> data = body['data'];
      return data.map((e) => e.toString()).toList();
    } catch (e) {
      debugPrint('Error obteniendo áreas: $e');
      return [];
    }
  }

  Future<List<String>> getIglesias() async {
    try {
      final body = await _apiService.get(ApiConstants.iglesias);
      final List<dynamic> data = body['data'];
      return data.map((e) => e.toString()).toList();
    } catch (e) {
      debugPrint('Error obteniendo iglesias: $e');
      return [];
    }
  }

  Future<bool> actualizarConteo(String id, Map<String, dynamic> datos) async {
    try {
      await _apiService.put('${ApiConstants.conteos}/$id', datos);
      return true;
    } catch (e) {
      debugPrint('Error actualizando conteo: $e');
      return false;
    }
  }

  Future<bool> eliminarConteo(String id) async {
    try {
      await _apiService.delete('${ApiConstants.conteos}/$id');
      return true;
    } catch (e) {
      debugPrint('Error eliminando conteo: $e');
      return false;
    }
  }
}
