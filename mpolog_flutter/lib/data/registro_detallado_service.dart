import '../data/api_service.dart';
import '../models/persona_detallada_model.dart';

class RegistroDetalladoService {
  final ApiService _apiService = ApiService();

  Future<List<PersonaDetalladaModel>> getPersonas({String? departamento}) async {
    String url = '/registro-detallado?';
    if (departamento != null) url += 'departamento=$departamento';
    
    final List<dynamic> data = await _apiService.get(url);
    return data.map((e) => PersonaDetalladaModel.fromJson(e)).toList();
  }

  Future<bool> crearPersona(Map<String, dynamic> data) async {
    await _apiService.post('/registro-detallado', data);
    return true;
  }

  Future<bool> actualizarPersona(String id, Map<String, dynamic> data) async {
    await _apiService.put('/registro-detallado/$id', data);
    return true;
  }

  Future<bool> eliminarPersona(String id) async {
    await _apiService.delete('/registro-detallado/$id');
    return true;
  }

  Future<bool> marcarAsistencia(List<String> ids, {DateTime? fecha}) async {
    await _apiService.post('/registro-detallado/asistencia', {
      'ids': ids,
      if (fecha != null) 'fecha': fecha.toIso8601String(),
    });
    return true;
  }
}
