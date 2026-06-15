import 'package:flutter/material.dart';
import '../models/persona_detallada_model.dart';
import '../data/registro_detallado_service.dart';

class RegistroKidsStore extends ChangeNotifier {
  final RegistroDetalladoService _service = RegistroDetalladoService();

  List<PersonaDetalladaModel> _personas = [];
  bool _isLoading = false;
  String? _errorMessage;

  List<PersonaDetalladaModel> get personas => _personas;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<void> fetchPersonas() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _personas = await _service.getPersonas(departamento: 'Kids');
    } catch (e) {
      _errorMessage = 'Error al cargar registros';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> crearPersona(Map<String, dynamic> data) async {
    try {
      final success = await _service.crearPersona(data);
      if (success) await fetchPersonas();
      return success;
    } catch (e) {
      return false;
    }
  }

  Future<int> importarListaPersonas(List<Map<String, dynamic>> lista) async {
    _isLoading = true;
    notifyListeners();
    int importados = 0;
    try {
      for (final data in lista) {
        final success = await _service.crearPersona(data);
        if (success) importados++;
      }
      if (importados > 0) {
        await fetchPersonas();
      }
      return importados;
    } catch (e) {
      return importados;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> actualizarPersona(String id, Map<String, dynamic> data) async {
    try {
      final success = await _service.actualizarPersona(id, data);
      if (success) await fetchPersonas();
      return success;
    } catch (e) {
      return false;
    }
  }

  Future<bool> eliminarPersona(String id) async {
    try {
      final success = await _service.eliminarPersona(id);
      if (success) await fetchPersonas();
      return success;
    } catch (e) {
      return false;
    }
  }

  Future<bool> guardarAsistencias(List<String> ids) async {
    _isLoading = true;
    notifyListeners();
    try {
      final success = await _service.marcarAsistencia(ids);
      if (success) await fetchPersonas();
      return success;
    } catch (e) {
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
