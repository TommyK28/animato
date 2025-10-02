# Animato Project

Frontend startovací projekt podle zadaných požadavků.  
Používá **Vite** pro vývoj a **Gulp** pro produkční build SCSS → CSS.  
Stylování je psané v **SCSS** s metodikou **BEM**.

---

## 📦 Požadavky

-   Node.js 18+ (doporučeno 20+)
-   npm 9+ nebo novější

---

## 🚀 Instalace

```bash
npm install
```

---

## 🛠 Vývoj

Spusť dev server:

```bash
npm run dev
```

-   Vite běží na [http://localhost:5173](http://localhost:5173)
-   SCSS se importuje přímo v `main.js` (`import './scss/main.scss'`)

---

## 🏗 Build

Produkční build (CSS přes Gulp + bundling přes Vite):

```bash
npm run build
```

Pouze kompilace SCSS do `public/css`:

```bash
npm run build:css
```

Náhled buildu:

```bash
npm run preview
```
