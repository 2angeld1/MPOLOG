import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../logic/theme_store.dart';
import '../../logic/auth_store.dart';
import '../../logic/config_store.dart';
import '../../logic/conteo_store.dart';
import '../../widgets/glass_container.dart';
import '../../styles/app_colors.dart';
import '../../styles/app_text_styles.dart';

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
    final themeStore = context.watch<ThemeStore>();
    final authStore = context.watch<AuthStore>();
    final configStore = context.watch<ConfigStore>();
    final conteoStore = context.watch<ConteoStore>();
    final canManage = authStore.canManageCounts;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: themeStore.isDarkMode ? Colors.black : Colors.grey[100],
      appBar: AppBar(
        title: Text('Configuración', style: AppTextStyles.title(context)),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Text('SEDE PRINCIPAL', 
            style: AppTextStyles.body(context).copyWith(
              color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.5), 
              fontWeight: FontWeight.bold,
              fontSize: 12,
              letterSpacing: 1.2
            )
          ),
          const SizedBox(height: 16),
          GlassContainer(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            borderRadius: 20,
            child: Row(
              children: [
                Icon(Icons.church_rounded, color: isDark ? Colors.white70 : AppColors.primary, size: 22),
                const SizedBox(width: 16),
                Expanded(
                  child: DropdownButtonHideUnderline(
                    child: DropdownButton<String>(
                      value: configStore.selectedIglesia,
                      isExpanded: true,
                      hint: Text(conteoStore.isLoading ? 'Cargando...' : 'Selecciona una sede', style: AppTextStyles.body(context)),
                      dropdownColor: isDark ? Colors.grey[900] : Colors.white,
                      style: AppTextStyles.body(context).copyWith(fontWeight: FontWeight.w600),
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
          const SizedBox(height: 32),
          Text('APARIENCIA', 
            style: AppTextStyles.body(context).copyWith(
              color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.5), 
              fontWeight: FontWeight.bold,
              fontSize: 12,
              letterSpacing: 1.2
            )
          ),
          const SizedBox(height: 16),
          GlassContainer(
            padding: const EdgeInsets.all(16),
            borderRadius: 20,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: AppColors.primary.withValues(alpha: 0.1),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        themeStore.isDarkMode ? Icons.dark_mode_rounded : Icons.light_mode_rounded,
                        color: themeStore.isDarkMode ? Colors.white : AppColors.primary,
                        size: 20,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Text('Modo Oscuro', style: AppTextStyles.h3(context).copyWith(fontSize: 16)),
                  ],
                ),
                Switch.adaptive(
                  value: themeStore.isDarkMode,
                  onChanged: (val) => themeStore.toggleTheme(),
                  activeColor: Colors.amber,
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),
          Text('SISTEMA', 
            style: AppTextStyles.body(context).copyWith(
              color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.5), 
              fontWeight: FontWeight.bold,
              fontSize: 12,
              letterSpacing: 1.2
            )
          ),
          const SizedBox(height: 16),
          GlassContainer(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            borderRadius: 20,
            child: ListTile(
              contentPadding: EdgeInsets.zero,
              leading: Icon(Icons.language_rounded, color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.7)),
              title: Text('Idioma', style: AppTextStyles.body(context).copyWith(fontWeight: FontWeight.bold)),
              trailing: Text('Español', style: AppTextStyles.body(context).copyWith(fontSize: 14)),
            ),
          ),
          if (canManage) ...[
            const SizedBox(height: 32),
            Text('GESTIÓN LOGÍSTICA', 
              style: AppTextStyles.body(context).copyWith(
                color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.5), 
                fontWeight: FontWeight.bold,
                fontSize: 12,
                letterSpacing: 1.2
              )
            ),
            const SizedBox(height: 16),
            GlassContainer(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              borderRadius: 20,
              child: Column(
                children: [
                   ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: Icon(Icons.analytics_outlined, color: Theme.of(context).colorScheme.primary),
                    title: Text('Reportes Globales', style: AppTextStyles.body(context).copyWith(fontWeight: FontWeight.bold)),
                    subtitle: Text('Ver estadísticas del sistema', style: TextStyle(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.5), fontSize: 11)),
                    trailing: const Icon(Icons.chevron_right, size: 20),
                    onTap: () {},
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }
}
