import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../logic/auth_store.dart';
import '../../logic/config_store.dart';
import '../../logic/conteo_store.dart';
import '../../widgets/glass_container.dart';
import '../../styles/app_colors.dart';
import '../../styles/app_text_styles.dart';
import 'reportes_page.dart';

class SettingsPage extends StatefulWidget {
  const SettingsPage({super.key});

  @override
  State<SettingsPage> createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ConteoStore>().fetchIglesias();
    });
  }

  @override
  Widget build(BuildContext context) {
    final authStore = context.watch<AuthStore>();
    final configStore = context.watch<ConfigStore>();
    final conteoStore = context.watch<ConteoStore>();
    final canManage = authStore.canManageCounts;

    return Container(
      color: AppColors.background,
      child: Scaffold(
        backgroundColor: Colors.transparent,
        body: CustomScrollView(
          slivers: [
            SliverAppBar(
              expandedHeight: 280,
              backgroundColor: AppColors.background,
              pinned: true,
              flexibleSpace: FlexibleSpaceBar(
                titlePadding: const EdgeInsets.only(left: 24, bottom: 24),
                title: Text('Configuración', 
                  style: AppTextStyles.h2(context).copyWith(fontSize: 24, fontWeight: FontWeight.bold)),
                background: Stack(
                  fit: StackFit.expand,
                  children: [
                    Image.asset(
                      'assets/images/church_header.png',
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) => Container(color: AppColors.background),
                    ),
                    Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          stops: const [0.0, 0.5, 1.0],
                          colors: [
                            Colors.transparent,
                            Colors.black.withValues(alpha: 0.3),
                            AppColors.background,
                          ],
                        ),
                      ),
                    ),
                    Positioned(
                      right: -30,
                      top: -10,
                      child: Icon(Icons.settings_rounded, size: 160, color: Colors.white.withValues(alpha: 0.05)),
                    ),
                  ],
                ),
              ),
            ),
            SliverPadding(
              padding: const EdgeInsets.all(24),
              sliver: SliverList(
                delegate: SliverChildListDelegate([
                  _buildSectionTitle('DATOS PERSONALES'),
                  const SizedBox(height: 16),
                  GlassContainer(
                    padding: const EdgeInsets.all(16),
                    borderRadius: 20,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildProfileItem(
                          context,
                          Icons.person_rounded,
                          'Nombre',
                          authStore.user?.nombre ?? 'Sin nombre',
                        ),
                        const Divider(color: Colors.white12, height: 24),
                        _buildProfileItem(
                          context,
                          Icons.email_rounded,
                          'Email',
                          authStore.user?.email ?? 'Sin email',
                        ),
                        const Divider(color: Colors.white12, height: 24),
                        _buildProfileItem(
                          context,
                          Icons.admin_panel_settings_rounded,
                          'Roles Activos',
                          authStore.user?.roles.map((r) => _capitalize(r)).join(' / ') ?? _capitalize(authStore.user?.rol ?? 'Sin rol'),
                          onTap: () => _showChangeRoleModal(context, authStore),
                          trailing: const Icon(
                            Icons.edit_rounded,
                            color: AppColors.primary,
                            size: 18,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 32),
                  _buildSectionTitle('SEDE PRINCIPAL'),
                  const SizedBox(height: 16),
                  GlassContainer(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    borderRadius: 20,
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: AppColors.primary.withValues(alpha: 0.1),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.church_rounded, color: AppColors.primary, size: 20),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: DropdownButtonHideUnderline(
                            child: DropdownButton<String>(
                              value: configStore.selectedIglesia,
                              isExpanded: true,
                              hint: Text(conteoStore.isLoading ? 'Cargando...' : 'Selecciona una sede', 
                                style: AppTextStyles.body(context).copyWith(color: Colors.white38)),
                              dropdownColor: AppColors.surface,
                              style: AppTextStyles.body(context).copyWith(fontWeight: FontWeight.w600, color: Colors.white),
                              items: (conteoStore.iglesias.isEmpty && configStore.selectedIglesia != null)
                                ? [DropdownMenuItem(value: configStore.selectedIglesia, child: Text(configStore.selectedIglesia!))]
                                : conteoStore.iglesias.map((String value) {
                                    return DropdownMenuItem<String>(
                                      value: value,
                                      child: Text(value),
                                    );
                                  }).toList(),
                              onChanged: (newValue) {
                                configStore.setSelectedIglesia(newValue);
                              },
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  if (canManage) ...[
                    const SizedBox(height: 32),
                    _buildSectionTitle('ADMINISTRACIÓN'),
                    const SizedBox(height: 16),
                    GlassContainer(
                      padding: const EdgeInsets.all(4),
                      borderRadius: 20,
                      child: ListTile(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (context) => const ReportesPage()),
                          );
                        },
                        leading: Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: AppColors.primary.withValues(alpha: 0.1),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.bar_chart_rounded, color: AppColors.primary, size: 20),
                        ),
                        title: Text('SISTEMA DE REPORTES', 
                          style: AppTextStyles.body(context).copyWith(fontWeight: FontWeight.bold, fontSize: 13, letterSpacing: 1)),
                        trailing: const Icon(Icons.chevron_right_rounded, color: Colors.white24),
                      ),
                    ),
                  ],
                  const SizedBox(height: 32),
                  _buildSectionTitle('SISTEMA'),
                  const SizedBox(height: 16),
                  GlassContainer(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    borderRadius: 20,
                    child: ListTile(
                      contentPadding: EdgeInsets.zero,
                      leading: const Icon(Icons.language_rounded, color: Colors.white38),
                      title: Text('Idioma', style: AppTextStyles.body(context).copyWith(fontWeight: FontWeight.bold)),
                      trailing: Text('Español', style: AppTextStyles.body(context).copyWith(fontSize: 14, color: AppColors.primary)),
                    ),
                  ),
                  const SizedBox(height: 32),
                  _buildSectionTitle('CUENTA'),
                  const SizedBox(height: 16),
                  GlassContainer(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    borderRadius: 20,
                    child: ListTile(
                      contentPadding: EdgeInsets.zero,
                      leading: const Icon(Icons.logout_rounded, color: Colors.redAccent),
                      title: Text('Cerrar Sesión', 
                        style: AppTextStyles.body(context).copyWith(fontWeight: FontWeight.bold, color: Colors.redAccent)),
                      onTap: () {
                         showDialog(
                          context: context,
                          builder: (context) => AlertDialog(
                            title: const Text('Cerrar Sesión'),
                            content: const Text('¿Estás seguro de que deseas salir?'),
                            actions: [
                              TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancelar')),
                              TextButton(
                                onPressed: () {
                                  Navigator.pop(context);
                                  authStore.logout();
                                }, 
                                child: const Text('Cerrar Sesión', style: TextStyle(color: Colors.redAccent))
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: 100),
                ]),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(title, style: AppTextStyles.label(context).copyWith(
      letterSpacing: 2.5, 
      fontWeight: FontWeight.bold,
      fontSize: 10,
      color: Colors.white.withValues(alpha: 0.4)
    ));
  }

  Widget _buildProfileItem(
    BuildContext context,
    IconData icon,
    String label,
    String value, {
    VoidCallback? onTap,
    Widget? trailing,
  }) {
    final item = Row(
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: AppColors.primary.withValues(alpha: 0.1),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, color: AppColors.primary, size: 20),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: AppTextStyles.label(context).copyWith(
                  fontSize: 11,
                  color: Colors.white.withValues(alpha: 0.4),
                ),
              ),
              const SizedBox(height: 2),
              Text(
                value,
                style: AppTextStyles.body(context).copyWith(
                  fontWeight: FontWeight.w600,
                  fontSize: 14,
                ),
              ),
            ],
          ),
        ),
        if (trailing != null) trailing,
      ],
    );

    if (onTap != null) {
      return InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 4),
          child: item,
        ),
      );
    }

    return item;
  }

  String _capitalize(String text) {
    if (text.isEmpty) return text;
    return text.split(' ').map((word) {
      if (word.isEmpty) return word;
      return word[0].toUpperCase() + word.substring(1).toLowerCase();
    }).join(' ');
  }

  static const _rolesDisponibles = [
    _RolOption('usuario',       'Usuario',     Icons.person_outline_rounded),
    _RolOption('jef teen',     'Jef Teen',    Icons.group_rounded),
    _RolOption('jef',          'Jef',         Icons.star_rounded),
    _RolOption('mentor club',  'Mentor Club', Icons.child_care_rounded),
    _RolOption('servidores',   'Servidores',  Icons.volunteer_activism_rounded),
    _RolOption('logisticadmin','Logística',   Icons.inventory_2_rounded),
    _RolOption('eventsadmin',  'Eventos',     Icons.event_note_rounded),
    _RolOption('sameadmin',    'SAME',        Icons.medical_services_rounded),
  ];

  void _showChangeRoleModal(BuildContext context, AuthStore authStore) {
    List<String> selectedRoles = List<String>.from(authStore.user?.roles ?? [authStore.user?.rol ?? 'usuario']);
    bool isSaving = false;

    showDialog(
      context: context,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setState) {
            return AlertDialog(
              backgroundColor: AppColors.surface,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
              title: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Cambiar Roles', style: AppTextStyles.h3(context)),
                  const SizedBox(height: 6),
                  Text(
                    'Selecciona uno o más roles en el sistema:',
                    style: AppTextStyles.body(context).copyWith(fontSize: 12, color: Colors.white38),
                  ),
                ],
              ),
              content: SizedBox(
                width: double.maxFinite,
                child: SingleChildScrollView(
                  child: Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: _rolesDisponibles.map((rol) {
                      final selected = selectedRoles.contains(rol.value);
                      return GestureDetector(
                        onTap: isSaving ? null : () {
                          setState(() {
                            if (selected) {
                              if (selectedRoles.length > 1) {
                                selectedRoles.remove(rol.value);
                              } else {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text('Debes tener al menos un rol asignado'),
                                    duration: Duration(seconds: 2),
                                  ),
                                );
                              }
                            } else {
                              selectedRoles.add(rol.value);
                            }
                          });
                        },
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                          decoration: BoxDecoration(
                            color: selected
                                ? const Color(0xFF9D4EDD).withValues(alpha: 0.25)
                                : Colors.white.withValues(alpha: 0.05),
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(
                              color: selected ? const Color(0xFF9D4EDD) : Colors.white24,
                              width: selected ? 1.5 : 1,
                            ),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                rol.icon,
                                size: 16,
                                color: selected ? const Color(0xFF9D4EDD) : Colors.white54,
                              ),
                              const SizedBox(width: 6),
                              Text(
                                rol.label,
                                style: TextStyle(
                                  color: selected ? Colors.white : Colors.white60,
                                  fontSize: 12,
                                  fontWeight: selected ? FontWeight.bold : FontWeight.normal,
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ),
              actions: [
                TextButton(
                  onPressed: isSaving ? null : () => Navigator.pop(context),
                  child: Text('CANCELAR', style: TextStyle(color: Colors.white.withValues(alpha: 0.5))),
                ),
                ElevatedButton(
                  onPressed: isSaving
                      ? null
                      : () async {
                          setState(() => isSaving = true);
                          final success = await authStore.updateMyRoles(selectedRoles);
                          if (context.mounted) {
                            Navigator.pop(context);
                            if (success) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Roles actualizados correctamente'),
                                  backgroundColor: Colors.green,
                                ),
                              );
                            } else {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text(authStore.errorMessage ?? 'Error al actualizar los roles'),
                                  backgroundColor: Colors.redAccent,
                                ),
                              );
                            }
                          }
                        },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                  ),
                  child: isSaving
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                        )
                      : const Text('GUARDAR', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                ),
              ],
            );
          },
        );
      },
    );
  }
}

class _RolOption {
  final String value;
  final String label;
  final IconData icon;
  const _RolOption(this.value, this.label, this.icon);
}
