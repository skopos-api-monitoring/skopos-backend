FROM node:18-alpine
RUN apk update 

WORKDIR /home/backend-skopos

COPY . . 

RUN npm install

RUN npx prisma migrate deploy 
RUN npm run build 

EXPOSE 3001

CMD ["node", "dist/index.js"]
