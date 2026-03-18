import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:mpolog_flutter/logic/auth_store.dart';
import 'package:mpolog_flutter/ui/login_page.dart';
import 'package:mpolog_flutter/ui/main_tabs.dart';

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MPOLOG',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF1A237E),
          primary: const Color(0xFF1A237E),
          brightness: Brightness.dark,
        ),
        useMaterial3: true,
      ),
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
