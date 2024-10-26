FROM node:20

RUN mkdir /app
WORKDIR /app

COPY . .

WORKDIR /app
RUN npm install

EXPOSE 3000



CMD ["npm", "start"]

