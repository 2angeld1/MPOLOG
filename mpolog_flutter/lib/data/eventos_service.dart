import '../data/api_service.dart';
import '../models/evento_model.dart';
import '../models/persona_model.dart';

class EventosService {
  final ApiService _apiService = ApiService();

  Future<List<EventoModel>> getEventos({String? departamento, bool? activo}) async {
    String url = '/eventos?';
    if (departamento != null) url += 'departamento=$departamento&';
    if (activo != null) url += 'activo=$activo&';
    
    final List<dynamic> data = await _apiService.get(url);
    return data.map((e) => EventoModel.fromJson(e)).toList();
  }

  Future<bool> crearEvento(Map<String, dynamic> data) async {
    await _apiService.post('/eventos', data);
    return true;
  }

  Future<List<PersonaModel>> getPersonas(String eventoId) async {
    final List<dynamic> data = await _apiService.get('/eventos/$eventoId/personas');
    return data.map((e) => PersonaModel.fromJson(e)).toList();
  }

  Future<Map<String, dynamic>> getEstadisticas(String eventoId) async {
    final data = await _apiService.get('/eventos/$eventoId/estadisticas');
    return data as Map<String, dynamic>;
  }

  Future<bool> registrarPersona(String eventoId, Map<String, dynamic> data) async {
    await _apiService.post('/eventos/$eventoId/personas', data);
    return true;
  }

  Future<bool> eliminarPersona(String eventoId, String personaId) async {
    await _apiService.delete('/eventos/$eventoId/personas/$personaId');
    return true;
  }

  Future<bool> actualizarPersona(String eventoId, String personaId, Map<String, dynamic> data) async {
    await _apiService.put('/eventos/$eventoId/personas/$personaId', data);
    return true;
  }
}
