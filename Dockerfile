FROM node:20-alpine AS builder
WORKDIR /app

ARG NEXT_PUBLIC_SERVER_URL
ENV NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL}

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

RUN echo "NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL}"

RUN npm run build

# --- runner ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
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