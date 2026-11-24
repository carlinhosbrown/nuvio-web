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

`npm run serve` sirve la app y arranca el servicio de streaming local (puerto 2710),
que es el que reproduce torrents/P2P. Sin ese servicio solo funcionan streams HTTP y debrid.

## Docker

```bash
docker build -t nuvio-web .
docker run -p 4173:4173 -p 2710:2710 nuvio-web
```
