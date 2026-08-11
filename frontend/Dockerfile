# syntax=docker/dockerfile:1

# NOT: frontend/package.json su an bos. Bu imaj, Next.js projesi kurulup
# next.config.* icinde `output: "standalone"` acildiktan sonra build olur.
# O ana kadar compose'da `frontend` profili altinda durur, varsayilan
# `docker compose up` bu servisi ayaga kaldirmaya calismaz.

# ---------- Bagimliliklar ----------
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
# Lock dosyasi varsa ondan kur (tekrarlanabilir); yoksa ilk kurulumda uret.
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# ---------- Build ----------
FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---------- Runtime ----------
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -S nodejs -g 1001 && adduser -S nextjs -u 1001 -G nodejs

# standalone ciktisi node_modules'un sadece kullanilan kismini tasir:
# imaj ~1 GB yerine ~200 MB kalir.
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000
ENV PORT=3000
# 0.0.0.0'a baglanmazsa konteyner disindan erisilemez.
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
