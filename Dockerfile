FROM node:24-alpine AS builder
WORKDIR /app

RUN corepack enable
RUN corepack prepare pnpm@10.23.0 --activate

ARG SERVER_URL
ARG SENTRY_DSN
ARG SENTRY_AUTH_TOKEN
ARG SENTRY_ORG
ARG SENTRY_PROJECT
ENV NEXT_PUBLIC_SERVER_URL=${SERVER_URL}
ENV SERVER_URL=${SERVER_URL}
ENV NEXT_PUBLIC_SENTRY_DSN=${SENTRY_DSN}
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}
ENV SENTRY_ORG=${SENTRY_ORG}
ENV SENTRY_PROJECT=${SENTRY_PROJECT}

COPY pnpm-lock.yaml package.json ./

RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

COPY . .

# BUILD_SHA 는 매 커밋마다 변경되므로 pnpm install 레이어 뒤로 배치 — 의존성 캐시 보존.
# 빌드 직전에 ARG/ENV 정의해 next build 만 영향받게 함.
ARG BUILD_SHA
ENV NEXT_PUBLIC_BUILD_SHA=${BUILD_SHA}

RUN --mount=type=cache,target=/app/.next/cache \
    pnpm build
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
