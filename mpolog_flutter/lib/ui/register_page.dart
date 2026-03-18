import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../logic/auth_store.dart';
import '../../widgets/glass_container.dart';
import '../../widgets/glass_text_field.dart';
import '../../widgets/glass_button.dart';
import '../../utils/app_notifications.dart';

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage>
    with SingleTickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final _nombreController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  bool _obscurePassword = true;

  late AnimationController _animController;
  late Animation<double> _fadeAnim;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    );
    _fadeAnim = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _animController, curve: Curves.easeIn),
    );
    _animController.forward();
  }

  @override
  void dispose() {
    _nombreController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    _animController.dispose();
    super.dispose();
  }

  Future<void> _handleRegister() async {
    if (!_formKey.currentState!.validate()) return;

    final authStore = context.read<AuthStore>();
    final result = await authStore.register(
      nombre: _nombreController.text.trim(),
      email: _emailController.text.trim(),
      password: _passwordController.text,
    );

    if (!mounted) return;

    if (result['success'] == true) {
      AppNotifications.showTopToast(context, '¡Registro exitoso!');
      Navigator.pop(context);
    } else {
      AppNotifications.showTopToast(
        context,
        result['message'] ?? 'Error al registrar',
        isError: true,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final authStore = context.watch<AuthStore>();

    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        fit: StackFit.expand,
        children: [
          Image.asset('assets/images/worship_bg.png', fit: BoxFit.cover),
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [Colors.black.withValues(alpha: 0.4), Colors.black.withValues(alpha: 0.8)],
              ),
            ),
          ),
          SafeArea(
            child: Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 40),
                child: FadeTransition(
                  opacity: _fadeAnim,
                  child: Column(
                    children: [
                      Align(
                        alignment: Alignment.centerLeft,
                        child: IconButton(
                          onPressed: () => Navigator.pop(context),
                          icon: const Icon(Icons.close, color: Colors.white, size: 28),
                          padding: EdgeInsets.zero,
                          constraints: const BoxConstraints(),
                        ),
                      ),
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(color: Colors.white.withValues(alpha: 0.1), width: 1),
                        ),
                        child: ClipOval(
                          child: ColorFiltered(
                            colorFilter: ColorFilter.mode(
                              Colors.white.withValues(alpha: 0.9),
                              BlendMode.srcIn,
                            ),
                            child: Image.asset(
                              'assets/images/logo.png',
                              width: 70,
                              height: 70,
                              fit: BoxFit.cover,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),
                      Text(
                        'Crea tu cuenta',
                        style: TextStyle(
                          color: Colors.white.withValues(alpha: 0.9),
                          fontSize: 20,
                          fontWeight: FontWeight.w400,
                        ),
                      ),
                      const SizedBox(height: 24),
                      GlassContainer(
                        borderRadius: 24,
                        padding: const EdgeInsets.all(24),
                        child: Form(
                          key: _formKey,
                          child: Column(
                            children: [
                              GlassTextField(
                                label: 'Nombre',
                                controller: _nombreController,
                                enabled: !authStore.isLoading,
                                validator: (value) => (value == null || value.isEmpty) ? 'Requerido' : null,
                              ),
                              const SizedBox(height: 12),
                              GlassTextField(
                                label: 'Email',
                                controller: _emailController,
                                keyboardType: TextInputType.emailAddress,
                                enabled: !authStore.isLoading,
                                validator: (value) => (value == null || !value.contains('@')) ? 'Inválido' : null,
                              ),
                              const SizedBox(height: 12),
                              GlassTextField(
                                label: 'Contraseña',
                                controller: _passwordController,
                                obscureText: _obscurePassword,
                                enabled: !authStore.isLoading,
                                suffixIcon: IconButton(
                                  icon: Icon(_obscurePassword ? Icons.visibility_off : Icons.visibility,
                                      size: 18, color: Colors.white.withValues(alpha: 0.4)),
                                  onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                                ),
                                validator: (value) => (value != null && value.length < 6) ? 'Mínimo 6' : null,
                              ),
                              const SizedBox(height: 12),
                              GlassTextField(
                                label: 'Confirmar',
                                controller: _confirmPasswordController,
                                obscureText: true,
                                enabled: !authStore.isLoading,
                                validator: (value) => (value != _passwordController.text) ? 'No coincide' : null,
                              ),
                              const SizedBox(height: 32),
                              GlassButton(
                                text: 'REGISTRARME',
                                isLoading: authStore.isLoading,
                                onPressed: _handleRegister,
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 24),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
