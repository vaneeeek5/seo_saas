FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY apps/web/package*.json ./apps/web/

RUN npm ci

COPY packages/shared ./packages/shared
COPY apps/web ./apps/web

RUN npm run build --workspace=@seo-saas/shared
RUN npm run build --workspace=@seo-saas/web

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/web ./apps/web

EXPOSE 3000

CMD ["npx", "next", "start", "apps/web", "-p", "3000", "-H", "0.0.0.0"]
