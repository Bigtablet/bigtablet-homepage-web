FROM node:24-alpine AS builder
WORKDIR /app

RUN corepack enable
RUN corepack prepare pnpm@10.23.0 --activate

ARG NEXT_PUBLIC_SERVER_URL
ENV NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL}

COPY pnpm-lock.yaml package.json ./

RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

COPY . .

RUN pnpm build
RUN cp -r public .next/standalone/public

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/package.json ./
COPY --from=builder /app/src/i18n ./src/i18n
COPY --from=builder /app/messages ./messages

ENV PORT=80
EXPOSE 80
CMD ["node", "server.js"]