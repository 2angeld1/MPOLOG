import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../modals/notifications_modal.dart';
import '../../logic/notification_store.dart';
import '../../styles/app_text_styles.dart';
import '../../styles/app_colors.dart';

class ChurchDashboardHeader extends StatelessWidget {
  final dynamic user;

  const ChurchDashboardHeader({
    super.key,
    required this.user,
  });

  @override
  Widget build(BuildContext context) {
    return SliverAppBar(
      expandedHeight: 280,
      backgroundColor: AppColors.background,
      flexibleSpace: FlexibleSpaceBar(
        background: Stack(
          fit: StackFit.expand,
          children: [
            Image.asset(
              'assets/images/church_header.png',
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) => Container(
                color: AppColors.primary,
                child: const Center(child: Icon(Icons.church_rounded, color: Colors.white, size: 48)),
              ),
            ),
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.black.withValues(alpha: 0.3),
                    AppColors.background,
                  ],
                ),
              ),
            ),
            Positioned(
              bottom: 24,
              left: 24,
              right: 24,
              child: Row(
                children: [
                  _buildUserAvatar(user),
                  const SizedBox(width: 16),
                  _buildWelcomeText(context, user),
                  _buildNotificationIcon(context),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildUserAvatar(dynamic user) {
    return Container(
      padding: const EdgeInsets.all(2),
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(color: AppColors.primary, width: 2),
      ),
      child: CircleAvatar(
        radius: 32,
        backgroundColor: AppColors.surface,
        child: Text(
          (user?['nombre'] ?? 'U')[0].toUpperCase(),
          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 24),
        ),
      ),
    );
  }

  Widget _buildWelcomeText(BuildContext context, dynamic user) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Bienvenido de nuevo,', style: AppTextStyles.label(context).copyWith(fontSize: 10, color: Colors.white70)),
          Text(user?['nombre'] ?? 'Usuario', style: AppTextStyles.h2(context).copyWith(fontSize: 28, letterSpacing: -0.5)),
          Text(
            (user?['rol']?.toString().toUpperCase() ?? 'ROL DE USUARIO'),
            style: AppTextStyles.label(context).copyWith(fontSize: 10, color: AppColors.accent, fontWeight: FontWeight.bold, letterSpacing: 2),
          ),
        ],
      ),
    );
  }

  Widget _buildNotificationIcon(BuildContext context) {
    return Consumer<NotificationStore>(
      builder: (context, store, _) => Stack(
        clipBehavior: Clip.none,
        children: [
          IconButton(
            icon: const Icon(Icons.notifications_none_rounded, color: Colors.white),
            onPressed: () => showNotificationsModal(context),
          ),
          if (store.unreadCount > 0)
            Positioned(
              right: 10,
              top: 10,
              child: Container(
                padding: const EdgeInsets.all(4),
                decoration: const BoxDecoration(color: Colors.redAccent, shape: BoxShape.circle),
                constraints: const BoxConstraints(minWidth: 14, minHeight: 14),
                child: Text('${store.unreadCount}', style: const TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.bold), textAlign: TextAlign.center),
              ),
            ),
        ],
      ),
    );
  }
}
