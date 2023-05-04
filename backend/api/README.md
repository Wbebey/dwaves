# DWAVES api

# Setup

Start by installing all dependencies:

`npm i`

# Prisma

Generate prisma client with (this is automatically done while running `npm i`):

`npx prisma generate`

## LOCAL database

Start docker container:

`docker compose up -d`

Update POSTGRES_URL in env file:

`POSTGRES_URL=postgresql://dwaves-local:dwaves-password@localhost:5432/dwaves`

Init the database (migrations + seed):

`npm run db:init`

## STAGING database

Update POSTGRES_URL in env file:

`POSTGRES_URL=postgresql://<user>:<password>@<host>:<port>/<db>`

## Explore database

You can browse the database with prisma's builtin studio:

`npx prisma studio`

# Deployment (afer updated smart contract)

For every deployment, you have to update [version.txt](version.txt) file with semantic versioning..