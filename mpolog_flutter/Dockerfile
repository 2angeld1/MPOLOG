# Stage 1: Build
FROM ghcr.io/cirruslabs/flutter:stable AS build

WORKDIR /app

# Copiar dependencias primero para cachear capas
COPY pubspec.yaml pubspec.lock ./
RUN flutter pub get

# Copiar el resto del código
COPY . .

# Construir para web en modo release
RUN flutter build web --release

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copiar build de la etapa anterior al directorio de Nginx
COPY --from=build /app/build/web /usr/share/nginx/html

# Copiar configuración de Nginx para SPA (Flutter Web)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
