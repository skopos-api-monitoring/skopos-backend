FROM node:16-bullseye

WORKDIR /home/backend-skopos


COPY package*.json ./

ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true

RUN npm install #--loglevel verbose

COPY . .

RUN npx prisma generate
RUN npm run build 


EXPOSE 3001

CMD ["npm", "run", "deploy"]
