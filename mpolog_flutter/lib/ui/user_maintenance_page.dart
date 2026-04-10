import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../logic/admin_store.dart';
import '../../styles/app_text_styles.dart';
import '../../widgets/items/user_list_item.dart';
import '../../widgets/modals/assign_role_modal.dart';

class UserMaintenancePage extends StatefulWidget {
  const UserMaintenancePage({super.key});

  @override
  State<UserMaintenancePage> createState() => _UserMaintenancePageState();
}

class _UserMaintenancePageState extends State<UserMaintenancePage> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      if (!mounted) return;
      context.read<AdminStore>().fetchUsers();
      context.read<AdminStore>().fetchRoles();
    });
  }

  @override
  Widget build(BuildContext context) {
    final adminStore = context.watch<AdminStore>();

    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surface,
      appBar: AppBar(
        title: Text('Gestión de Usuarios', style: AppTextStyles.title(context)),
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
                  return UserListItem(
                    user: usr,
                    onEdit: () => showAssignRoleModal(context, usr, adminStore),
                  );
                },
              ),
            ),
    );
  }
}
