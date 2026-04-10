import 'package:flutter/material.dart';
import '../../logic/admin_store.dart';
import '../../styles/app_colors.dart';
import '../../styles/app_text_styles.dart';
import 'package:mpolog_flutter/models/usuario_model.dart';

class AssignRoleModal extends StatefulWidget {
  final UsuarioModel user;
  final AdminStore adminStore;

  const AssignRoleModal({
    super.key,
    required this.user,
    required this.adminStore,
  });

  @override
  State<AssignRoleModal> createState() => _AssignRoleModalState();
}

class _AssignRoleModalState extends State<AssignRoleModal> {
  late String _selectedRole;

  @override
  void initState() {
    super.initState();
    _selectedRole = widget.user.rol;
  }

  @override
  Widget build(BuildContext context) {
    final roles = widget.adminStore.roles;

    return AlertDialog(
      backgroundColor: Theme.of(context).colorScheme.surface,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      title: Text(
        'Asignar Rol a ${widget.user.nombre}',
        style: AppTextStyles.h3(context),
      ),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: roles.map((role) {
            final roleName = role.name;
            return RadioListTile<String>(
              title: Text(roleName, style: AppTextStyles.body(context)),
              value: roleName,
              groupValue: _selectedRole,
              onChanged: (val) => setState(() => _selectedRole = val!),
              activeColor: AppColors.primary,
            );
          }).toList(),
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: Text('CANCELAR', style: TextStyle(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.5))),
        ),
        ElevatedButton(
          onPressed: () async {
            final success = await widget.adminStore.updateRole(
              widget.user.id,
              _selectedRole,
            );
            if (mounted) Navigator.pop(context);
            if (success && mounted) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Rol actualizado correctamente')),
              );
            }
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.primary,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
          child: const Text('GUARDAR', style: TextStyle(color: Colors.white)),
        ),
      ],
    );
  }
}

void showAssignRoleModal(
  BuildContext context,
  UsuarioModel user,
  AdminStore adminStore,
) {
  showDialog(
    context: context,
    builder: (context) => AssignRoleModal(user: user, adminStore: adminStore),
  );
}
