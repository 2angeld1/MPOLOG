import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../logic/auth_store.dart';
import 'home_page.dart';
import 'super_admin_dashboard.dart';
import 'user_maintenance_page.dart';
import 'role_maintenance_page.dart';

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

    // Define tabs based on role
    final List<Widget> superAdminScreens = [
      const SuperAdminDashboard(),
      const UserMaintenancePage(),
      const RoleMaintenancePage(),
    ];

    final List<Widget> userScreens = [
      const HomePage(title: 'Inicio'),
      const Scaffold(body: Center(child: Text('Agregar Registro'))),
      const Scaffold(body: Center(child: Text('Reportes'))),
    ];

    final screens = isSuperAdmin ? superAdminScreens : userScreens;

    return Scaffold(
      extendBody: true,
      body: screens[_currentIndex],
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.transparent,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.3),
              blurRadius: 20,
              offset: const Offset(0, -5),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 15, sigmaY: 15),
            child: Container(
              height: 70 + MediaQuery.of(context).padding.bottom,
              padding: EdgeInsets.only(bottom: MediaQuery.of(context).padding.bottom),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.08),
                borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
                border: Border(
                  top: BorderSide(
                    color: Colors.white.withValues(alpha: 0.1),
                    width: 1,
                  ),
                ),
              ),
              child: Theme(
                data: Theme.of(context).copyWith(
                  splashColor: Colors.transparent,
                  highlightColor: Colors.transparent,
                ),
                child: BottomNavigationBar(
                  currentIndex: _currentIndex,
                  onTap: (index) => setState(() => _currentIndex = index),
                  backgroundColor: Colors.transparent,
                  elevation: 0,
                  selectedItemColor: Colors.white,
                  unselectedItemColor: Colors.white.withValues(alpha: 0.3),
                  showSelectedLabels: true,
                  showUnselectedLabels: true,
                  type: BottomNavigationBarType.fixed,
                  selectedLabelStyle: const TextStyle(
                    fontSize: 12, 
                    fontWeight: FontWeight.bold,
                    letterSpacing: 0.3,
                  ),
                  unselectedLabelStyle: TextStyle(
                    fontSize: 11,
                    color: Colors.white.withValues(alpha: 0.3),
                  ),
                  items: isSuperAdmin ? _buildSuperAdminItems() : _buildUserItems(),
                ),
              ),
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
    ];
  }

  List<BottomNavigationBarItem> _buildUserItems() {
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
        icon: Icon(Icons.bar_chart_rounded),
        label: 'Reportes',
      ),
    ];
  }
}
