import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  Future<Map<String, String>> _getHeaders() async {
    final token = await getToken();
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  // GET genérico
  Future<http.Response> get(String url) async {
    final headers = await _getHeaders();
    return await http.get(Uri.parse(url), headers: headers);
  }

  // POST genérico
  Future<http.Response> post(String url, dynamic body) async {
    final headers = await _getHeaders();
    return await http.post(
      Uri.parse(url),
      headers: headers,
      body: jsonEncode(body),
    );
  }

  // PUT genérico
  Future<http.Response> put(String url, dynamic body) async {
    final headers = await _getHeaders();
    return await http.put(
      Uri.parse(url),
      headers: headers,
      body: jsonEncode(body),
    );
  }

  // DELETE genérico
  Future<http.Response> delete(String url) async {
    final headers = await _getHeaders();
    return await http.delete(Uri.parse(url), headers: headers);
  }
}
