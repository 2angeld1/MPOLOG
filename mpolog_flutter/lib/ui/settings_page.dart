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
}
