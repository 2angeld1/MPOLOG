import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../logic/auth_store.dart';
import '../../styles/app_text_styles.dart';
import 'user_maintenance_page.dart';
import 'settings_page.dart';
import 'reportes_page.dart';
import 'package:mpolog_flutter/widgets/cards/admin_stat_card.dart';
import 'package:mpolog_flutter/widgets/items/admin_quick_action.dart';

class SuperAdminDashboard extends StatelessWidget {
  const SuperAdminDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    final authStore = context.watch<AuthStore>();
    final user = authStore.user;

    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surface,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Profile Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Hola, ${user?.nombre ?? 'Admin'}',
                        style: AppTextStyles.h2(context).copyWith(fontSize: 24),
                      ),
                      Text(
                        'Panel de SuperAdmin',
                        style: AppTextStyles.body(context).copyWith(
                          color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.6),
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                  IconButton(
                    onPressed: () => authStore.logout(),
                    icon: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.redAccent.withValues(alpha: 0.1),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.logout, color: Colors.redAccent, size: 20),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 32),

              // Stats Section
              Text('Estadísticas Generales', style: AppTextStyles.h3(context)),
              const SizedBox(height: 16),
              LayoutBuilder(
                builder: (context, constraints) {
                  final crossAxisCount = constraints.maxWidth < 340 ? 1 : 2;
                  return GridView.count(
                    crossAxisCount: crossAxisCount,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    mainAxisSpacing: 16,
                    crossAxisSpacing: 16,
                    childAspectRatio: crossAxisCount == 1 ? 2.5 : 1.3,
                    children: [
                      const AdminStatCard(
                        label: 'Usuarios',
                        value: '248',
                        icon: Icons.people_outline,
                        color: Colors.blueAccent,
                      ),
                      const AdminStatCard(
                        label: 'Eventos',
                        value: '12',
                        icon: Icons.event_available_outlined,
                        color: Colors.purpleAccent,
                      ),
                      const AdminStatCard(
                        label: 'Iglesias',
                        value: '5',
                        icon: Icons.church_outlined,
                        color: Colors.orangeAccent,
                      ),
                      const AdminStatCard(
                        label: 'Reportes',
                        value: '84',
                        icon: Icons.bar_chart_outlined,
                        color: Colors.greenAccent,
                      ),
                    ],
                  );
                },
              ),
              const SizedBox(height: 32),

              // Quick Actions
              Text('Acciones Rápidas', style: AppTextStyles.h3(context)),
              const SizedBox(height: 16),
              AdminQuickAction(
                title: 'Gestión de Usuarios',
                subtitle: 'Asignar roles y permisos',
                icon: Icons.manage_accounts_outlined,
                onTap: () => Navigator.push(context, MaterialPageRoute(builder: (context) => const UserMaintenancePage())),
              ),
              AdminQuickAction(
                title: 'Configuración Global',
                subtitle: 'Ajustes del sistema principal',
                icon: Icons.settings_suggest_outlined,
                onTap: () => Navigator.push(context, MaterialPageRoute(builder: (context) => const SettingsPage())),
              ),
              AdminQuickAction(
                title: 'Ver Reportes Críticos',
                subtitle: 'Análisis de datos mensual',
                icon: Icons.analytics_outlined,
                onTap: () => Navigator.push(context, MaterialPageRoute(builder: (context) => const ReportesPage())),
              ),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }
}
