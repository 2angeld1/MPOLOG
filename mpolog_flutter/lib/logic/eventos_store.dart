import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../data/api_constants.dart';

class EventosStore extends ChangeNotifier {
  final String _baseUrl = ApiConstants.baseUrl;
  
  List<dynamic> _eventos = [];
  bool _isLoading = false;
  String? _errorMessage;
  String? _selectedEventoId;
  Map<String, dynamic>? _estadisticas;
  List<dynamic> _personas = [];

  List<dynamic> get eventos => _eventos;
  List<dynamic> get personas => _personas;
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

  Future<Map<String, String>> _getHeaders() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    };
  }

  Future<void> fetchEventos({String? departamento, bool? activo}) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      String url = '$_baseUrl/eventos?';
      if (departamento != null) url += 'departamento=$departamento&';
      if (activo != null) url += 'activo=$activo&';

      final response = await http.get(
        Uri.parse(url),
        headers: await _getHeaders(),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        _eventos = data as List;
      } else {
        _errorMessage = 'Error al cargar eventos';
      }
    } catch (e) {
      _errorMessage = 'Error de conexión';
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
      final response = await http.post(
        Uri.parse('$_baseUrl/eventos'),
        headers: await _getHeaders(),
        body: json.encode(data),
      );

      final responseData = json.decode(response.body);

      if (response.statusCode == 201 || response.statusCode == 200) {
        await fetchEventos();
        return true;
      } else {
        // Capturar mensaje de error del backend (ej. solapamiento)
        _errorMessage = responseData['message'] ?? 'Error al crear el evento';
        return false;
      }
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
      final response = await http.get(
        Uri.parse('$_baseUrl/eventos/$eventoId/personas'),
        headers: await _getHeaders(),
      );
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        _personas = data as List;
        notifyListeners();
      }
    } catch (e) {
      debugPrint('Error fetching personas: $e');
    }
  }

  Future<void> fetchEstadisticas(String eventoId) async {
    try {
      final response = await http.get(
        Uri.parse('$_baseUrl/eventos/$eventoId/estadisticas'),
        headers: await _getHeaders(),
      );
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        _estadisticas = data as Map<String, dynamic>;
        notifyListeners();
      }
    } catch (e) {
      debugPrint('Error fetching stats: $e');
    }
  }

  Future<bool> registrarPersona(String eventoId, Map<String, dynamic> data) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/eventos/$eventoId/personas'),
        headers: await _getHeaders(),
        body: json.encode(data),
      );
      if (response.statusCode == 201 || response.statusCode == 200) {
        await fetchPersonas(eventoId);
        await fetchEstadisticas(eventoId);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  Future<bool> eliminarPersona(String eventoId, String personaId) async {
    try {
      final response = await http.delete(
        Uri.parse('$_baseUrl/eventos/$eventoId/personas/$personaId'),
        headers: await _getHeaders(),
      );
      if (response.statusCode == 200) {
        await fetchPersonas(eventoId);
        await fetchEstadisticas(eventoId);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  Future<bool> actualizarPersona(String eventoId, String personaId, Map<String, dynamic> data) async {
    try {
      final response = await http.put(
        Uri.parse('$_baseUrl/eventos/$eventoId/personas/$personaId'),
        headers: await _getHeaders(),
        body: json.encode(data),
      );
      if (response.statusCode == 200) {
        await fetchPersonas(eventoId);
        await fetchEstadisticas(eventoId);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
}
