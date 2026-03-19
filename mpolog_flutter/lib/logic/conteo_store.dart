import 'package:flutter/material.dart';
import '../data/conteo_service.dart';

class ConteoStore with ChangeNotifier {
  final ConteoService _conteoService = ConteoService();
  
  List<dynamic> _conteos = [];
  List<String> _areas = [];
  List<String> _iglesias = [];
  bool _isLoading = false;
  String? _errorMessage;

  List<dynamic> get conteos => _conteos;
  List<String> get areas => _areas;
  List<String> get iglesias => _iglesias;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<void> fetchConteos() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _conteos = await _conteoService.getConteos();
    } catch (e) {
      _errorMessage = 'Error al cargar los conteos';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchAreas({String? tipo}) async {
    _isLoading = true;
    notifyListeners();
    _areas = await _conteoService.getAreas(tipo: tipo);
    _isLoading = false;
    notifyListeners();
  }

  Future<void> fetchIglesias() async {
    _isLoading = true;
    notifyListeners();
    _iglesias = await _conteoService.getIglesias();
    _isLoading = false;
    notifyListeners();
  }

  Future<bool> registerConteo(Map<String, dynamic> data) async {
    _isLoading = true;
    notifyListeners();

    final success = await _conteoService.crearConteo(data);
    
    if (success) {
      await fetchConteos();
    } else {
      _errorMessage = 'Error al registrar el conteo';
    }
    
    _isLoading = false;
    notifyListeners();
    return success;
  }

  Future<bool> updateConteo(String id, Map<String, dynamic> data) async {
    _isLoading = true;
    notifyListeners();

    final success = await _conteoService.actualizarConteo(id, data);
    
    if (success) {
      await fetchConteos();
    } else {
      _errorMessage = 'Error al actualizar el conteo';
    }
    
    _isLoading = false;
    notifyListeners();
    return success;
  }

  Future<bool> deleteConteo(String id) async {
    _isLoading = true;
    notifyListeners();

    final success = await _conteoService.eliminarConteo(id);
    
    if (success) {
      await fetchConteos();
    } else {
      _errorMessage = 'Error al eliminar el conteo';
    }
    
    _isLoading = false;
    notifyListeners();
    return success;
  }
}
