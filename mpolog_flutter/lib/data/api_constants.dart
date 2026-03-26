import 'package:flutter_dotenv/flutter_dotenv.dart';

class ApiConstants {
  static String get baseUrl => dotenv.env['API_URL'] ?? 'http://localhost:5000/api';
  static String get login => '$baseUrl/auth/login';
  static String get register => '$baseUrl/auth/register';
  static String get conteos => '$baseUrl/conteo';
  static String get estadisticas => '$baseUrl/conteo/estadisticas';
  static String get areas => '$baseUrl/conteo/areas';
  static String get iglesias => '$baseUrl/conteo/iglesias';
  static String get usuarios => '$baseUrl/users';
  static String get roles => '$baseUrl/roles';
}
