# --------------> The build image
FROM node:16.18.1-bullseye-slim AS build

ARG DOPPLER_TOKEN
ARG APP
ARG ENV_NAME

ENV APP=${APP}
ENV DOPPLER_TOKEN=${DOPPLER_TOKEN}
ENV ENV_NAME=${ENV_NAME}

# Set a more restrictive umask
RUN umask 077

RUN apt-get update && \
    apt-get install -y --no-install-recommends

WORKDIR /usr/src/app/api

# Copy only the necessary files for npm install
COPY package*.json ./
COPY prisma/schema.prisma ./prisma/

# Disable npm scripts from running as root
RUN chown node:node /usr/src/app/api && \
    npm config set unsafe-perm false && \
    npm install  && \
    npm cache clean --force

# Install Doppler CLI
RUN apt-get update && apt-get install -y apt-transport-https ca-certificates curl gnupg && \
    curl -sLf --retry 3 --tlsv1.2 --proto "=https" 'https://packages.doppler.com/public/cli/gpg.DE2A7741A397C129.key' | apt-key add - && \
    echo "deb https://packages.doppler.com/public/cli/deb/debian any-version main" | tee /etc/apt/sources.list.d/doppler-cli.list && \
    apt-get update && \
    apt-get -y install doppler

USER node

# Copy the remaining application files
COPY --chown=node:node . .

RUN doppler setup --token ${DOPPLER_TOKEN} --project ${APP} --config ${ENV_NAME} 

RUN npm run db:init && \
    npm run build && \
    npm prune --production && \
    rm -rf ./node_modules/.cache

# --------------> The production image
FROM node:16.18.1-bullseye-slim

ARG DOPPLER_TOKEN
ARG APP
ARG ENV_NAME

ENV APP=${APP}
ENV DOPPLER_TOKEN=${DOPPLER_TOKEN}
ENV ENV_NAME=${ENV_NAME}

# Set a more restrictive umask
RUN umask 077

WORKDIR /usr/src/app/api

COPY package*.json /usr/src/app/api/

COPY prisma/schema.prisma /usr/src/app/api/prisma/

# Disable npm scripts from running as root
RUN chown node:node /usr/src/app/api && \
    npm config set unsafe-perm false && \
    npm ci --only=production --no-audit --no-fund && \
    npm cache clean --force

# Install Doppler CLI
RUN apt-get update && apt-get install -y apt-transport-https ca-certificates curl gnupg && \
    curl -sLf --retry 3 --tlsv1.2 --proto "=https" 'https://packages.doppler.com/public/cli/gpg.DE2A7741A397C129.key' | apt-key add - && \
    echo "deb https://packages.doppler.com/public/cli/deb/debian any-version main" | tee /etc/apt/sources.list.d/doppler-cli.list && \
    apt-get update && \
    apt-get -y install doppler

USER node

COPY --chown=node:node --from=build /usr/src/app/api/build ./build

COPY --chown=node:node --from=build /usr/src/app/api/tsconfig.json ./tsconfig.json

RUN doppler setup --token ${DOPPLER_TOKEN} --project ${APP} --config ${ENV_NAME} --no-interactive

EXPOSE 8080

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD curl --fail http://localhost:8080/api/v1 || exit 1

CMD ["npm", "run", "start"]