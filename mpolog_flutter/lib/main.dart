import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:mpolog_flutter/ui/app.dart';
import 'package:mpolog_flutter/logic/auth_store.dart';
import 'package:mpolog_flutter/logic/admin_store.dart';
import 'package:mpolog_flutter/logic/theme_store.dart';
import 'package:mpolog_flutter/logic/conteo_store.dart';
import 'package:mpolog_flutter/logic/config_store.dart';
import 'package:mpolog_flutter/logic/eventos_store.dart';
import 'package:mpolog_flutter/logic/reportes_store.dart';
import 'package:mpolog_flutter/logic/notification_store.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

void main() async {
  try {
    WidgetsFlutterBinding.ensureInitialized();
    
    // Opcional: Cargar .env si existe, pero no crashar si falta en producción
    try {
      await dotenv.load(fileName: ".env");
    } catch (e) {
      debugPrint("Advertencia: No se pudo cargar el archivo .env: $e");
    }

    runApp(
      MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (_) => AuthStore()),
          ChangeNotifierProvider(create: (_) => AdminStore()),
          ChangeNotifierProvider(create: (_) => ThemeStore()),
          ChangeNotifierProvider(create: (_) => ConteoStore()),
          ChangeNotifierProvider(create: (_) => ConfigStore()),
          ChangeNotifierProvider(create: (_) => EventosStore()),
          ChangeNotifierProvider(create: (_) => ReportesStore()),
          ChangeNotifierProvider(create: (_) => NotificationStore()),
        ],
        child: const MyApp(),
      ),
    );
  } catch (e) {
    debugPrint("Error crítico en main: $e");
    // Al menos mostramos algo si todo falla
    runApp(
      MaterialApp(
        home: Scaffold(
          body: Center(
            child: Text("Error al iniciar la aplicación: $e"),
          ),
        ),
      ),
    );
  }
}
