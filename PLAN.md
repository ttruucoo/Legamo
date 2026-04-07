# Plan de Trabajo — Rediseño Légamo
**Aprobado:** 2026-04-06  
**Estado:** En ejecución

---

## Objetivo
Rediseñar el sitio web de la banda Légamo con un diseño moderno, editorial y enfocado en el engagement musical y la visibilidad del grupo. El sitio vive en `legamo.proyectoenjambre.cl`.

---

## Estructura de Archivos

```
legamo/
├── index.html              ← Página principal
├── produccion.html         ← Para productores/técnicos
├── gira.html               ← Gira Chile 2026 - Círculo de Fuego
├── send_email.php          ← Conservado sin cambios
│
├── css/
│   ├── main.css            ← Estilos globales + variables
│   ├── index.css           ← Estilos específicos de inicio
│   ├── produccion.css      ← Estilos página producción
│   └── gira.css            ← Estilos página gira
│
├── js/
│   ├── nav.js              ← Navegación sticky + hamburger móvil
│   ├── scroll-reveal.js    ← Animaciones al entrar en viewport (Intersection Observer)
│   ├── lightbox.js         ← Galería con lightbox fullscreen
│   └── audio-player.js     ← Player con control manual (múltiples canciones)
│
└── assets/
    ├── logo.png            ✓ existe
    ├── musica/             ← Canciones alojadas en el sitio
    │   └── Verano2001.mp3  ✓ existe (+ agregar más canciones aquí)
    ├── docs/
    │   ├── dossier-2026.pdf      ✓ existe (renombrar desde "legamo dossier 2026.pdf")
    │   ├── ficha-tecnica.pdf     ← agregar cuando esté disponible
    │   └── escenario.pdf        ✓ existe
    ├── icons/              ✓ existe
    ├── galeria/            ← placeholders → reemplazar con fotos de alta res
    ├── discos/             ← placeholders → reemplazar con carátulas de álbumes
    └── gira/               ← afiches placeholder → reemplazar con afiches oficiales
```

---

## Páginas y Secciones

### `index.html` — Página Principal
| # | Sección | Descripción | Estado |
|---|---|---|---|
| 1 | **Hero** | Logo flotante, tagline, audio player manual (múltiples canciones), nav fade-in, CTA a Gira 2026 | ✅ Completo |
| 2 | **Sobre Légamo** | Layout 60/40: texto historia + foto placeholder, línea de tiempo | ✅ Completo |
| 3 | **Discografía** | Grid álbumes con hover + links Spotify | ✅ Completo |
| 4 | **Galería** | Grid masonry, lightbox fullscreen al hacer click | ✅ Completo |
| 5 | **Shows / Gira** | Preview fechas Círculo de Fuego + CTA a `gira.html` | ✅ Completo |
| 6 | **Contacto** | Form PHP + redes sociales + link a producción | ✅ Completo |

### `produccion.html` — Para Productores y Técnicos
| # | Sección | Descripción | Estado |
|---|---|---|---|
| 1 | **Hero** | Header "Para Productores y Técnicos" | ✅ Completo |
| 2 | **Nav interna sticky** | Dossier / Rider / Escenario / Press Kit | ✅ Completo |
| 3 | **Dossier** | Visor PDF + botón descarga (dossier-2026.pdf) | ✅ Completo |
| 4 | **Ficha Técnica** | Visor PDF + botón descarga (fichatecnica.pdf) | ✅ Completo |
| 5 | **Planta de Escenario** | Visor PDF + botón descarga (escenario.pdf) | ✅ Completo |
| 6 | **Press Kit** | Bio oficial, fotos de prensa (placeholders + descarga), logos, links plataformas | ✅ Completo |

### `gira.html` — Gira Chile 2026: Círculo de Fuego
| # | Sección | Descripción | Estado |
|---|---|---|---|
| 1 | **Hero dramático** | Título "Círculo de Fuego", estética de gira, año 2026 | ✅ Completo |
| 2 | **Fechas** | Cards por fecha: ciudad, venue, fecha, link entradas | ✅ Completo |
| 3 | **Afiches** | Grid de afiches descargables (placeholders → reemplazar) | ✅ Completo |
| 4 | **CTA** | Link a inicio + contacto | ✅ Completo |

---

## Estética y Tecnología

### Stack
- HTML5 + CSS3 puro (custom properties, Grid, Flexbox)
- Vanilla JS moderno — sin frameworks
- PHP conservado solo para `send_email.php`
- Sin dependencias externas excepto Google Fonts

### Tipografía
- **Títulos de impacto:** Bebas Neue (Google Fonts)
- **Body y navegación:** Barlow Condensed (Google Fonts, weight 300-600)

### Paleta de Colores
```css
--color-bg:       #000000
--color-surface:  #0a0a0a
--color-accent:   #a6ff00   /* verde lima — uso estratégico */
--color-accent-2: #caff68   /* hover */
--color-text:     #ffffff
--color-muted:    #888888
--color-border:   #222222
```

### Efectos Visuales
- Grain/ruido CSS (pseudo-elemento, sin imagen externa)
- Intersection Observer para fade-in/slide al scrollear
- Nav sticky transparente → sólida al scrollear
- Hamburger en móvil
- Scroll libre y fluido (sin snap forzado)
- Glitch leve en hover del logo (CSS animation)

---

## Audio Player
- Múltiples canciones alojadas en `assets/musica/`
- Player con controles: play/pause, anterior/siguiente, barra de progreso, volumen
- Las canciones se declaran en un array JS — fácilmente extensible
- Arquitectura preparada para futura integración en un reproductor multi-banda (opcional, fuera del alcance actual)
- Para el reproductor multi-banda futuro: cada banda tendrá sus canciones en su propio dominio/subdominio y se expondrán mediante un JSON de playlist estático (`playlist.json`) que un reproductor externo podrá consumir

---

## Hosting
- Alojado en `legamo.proyectoenjambre.cl` (subdominio existente)
- Servidor con PHP disponible — formulario de contacto funcional
- Posible migración futura a hosting estático (Netlify/GitHub Pages) con Formspree para el formulario — no urgente

---

## Assets Pendientes (reemplazar placeholders)
- [ ] Fotos de prensa alta resolución → `assets/galeria/`
- [ ] Carátulas de álbumes → `assets/discos/`
- [ ] Ficha técnica / rider → `assets/docs/ficha-tecnica.pdf`
- [ ] Afiches Gira Círculo de Fuego → `assets/gira/`
- [ ] Canciones adicionales → `assets/musica/`

---

## Orden de Ejecución
1. `css/main.css` — variables globales, reset, tipografía, componentes reutilizables ✅
2. `index.html` + `css/index.css` — página principal completa ✅
3. `produccion.html` + `css/produccion.css` — página de producción ✅
4. `gira.html` + `css/gira.css` — página de gira ✅
5. `js/nav.js` — navegación sticky + hamburger ✅
6. `js/scroll-reveal.js` — animaciones de entrada ✅
7. `js/lightbox.js` — galería con lightbox ✅
8. `js/audio-player.js` — reproductor con múltiples canciones ✅

## Pendientes

### 🔧 Prioridad alta
- **Reproductor persistente entre páginas** — al navegar a gira.html o produccion.html la música se detiene.
  Solución planificada: guardar estado (pista + timestamp) en `sessionStorage` al salir, recuperarlo al cargar el player en la nueva página. Requiere modificar `js/audio-player.js` y agregar el player HTML en `produccion.html` y `gira.html`.

### 🔒 Página management (oculta — solo acceso por URL directa)
- URL: `legamo.proyectoenjambre.cl/management.html` (sin link desde el sitio)
- Propósito: dashboard de actividad para uso interno — redes sociales, Spotify, YouTube
- Ver análisis de viabilidad en sección correspondiente más abajo

---

## Análisis: Página Management

### ¿Qué es posible sin backend?
| Plataforma | Dato público disponible | Método |
|---|---|---|
| Spotify | Seguidores, oyentes mensuales | Spotify Web API (requiere OAuth) |
| YouTube | Suscriptores, vistas totales | YouTube Data API v3 (requiere API key) |
| Instagram | No disponible sin app aprobada por Meta | — |

### Opciones prácticas

**Opción A — Links centralizados (simple, sin código extra)**
Una página que agrupa los links directos a los dashboards nativos de cada plataforma:
- Spotify for Artists
- YouTube Studio
- Meta Business Suite (Instagram)
- Google Analytics (si está instalado)
Útil como "panel de control" pero sin datos integrados.

**Opción B — Widgets estáticos con actualización manual**
Una página con tarjetas de métricas que el usuario actualiza manualmente. Sin APIs, sin autenticación. Editar el HTML para actualizar los números.

**Opción C — Integración real con APIs (requiere desarrollo adicional)**
Requiere un pequeño backend (PHP ya disponible en el servidor) o un servicio tipo Netlify Functions para manejar los tokens OAuth de Spotify y YouTube Data API. Los datos se actualizarían automáticamente cada vez que se carga la página.
- Spotify Web API: oyentes mensuales, seguidores, popularidad por track
- YouTube Data API v3: vistas, suscriptores, videos más vistos
- Tiempo estimado: sesión adicional de trabajo

**Recomendación**: arrancar con Opción A+B (rápido, sin dependencias) y evolucionar a Opción C en una iteración siguiente.

### Assets pendientes (sitio principal)
- [ ] Video de fondo hero → `assets/video/legamo-bg.mp4`
- [ ] Fotos de prensa para press kit → `assets/prensa/`
- [ ] Afiches gira → `assets/gira/`
- [ ] Fechas y links de entradas → editar `gira.html`
- [ ] Canciones nuevas → agregar a `assets/musica/` + `playlist.json` + fallback en `audio-player.js`
