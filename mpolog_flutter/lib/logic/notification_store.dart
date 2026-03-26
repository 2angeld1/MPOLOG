import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../data/socket_service.dart';

class AppNotification {
  final String id;
  final String title;
  final String body;
  final DateTime timestamp;
  bool isRead;
  final String type; // 'conteo', 'evento', 'alerta'

  AppNotification({
    required this.id,
    required this.title,
    required this.body,
    required this.timestamp,
    this.isRead = false,
    required this.type,
  });

  factory AppNotification.fromJson(Map<String, dynamic> json) {
    return AppNotification(
      id: json['_id'] ?? '',
      title: json['title'] ?? '',
      body: json['body'] ?? '',
      timestamp: DateTime.parse(json['createdAt'] ?? DateTime.now().toIso8601String()),
      isRead: json['isRead'] ?? false,
      type: json['type'] ?? 'alerta',
    );
  }
}

class NotificationStore with ChangeNotifier {
  final List<AppNotification> _notifications = [];
  int _unreadCount = 0;
  final SocketService _socketService = SocketService();
  final String _baseUrl = dotenv.env['API_URL'] ?? 'http://localhost:5000/api';

  List<AppNotification> get notifications => _notifications;
  int get unreadCount => _unreadCount;

  NotificationStore() {
    _socketService.addListener(_handleSocketEvent);
  }

  void _handleSocketEvent(String event, dynamic data) {
    // Alarma nueva desde el servidor (ahora mandamos el objeto completo de la DB)
    if (event == 'notificacion-nueva') {
      final n = AppNotification.fromJson(data);
      _notifications.insert(0, n);
      if (!n.isRead) _unreadCount++;
      notifyListeners();
    }
  }

  Future<void> fetchNotifications() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      if (token == null) return;

      final response = await http.get(
        Uri.parse('$_baseUrl/notificaciones'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        _notifications.clear();
        _notifications.addAll(data.map((n) => AppNotification.fromJson(n)).toList());
        _unreadCount = _notifications.where((n) => !n.isRead).length;
        notifyListeners();
      }
    } catch (e) {
      print('Error fetching notifications: $e');
    }
  }

  Future<void> markAllAsRead() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      
      // Local optimista
      for (var n in _notifications) {
        n.isRead = true;
      }
      _unreadCount = 0;
      notifyListeners();

      // Backend
      if (token != null) {
        await http.put(
          Uri.parse('$_baseUrl/notificaciones/read-all'),
          headers: {'Authorization': 'Bearer $token'},
        );
      }
    } catch (e) {
      print('Error marking all as read: $e');
    }
  }

  Future<void> clearNotifications() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      
      // Local
      _notifications.clear();
      _unreadCount = 0;
      notifyListeners();

      // Backend
      if (token != null) {
        await http.delete(
          Uri.parse('$_baseUrl/notificaciones/clear'),
          headers: {'Authorization': 'Bearer $token'},
        );
      }
    } catch (e) {
      print('Error clearing notifications: $e');
    }
  }
}
