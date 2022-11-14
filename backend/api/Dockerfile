# --------------> The build image
FROM node:16.18.1-bullseye-slim AS build

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    dumb-init

WORKDIR /usr/src/app/api

COPY db /usr/src/app/db

COPY api /usr/src/app/api/

RUN npm ci --only=production --omit=dev --prefix /usr/src/app/db

RUN npm run deploy --prefix /usr/src/app/db

RUN npm run generate --prefix /usr/src/app/db


RUN npm install 

RUN npm run build 

# --------------> The production image
FROM node:16.17.0-bullseye-slim

ENV NODE_ENV production

COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init

WORKDIR /usr/src/app/api

COPY api/package*.json /usr/src/app/api/

RUN npm ci --only=production --omit=dev

USER node

COPY --chown=node:node --from=build /usr/src/app/api/node_modules /usr/src/app/api/node_modules

COPY --chown=node:node --from=build /usr/src/app/api/build /usr/src/app/api/build

COPY --chown=node:node --from=build /usr/src/app/api/client /usr/src/app/api/client

COPY --chown=node:node --from=build /usr/src/app/api/.env /usr/src/app/api

EXPOSE 8080

CMD ["dumb-init", "node", "build/server.js"]