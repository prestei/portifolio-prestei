# Prestei — Portfólio

Site institucional estático com Vite.

## Rodar local

```bash
npm install
npm run dev
```

Abre em [http://localhost:5173](http://localhost:5173).

Não use Live Server / porta 5500 no `index.html` da raiz: os arquivos em `public/` e os imports npm (`gsap`, etc.) só funcionam com o Vite.

## Build de produção

```bash
npm run build
npm run preview
```

A saída vai para a pasta `docs/`. Para pré-visualizar o build estático, use `npm run preview` ou abra `docs/` (não a raiz do projeto).
