import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../logic/admin_store.dart';
import '../../widgets/glass_container.dart';
import '../../styles/app_colors.dart';
import '../../styles/app_text_styles.dart';

class UserMaintenancePage extends StatefulWidget {
  const UserMaintenancePage({super.key});

  @override
  State<UserMaintenancePage> createState() => _UserMaintenancePageState();
}

class _UserMaintenancePageState extends State<UserMaintenancePage> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() => context.read<AdminStore>().fetchUsers());
    Future.microtask(() => context.read<AdminStore>().fetchRoles());
  }

  void _showRoleDialog(dynamic user) {
    final adminStore = context.read<AdminStore>();
    final roles = adminStore.roles;
    String selectedRole = user['rol'] ?? 'user';

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: Colors.grey[900],
        title: Text('Asignar Rol a ${user['nombre']}', style: AppTextStyles.h3),
        content: StatefulBuilder(
          builder: (context, setDialogState) => Column(
            mainAxisSize: MainAxisSize.min,
            children: roles.map((role) {
              return RadioListTile<String>(
                title: Text(role['name'], style: AppTextStyles.body),
                value: role['name'],
                groupValue: selectedRole,
                onChanged: (val) => setDialogState(() => selectedRole = val!),
                activeColor: AppColors.primary,
              );
            }).toList(),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('CANCELAR', style: TextStyle(color: Colors.white54)),
          ),
          ElevatedButton(
            onPressed: () async {
              final success = await adminStore.updateRole(user['_id'], selectedRole);
              if (mounted) Navigator.pop(context);
              if (success) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Rol actualizado correctamente')),
                );
              }
            },
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
            child: const Text('GUARDAR', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final adminStore = context.watch<AdminStore>();

    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        title: const Text('Gestión de Usuarios', style: AppTextStyles.title),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: adminStore.isLoadingUsers
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: () => adminStore.fetchUsers(),
              child: ListView.builder(
                padding: const EdgeInsets.all(20),
                itemCount: adminStore.users.length,
                itemBuilder: (context, index) {
                  final usr = adminStore.users[index];
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
                              usr['nombre'][0].toUpperCase(),
                              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(usr['nombre'], style: AppTextStyles.h3.copyWith(fontSize: 16)),
                                Text(usr['email'], style: AppTextStyles.body.copyWith(fontSize: 12)),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: _getRoleColor(usr['rol']).withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: _getRoleColor(usr['rol']).withValues(alpha: 0.3)),
                            ),
                            child: Text(
                              usr['rol'].toUpperCase(),
                              style: TextStyle(
                                color: _getRoleColor(usr['rol']),
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.edit_outlined, color: Colors.white54, size: 20),
                            onPressed: () => _showRoleDialog(usr),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
    );
  }

  Color _getRoleColor(String role) {
    switch (role.toLowerCase()) {
      case 'superadmin':
        return Colors.amberAccent;
      case 'logisticadmin':
        return Colors.blueAccent;
      case 'user':
        return Colors.greenAccent;
      default:
        return Colors.grey;
    }
  }
}
