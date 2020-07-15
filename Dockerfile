FROM node:10.15.1-alpine as build

WORKDIR /
ENV PATH /node_modules/.bin:$PATH

COPY package.json /
RUN npm install --silent
COPY . /
# RUN source .env.production.local && npm run build
RUN npm run build

FROM nginx:1.16.1-alpine
COPY --from=build /build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
