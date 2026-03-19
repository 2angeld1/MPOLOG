import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:mpolog_flutter/ui/app.dart';
import 'package:mpolog_flutter/logic/auth_store.dart';
import 'package:mpolog_flutter/logic/admin_store.dart';
import 'package:mpolog_flutter/logic/theme_store.dart';
import 'package:mpolog_flutter/logic/conteo_store.dart';
import 'package:mpolog_flutter/logic/config_store.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthStore()),
        ChangeNotifierProvider(create: (_) => AdminStore()),
        ChangeNotifierProvider(create: (_) => ThemeStore()),
        ChangeNotifierProvider(create: (_) => ConteoStore()),
        ChangeNotifierProvider(create: (_) => ConfigStore()),
      ],
      child: const MyApp(),
    ),
  );
}
