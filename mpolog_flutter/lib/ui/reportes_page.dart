import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import '../logic/reportes_store.dart';
import '../logic/conteo_store.dart';
import '../logic/config_store.dart';
import '../styles/app_colors.dart';
import '../styles/app_text_styles.dart';
import '../widgets/glass_container.dart';
import '../widgets/glass_button.dart';

class ReportesPage extends StatefulWidget {
  const ReportesPage({super.key});

  @override
  State<ReportesPage> createState() => _ReportesPageState();
}

class _ReportesPageState extends State<ReportesPage> {
  Uint8List? _chartImage;
  bool _isChartLoading = false;

  @override
  void initState() {
    super.initState();
    _fetchChart();
  }

  Future<void> _fetchChart() async {
    setState(() => _isChartLoading = true);
    final store = context.read<ReportesStore>();
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');

    if (token == null) {
      setState(() => _isChartLoading = false);
      return;
    }

    try {
      final response = await http.get(
        Uri.parse(store.getChartUrl()),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        setState(() {
          _chartImage = response.bodyBytes;
          _isChartLoading = false;
        });
      } else {
        setState(() => _isChartLoading = false);
      }
    } catch (e) {
      setState(() => _isChartLoading = false);
    }
  }

  Future<void> _downloadReport(String format) async {
    final store = context.read<ReportesStore>();
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    
    // Para descargar archivos en móvil/web que requieren autenticación,
    // a veces lo más simple es autorizar la URL temporalmente 
    // o descargar y compartir. Por simplicidad aquí, abriremos un link.
    // SI el backend no admite token en URL, esto fallará.
    final baseUrl = await store.getReportUrl(format);
    final url = Uri.parse('$baseUrl&token=$token'); // Suponiendo soporte de token en el backend
    
    if (await canLaunchUrl(url)) {
      await launchUrl(url);
    }
  }

  @override
  Widget build(BuildContext context) {
    final store = context.watch<ReportesStore>();
    final configStore = context.watch<ConfigStore>();
    final conteoStore = context.watch<ConteoStore>();

    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 280,
            backgroundColor: AppColors.background,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              title: Text('SISTEMA DE REPORTES', 
                style: AppTextStyles.h3(context).copyWith(fontSize: 14, letterSpacing: 2, fontWeight: FontWeight.bold)),
              centerTitle: false,
              titlePadding: const EdgeInsets.only(left: 60, bottom: 16),
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
                    right: -40,
                    top: -20,
                    child: Icon(Icons.analytics_rounded, size: 220, color: Colors.white.withValues(alpha: 0.05)),
                  ),
                ],
              ),
            ),
          ),
          
          SliverPadding(
            padding: const EdgeInsets.fromLTRB(24, 16, 24, 24),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                _buildFilters(store, configStore, conteoStore),
                const SizedBox(height: 24),
                
                // Gráfico
                _buildSectionTitle('ANÁLISIS VISUAL'),
                const SizedBox(height: 16),
                _buildChartPreview(),
                const SizedBox(height: 32),
                
                // Descargas
                _buildSectionTitle('EXPORTAR DATOS'),
                const SizedBox(height: 16),
                _buildExportOptions(),
                const SizedBox(height: 48),
              ]),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(title, 
      style: AppTextStyles.label(context).copyWith(fontSize: 10, letterSpacing: 2, color: Colors.white38));
  }

  Widget _buildFilters(ReportesStore store, ConfigStore configStore, ConteoStore conteoStore) {
    return GlassContainer(
      padding: const EdgeInsets.all(24),
      borderRadius: 32,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.filter_list_rounded, color: AppColors.primary, size: 18),
              const SizedBox(width: 8),
              Text('FILTROS DE REPORTE', style: AppTextStyles.label(context)),
            ],
          ),
          const SizedBox(height: 20),
          
          // Selector de Periodo
          _buildSmallLabel('PERÍODO DE TIEMPO'),
          const SizedBox(height: 8),
          _buildPeriodSelector(store),
          const SizedBox(height: 20),
          
          // Selector de Tipo
          _buildSmallLabel('CATEGORÍA'),
          const SizedBox(height: 8),
          _buildTypeSelector(store),
          const SizedBox(height: 20),
          
          // Aplicar Cambios
          GlassButton(
            text: 'ACTUALIZAR ANÁLISIS',
            icon: Icons.refresh_rounded,
            onPressed: _fetchChart,
          ),
        ],
      ),
    );
  }

  Widget _buildSmallLabel(String text) {
    return Text(text, style: const TextStyle(fontSize: 9, color: Colors.white24, fontWeight: FontWeight.bold, letterSpacing: 1.2));
  }

  Widget _buildPeriodSelector(ReportesStore store) {
    final periods = {
      'semana': 'Esta Semana',
      'mes': 'Este Mes',
      '6meses': '6 Meses',
      'año': 'Este Año',
    };

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: periods.entries.map((p) {
          final isSelected = store.selectedPeriodo == p.key;
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: GestureDetector(
              onTap: () => store.setPeriodo(p.key),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(
                  color: isSelected ? AppColors.primary : Colors.white.withValues(alpha: 0.05),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: isSelected ? AppColors.primary : Colors.white10),
                ),
                child: Text(
                  p.value,
                  style: TextStyle(
                    color: isSelected ? Colors.white : Colors.white60,
                    fontSize: 12,
                    fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                  ),
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildTypeSelector(ReportesStore store) {
    return Row(
      children: [
        _buildChoiceChip(
          label: 'Personas', 
          isSelected: store.selectedTipo == 'personas',
          onTap: () => store.setTipo('personas'),
        ),
        const SizedBox(width: 12),
        _buildChoiceChip(
          label: 'Materiales', 
          isSelected: store.selectedTipo == 'materiales',
          onTap: () => store.setTipo('materiales'),
        ),
      ],
    );
  }

  Widget _buildChoiceChip({required String label, required bool isSelected, required VoidCallback onTap}) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          padding: const EdgeInsets.symmetric(vertical: 12),
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: isSelected ? AppColors.primary.withValues(alpha: 0.2) : Colors.transparent,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: isSelected ? AppColors.primary : Colors.white.withValues(alpha: 0.05)),
          ),
          child: Text(label, style: TextStyle(
            color: isSelected ? Colors.white : Colors.white38,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          )),
        ),
      ),
    );
  }

  Widget _buildChartPreview() {
    return GlassContainer(
      padding: const EdgeInsets.all(12),
      borderRadius: 24,
      child: Column(
        children: [
          Container(
            height: 250,
            width: double.infinity,
            decoration: BoxDecoration(
              color: Colors.black26,
              borderRadius: BorderRadius.circular(16),
            ),
            child: _isChartLoading
              ? const Center(child: CircularProgressIndicator())
              : _chartImage != null
                ? ClipRRect(
                    borderRadius: BorderRadius.circular(16),
                    child: Image.memory(_chartImage!, fit: BoxFit.contain),
                  )
                : Center(child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.broken_image_rounded, color: Colors.white10, size: 48),
                      const SizedBox(height: 8),
                      Text('Error al cargar gráfico', style: TextStyle(color: Colors.white10)),
                    ],
                  )),
          ),
          const SizedBox(height: 12),
          Text(
            'Gráfico de distribución por áreas para el período seleccionado.',
            style: TextStyle(fontSize: 11, color: Colors.white24, fontStyle: FontStyle.italic),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildExportOptions() {
    return Row(
      children: [
        Expanded(
          child: _buildExportButton(
            label: 'PDF DOCUMENT',
            icon: Icons.picture_as_pdf_rounded,
            color: Colors.redAccent,
            onTap: () => _downloadReport('pdf'),
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: _buildExportButton(
            label: 'EXCEL SHEET',
            icon: Icons.table_view_rounded,
            color: Colors.greenAccent,
            onTap: () => _downloadReport('excel'),
          ),
        ),
      ],
    );
  }

  Widget _buildExportButton({required String label, required IconData icon, required Color color, required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: GlassContainer(
        padding: const EdgeInsets.symmetric(vertical: 24),
        borderRadius: 24,
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: color, size: 28),
            ),
            const SizedBox(height: 12),
            Text(label, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1)),
          ],
        ),
      ),
    );
  }
}
