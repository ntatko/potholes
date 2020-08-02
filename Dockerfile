FROM node:10.15.1-alpine as build

WORKDIR /
ENV PATH /node_modules/.bin:$PATH

COPY package.json /
RUN npm install --silent

# COPY only the things we need - devops changes shouldn't affect the build
COPY src/ src/
COPY scripts/ scripts/
COPY public/ public/
COPY config/ config/

# RUN source .env.production.local && npm run build
RUN npm run build

FROM nginx:1.16.1-alpine
COPY --from=build /build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf.template /etc/nginx/conf.d.template
COPY .env.template /.env.template
# EXPOSE 8080
CMD /bin/sh -c "envsubst '\$PORT' < /etc/nginx/conf.d.template > /etc/nginx/conf.d/default.conf" && /bin/sh -c "envsubst '\$ENVIRONMENT' < .env.template > .env " && source .env && nginx -g 'daemon off;'
# CMD ["nginx", "-g", "daemon off;"]

