FROM node:10.15.3-stretch-slim as build
WORKDIR /build-web
COPY . .
RUN npm ci && npm run build

FROM nginx
# RUN rm /etc/nginx/conf.d/*
# COPY ./nginx/ /etc/nginx/conf.d/
COPY --from=build /build-web/dist/ /usr/share/nginx/html/
