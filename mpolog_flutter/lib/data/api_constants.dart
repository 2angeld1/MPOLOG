import 'package:flutter/foundation.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class ApiConstants {
  static String get baseUrl {
    // 1. Variable definida en tiempo de compilación (--dart-define=API_URL=...)
    // Esta es la forma recomendada para producción en Flutter Web
    // Se revisa PRIMERO porque es la más confiable
    const defineUrl = String.fromEnvironment('API_URL');
    if (defineUrl.isNotEmpty) {
      return defineUrl;
    }

    // 2. Variable de entorno cargada en tiempo de ejecución (.env)
    // Protegida con try-catch: si dotenv no cargó, esto puede lanzar excepciones
    try {
      final envUrl = dotenv.env['API_URL'];
      if (envUrl != null && envUrl.isNotEmpty) {
        return envUrl;
      }
    } catch (e) {
      debugPrint('ApiConstants: No se pudo leer dotenv: $e');
    }
    
    // 3. Por defecto para desarrollo local
    return 'http://localhost:5000/api';
  }

  static String get login => '/auth/login';
  static String get register => '/auth/register';
  static String get conteos => '/conteo';
  static String get estadisticas => '/conteo/estadisticas';
  static String get areas => '/conteo/areas';
  static String get iglesias => '/conteo/iglesias';
  static String get usuarios => '/users';
  static String get roles => '/roles';
}
