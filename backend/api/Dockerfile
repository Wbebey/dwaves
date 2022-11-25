# --------------> The build image
FROM node:16.18.1-bullseye-slim AS build

RUN apt-get update && \
    apt-get install -y --no-install-recommends

WORKDIR /usr/src/app/api

COPY . .

RUN npm install 

RUN npm run deploy 

RUN npm run build 

# --------------> The production image
FROM node:16.18.1-bullseye-slim

ENV NODE_ENV production

WORKDIR /usr/src/app/api

COPY package*.json /usr/src/app/api/

COPY prisma/schema.prisma /usr/src/app/api/prisma/

RUN npm ci --only=production

#USER node

#COPY --chown=node:node --from=build /usr/src/app/api/build ./build
#
#COPY --chown=node:node --from=build /usr/src/app/api/.env ./.env
#
#COPY --chown=node:node --from=build /usr/src/app/api/tsconfig.json ./tsconfig.json

COPY --from=build /usr/src/app/api/build ./build

COPY --from=build /usr/src/app/api/.env ./.env

COPY --from=build /usr/src/app/api/tsconfig.json ./tsconfig.json

EXPOSE 8080

CMD ["npm", "start"]