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
        backgroundColor: Colors.grey[900],
        title: const Text('Nuevo Rol', style: AppTextStyles.h3),
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
            child: const Text('CANCELAR', style: TextStyle(color: Colors.white54)),
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
      backgroundColor: Colors.black,
      appBar: AppBar(
        title: const Text('Configuración de Roles', style: AppTextStyles.title),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: adminStore.isLoadingRoles
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              padding: const EdgeInsets.all(20),
              itemCount: adminStore.roles.length,
              itemBuilder: (context, index) {
                final role = adminStore.roles[index];
                final isSystem = ['superadmin', 'user', 'logisticadmin'].contains(role['name'].toLowerCase());

                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: GlassContainer(
                    padding: const EdgeInsets.all(16),
                    borderRadius: 16,
                    child: Row(
                      children: [
                        const CircleAvatar(
                          backgroundColor: Colors.white10,
                          child: Icon(Icons.security_rounded, color: Colors.white70, size: 20),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(role['name'], style: AppTextStyles.h3.copyWith(fontSize: 16)),
                              Text(role['description'] ?? 'Sin descripción',
                                  style: AppTextStyles.body.copyWith(fontSize: 12)),
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
                                  backgroundColor: Colors.grey[900],
                                  title: const Text('¿Eliminar Rol?', style: AppTextStyles.h3),
                                  content: Text('¿Estás seguro de eliminar el rol "${role['name']}"?', 
                                      style: AppTextStyles.body),
                                  actions: [
                                    TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('NO')),
                                    TextButton(onPressed: () => Navigator.pop(context, true), 
                                        child: const Text('SÍ', style: TextStyle(color: Colors.redAccent))),
                                  ],
                                ),
                              );
                              if (confirm == true) {
                                await adminStore.deleteRole(role['_id']);
                              }
                            },
                          ),
                        if (isSystem)
                          const Tooltip(
                            message: 'Rol del sistema',
                            child: Padding(
                              padding: EdgeInsets.all(8.0),
                              child: Icon(Icons.lock_outline, color: Colors.white24, size: 18),
                            ),
                          ),
                      ],
                    ),
                  ),
                );
              },
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: _showAddRoleDialog,
        backgroundColor: AppColors.primary,
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }
}
