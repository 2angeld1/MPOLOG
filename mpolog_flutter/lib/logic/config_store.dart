import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ConfigStore with ChangeNotifier {
  String? _selectedIglesia;

  String? get selectedIglesia => _selectedIglesia;

  ConfigStore() {
    _loadConfig();
  }

  Future<void> _loadConfig() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      _selectedIglesia = prefs.getString('selected_iglesia');
    } catch (e) {
      debugPrint("Error cargando configuración: $e");
    } finally {
      notifyListeners();
    }
  }

  Future<void> setSelectedIglesia(String? iglesia) async {
    _selectedIglesia = iglesia;
    final prefs = await SharedPreferences.getInstance();
    if (iglesia != null) {
      await prefs.setString('selected_iglesia', iglesia);
    } else {
      await prefs.remove('selected_iglesia');
    }
    notifyListeners();
  }
}
