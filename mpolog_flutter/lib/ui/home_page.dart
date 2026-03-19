import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../logic/auth_store.dart';
import '../../logic/conteo_store.dart';
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
  @override
  void initState() {
    super.initState();
    Future.microtask(() => context.read<ConteoStore>().fetchConteos());
  }

  @override
  Widget build(BuildContext context) {
    final authStore = context.watch<AuthStore>();
    final conteoStore = context.watch<ConteoStore>();
    final user = authStore.user;

    return Container(
      color: AppColors.background,
      child: Scaffold(
        backgroundColor: Colors.transparent,
        floatingActionButton: Padding(
          padding: const EdgeInsets.only(bottom: 80, right: 10),
          child: FloatingActionButton(
            onPressed: () => conteoStore.fetchConteos(),
            backgroundColor: AppColors.primary,
            child: const Icon(Icons.add_rounded, color: Colors.white, size: 32),
          ),
        ),
        body: RefreshIndicator(
          onRefresh: () => conteoStore.fetchConteos(),
          child: CustomScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            slivers: [
              // Header con Imagen de Iglesia
              _buildChurchHeader(user),

              SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
                sliver: SliverList(
                  delegate: SliverChildListDelegate([
                    // Metricas Clave
                    _buildSectionTitle('MÉTRICAS CLAVE'),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: _buildSummaryCard(
                            context,
                            'Registros',
                            '${conteoStore.conteos.length}',
                            Icons.insights_rounded,
                            AppColors.primary,
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: _buildSummaryCard(
                            context,
                            'Personas/Hoy',
                            '${_getTotalPeopleToday(conteoStore.conteos)}',
                            Icons.groups_3_rounded,
                            AppColors.accent,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 40),

                    // TOP AREAS Section
                    _buildTopAreas(conteoStore.conteos),
                    const SizedBox(height: 32),

                    // Chart: Distribution
                    _buildChartSection(
                      title: 'DISTRIBUCIÓN POR TIPO',
                      child: _buildDistributionChart(conteoStore.conteos),
                    ),
                    
                    const SizedBox(height: 32),

                    // Chart: Activity last 7 days
                    _buildChartSection(
                      title: 'ACTIVIDAD ÚLTIMA SEMANA',
                      child: _buildActivityBarChart(conteoStore.conteos),
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

  Widget _buildChurchHeader(dynamic user) {
    return SliverAppBar(
      expandedHeight: 280,
      backgroundColor: AppColors.background,
      flexibleSpace: FlexibleSpaceBar(
        background: Stack(
          fit: StackFit.expand,
          children: [
            // Imagen de fondo
            Image.asset(
              'assets/images/church_header.png',
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) => Container(
                color: AppColors.primary,
                child: const Center(child: Icon(Icons.church_rounded, color: Colors.white, size: 48)),
              ),
            ),
            // Overlay de gradiente para legibilidad
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
            // Perfil de Usuario
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
                        Text(
                          'Bienvenido de nuevo,',
                          style: AppTextStyles.label(context).copyWith(fontSize: 10, color: Colors.white70),
                        ),
                        Text(
                          user?['nombre'] ?? 'Usuario',
                          style: AppTextStyles.h2(context).copyWith(fontSize: 28, letterSpacing: -0.5),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.notifications_none_rounded, color: Colors.white),
                    onPressed: () {},
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

  Widget _buildTopAreas(List<dynamic> conteos) {
    if (conteos.isEmpty) return const SizedBox.shrink();

    // Calculate top area
    final Map<String, int> areaCounts = {};
    for (var c in conteos) {
      if (c['tipo']?.toString().toLowerCase() == 'personas') {
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
      boxShadow: [
        BoxShadow(color: AppColors.primary.withValues(alpha: 0.1), blurRadius: 20, offset: const Offset(0, 10))
      ],
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.primary,
              borderRadius: BorderRadius.circular(16),
            ),
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
              const Text('personas', style: TextStyle(fontSize: 10, color: Colors.white38)),
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
            Text(title, style: AppTextStyles.label(context).copyWith(
              letterSpacing: 2, 
              fontWeight: FontWeight.bold,
              fontSize: 10,
              color: Colors.white.withValues(alpha: 0.5)
            )),
            const Icon(Icons.arrow_forward_ios_rounded, size: 12, color: Colors.white24),
          ],
        ),
        const SizedBox(height: 16),
        child,
      ],
    );
  }

  int _getTotalPeopleToday(List<dynamic> conteos) {
    final now = DateTime.now();
    return conteos.where((c) {
      final date = DateTime.tryParse(c['fecha'] ?? '');
      return date != null && 
             date.day == now.day && 
             date.month == now.month && 
             date.year == now.year &&
             c['tipo']?.toString().toLowerCase() == 'personas';
    }).fold(0, (sum, c) => sum + (c['cantidad'] as int? ?? 0));
  }

  Widget _buildDistributionChart(List<dynamic> conteos) {
    final personas = conteos.where((c) => c['tipo']?.toString().toLowerCase() == 'personas').length;
    final materiales = conteos.where((c) => c['tipo']?.toString().toLowerCase() == 'materiales').length;
    final total = personas + materiales;

    if (total == 0) return const GlassContainer(child: Center(child: Text('Sin datos disponibles')));

    return GlassContainer(
      padding: const EdgeInsets.all(24),
      borderRadius: 32,
      child: SizedBox(
        height: 180,
        child: Row(
          children: [
            Expanded(
              child: PieChart(
                PieChartData(
                  sectionsSpace: 6,
                  centerSpaceRadius: 40,
                  sections: [
                    PieChartSectionData(
                      value: personas.toDouble(),
                      color: AppColors.primary,
                      title: '',
                      radius: 20,
                      badgeWidget: _buildChartBadge('${((personas/total)*100).toInt()}%'),
                      badgePositionPercentageOffset: 1.4,
                    ),
                    PieChartSectionData(
                      value: materiales.toDouble(),
                      color: AppColors.accent,
                      title: '',
                      radius: 20,
                      badgeWidget: _buildChartBadge('${((materiales/total)*100).toInt()}%'),
                      badgePositionPercentageOffset: 1.4,
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(width: 32),
            Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildLegendItem('Personas', AppColors.primary),
                const SizedBox(height: 16),
                _buildLegendItem('Materiales', AppColors.accent),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildChartBadge(String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.2), blurRadius: 4)],
      ),
      child: Text(text, style: const TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 10)),
    );
  }

  Widget _buildLegendItem(String title, Color color) {
    return Row(
      children: [
        Container(
          width: 8,
          height: 8,
          decoration: BoxDecoration(color: color, shape: BoxShape.circle),
        ),
        const SizedBox(width: 12),
        Text(title, style: AppTextStyles.body(context).copyWith(fontSize: 13, fontWeight: FontWeight.w500)),
      ],
    );
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

    return GlassContainer(
      padding: const EdgeInsets.fromLTRB(16, 40, 16, 16),
      borderRadius: 32,
      child: SizedBox(
        height: 200,
        child: BarChart(
          BarChartData(
            gridData: const FlGridData(show: false),
            titlesData: FlTitlesData(
              leftTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
              topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
              rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
              bottomTitles: AxisTitles(
                sideTitles: SideTitles(
                  showTitles: true,
                  getTitlesWidget: (val, meta) {
                    final date = now.subtract(Duration(days: 6 - val.toInt()));
                    return Padding(
                      padding: const EdgeInsets.only(top: 12),
                      child: Text('${date.day}', style: const TextStyle(fontSize: 10, color: Colors.white38)),
                    );
                  },
                ),
              ),
            ),
            borderData: FlBorderData(show: false),
            barGroups: List.generate(7, (i) => BarChartGroupData(
              x: i,
              barRods: [
                BarChartRodData(
                  toY: counts[i].toDouble(),
                  color: AppColors.primary,
                  width: 12,
                  borderRadius: BorderRadius.circular(12),
                  backDrawRodData: BackgroundBarChartRodData(
                    show: true,
                    toY: (counts.reduce((a, b) => a > b ? a : b).toDouble() + 5),
                    color: Colors.white.withValues(alpha: 0.05),
                  ),
                ),
              ],
            )),
          ),
        ),
      ),
    );
  }

  Widget _buildSummaryCard(BuildContext context, String title, String value, IconData icon, Color color) {
    return GlassContainer(
      padding: const EdgeInsets.all(20),
      borderRadius: 24,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(height: 20),
          Text(value, style: AppTextStyles.h1(context).copyWith(fontSize: 32, color: Colors.white)),
          Text(title.toUpperCase(), style: AppTextStyles.label(context).copyWith(
            fontSize: 9, 
            letterSpacing: 1.5,
            fontWeight: FontWeight.bold,
            color: Colors.white.withValues(alpha: 0.5)
          )),
        ],
      ),
    );
  }
}
