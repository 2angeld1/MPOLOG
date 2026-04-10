import 'package:flutter/material.dart';
import '../models/evento_model.dart';
import '../models/persona_model.dart';
import '../data/eventos_service.dart';
import '../data/network_exception.dart';

class EventosStore extends ChangeNotifier {
  final EventosService _eventosService = EventosService();
  
  List<EventoModel> _eventos = [];
  bool _isLoading = false;
  String? _errorMessage;
  String? _selectedEventoId;
  Map<String, dynamic>? _estadisticas;
  List<PersonaModel> _personas = [];

  List<EventoModel> get eventos => _eventos;
  List<PersonaModel> get personas => _personas;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  String? get selectedEventoId => _selectedEventoId;
  Map<String, dynamic>? get estadisticas => _estadisticas;

  void setSelectedEvento(String? id) {
    _selectedEventoId = id;
    if (id != null) {
      fetchPersonas(id);
      fetchEstadisticas(id);
    }
    notifyListeners();
  }

  Future<void> fetchEventos({String? departamento, bool? activo}) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _eventos = await _eventosService.getEventos(departamento: departamento, activo: activo);
    } catch (e) {
      _errorMessage = 'Error al cargar eventos';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> crearEvento(Map<String, dynamic> data) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();
    try {
      await _eventosService.crearEvento(data);
      await fetchEventos();
      return true;
    } on NetworkException catch (e) {
      _errorMessage = e.message;
      return false;
    } catch (e) {
      _errorMessage = 'Error de conexión con el servidor';
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchPersonas(String eventoId) async {
    try {
      _personas = await _eventosService.getPersonas(eventoId);
      notifyListeners();
    } catch (e) {
      debugPrint('Error fetching personas: $e');
    }
  }

  Future<void> fetchEstadisticas(String eventoId) async {
    try {
      _estadisticas = await _eventosService.getEstadisticas(eventoId);
      notifyListeners();
    } catch (e) {
      debugPrint('Error fetching stats: $e');
    }
  }

  Future<bool> registrarPersona(String eventoId, Map<String, dynamic> data) async {
    try {
      final success = await _eventosService.registrarPersona(eventoId, data);
      if (success) {
        await fetchPersonas(eventoId);
        await fetchEstadisticas(eventoId);
      }
      return success;
    } catch (e) {
      return false;
    }
  }

  Future<bool> eliminarPersona(String eventoId, String personaId) async {
    try {
      final success = await _eventosService.eliminarPersona(eventoId, personaId);
      if (success) {
        await fetchPersonas(eventoId);
        await fetchEstadisticas(eventoId);
      }
      return success;
    } catch (e) {
      return false;
    }
  }

  Future<bool> actualizarPersona(String eventoId, String personaId, Map<String, dynamic> data) async {
    try {
      final success = await _eventosService.actualizarPersona(eventoId, personaId, data);
      if (success) {
        await fetchPersonas(eventoId);
        await fetchEstadisticas(eventoId);
      }
      return success;
    } catch (e) {
      return false;
    }
  }
}
