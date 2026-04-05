import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../logic/auth_store.dart';
import '../../logic/conteo_store.dart';
import '../../logic/config_store.dart';
import '../../logic/notification_store.dart';
import 'calendario_page.dart';
import 'add_conteo_page.dart';
import '../../widgets/glass_container.dart';
import '../../styles/app_text_styles.dart';
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
              _buildChurchHeader(user),

              SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
                sliver: SliverList(
                  delegate: SliverChildListDelegate([
                    _buildSectionTitle('ACCIONES RÁPIDAS'),
                    const SizedBox(height: 16),
                    _buildQuickActions(),
                    const SizedBox(height: 32),

                    _buildTypeSelector(),
                    const SizedBox(height: 24),

                    _buildSectionTitle('MÉTRICAS ${_selectedType.toUpperCase()} - ${currentIglesia?.toUpperCase() ?? "SIN SEDE"}'),
                    const SizedBox(height: 16),
                    LayoutBuilder(
                      builder: (context, constraints) {
                        bool useRow = constraints.maxWidth > 340;
                        if (useRow) {
                          return Row(
                            children: [
                              Expanded(
                                child: _buildSummaryCard(
                                  context,
                                  'Total Histórico',
                                  '${filteredConteos.fold<int>(0, (sum, c) => sum + (c['cantidad'] as int? ?? 0))}',
                                  Icons.insights_rounded,
                                  AppColors.primary,
                                ),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: _buildSummaryCard(
                                  context,
                                  'Hoy',
                                  '${_getTotalQuantityToday(filteredConteos)}',
                                  _selectedType == 'Personas' ? Icons.groups_3_rounded : Icons.inventory_2_rounded,
                                  AppColors.accent,
                                ),
                              ),
                            ],
                          );
                        } else {
                          return Column(
                            children: [
                              _buildSummaryCard(
                                context,
                                'Total Histórico',
                                '${filteredConteos.fold<int>(0, (sum, c) => sum + (c['cantidad'] as int? ?? 0))}',
                                Icons.insights_rounded,
                                AppColors.primary,
                              ),
                              const SizedBox(height: 16),
                              _buildSummaryCard(
                                context,
                                'Hoy',
                                '${_getTotalQuantityToday(filteredConteos)}',
                                _selectedType == 'Personas' ? Icons.groups_3_rounded : Icons.inventory_2_rounded,
                                AppColors.accent,
                              ),
                            ],
                          );
                        }
                      },
                    ),
                    const SizedBox(height: 32),

                    _buildSectionTitle('ACTIVIDAD RECIENTE'),
                    const SizedBox(height: 16),
                    _buildRecentActivityList(churchConteos),
                    const SizedBox(height: 32),

                    _buildTopAreas(filteredConteos),
                    const SizedBox(height: 32),

                    _buildChartSection(
                      title: 'DISTRIBUCIÓN POR ZONA',
                      child: _buildDistributionByAreaChart(filteredConteos),
                    ),
                    
                    const SizedBox(height: 32),

                    _buildChartSection(
                      title: 'ACTIVIDAD ÚLTIMA SEMANA',
                      child: _buildActivityBarChart(filteredConteos),
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
        _buildActionItem(context, 'Personas', Icons.person_add_rounded, AppColors.primary, 0),
        const SizedBox(width: 12),
        _buildActionItem(context, 'Material', Icons.inventory_rounded, AppColors.accent, 1),
        const SizedBox(width: 12),
        _buildActionItem(context, 'Eventos', Icons.calendar_month_rounded, const Color(0xFF673AB7), 2),
      ],
    );
  }

  Widget _buildActionItem(BuildContext context, String label, IconData icon, Color color, int tabIndex) {
    return Expanded(
      child: GestureDetector(
        onTap: () {
          if (label == 'Eventos') {
            Navigator.push(context, MaterialPageRoute(builder: (context) => const CalendarioPage()));
          } else {
            // NAVEGAR A NUEVO REGISTRO PARA PERSONAS O MATERIAL
            Navigator.push(context, MaterialPageRoute(builder: (context) => const AddConteoPage()));
          }
        },
        child: GlassContainer(
          padding: const EdgeInsets.symmetric(vertical: 20),
          borderRadius: 24,
          child: Column(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(color: color.withValues(alpha: 0.1), shape: BoxShape.circle),
                child: Icon(icon, color: color, size: 24),
              ),
              const SizedBox(height: 12),
              Text(label, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white70)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRecentActivityList(List<dynamic> allConteos) {
    final recent = allConteos.take(5).toList();
    if (recent.isEmpty) return const Center(child: Text('Sin actividad reciente', style: TextStyle(color: Colors.white10)));

    return Column(
      children: recent.map((c) {
        final date = DateTime.tryParse(c['fecha'] ?? '') ?? DateTime.now();
        final isToday = date.day == DateTime.now().day && date.month == DateTime.now().month;
        
        return Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: GlassContainer(
            padding: const EdgeInsets.all(16),
            borderRadius: 20,
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: (c['tipo'] == 'personas' ? AppColors.primary : AppColors.accent).withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    c['tipo'] == 'personas' ? Icons.people_rounded : Icons.inventory_2_rounded,
                    color: c['tipo'] == 'personas' ? AppColors.primary : AppColors.accent,
                    size: 20,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(c['area'] ?? 'General', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                      Text(isToday ? 'Hoy' : '${date.day}/${date.month}/${date.year}', style: const TextStyle(fontSize: 10, color: Colors.white38)),
                    ],
                  ),
                ),
                Text('+${c['cantidad']}', style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.primary)),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildChurchHeader(dynamic user) {
    return SliverAppBar(
      expandedHeight: 280,
      backgroundColor: AppColors.background,
      flexibleSpace: FlexibleSpaceBar(
        background: Stack(
          fit: StackFit.expand,
          children: [
            Image.asset(
              'assets/images/church_header.png',
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) => Container(
                color: AppColors.primary,
                child: const Center(child: Icon(Icons.church_rounded, color: Colors.white, size: 48)),
              ),
            ),
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.black.withValues(alpha: 0.3),
                    AppColors.background,
                  ],
                ),
              ),
            ),
            Positioned(
              bottom: 24,
              left: 24,
              right: 24,
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(2),
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: AppColors.primary, width: 2),
                    ),
                    child: CircleAvatar(
                      radius: 32,
                      backgroundColor: AppColors.surface,
                      child: Text(
                        (user?['nombre'] ?? 'U')[0].toUpperCase(),
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 24),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Bienvenido de nuevo,', style: AppTextStyles.label(context).copyWith(fontSize: 10, color: Colors.white70)),
                        Text(user?['nombre'] ?? 'Usuario', style: AppTextStyles.h2(context).copyWith(fontSize: 28, letterSpacing: -0.5)),
                        Text(
                          (user?['rol']?.toString().toUpperCase() ?? 'ROL DE USUARIO'),
                          style: AppTextStyles.label(context).copyWith(fontSize: 10, color: AppColors.accent, fontWeight: FontWeight.bold, letterSpacing: 2),
                        ),
                      ],
                    ),
                  ),
                  Consumer<NotificationStore>(
                    builder: (context, store, _) => Stack(
                      clipBehavior: Clip.none,
                      children: [
                        IconButton(
                          icon: const Icon(Icons.notifications_none_rounded, color: Colors.white),
                          onPressed: () => _showNotificationsModal(context),
                        ),
                        if (store.unreadCount > 0)
                          Positioned(
                            right: 10,
                            top: 10,
                            child: Container(
                              padding: const EdgeInsets.all(4),
                              decoration: const BoxDecoration(color: Colors.redAccent, shape: BoxShape.circle),
                              constraints: const BoxConstraints(minWidth: 14, minHeight: 14),
                              child: Text('${store.unreadCount}', style: const TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.bold), textAlign: TextAlign.center),
                            ),
                          ),
                      ],
                    ),
                  ),
                ],
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

  Widget _buildTypeSelector() {
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
      ),
      child: Row(
        children: [
          _buildTypeTab('Personas', Icons.people_rounded),
          _buildTypeTab('Materiales', Icons.inventory_2_rounded),
        ],
      ),
    );
  }

  Widget _buildTypeTab(String type, IconData icon) {
    final isSelected = _selectedType == type;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _selectedType = type),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: isSelected ? AppColors.primary : Colors.transparent,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, color: isSelected ? Colors.white : Colors.white38, size: 18),
              const SizedBox(width: 8),
              Text(type, style: TextStyle(color: isSelected ? Colors.white : Colors.white38, fontWeight: FontWeight.bold, fontSize: 14)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTopAreas(List<dynamic> conteos) {
    if (conteos.isEmpty) return const SizedBox.shrink();
    final Map<String, int> areaCounts = {};
    for (var c in conteos) {
      if (c['tipo']?.toString().toLowerCase() == _selectedType.toLowerCase()) {
        final area = c['area']?.toString() ?? 'Otras';
        areaCounts[area] = (areaCounts[area] ?? 0) + (c['cantidad'] as int? ?? 0);
      }
    }
    if (areaCounts.isEmpty) return const SizedBox.shrink();
    final sortedAreas = areaCounts.entries.toList()..sort((a,b) => b.value.compareTo(a.value));
    final topArea = sortedAreas.first;

    return GlassContainer(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
      borderRadius: 24,
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(color: AppColors.primary, borderRadius: BorderRadius.circular(16)),
            child: const Icon(Icons.workspace_premium_rounded, color: Colors.white),
          ),
          const SizedBox(width: 20),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('TOP ÁREA ESTA SEMANA', style: AppTextStyles.label(context).copyWith(fontSize: 10, letterSpacing: 1, color: Colors.white54)),
                Text(topArea.key, style: AppTextStyles.h3(context).copyWith(fontSize: 18)),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text('${topArea.value}', style: AppTextStyles.h2(context).copyWith(color: AppColors.primary, fontSize: 24)),
              Text(_selectedType.toLowerCase(), style: const TextStyle(fontSize: 10, color: Colors.white38)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildChartSection({required String title, required Widget child}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(title, style: AppTextStyles.label(context).copyWith(letterSpacing: 2, fontWeight: FontWeight.bold, fontSize: 10, color: Colors.white.withValues(alpha: 0.5))),
            const Icon(Icons.arrow_forward_ios_rounded, size: 12, color: Colors.white24),
          ],
        ),
        const SizedBox(height: 16),
        child,
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

  Widget _buildDistributionByAreaChart(List<dynamic> conteos) {
    final Map<String, int> areaData = {};
    for (var c in conteos) {
      if (c['tipo']?.toString().toLowerCase() == _selectedType.toLowerCase()) {
        final area = c['area']?.toString() ?? 'Otros';
        areaData[area] = (areaData[area] ?? 0) + (c['cantidad'] as int? ?? 0);
      }
    }
    final total = areaData.values.fold(0, (a, b) => a + b);
    if (total == 0 || areaData.isEmpty) return const SizedBox(height: 150, child: GlassContainer(child: Center(child: Text('Sin datos'))));

    final List<Color> chartColors = [AppColors.primary, AppColors.accent, const Color(0xFF3F51B5), const Color(0xFF009688)];
    final sortedItems = areaData.entries.toList()..sort((a, b) => b.value.compareTo(a.value));
    final displayItems = sortedItems.take(4).toList();

    final isSmallScreen = MediaQuery.of(context).size.width < 400;

    return GlassContainer(
      padding: EdgeInsets.all(isSmallScreen ? 16 : 28),
      borderRadius: isSmallScreen ? 24 : 32,
      child: Column(
        children: [
          SizedBox(
            height: 180,
            child: PieChart(
              PieChartData(
                sectionsSpace: 4,
                centerSpaceRadius: 50,
                sections: displayItems.asMap().entries.map((entry) {
                  return PieChartSectionData(
                    value: entry.value.value.toDouble(),
                    color: chartColors[entry.key % chartColors.length],
                    radius: 20,
                    title: '',
                  );
                }).toList(),
              ),
            ),
          ),
          const SizedBox(height: 24),
          Wrap(
            spacing: 12,
            children: displayItems.asMap().entries.map((e) => _buildLegendItem(e.value.key, chartColors[e.key % chartColors.length])).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildLegendItem(String title, Color color) {
    return Row(mainAxisSize: MainAxisSize.min, children: [
        Container(width: 8, height: 8, decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
        const SizedBox(width: 6),
        Text(title, style: const TextStyle(fontSize: 10, color: Colors.white70)),
    ]);
  }

  Widget _buildActivityBarChart(List<dynamic> conteos) {
    final now = DateTime.now();
    final List<int> counts = List.filled(7, 0);
    for (var i = 0; i < 7; i++) {
      final date = now.subtract(Duration(days: 6 - i));
      counts[i] = conteos.where((c) {
        final d = DateTime.tryParse(c['fecha'] ?? '');
        return d != null && d.day == date.day && d.month == date.month && d.year == date.year;
      }).length;
    }
    final isSmallScreen = MediaQuery.of(context).size.width < 400;

    return GlassContainer(
      padding: EdgeInsets.all(isSmallScreen ? 16 : 24),
      borderRadius: isSmallScreen ? 24 : 32,
      child: SizedBox(height: 150, child: BarChart(BarChartData(
        gridData: const FlGridData(show: false),
        borderData: FlBorderData(show: false),
        barGroups: List.generate(7, (i) => BarChartGroupData(x: i, barRods: [BarChartRodData(toY: counts[i].toDouble(), color: AppColors.primary, width: 8)])),
      ))),
    );
  }

  Widget _buildSummaryCard(BuildContext context, String title, String value, IconData icon, Color color) {
    return GlassContainer(
      padding: const EdgeInsets.all(16),
      borderRadius: 24,
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Icon(icon, color: color, size: 20),
          const SizedBox(height: 12),
          Text(value, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
          Text(title, style: const TextStyle(fontSize: 9, color: Colors.white38)),
      ]),
    );
  }

  void _showNotificationsModal(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.7,
        maxChildSize: 0.9,
        minChildSize: 0.5,
        builder: (context, scrollController) => GlassContainer(
          borderRadius: 32,
          padding: const EdgeInsets.all(24),
          child: Consumer<NotificationStore>(
            builder: (context, store, _) => Column(
              children: [
                Container(
                  width: 40, height: 4, margin: const EdgeInsets.only(bottom: 24),
                  decoration: BoxDecoration(color: Colors.white24, borderRadius: BorderRadius.circular(2)),
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('NOTIFICACIONES', style: const TextStyle(letterSpacing: 2, color: Colors.white70, fontSize: 12)),
                    TextButton(onPressed: () => store.markAllAsRead(), child: const Text('Leer todo', style: TextStyle(fontSize: 12, color: AppColors.primary))),
                  ],
                ),
                const SizedBox(height: 16),
                Expanded(
                  child: store.notifications.isEmpty
                      ? const Center(child: Text('Sin alertas pendientes', style: TextStyle(color: Colors.white10)))
                      : ListView.builder(
                          controller: scrollController,
                          itemCount: store.notifications.length,
                          itemBuilder: (context, index) {
                            final n = store.notifications[index];
                            return Padding(
                              padding: const EdgeInsets.only(bottom: 12),
                              child: GlassContainer(
                                padding: const EdgeInsets.all(16),
                                borderRadius: 20,
                                child: Row(children: [
                                  Icon(n.type == 'conteo' ? Icons.insights_rounded : Icons.calendar_month_rounded, color: AppColors.primary, size: 18),
                                  const SizedBox(width: 16),
                                  Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                                    Text(n.title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                                    Text(n.body, style: const TextStyle(fontSize: 11, color: Colors.white54)),
                                  ])),
                                ]),
                              ),
                            );
                          },
                        ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
