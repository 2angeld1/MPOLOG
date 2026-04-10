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
import 'eventos_page.dart';
import 'calendario_page.dart';

class MainTabs extends StatefulWidget {
  const MainTabs({super.key});

  @override
  State<MainTabs> createState() => _MainTabsState();
}

class _MainTabsState extends State<MainTabs> {
  int _currentIndex = 0;

  late List<Widget> _superAdminScreens;
  late List<Widget> _sameAdminScreens;
  late List<Widget> _logisticScreens;
  late List<Widget> _userScreens;

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

    _sameAdminScreens = [
      const HomePage(title: 'Inicio', key: ValueKey('home_same')),
      const CalendarioPage(key: ValueKey('calendar_same')),
      const AddConteoPage(key: ValueKey('add_same')),
      const EventosPage(key: ValueKey('events_same')),
      const SettingsPage(key: ValueKey('settings_same')),
    ];

    _logisticScreens = [
      const HomePage(title: 'Inicio', key: ValueKey('home_log')),
      const CalendarioPage(key: ValueKey('calendar_log')),
      const AddConteoPage(key: ValueKey('add_log')),
      const SettingsPage(key: ValueKey('settings_log')),
    ];

    _userScreens = [
      const HomePage(title: 'Inicio', key: ValueKey('home_user')),
      const CalendarioPage(key: ValueKey('calendar_user')),
      const SettingsPage(key: ValueKey('settings_user')),
    ];
  }

  @override
  Widget build(BuildContext context) {
    final authStore = context.watch<AuthStore>();
    final userRol = authStore.user?.rol.toLowerCase();
    
    final isSuperAdmin = authStore.isSuperAdmin;
    final isSameAdmin = userRol == 'sameadmin';
    final isLogistic = authStore.isLogisticAdmin;

    List<Widget> screens;
    List<BottomNavigationBarItem> items;

    if (isSuperAdmin) {
      screens = _superAdminScreens;
      items = _buildSuperAdminItems();
    } else if (isSameAdmin) {
      screens = _sameAdminScreens;
      items = _buildSameAdminItems();
    } else if (isLogistic) {
      screens = _logisticScreens;
      items = _buildLogisticItems();
    } else {
      screens = _userScreens;
      items = _buildUserItems();
    }

    if (_currentIndex >= screens.length) {
      _currentIndex = 0;
    }

    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      extendBody: true,
      body: IndexedStack(
        index: _currentIndex,
        children: screens,
      ),
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
              selectedItemColor: isDark ? Colors.white : Theme.of(context).colorScheme.primary,
              unselectedItemColor: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.4),
              showSelectedLabels: true,
              showUnselectedLabels: true,
              type: BottomNavigationBarType.fixed,
              selectedLabelStyle: const TextStyle(
                fontSize: 12, 
                fontWeight: FontWeight.bold,
                letterSpacing: 0.3,
              ),
              unselectedLabelStyle: const TextStyle(
                fontSize: 11,
              ),
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

  List<BottomNavigationBarItem> _buildSameAdminItems() {
    return const [
      BottomNavigationBarItem(
        icon: Icon(Icons.home_rounded),
        label: 'Inicio',
      ),
      BottomNavigationBarItem(
        icon: Icon(Icons.calendar_month_rounded),
        label: 'Calendario',
      ),
      BottomNavigationBarItem(
        icon: Icon(Icons.add_circle_outline_rounded),
        label: 'Contar',
      ),
      BottomNavigationBarItem(
        icon: Icon(Icons.confirmation_number_rounded),
        label: 'Eventos',
      ),
      BottomNavigationBarItem(
        icon: Icon(Icons.settings_rounded),
        label: 'Config',
      ),
    ];
  }

  List<BottomNavigationBarItem> _buildLogisticItems() {
    return const [
      BottomNavigationBarItem(
        icon: Icon(Icons.home_rounded),
        label: 'Inicio',
      ),
      BottomNavigationBarItem(
        icon: Icon(Icons.calendar_month_rounded),
        label: 'Calendario',
      ),
      BottomNavigationBarItem(
        icon: Icon(Icons.add_circle_outline_rounded),
        label: 'Contar',
      ),
      BottomNavigationBarItem(
        icon: Icon(Icons.settings_rounded),
        label: 'Config',
      ),
    ];
  }

  List<BottomNavigationBarItem> _buildUserItems() {
    return const [
      BottomNavigationBarItem(
        icon: Icon(Icons.home_rounded),
        label: 'Inicio',
      ),
      BottomNavigationBarItem(
        icon: Icon(Icons.calendar_month_rounded),
        label: 'Calendario',
      ),
      BottomNavigationBarItem(
        icon: Icon(Icons.settings_rounded),
        label: 'Config',
      ),
    ];
  }
}
