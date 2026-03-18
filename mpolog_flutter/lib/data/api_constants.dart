class ApiConstants {
  static const String baseUrl = 'http://localhost:5000/api'; // Ajusta según tu red
  static const String login = '$baseUrl/auth/login';
  static const String register = '$baseUrl/auth/register';
  static const String conteos = '$baseUrl/conteo';
  static const String estadisticas = '$baseUrl/conteo/estadisticas';
  static const String areas = '$baseUrl/conteo/areas';
  static const String iglesias = '$baseUrl/conteo/iglesias';
  static const String usuarios = '$baseUrl/users';
  static const String roles = '$baseUrl/roles';
}
