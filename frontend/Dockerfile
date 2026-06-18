# Estagio 1: builda a SPA React/Vite em um ambiente Node completo.
FROM node:20-alpine AS build

WORKDIR /app

# Copia primeiro so o manifesto de dependencias para aproveitar o cache do Docker.
COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

# Estagio 2: imagem final, so com os arquivos estaticos gerados + Nginx (muito mais
# leve do que carregar o Node em produção).
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
