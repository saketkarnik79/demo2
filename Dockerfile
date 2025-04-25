FROM node:20-alpine
WORKDIR /app
COPY . .
EXPOSE 8181
CMD("node", "index.html")