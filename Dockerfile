# ───── Stage 1: Build ──────────────────────────────────────────
FROM node:20 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install            # or:  npm ci --production

COPY . .
RUN npm run build          # creates /app/dist via Vite

# ───── Stage 2: Serve ─────────────────────────────────────────
FROM nginx:alpine

# copy the built static assets
COPY --from=builder /app/dist /usr/share/nginx/html

# custom Nginx config → enables SPA fallback for React-router
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
