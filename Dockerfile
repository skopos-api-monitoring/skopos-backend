FROM node:16-bullseye
RUN apt-get update

WORKDIR /home/backend-skopos

COPY package.json .

RUN npm install

COPY . . 

RUN npm run build 

EXPOSE 3001
EXPOSE 5432

CMD npx prisma migrate dev --name "deploy"; node dist/index.js
