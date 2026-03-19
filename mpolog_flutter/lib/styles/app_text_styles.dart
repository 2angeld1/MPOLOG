import 'package:flutter/material.dart';

class AppTextStyles {
  static TextStyle h1(BuildContext context) => TextStyle(
    fontSize: 28,
    fontWeight: FontWeight.bold,
    color: Theme.of(context).colorScheme.onSurface,
    letterSpacing: 0.5,
  );

  static TextStyle h2(BuildContext context) => TextStyle(
    fontSize: 22,
    fontWeight: FontWeight.bold,
    color: Theme.of(context).colorScheme.onSurface,
  );

  static TextStyle h3(BuildContext context) => TextStyle(
    fontSize: 18,
    fontWeight: FontWeight.w600,
    color: Theme.of(context).colorScheme.onSurface,
  );

  static TextStyle title(BuildContext context) => TextStyle(
    fontSize: 22,
    fontWeight: FontWeight.w400,
    color: Theme.of(context).colorScheme.onSurface,
    letterSpacing: 0.8,
  );

  static TextStyle body(BuildContext context) => TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.w300,
    color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.7),
  );

  static TextStyle label(BuildContext context) => TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.w400,
    color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.6),
  );

  static TextStyle button(BuildContext context) => TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.w600,
    letterSpacing: 1.2,
    color: Theme.of(context).colorScheme.onPrimaryContainer,
  );
}
