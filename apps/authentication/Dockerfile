# base: simple node image with pnpm installed globally
FROM node:16 AS base
RUN npm i -g pnpm

# dependencies: installation of all dependencies using pnpm 
FROM base AS dependencies
WORKDIR /usr/src/app
COPY --chown=node:node package.json pnpm-lock.yaml ./
RUN pnpm install
COPY --chown=node:node ./prisma ./
RUN pnpm prisma generate

# development: used for developing inside docker 
FROM dependencies AS development
WORKDIR /usr/src/app
COPY --chown=node:node . .
RUN pnpm run build

# production: used for production 
FROM node:16-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

RUN npm i -g pnpm

COPY . .
COPY --from=development /usr/src/app/dist ./dist

RUN pnpm prune --prod

CMD ["node", "dist/apps/authentication/main"]