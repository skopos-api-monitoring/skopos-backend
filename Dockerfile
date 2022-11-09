FROM node:18-alpine
RUN apk update 

WORKDIR /home/backend-skopos

COPY . .
RUN npm install


RUN npx prisma migrate deploy 
RUN npx prisma generate
RUN npm run build 

EXPOSE 3001

CMD ["npm", "start"]
