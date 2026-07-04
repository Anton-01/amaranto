# Amaranto Morelia — Sitio web

Sitio web estático (sin frameworks ni backend) para **Amaranto Morelia**,
comida casera con entrega a oficinas y domicilio en Morelia, Michoacán.

## Estructura del proyecto

```
amaranto/
├── index.html            → estructura de la página + SEO
├── css/
│   └── styles.css        → todos los estilos
├── js/
│   ├── config.js         → TUS DATOS (el único archivo que editas normalmente)
│   ├── config.example.js → plantilla de ejemplo, sin datos reales
│   └── app.js            → la lógica (no necesitas tocarlo)
├── assets/
│   ├── logo.webp         → logotipo
│   └── menu.webp         → foto del menú del día
├── .gitignore
└── README.md
```

Todo es **100% estático**: se abre con doble clic o se sube tal cual a
cualquier hosting (Netlify, Vercel, GitHub Pages, Hostinger, cPanel, etc.).
No hay que instalar ni compilar nada.

## Cómo editar tu información

Abre **`js/config.js`** y cambia lo que necesites: número de WhatsApp,
redes sociales, dirección, coordenadas del mapa y los mensajes
prellenados de WhatsApp. No hace falta tocar el HTML, el CSS ni `app.js`.

> Si cambias la **dirección o el teléfono**, actualízalos también en el
> bloque `application/ld+json` de `index.html` (son los datos que lee
> Google para el SEO local).

## Protección de tus datos

Es importante ser claro: en un sitio **100% estático** todo lo que el
navegador muestra es visible para quien visita la página. El número de
WhatsApp, las redes y la dirección son, por diseño, **información
pública** (los necesitas para que te encuentren, te contacten y para que
Google te posicione). No existe forma de "ocultarlos" por completo en un
sitio estático, y tampoco conviene: son tu carta de presentación.

Lo que sí hicimos para cuidar tus datos:

1. **Un solo lugar.** Todos tus datos viven en `js/config.js`. No están
   dispersos por el código, así que es difícil dejar uno mal por error.
2. **Enlaces generados en tiempo de ejecución.** El número de WhatsApp y
   los enlaces se arman con JavaScript al cargar la página, no aparecen
   como texto plano `wa.me/...` en el HTML. Esto dificulta que los bots
   que raspan el código HTML recojan tu número automáticamente.
3. **Opción de sacar tus datos del repositorio de git.** Si vas a
   publicar el código en un repositorio (por ejemplo público en GitHub) y
   no quieres que tus datos reales viajen ahí:
   - En `.gitignore`, quita el `#` de la línea `# js/config.js`.
   - Usa `js/config.example.js` como plantilla y mantén tu `js/config.js`
     real sólo en tu computadora y en tu hosting.
   - Así, tu código puede ser público pero tus datos no quedan versionados.

## Publicar

Sube toda la carpeta a tu hosting. El archivo que se abre es `index.html`.
Asegúrate de subir también la carpeta `js/` (incluido `config.js`) y
`assets/`, o la página no cargará tus datos ni las imágenes.
