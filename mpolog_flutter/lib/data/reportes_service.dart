import 'dart:typed_data';
import '../data/api_service.dart';

class ReportesService {
  final ApiService _apiService = ApiService();

  Future<Uint8List> getChartImage({
    required String periodo,
    String? tipo,
    String? iglesia,
  }) async {
    String endpoint = '/reportes/png?periodo=$periodo';
    if (tipo != null) endpoint += '&tipo=$tipo';
    if (iglesia != null) endpoint += '&iglesia=$iglesia';
    
    return await _apiService.getBytes(endpoint);
  }

  String getReportEndpoint({
    required String format,
    required String periodo,
    String? tipo,
    String? iglesia,
  }) {
    String endpoint = '/reportes/$format?periodo=$periodo';
    if (tipo != null) endpoint += '&tipo=$tipo';
    if (iglesia != null) endpoint += '&iglesia=$iglesia';
    return endpoint;
  }
}
