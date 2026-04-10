import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../logic/admin_store.dart';
import '../../widgets/glass_container.dart';
import '../../widgets/glass_text_field.dart';
import '../../styles/app_colors.dart';
import '../../styles/app_text_styles.dart';

class RoleMaintenancePage extends StatefulWidget {
  const RoleMaintenancePage({super.key});

  @override
  State<RoleMaintenancePage> createState() => _RoleMaintenancePageState();
}

class _RoleMaintenancePageState extends State<RoleMaintenancePage> {
  final _nameController = TextEditingController();
  final _descController = TextEditingController();

  @override
  void initState() {
    super.initState();
    Future.microtask(() => context.read<AdminStore>().fetchRoles());
  }

  void _showAddRoleDialog() {
    _nameController.clear();
    _descController.clear();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: Theme.of(context).colorScheme.surface,
        title: Text('Nuevo Rol', style: AppTextStyles.h3(context)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            GlassTextField(label: 'Nombre del Rol', controller: _nameController),
            const SizedBox(height: 12),
            GlassTextField(label: 'Descripción', controller: _descController),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('CANCELAR', style: TextStyle(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.5))),
          ),
          ElevatedButton(
            onPressed: () async {
              if (_nameController.text.isEmpty) return;
              final success = await context.read<AdminStore>().createRole(
                    _nameController.text,
                    _descController.text,
                  );
              if (mounted) Navigator.pop(context);
              if (success) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Rol creado correctamente')),
                );
              }
            },
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
            child: const Text('CREAR', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final adminStore = context.watch<AdminStore>();

    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surface,
      appBar: AppBar(
        title: Text('Configuración de Roles', style: AppTextStyles.title(context)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(
            onPressed: _showAddRoleDialog,
            icon: Icon(Icons.add_circle_outline_rounded, color: Theme.of(context).colorScheme.onSurface, size: 28),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: adminStore.isLoadingRoles
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              padding: const EdgeInsets.fromLTRB(20, 20, 20, 100), // Added bottom padding for credits/tabs
              itemCount: adminStore.roles.length,
              itemBuilder: (context, index) {
                final role = adminStore.roles[index];
                final String roleName = role.name;
                final isSystem = ['superadmin', 'user', 'logisticadmin'].contains(roleName.toLowerCase());

                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: GlassContainer(
                    padding: const EdgeInsets.all(16),
                    borderRadius: 16,
                    child: Row(
                      children: [
                        CircleAvatar(
                          backgroundColor: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.05),
                          child: Icon(Icons.security_rounded, color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.7), size: 20),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(roleName, style: AppTextStyles.h3(context).copyWith(fontSize: 16)),
                              Text(role.description ?? 'Sin descripción',
                                  style: AppTextStyles.body(context).copyWith(fontSize: 12)),
                            ],
                          ),
                        ),
                        if (!isSystem)
                          IconButton(
                            icon: const Icon(Icons.delete_outline, color: Colors.redAccent, size: 20),
                            onPressed: () async {
                              final confirm = await showDialog<bool>(
                                context: context,
                                builder: (context) => AlertDialog(
                                  backgroundColor: Theme.of(context).colorScheme.surface,
                                  title: Text('¿Eliminar Rol?', style: AppTextStyles.h3(context)),
                                  content: Text('¿Estás seguro de eliminar el rol "${role.name}"?', 
                                      style: AppTextStyles.body(context)),
                                  actions: [
                                    TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('NO')),
                                    TextButton(onPressed: () => Navigator.pop(context, true), 
                                        child: const Text('SÍ', style: TextStyle(color: Colors.redAccent))),
                                  ],
                                ),
                              );
                              if (confirm == true) {
                                await adminStore.deleteRole(role.id);
                              }
                            },
                          ),
                        if (isSystem)
                          Tooltip(
                            message: 'Rol del sistema',
                            child: Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: Icon(Icons.lock_outline, color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.2), size: 18),
                            ),
                          ),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }
}
