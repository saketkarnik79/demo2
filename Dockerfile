FROM nginx:alpine
RUN rm -rf /usr/share/html/*
COPY . /usr/share/html/
EXPOSE 8181
CMD ["nginx", "-g", "daemon off;"]