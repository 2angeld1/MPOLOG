import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../logic/auth_store.dart';
import 'home_page.dart';
import 'super_admin_dashboard.dart';
import '../styles/app_colors.dart';
import 'user_maintenance_page.dart';
import 'role_maintenance_page.dart';
import 'settings_page.dart';
import 'add_conteo_page.dart';
import 'calendario_page.dart';
import 'registro_detallado_page.dart';
import 'registro_kids_page.dart';

class MainTabs extends StatefulWidget {
  const MainTabs({super.key});

  @override
  State<MainTabs> createState() => _MainTabsState();
}

class _MainTabsState extends State<MainTabs> {
  int _currentIndex = 0;

  late List<Widget> _superAdminScreens;

  @override
  void initState() {
    super.initState();
    _superAdminScreens = [
      const SuperAdminDashboard(key: ValueKey('superadmin')),
      const CalendarioPage(key: ValueKey('calendar_super')),
      const UserMaintenancePage(key: ValueKey('users')),
      const RoleMaintenancePage(key: ValueKey('roles')),
      const SettingsPage(key: ValueKey('settings_super')),
    ];
  }

  @override
  Widget build(BuildContext context) {
    final authStore = context.watch<AuthStore>();
    final user = authStore.user;

    if (user == null) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    final isSuperAdmin = user.isSuperAdmin;

    List<Widget> screens = [];
    List<BottomNavigationBarItem> items = [];

    if (isSuperAdmin) {
      screens = _superAdminScreens;
      items = _buildSuperAdminItems();
    } else {
      // Evaluar permisos dinámicamente según los roles del usuario
      final hasSameAdmin = user.hasRole('sameadmin');
      final hasLogistic = user.hasRole('logisticadmin') || hasSameAdmin;
      final hasJefTeen = user.hasRole('jef teen');
      final hasMentorClub = user.hasRole('mentor club');
      final hasServidores = user.hasRole('servidores');
      final hasJef = user.hasRole('jef');

      // 1. Inicio (Solo para sameadmin y logisticadmin o usuarios estándar por defecto)
      // Jef Teen, Mentor Club, Servidores y Jef NO tienen acceso a Inicio.
      final showHome =
          hasLogistic ||
          (!hasJefTeen && !hasMentorClub && !hasServidores && !hasJef);
      if (showHome) {
        screens.add(
          const HomePage(title: 'Inicio', key: ValueKey('home_dynamic')),
        );
        items.add(
          const BottomNavigationBarItem(
            icon: Icon(Icons.home_rounded),
            label: 'Inicio',
          ),
        );
      }

      // 2. Calendario (Todos los roles tienen acceso a Calendario)
      screens.add(const CalendarioPage(key: ValueKey('calendar_dynamic')));
      items.add(
        const BottomNavigationBarItem(
          icon: Icon(Icons.calendar_month_rounded),
          label: 'Calendario',
        ),
      );

      // 3. Registro Teens (jef teen)
      if (hasJefTeen) {
        screens.add(
          const RegistroDetalladoPage(key: ValueKey('registro_teen')),
        );
        items.add(
          const BottomNavigationBarItem(
            icon: Icon(Icons.assignment_ind_rounded),
            label: 'Teens',
          ),
        );
      }

      // 4. Registro Kids / Mentor Club (mentor club)
      if (hasMentorClub) {
        screens.add(const RegistroKidsPage(key: ValueKey('registro_kids')));
        items.add(
          const BottomNavigationBarItem(
            icon: Icon(Icons.child_care_rounded),
            label: 'Kids',
          ),
        );
      }

      // 5. Agregar Conteo / Contar (sameadmin, logisticadmin)
      final showAddConteo = hasLogistic;
      if (showAddConteo) {
        screens.add(const AddConteoPage(key: ValueKey('add_dynamic')));
        items.add(
          const BottomNavigationBarItem(
            icon: Icon(Icons.add_circle_outline_rounded),
            label: 'Contar',
          ),
        );
      }

      // 6. Configuración / Settings (Todos tienen acceso)
      screens.add(const SettingsPage(key: ValueKey('settings_dynamic')));
      items.add(
        const BottomNavigationBarItem(
          icon: Icon(Icons.settings_rounded),
          label: 'Config',
        ),
      );
    }

    if (_currentIndex >= screens.length) {
      _currentIndex = 0;
    }

    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      extendBody: true,
      body: IndexedStack(index: _currentIndex, children: screens),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: AppColors.surface,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.1),
              blurRadius: 10,
              offset: const Offset(0, -2),
            ),
          ],
          borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
          border: Border(
            top: BorderSide(
              color: Theme.of(context).dividerColor.withValues(alpha: 0.1),
              width: 1,
            ),
          ),
        ),
        child: SafeArea(
          top: false,
          child: SizedBox(
            height: 70,
            child: BottomNavigationBar(
              currentIndex: _currentIndex,
              onTap: (index) => setState(() => _currentIndex = index),
              backgroundColor: Colors.transparent,
              elevation: 0,
              selectedItemColor: isDark
                  ? Colors.white
                  : Theme.of(context).colorScheme.primary,
              unselectedItemColor: Theme.of(
                context,
              ).colorScheme.onSurface.withValues(alpha: 0.4),
              showSelectedLabels: true,
              showUnselectedLabels: true,
              type: BottomNavigationBarType.fixed,
              selectedLabelStyle: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                letterSpacing: 0.3,
              ),
              unselectedLabelStyle: const TextStyle(fontSize: 11),
              items: items,
            ),
          ),
        ),
      ),
    );
  }

  List<BottomNavigationBarItem> _buildSuperAdminItems() {
    return const [
      BottomNavigationBarItem(
        icon: Icon(Icons.grid_view_rounded),
        label: 'Inicio',
      ),
      BottomNavigationBarItem(
        icon: Icon(Icons.calendar_month_rounded),
        label: 'Calendario',
      ),
      BottomNavigationBarItem(
        icon: Icon(Icons.people_alt_rounded),
        label: 'Usuarios',
      ),
      BottomNavigationBarItem(
        icon: Icon(Icons.admin_panel_settings_rounded),
        label: 'Roles',
      ),
      BottomNavigationBarItem(
        icon: Icon(Icons.settings_rounded),
        label: 'Config',
      ),
    ];
  }
}
