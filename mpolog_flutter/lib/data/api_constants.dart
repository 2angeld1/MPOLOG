import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter/foundation.dart';

class ApiConstants {
  static String get baseUrl {
    // 1. Variable de entorno cargada en tiempo de ejecución (.env)
    final envUrl = dotenv.env['API_URL'];
    if (envUrl != null && envUrl.isNotEmpty) {
      return envUrl;
    }
    
    // 2. Variable definida en tiempo de compilación (--dart-define=API_URL=...)
    // Esta es la forma recomendada para producción en Flutter Web
    const defineUrl = String.fromEnvironment('API_URL');
    if (defineUrl.isNotEmpty) {
      return defineUrl;
    }
    
    // 3. Por defecto para desarrollo local
    return 'http://localhost:5000/api';
  }

  static String get login => '$baseUrl/auth/login';
  static String get register => '$baseUrl/auth/register';
  static String get conteos => '$baseUrl/conteo';
  static String get estadisticas => '$baseUrl/conteo/estadisticas';
  static String get areas => '$baseUrl/conteo/areas';
  static String get iglesias => '$baseUrl/conteo/iglesias';
  static String get usuarios => '$baseUrl/users';
  static String get roles => '$baseUrl/roles';
}
