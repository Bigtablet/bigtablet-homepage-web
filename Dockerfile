FROM node:22-alpine AS builder
WORKDIR /app

RUN corepack enable
RUN corepack prepare pnpm@10.20.0 --activate

ARG NEXT_PUBLIC_SERVER_URL
ENV NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL}

COPY pnpm-lock.yaml package.json ./

RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN corepack enable
RUN corepack prepare pnpm@10.20.0 --activate

COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.* ./

COPY --from=builder /app/src/i18n ./src/i18n
COPY --from=builder /app/messages ./messages

ENV PORT=80
EXPOSE 80
CMD ["pnpm", "start"]