import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../logic/auth_store.dart';
import '../../logic/conteo_store.dart';
import '../../logic/config_store.dart';
import '../../logic/notification_store.dart';
import 'calendario_page.dart';
import 'add_conteo_page.dart';
import '../../widgets/charts/distribution_donut_chart.dart';
import '../../widgets/charts/activity_bar_chart.dart';
import '../../widgets/cards/summary_card.dart';
import '../../widgets/cards/top_area_card.dart';
import '../../widgets/items/quick_action_item.dart';
import '../../widgets/items/type_selector.dart';
import '../../widgets/sections/section_header.dart';
import '../../widgets/sections/recent_activity_section.dart';
import '../../widgets/dashboard/church_dashboard_header.dart';
import '../styles/app_colors.dart';

class HomePage extends StatefulWidget {
  final String title;
  const HomePage({super.key, required this.title});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  String _selectedType = 'Personas';

  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      if (!mounted) return;
      context.read<ConteoStore>().fetchConteos();
      context.read<NotificationStore>().fetchNotifications();
    });
  }

  @override
  Widget build(BuildContext context) {
    final authStore = context.watch<AuthStore>();
    final conteoStore = context.watch<ConteoStore>();
    final configStore = context.watch<ConfigStore>();
    final user = authStore.user;
    final currentIglesia = configStore.selectedIglesia;
    
    final churchConteos = conteoStore.conteos.where((c) => c['iglesia'] == currentIglesia).toList();
    final filteredConteos = churchConteos.where((c) {
      return c['tipo']?.toString().toLowerCase() == _selectedType.toLowerCase();
    }).toList();

    return Container(
      color: AppColors.background,
      child: Scaffold(
        backgroundColor: Colors.transparent,
        body: RefreshIndicator(
          onRefresh: () => conteoStore.fetchConteos(),
          child: CustomScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            slivers: [
              ChurchDashboardHeader(user: user),

              SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
                sliver: SliverList(
                  delegate: SliverChildListDelegate([
                    const SectionHeader(title: 'ACCIONES RÁPIDAS'),
                    _buildQuickActions(),
                    const SizedBox(height: 32),

                    TypeSelector(
                      selectedType: _selectedType, 
                      onTypeSelected: (type) => setState(() => _selectedType = type),
                    ),
                    const SizedBox(height: 24),

                    SectionHeader(title: 'MÉTRICAS ${_selectedType.toUpperCase()} - ${currentIglesia?.toUpperCase() ?? "SIN SEDE"}'),
                    LayoutBuilder(
                      builder: (context, constraints) {
                        bool useRow = constraints.maxWidth > 340;
                        if (useRow) {
                          return Row(
                            children: [
                              Expanded(
                                child: SummaryCard(
                                  title: 'Total Histórico',
                                  value: '${filteredConteos.fold<int>(0, (sum, c) => sum + (c['cantidad'] as int? ?? 0))}',
                                  icon: Icons.insights_rounded,
                                  color: AppColors.primary,
                                ),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: SummaryCard(
                                  title: 'Hoy',
                                  value: '${_getTotalQuantityToday(filteredConteos)}',
                                  icon: _selectedType == 'Personas' ? Icons.groups_3_rounded : Icons.inventory_2_rounded,
                                  color: AppColors.accent,
                                ),
                              ),
                            ],
                          );
                        } else {
                          return Column(
                            children: [
                              SummaryCard(
                                title: 'Total Histórico',
                                value: '${filteredConteos.fold<int>(0, (sum, c) => sum + (c['cantidad'] as int? ?? 0))}',
                                icon: Icons.insights_rounded,
                                color: AppColors.primary,
                              ),
                              const SizedBox(height: 16),
                              SummaryCard(
                                title: 'Hoy',
                                value: '${_getTotalQuantityToday(filteredConteos)}',
                                icon: _selectedType == 'Personas' ? Icons.groups_3_rounded : Icons.inventory_2_rounded,
                                color: AppColors.accent,
                              ),
                            ],
                          );
                        }
                      },
                    ),
                    const SizedBox(height: 32),

                    const SectionHeader(title: 'ACTIVIDAD RECENTE'),
                    RecentActivitySection(conteos: churchConteos),
                    const SizedBox(height: 32),

                    TopAreaCard(conteos: filteredConteos, selectedType: _selectedType),
                    const SizedBox(height: 32),

                    Column(
                      children: [
                        const SectionHeader(title: 'DISTRIBUCIÓN POR ZONA', showArrow: true),
                        DistributionDonutChart(
                          conteos: filteredConteos, 
                          selectedType: _selectedType
                        ),
                      ],
                    ),
                    
                    const SizedBox(height: 32),

                    Column(
                      children: [
                        const SectionHeader(title: 'ACTIVIDAD ÚLTIMA SEMANA', showArrow: true),
                        ActivityBarChart(
                          conteos: filteredConteos, 
                          selectedType: _selectedType
                        ),
                      ],
                    ),

                    const SizedBox(height: 140), 
                  ]),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildQuickActions() {
    return Row(
      children: [
        QuickActionItem(
          label: 'Personas',
          icon: Icons.person_add_rounded,
          color: AppColors.primary,
          onTap: () => Navigator.push(context, MaterialPageRoute(builder: (context) => const AddConteoPage())),
        ),
        const SizedBox(width: 12),
        QuickActionItem(
          label: 'Material',
          icon: Icons.inventory_rounded,
          color: AppColors.accent,
          onTap: () => Navigator.push(context, MaterialPageRoute(builder: (context) => const AddConteoPage())),
        ),
        const SizedBox(width: 12),
        QuickActionItem(
          label: 'Eventos',
          icon: Icons.calendar_month_rounded,
          color: const Color(0xFF673AB7),
          onTap: () => Navigator.push(context, MaterialPageRoute(builder: (context) => const CalendarioPage())),
        ),
      ],
    );
  }

  int _getTotalQuantityToday(List<dynamic> conteos) {
    final now = DateTime.now();
    return conteos.where((c) {
      final date = DateTime.tryParse(c['fecha'] ?? '');
      return date != null && date.day == now.day && date.month == now.month && date.year == now.year && c['tipo']?.toString().toLowerCase() == _selectedType.toLowerCase();
    }).fold(0, (sum, c) => sum + (c['cantidad'] as int? ?? 0));
  }
}
