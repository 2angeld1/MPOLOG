import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../logic/notification_store.dart';
import '../styles/app_colors.dart';
import '../styles/app_text_styles.dart';
import '../widgets/glass_container.dart';
import '../models/notification_model.dart';

class NotificationsPage extends StatelessWidget {
  const NotificationsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 120,
            pinned: true,
            backgroundColor: AppColors.background,
            flexibleSpace: FlexibleSpaceBar(
              title: Text('NOTIFICACIONES', style: AppTextStyles.h3(context).copyWith(fontSize: 16)),
              background: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [AppColors.primary.withValues(alpha: 0.2), AppColors.background],
                  ),
                ),
              ),
            ),
            actions: [
              IconButton(
                icon: const Icon(Icons.done_all_rounded, color: AppColors.primary),
                onPressed: () => context.read<NotificationStore>().markAllAsRead(),
                tooltip: 'Marcar todas como leídas',
              ),
              IconButton(
                icon: const Icon(Icons.delete_sweep_outlined, color: Colors.white38),
                onPressed: () => _confirmClear(context),
                tooltip: 'Limpiar historial',
              ),
            ],
          ),
          
          Consumer<NotificationStore>(
            builder: (context, store, child) {
              if (store.notifications.isEmpty) {
                return SliverFillRemaining(
                  child: Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.notifications_none_rounded, size: 64, color: Colors.white10),
                        const SizedBox(height: 16),
                        Text('No tienes notificaciones', style: TextStyle(color: Colors.white24)),
                      ],
                    ),
                  ),
                );
              }

              return SliverPadding(
                padding: const EdgeInsets.all(16),
                sliver: SliverList(
                  delegate: SliverChildBuilderDelegate(
                    (context, index) {
                      final NotificationModel n = store.notifications[index];
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 12),
                        child: _buildNotificationCard(context, n),
                      );
                    },
                    childCount: store.notifications.length,
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildNotificationCard(BuildContext context, NotificationModel n) {
    IconData icon;
    Color color;

    switch (n.type) {
      case 'conteo':
        icon = Icons.analytics_outlined;
        color = AppColors.success;
        break;
      case 'evento':
        icon = Icons.calendar_today_rounded;
        color = AppColors.accent;
        break;
      default:
        icon = Icons.notifications_active_outlined;
        color = AppColors.primary;
    }

    return GlassContainer(
      padding: const EdgeInsets.all(16),
      borderRadius: 20,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: (n.isRead ? Colors.white10 : color).withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: n.isRead ? Colors.white24 : color, size: 20),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      n.title.toUpperCase(),
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1,
                        color: n.isRead ? Colors.white38 : color,
                      ),
                    ),
                    Text(
                      DateFormat('HH:mm').format(n.timestamp),
                      style: const TextStyle(fontSize: 10, color: Colors.white24),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  n.body,
                  style: TextStyle(
                    fontSize: 13,
                    color: n.isRead ? Colors.white38 : Colors.white70,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
          if (!n.isRead)
            Container(
              margin: const EdgeInsets.only(left: 8, top: 20),
              width: 8,
              height: 8,
              decoration: const BoxDecoration(color: AppColors.primary, shape: BoxShape.circle),
            ),
        ],
      ),
    );
  }

  void _confirmClear(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppColors.surface,
        title: const Text('¿Limpiar historial?'),
        content: const Text('Se eliminarán todas las notificaciones recibidas en esta sesión.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('CANCELAR')),
          TextButton(
            onPressed: () {
              context.read<NotificationStore>().clearNotifications();
              Navigator.pop(context);
            },
            child: const Text('LIMPIAR', style: TextStyle(color: Colors.redAccent)),
          ),
        ],
      ),
    );
  }
}
