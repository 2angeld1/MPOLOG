import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../logic/auth_store.dart';
import '../../widgets/glass_container.dart';
import '../../styles/app_text_styles.dart';

class SuperAdminDashboard extends StatelessWidget {
  const SuperAdminDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    final authStore = context.watch<AuthStore>();
    final user = authStore.user;

    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surface,
      body: Stack(
        fit: StackFit.expand,
        children: [
          // Background color is handled by Scaffold
          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Profile Header with Logout
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Hola, ${user?['nombre'] ?? 'Admin'}',
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
                  GridView.count(
                    crossAxisCount: 2,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    mainAxisSpacing: 16,
                    crossAxisSpacing: 16,
                    childAspectRatio: 1.3,
                    children: [
                      _buildStatCard(
                        context,
                        'Usuarios',
                        '248',
                        Icons.people_outline,
                        Colors.blueAccent,
                      ),
                      _buildStatCard(
                        context,
                        'Eventos',
                        '12',
                        Icons.event_available_outlined,
                        Colors.purpleAccent,
                      ),
                      _buildStatCard(
                        context,
                        'Iglesias',
                        '5',
                        Icons.church_outlined,
                        Colors.orangeAccent,
                      ),
                      _buildStatCard(
                        context,
                        'Reportes',
                        '84',
                        Icons.bar_chart_outlined,
                        Colors.greenAccent,
                      ),
                    ],
                  ),
                  const SizedBox(height: 32),

                  // Quick Actions
                  Text('Acciones Rápidas', style: AppTextStyles.h3(context)),
                  const SizedBox(height: 16),
                  _buildQuickAction(
                    context,
                    'Gestión de Usuarios',
                    'Asignar roles y permisos',
                    Icons.manage_accounts_outlined,
                    () {},
                  ),
                  _buildQuickAction(
                    context,
                    'Configuración Global',
                    'Ajustes del sistema principal',
                    Icons.settings_suggest_outlined,
                    () {},
                  ),
                  _buildQuickAction(
                    context,
                    'Ver Reportes Críticos',
                    'Análisis de datos mensual',
                    Icons.analytics_outlined,
                    () {},
                  ),
                  const SizedBox(height: 40),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(BuildContext context, String label, String value, IconData icon, Color color) {
    return GlassContainer(
      padding: const EdgeInsets.all(16),
      borderRadius: 20,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: color.withValues(alpha: 0.8), size: 28),
          const SizedBox(height: 12),
          Text(value, style: AppTextStyles.h2(context).copyWith(fontSize: 22)),
          Text(
            label,
            style: AppTextStyles.body(context).copyWith(
              color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.5),
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickAction(BuildContext context, String title, String subtitle, IconData icon, VoidCallback onTap) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: GestureDetector(
        onTap: onTap,
        child: GlassContainer(
          padding: const EdgeInsets.all(16),
          borderRadius: 16,
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.05),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.7), size: 24),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: AppTextStyles.body(context).copyWith(fontWeight: FontWeight.bold)),
                    Text(
                      subtitle,
                      style: AppTextStyles.body(context).copyWith(
                        color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.5),
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
              Icon(Icons.chevron_right, color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.2)),
            ],
          ),
        ),
      ),
    );
  }
}
