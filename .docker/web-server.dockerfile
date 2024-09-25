FROM nginx:1.16.0-alpine
EXPOSE 80
COPY .docker/config/web-server.conf /etc/nginx/conf.d/default.conf