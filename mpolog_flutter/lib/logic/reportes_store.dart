import 'package:flutter/material.dart';

import 'package:flutter_dotenv/flutter_dotenv.dart';

class ReportesStore extends ChangeNotifier {
  final String _baseUrl = dotenv.env['API_URL'] ?? 'http://localhost:5000';
  
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

  Future<String> getReportUrl(String format) async {
    // El backend usa query params para los filtros
    String url = '$_baseUrl/reportes/$format?periodo=$_selectedPeriodo';
    if (_selectedTipo != null) url += '&tipo=$_selectedTipo';
    if (_selectedIglesia != null) url += '&iglesia=$_selectedIglesia';
    
    // Agregamos el token como query param si el backend lo soporta o 
    // manejamos la descarga con headers (requeriría un plugin de descarga)
    // Para simplificar, asumiremos que el backend puede recibir el token en la URL si lo ajustamos,
    // o el usuario abrirá un WebView / Link que puede fallar sin headers.
    
    // ADVERTENCIA: Pasar tokens en la URL no es lo ideal por seguridad, 
    // pero para prototipos rápidos con links directos es común.
    // Si el middleware 'auth' del backend solo mira headers, necesitaremos descargar el archivo manualmente.
    
    return url;
  }
  
  // Opción para obtener el gráfico como imagen
  String getChartUrl() {
    String url = '$_baseUrl/reportes/png?periodo=$_selectedPeriodo';
    if (_selectedTipo != null) url += '&tipo=$_selectedTipo';
    if (_selectedIglesia != null) url += '&iglesia=$_selectedIglesia';
    return url;
  }
}
