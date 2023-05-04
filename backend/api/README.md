# api web 2.5

# Deployment (afer updated smart contract)

For every deployment, you have to update [version.txt](version.txt) file with semantic versioning.

# Prisma

Create migrations from your Prisma schema, apply them to the database, generate prisma client

`npx prisma migrate dev -n <migration_name>`

Browse database

`npx prisma studio`