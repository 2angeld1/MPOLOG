import 'package:flutter/material.dart';
import 'dart:typed_data';
import '../data/reportes_service.dart';
import '../data/api_constants.dart';

class ReportesStore extends ChangeNotifier {
  final ReportesService _service = ReportesService();
  
  String _selectedPeriodo = 'mes';
  String? _selectedTipo = 'personas';
  String? _selectedIglesia;
  bool _isLoading = false;

  String get selectedPeriodo => _selectedPeriodo;
  String? get selectedTipo => _selectedTipo;
  String? get selectedIglesia => _selectedIglesia;
  bool get isLoading => _isLoading;

  void setPeriodo(String val) {
    _selectedPeriodo = val;
    notifyListeners();
  }

  void setTipo(String? val) {
    _selectedTipo = val;
    notifyListeners();
  }

  void setIglesia(String? val) {
    _selectedIglesia = val;
    notifyListeners();
  }

  Future<Uint8List?> fetchChartImage() async {
    _isLoading = true;
    notifyListeners();
    try {
      final bytes = await _service.getChartImage(
        periodo: _selectedPeriodo,
        tipo: _selectedTipo,
        iglesia: _selectedIglesia,
      );
      _isLoading = false;
      notifyListeners();
      return bytes;
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      return null;
    }
  }

  Future<String> getReportUrl(String format) async {
    final endpoint = _service.getReportEndpoint(
      format: format,
      periodo: _selectedPeriodo,
      tipo: _selectedTipo,
      iglesia: _selectedIglesia,
    );
    return '${ApiConstants.baseUrl}$endpoint';
  }
}
