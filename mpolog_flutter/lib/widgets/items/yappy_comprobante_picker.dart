import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../../styles/app_colors.dart';

class YappyComprobantePicker extends StatelessWidget {
  final String? comprobanteYappyBase64;
  final String? existingUrl;
  final Function(ImageSource) onPickImage;
  final VoidCallback onRemoveImage;

  const YappyComprobantePicker({
    super.key,
    required this.comprobanteYappyBase64,
    this.existingUrl,
    required this.onPickImage,
    required this.onRemoveImage,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('COMPROBANTE YAPPY', style: TextStyle(fontSize: 9, color: Colors.white38, fontWeight: FontWeight.bold, letterSpacing: 1)),
        const SizedBox(height: 12),
        GestureDetector(
          onTap: () {
            showModalBottomSheet(
              context: context,
              backgroundColor: AppColors.surface,
              builder: (context) => SafeArea(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    ListTile(
                      leading: const Icon(Icons.photo_library_outlined, color: Colors.white),
                      title: const Text('Galería', style: TextStyle(color: Colors.white)),
                      onTap: () {
                        onPickImage(ImageSource.gallery);
                        Navigator.pop(context);
                      },
                    ),
                    ListTile(
                      leading: const Icon(Icons.camera_alt_outlined, color: Colors.white),
                      title: const Text('Cámara', style: TextStyle(color: Colors.white)),
                      onTap: () {
                        onPickImage(ImageSource.camera);
                        Navigator.pop(context);
                      },
                    ),
                  ],
                ),
              ),
            );
          },
          child: Container(
            height: 160,
            width: double.infinity,
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.05),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Colors.white10),
            ),
            child: comprobanteYappyBase64 != null
              ? ClipRRect(
                  borderRadius: BorderRadius.circular(18),
                  child: Stack(
                    fit: StackFit.expand,
                    children: [
                      Image.memory(base64Decode(comprobanteYappyBase64!.split(',').last), fit: BoxFit.cover),
                      Container(color: Colors.black26),
                      const Center(child: Icon(Icons.refresh_rounded, color: Colors.white, size: 32)),
                    ],
                  ),
                )
              : (existingUrl != null)
                ? ClipRRect(
                    borderRadius: BorderRadius.circular(18),
                    child: Stack(
                      fit: StackFit.expand,
                      children: [
                        Image.network(existingUrl!, fit: BoxFit.cover),
                        Container(color: Colors.black26),
                        const Center(child: Icon(Icons.edit_rounded, color: Colors.white, size: 32)),
                      ],
                    ),
                  )
                : Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.add_a_photo_outlined, color: AppColors.primary, size: 32),
                      const SizedBox(height: 8),
                      const Text('Toca para subir foto', style: TextStyle(fontSize: 12, color: Colors.white38)),
                    ],
                  ),
          ),
        ),
        if (comprobanteYappyBase64 != null)
          Padding(
            padding: const EdgeInsets.only(top: 8),
            child: TextButton.icon(
              onPressed: onRemoveImage,
              icon: const Icon(Icons.delete_outline_rounded, size: 16, color: Colors.redAccent),
              label: const Text('Eliminar captura', style: TextStyle(color: Colors.redAccent, fontSize: 12)),
            ),
          ),
      ],
    );
  }
}
