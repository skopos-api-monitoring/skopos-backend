FROM node:16-alpine as ts-builder

WORKDIR /home/backend_skopos

COPY . ./

RUN npm run clean
RUN npm run build 


FROM node:16-alpine as ts-prod
WORKDIR /home/backend_skopos

COPY --from=ts-builder ./home/backend_skopos/dist ./dist
COPY --from=ts-builder ./home/backend_skopos/prisma ./prisma
COPY package* ./

RUN npm install --production

EXPOSE 3001

CMD npx prisma migrate deploy; node ./dist/index.js
