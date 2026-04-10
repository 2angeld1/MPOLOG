import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:mpolog_flutter/logic/auth_store.dart';
import 'package:mpolog_flutter/logic/theme_store.dart';
import 'package:mpolog_flutter/ui/login_page.dart';
import 'package:mpolog_flutter/ui/main_tabs.dart';

import 'package:mpolog_flutter/styles/app_themes.dart';

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    final themeStore = context.watch<ThemeStore>();

    return MaterialApp(
      title: 'Numera',
      debugShowCheckedModeBanner: false,
      themeMode: themeStore.themeMode,
      theme: AppThemes.lightTheme,
      darkTheme: AppThemes.darkTheme,
      home: Consumer<AuthStore>(
        builder: (context, authStore, _) {
          if (authStore.isLoggedIn) {
            return const MainTabs();
          }
          return const LoginPage();
        },
      ),
    );
  }
}
