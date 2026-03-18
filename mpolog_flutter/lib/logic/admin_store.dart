import 'package:flutter/material.dart';
import '../data/user_service.dart';
import '../data/role_service.dart';

class AdminStore extends ChangeNotifier {
  final UserService _userService = UserService();
  final RoleService _roleService = RoleService();

  List<dynamic> _users = [];
  List<dynamic> _roles = [];
  bool _isLoadingUsers = false;
  bool _isLoadingRoles = false;
  String? _errorMessage;

  List<dynamic> get users => _users;
  List<dynamic> get roles => _roles;
  bool get isLoadingUsers => _isLoadingUsers;
  bool get isLoadingRoles => _isLoadingRoles;
  String? get errorMessage => _errorMessage;

  Future<void> fetchUsers() async {
    _isLoadingUsers = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _users = await _userService.getUsers();
    } catch (e) {
      _errorMessage = 'Error al cargar usuarios';
    } finally {
      _isLoadingUsers = false;
      notifyListeners();
    }
  }

  Future<void> fetchRoles() async {
    _isLoadingRoles = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _roles = await _roleService.getRoles();
    } catch (e) {
      _errorMessage = 'Error al cargar roles';
    } finally {
      _isLoadingRoles = false;
      notifyListeners();
    }
  }

  Future<bool> updateRole(String userId, String role) async {
    final success = await _userService.updateUserRole(userId, role);
    if (success) {
      await fetchUsers(); // Refresh list
    }
    return success;
  }

  Future<bool> createRole(String name, String description) async {
    final success = await _roleService.createRole({
      'name': name,
      'description': description,
    });
    if (success) {
      await fetchRoles(); // Refresh list
    }
    return success;
  }

  Future<bool> deleteRole(String id) async {
    final success = await _roleService.deleteRole(id);
    if (success) {
      await fetchRoles(); // Refresh list
    }
    return success;
  }
}
