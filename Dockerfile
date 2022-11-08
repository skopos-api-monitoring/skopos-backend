FROM node:18-alpine
RUN apk update 

WORKDIR /home/backend-skopos

COPY package.json .

RUN npm install

COPY . . 
RUN npx prisma migrate deploy 
RUN npx prisma generate
RUN npm run build 

EXPOSE 3001

CMD ["node", "dist/index.js"]
