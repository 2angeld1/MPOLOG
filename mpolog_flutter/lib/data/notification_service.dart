import '../data/api_service.dart';
import '../models/notification_model.dart';

class NotificationService {
  final ApiService _apiService = ApiService();

  Future<List<NotificationModel>> getNotifications() async {
    try {
      final body = await _apiService.get('/notificaciones');
      final List<dynamic> data = body;
      return data.map((n) => NotificationModel.fromJson(n)).toList();
    } catch (e) {
      return [];
    }
  }

  Future<bool> markAllAsRead() async {
    try {
      await _apiService.put('/notificaciones/read-all', {});
      return true;
    } catch (e) {
      return false;
    }
  }

  Future<bool> clearNotifications() async {
    try {
      await _apiService.delete('/notificaciones/clear');
      return true;
    } catch (e) {
      return false;
    }
  }
}
