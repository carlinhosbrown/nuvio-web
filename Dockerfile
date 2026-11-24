# Nuvio Web: sirve la app en el navegador junto al servicio local de streaming
# (EngineFS) que permite reproducir torrents/P2P.
FROM node:22-bookworm-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts --no-audit --no-fund
COPY . .
# Copia local.properties (claves de TMDB, Trakt, Supabase...) antes de construir.
RUN npm run build
ENV HOST=0.0.0.0 PORT=4173
EXPOSE 4173 2710
CMD ["node", "scripts/serve.mjs"]
