FROM node:16-bullseye as ts-builder

WORKDIR /app


COPY . .
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true
RUN npm install
RUN npx prisma generate
RUN npm run build
COPY . .


FROM node:16-alpine as ts-prod
WORKDIR /app

COPY --from=ts-builder ./app/package*.json ./
COPY --from=ts-builder ./app/dist ./dist
COPY --from=ts-builder ./app/prisma ./prisma
COPY --from=ts-builder ./app/node_modules ./node_modules


EXPOSE 3001

CMD ["npm", "run", "deploy"]


