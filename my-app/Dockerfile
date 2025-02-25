FROM node:18 as build
WORKDIR /my-app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /my-app/build /usr/share/nginx/html