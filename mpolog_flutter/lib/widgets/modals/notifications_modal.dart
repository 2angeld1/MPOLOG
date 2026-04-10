import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../glass_container.dart';
import '../../logic/notification_store.dart';
import '../../styles/app_colors.dart';

class NotificationsModal extends StatelessWidget {
  const NotificationsModal({super.key});

  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      initialChildSize: 0.7,
      maxChildSize: 0.9,
      minChildSize: 0.5,
      builder: (context, scrollController) => GlassContainer(
        borderRadius: 32,
        padding: const EdgeInsets.all(24),
        child: Consumer<NotificationStore>(
          builder: (context, store, _) => Column(
            children: [
              Container(
                width: 40,
                height: 4,
                margin: const EdgeInsets.only(bottom: 24),
                decoration: BoxDecoration(
                  color: Colors.white24, 
                  borderRadius: BorderRadius.circular(2)
                ),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'NOTIFICACIONES', 
                    style: TextStyle(
                      letterSpacing: 2, 
                      color: Colors.white70, 
                      fontSize: 12
                    )
                  ),
                  TextButton(
                    onPressed: () => store.markAllAsRead(), 
                    child: const Text(
                      'Leer todo', 
                      style: TextStyle(fontSize: 12, color: AppColors.primary)
                    )
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Expanded(
                child: store.notifications.isEmpty
                    ? const Center(
                        child: Text(
                          'Sin alertas pendientes', 
                          style: TextStyle(color: Colors.white10)
                        )
                      )
                    : ListView.builder(
                        controller: scrollController,
                        itemCount: store.notifications.length,
                        itemBuilder: (context, index) {
                          final n = store.notifications[index];
                          return _buildNotificationItem(n);
                        },
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNotificationItem(AppNotification n) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: GlassContainer(
        padding: const EdgeInsets.all(16),
        borderRadius: 20,
        child: Row(
          children: [
            Icon(
              n.type == 'conteo' ? Icons.insights_rounded : Icons.calendar_month_rounded, 
              color: AppColors.primary, 
              size: 18
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start, 
                children: [
                  Text(
                    n.title, 
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)
                  ),
                  Text(
                    n.body, 
                    style: const TextStyle(fontSize: 11, color: Colors.white54)
                  ),
                ]
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// Función auxiliar para mostrar el modal fácilmente
void showNotificationsModal(BuildContext context) {
  showModalBottomSheet(
    context: context,
    backgroundColor: Colors.transparent,
    isScrollControlled: true,
    builder: (context) => const NotificationsModal(),
  );
}
