import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import '../logic/reportes_store.dart';
import '../styles/app_colors.dart';
import '../styles/app_text_styles.dart';
import '../widgets/cards/report_filters_card.dart';
import '../widgets/sections/report_chart_preview.dart';
import '../widgets/sections/report_export_options.dart';
import '../widgets/sections/section_header.dart';

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
      if (!mounted) return;
      setState(() => _isChartLoading = false);
      return;
    }

    try {
      final response = await http.get(
        Uri.parse(store.getChartUrl()),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (!mounted) return;
      if (response.statusCode == 200) {
        setState(() {
          _chartImage = response.bodyBytes;
          _isChartLoading = false;
        });
      } else {
        setState(() => _isChartLoading = false);
      }
    } catch (e) {
      if (!mounted) return;
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
                ReportFiltersCard(store: store, onApply: _fetchChart),
                const SizedBox(height: 24),
                
                const SectionHeader(title: 'ANÁLISIS VISUAL'),
                const SizedBox(height: 16),
                ReportChartPreview(
                  chartImage: _chartImage,
                  isLoading: _isChartLoading,
                ),
                const SizedBox(height: 32),
                
                const SectionHeader(title: 'EXPORTAR DATOS'),
                const SizedBox(height: 16),
                ReportExportOptions(onDownload: _downloadReport),
                const SizedBox(height: 48),
              ]),
            ),
          ),
        ],
      ),
    );
  }

  // Los widgets de UI ahora son componentes externos.

}
