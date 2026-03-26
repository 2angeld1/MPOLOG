# Dockerfile Estratégico para Railway (Compilación local -> Servido con Nginx)
FROM nginx:alpine

# Copiar el build hecho localmente (Asegúrate de ejecutar flutter build web --release antes)
# Si te da error de COPY failed, verifica que la carpeta build/web existe en tu PC.
COPY build/web /usr/share/nginx/html

# Inyectamos nuestra configuración SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
