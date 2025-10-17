FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache libc6-compat python3 make g++

ARG NEXT_PUBLIC_SERVER_URL
ENV NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL}

COPY package.json package-lock.json* ./

RUN if [ -f package-lock.json ]; then \
      npm ci --no-audit --no-fund; \
    else \
      npm i --no-audit --no-fund; \
    fi

COPY . .
RUN npm run build

# --- runner ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ARG NEXT_PUBLIC_SERVER_URL
ENV NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL}

COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.* ./
COPY --from=builder /app/src/i18n ./src/i18n
COPY --from=builder /app/messages ./messages

ENV PORT=80
EXPOSE 80
CMD ["npm", "start"]