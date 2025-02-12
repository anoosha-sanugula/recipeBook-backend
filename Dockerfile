FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install

RUN rm -rf node_modules

RUN npm install
COPY . .
CMD ["npm","run","dev"]
EXPOSE 4000 
