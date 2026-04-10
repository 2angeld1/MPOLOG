import 'dart:convert';
import 'dart:typed_data';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'network_exception.dart';
import 'api_constants.dart';

class ApiService {
  final String _baseUrl = ApiConstants.baseUrl;

  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  Future<Map<String, String>> _getHeaders() async {
    final token = await getToken();
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  dynamic _processResponse(http.Response response) {
    // For binary responses, we don't decode JSON
    if (response.headers['content-type']?.contains('application/json') == false) {
      if (response.statusCode >= 200 && response.statusCode < 300) {
        return response.bodyBytes;
      }
    }

    final body = response.body.isNotEmpty ? jsonDecode(response.body) : null;
    
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return body;
    } else {
      final message = body != null && body['message'] != null 
          ? body['message'] 
          : 'Error en el servidor';
      throw NetworkException(message, response.statusCode);
    }
  }

  Future<dynamic> get(String endpoint) async {
    final headers = await _getHeaders();
    final response = await http.get(Uri.parse('$_baseUrl$endpoint'), headers: headers);
    return _processResponse(response);
  }

  Future<Uint8List> getBytes(String endpoint) async {
    final headers = await _getHeaders();
    final response = await http.get(Uri.parse('$_baseUrl$endpoint'), headers: headers);
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return response.bodyBytes;
    } else {
      _processResponse(response); // Will throw
      return Uint8List(0);
    }
  }

  Future<dynamic> post(String endpoint, dynamic body) async {
    final headers = await _getHeaders();
    final response = await http.post(
      Uri.parse('$_baseUrl$endpoint'),
      headers: headers,
      body: jsonEncode(body),
    );
    return _processResponse(response);
  }

  Future<dynamic> put(String endpoint, dynamic body) async {
    final headers = await _getHeaders();
    final response = await http.put(
      Uri.parse('$_baseUrl$endpoint'),
      headers: headers,
      body: jsonEncode(body),
    );
    return _processResponse(response);
  }

  Future<dynamic> delete(String endpoint) async {
    final headers = await _getHeaders();
    final response = await http.delete(Uri.parse('$_baseUrl$endpoint'), headers: headers);
    return _processResponse(response);
  }
}
