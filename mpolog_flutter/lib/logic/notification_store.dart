import 'package:flutter/material.dart';
import '../data/socket_service.dart';
import '../models/notification_model.dart';
import '../data/notification_service.dart';

class NotificationStore with ChangeNotifier {
  final List<NotificationModel> _notifications = [];
  int _unreadCount = 0;
  final SocketService _socketService = SocketService();
  final NotificationService _notificationService = NotificationService();

  List<NotificationModel> get notifications => _notifications;
  int get unreadCount => _unreadCount;

  NotificationStore() {
    _socketService.addListener(_handleSocketEvent);
  }

  void _handleSocketEvent(String event, dynamic data) {
    if (event == 'notificacion-nueva') {
      final n = NotificationModel.fromJson(data);
      _notifications.insert(0, n);
      if (!n.isRead) _unreadCount++;
      notifyListeners();
    }
  }

  Future<void> fetchNotifications() async {
    final results = await _notificationService.getNotifications();
    _notifications.clear();
    _notifications.addAll(results);
    _unreadCount = _notifications.where((n) => !n.isRead).length;
    notifyListeners();
  }

  Future<void> markAllAsRead() async {
    // Optimista local
    for (var n in _notifications) {
      n.isRead = true;
    }
    _unreadCount = 0;
    notifyListeners();

    await _notificationService.markAllAsRead();
  }

  Future<void> clearNotifications() async {
    // Local
    _notifications.clear();
    _unreadCount = 0;
    notifyListeners();

    await _notificationService.clearNotifications();
  }
}
