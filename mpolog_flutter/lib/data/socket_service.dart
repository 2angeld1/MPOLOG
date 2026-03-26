import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'api_constants.dart';

class SocketService {
  late IO.Socket _socket;
  final List<Function(String, dynamic)> _listeners = [];
  bool _isConnected = false;

  static final SocketService _instance = SocketService._internal();
  factory SocketService() => _instance;
  SocketService._internal() {
    _initSocket();
  }

  void _initSocket() {
    final socketUrl = ApiConstants.baseUrl.replaceAll('/api', '');
    
    _socket = IO.io(socketUrl, IO.OptionBuilder()
      .setTransports(['websocket'])
      .enableAutoConnect()
      .build());

    _socket.onConnect((_) {
      _isConnected = true;
      debugPrint('SocketService: Conectado');
    });

    _socket.onDisconnect((_) {
      _isConnected = false;
      debugPrint('SocketService: Desconectado');
    });

    // Escuchar eventos comunes
    _socket.on('conteo-actualizado', (data) => _notifyListeners('conteo-actualizado', data));
    _socket.on('nuevo-evento', (data) => _notifyListeners('nuevo-evento', data));
    _socket.on('notificacion-global', (data) => _notifyListeners('notificacion-global', data));
  }

  void addListener(Function(String, dynamic) callback) {
    _listeners.add(callback);
  }

  void removeListener(Function(String, dynamic) callback) {
    _listeners.remove(callback);
  }

  void _notifyListeners(String event, dynamic data) {
    for (var listener in _listeners) {
      listener(event, data);
    }
  }

  bool get isConnected => _isConnected;
}
