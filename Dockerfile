FROM node:18-alpine
RUN apk update 

WORKDIR /home/backend-skopos

COPY . . 

RUN npm install

RUN npx prisma generate
RUN npm run build 

EXPOSE 80

CMD ["node", "dist/index.js"]
