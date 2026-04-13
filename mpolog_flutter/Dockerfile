# Dockerfile Directo y Efectivo (Ignorando advertencias de Root)
FROM ghcr.io/cirruslabs/flutter:stable AS build

WORKDIR /app

# Ignorar la advertencia de Root de Flutter
ENV CHROME_EXECUTABLE=/usr/bin/chromium-browser

# Copiar archivos base
COPY pubspec.yaml pubspec.lock ./
RUN flutter pub get

# Copiar el resto
COPY . .

# Asegurar que existe un archivo .env (aunque esté vacío) para que Flutter no falle al compilar
# ya que está declarado como asset en pubspec.yaml
RUN touch .env

# Definir API_URL como argumento de construcción (Build-time variable)
ARG API_URL

# Compilar para Web inyectando la URL y forzando el renderizador HTML
RUN flutter build web --release --dart-define=FLUTTER_WEB_RENDERER=html --dart-define=API_URL=${API_URL}

# Stage 2: Servir con Nginx
FROM nginx:alpine
COPY --from=build /app/build/web /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
