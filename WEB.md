# Nuvio Web (fork para navegador)

Fork de [NuvioMedia/NuvioWeb](https://github.com/NuvioMedia/NuvioWeb) (Nuvio TV para Tizen/webOS),
publicado bajo la misma licencia GPL-3.0. El objetivo es ejecutar Nuvio como una página web normal.

## Ejecutar en local

```bash
cp local.example.properties local.properties   # rellena TMDB_API_KEY, etc.
npm install
npm run build
npm run serve        # http://localhost:4173
```

`npm run serve` sirve la app y arranca el servidor de streaming (EngineFS, puerto interno 2710),
que es el que reproduce torrents/P2P. El navegador no habla con el puerto 2710: todo pasa por
`/engine/*` en el mismo dominio que la web, así que funciona desde cualquier equipo o móvil que
abra la página, no solo desde la máquina donde corre el servidor.

Para reproducir torrents, activa **Ajustes → Reproducción → P2P** en la app. Sin el servidor
solo funcionan streams HTTP y debrid.

## Docker

```bash
docker build -t nuvio-web .
docker run -p 4173:4173 nuvio-web
```

Si la publicas en Internet, ponla detrás de un proxy con HTTPS (Caddy, Nginx, Traefik) y, si es
para uso privado, con contraseña: cualquiera que abra la web puede usar tu servidor de torrents.
