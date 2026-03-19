import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../logic/auth_store.dart';
import 'home_page.dart';
import 'super_admin_dashboard.dart';
import 'user_maintenance_page.dart';
import 'role_maintenance_page.dart';
import 'settings_page.dart';
import 'add_conteo_page.dart';

class MainTabs extends StatefulWidget {
  const MainTabs({super.key});

  @override
  State<MainTabs> createState() => _MainTabsState();
}

class _MainTabsState extends State<MainTabs> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    final authStore = context.watch<AuthStore>();
    final isSuperAdmin = authStore.isSuperAdmin;
    final isLogistic = authStore.isLogisticAdmin;

    // Define tabs based on role
    final List<Widget> superAdminScreens = [
      const SuperAdminDashboard(),
      const UserMaintenancePage(),
      const RoleMaintenancePage(),
      const SettingsPage(),
    ];

    final List<Widget> logisticScreens = [
      const HomePage(title: 'Inicio'),
      const AddConteoPage(),
      const SettingsPage(),
    ];

    final List<Widget> userScreens = [
      const HomePage(title: 'Inicio'),
      const SettingsPage(),
    ];

    List<Widget> screens;
    List<BottomNavigationBarItem> items;

    if (isSuperAdmin) {
      screens = superAdminScreens;
      items = _buildSuperAdminItems();
    } else if (isLogistic) {
      screens = logisticScreens;
      items = _buildLogisticItems();
    } else {
      screens = userScreens;
      items = _buildUserItems();
    }

    if (_currentIndex >= screens.length) {
      _currentIndex = 0;
    }

    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      extendBody: true,
      body: screens[_currentIndex],
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surface.withValues(alpha: isDark ? 0.8 : 0.95),
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

  List<BottomNavigationBarItem> _buildLogisticItems() {
    return const [
      BottomNavigationBarItem(
        icon: Icon(Icons.home_rounded),
        label: 'Inicio',
      ),
      BottomNavigationBarItem(
        icon: Icon(Icons.add_circle_outline_rounded),
        label: 'Agregar',
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
        icon: Icon(Icons.settings_rounded),
        label: 'Config',
      ),
    ];
  }
}
