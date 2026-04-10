import 'package:flutter/material.dart';
import '../glass_container.dart';
import '../../styles/app_colors.dart';
import '../../styles/app_text_styles.dart';
import 'package:mpolog_flutter/models/usuario_model.dart';

class UserListItem extends StatelessWidget {
  final UsuarioModel user;
  final VoidCallback onEdit;

  const UserListItem({
    super.key,
    required this.user,
    required this.onEdit,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final role = user.rol;

    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: GlassContainer(
        padding: const EdgeInsets.all(16),
        borderRadius: 16,
        child: Row(
          children: [
            CircleAvatar(
              backgroundColor: AppColors.primary.withValues(alpha: 0.2),
              child: Text(
                user.nombre.isNotEmpty ? user.nombre[0].toUpperCase() : 'U',
                style: TextStyle(
                  color: isDark ? Colors.white : AppColors.primary, 
                  fontWeight: FontWeight.bold
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(user.nombre, style: AppTextStyles.h3(context).copyWith(fontSize: 16)),
                  Text(user.email, style: AppTextStyles.body(context).copyWith(fontSize: 12)),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: _getRoleColor(role, isDark).withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: _getRoleColor(role, isDark).withValues(alpha: 0.3)),
              ),
              child: Text(
                role.toUpperCase(),
                style: TextStyle(
                  color: _getRoleColor(role, isDark),
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            IconButton(
              icon: Icon(Icons.edit_outlined, 
                color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.5), 
                size: 20
              ),
              onPressed: onEdit,
            ),
          ],
        ),
      ),
    );
  }

  Color _getRoleColor(String role, bool isDark) {
    if (isDark) {
      switch (role.toLowerCase()) {
        case 'superadmin': return Colors.amberAccent;
        case 'logisticadmin': return Colors.blueAccent;
        case 'eventsadmin': return Colors.purpleAccent;
        case 'sameadmin': return Colors.tealAccent;
        case 'usuario':
        case 'user': return Colors.greenAccent;
        default: return Colors.grey;
      }
    } else {
      switch (role.toLowerCase()) {
        case 'superadmin': return Colors.orange[800]!;
        case 'logisticadmin': return Colors.blue[800]!;
        case 'eventsadmin': return Colors.purple[800]!;
        case 'sameadmin': return Colors.teal[800]!;
        case 'usuario':
        case 'user': return Colors.green[800]!;
        default: return Colors.grey[700]!;
      }
    }
  }
}
