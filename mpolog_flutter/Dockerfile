# Stage 1: Compilación en la nube (Sin errores de Root)
FROM ghcr.io/cirruslabs/flutter:stable AS build

# Crear un usuario no-root para evitar el error de Flutter
RUN useradd -m -s /bin/bash flutteruser
USER flutteruser
WORKDIR /home/flutteruser/app

# Copiar archivos de dependencias primero para cachear capas
COPY --chown=flutteruser:flutteruser pubspec.yaml pubspec.lock ./
RUN flutter pub get

# Copiar el resto del código
COPY --chown=flutteruser:flutteruser . .

# Compilar para Web
RUN flutter build web --release

# Stage 2: Servir con Nginx (Ultra ligero)
FROM nginx:alpine
COPY --from=build /home/flutteruser/app/build/web /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
