# --------------> The build image
FROM node:16.18.1-bullseye-slim AS builder

RUN apt-get update && \
    apt-get install -y --no-install-recommends dumb-init

WORKDIR /usr/src/app

RUN cp -r ../db /usr/src/app/db

RUN npm ci --only=production --omit=dev --prefix /usr/src/app/db

RUN npx prisma migrate deploy --prefix /usr/src/app/db

RUN npm run generate --prefix /usr/src/app/db

COPY . .

RUN npm ci --only=production --omit=dev

RUN npm install -g typescript 

RUN npm run build

# --------------> The production image
FROM node:16.17.0-bullseye-slim

ENV NODE_ENV production

COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init

USER node

WORKDIR /usr/src/app

COPY --chown=node:node --from=build /usr/src/app/node_modules /usr/src/app/node_modules

# COPY --chown=node:node . /usr/src/app

COPY --chown=node:node --from=build build /usr/src/app

EXPOSE 8080

CMD ["dumb-init", "node", "build/server.js"]