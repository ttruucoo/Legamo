# Plan de Trabajo — Légamo Web
**Inicio:** 2026-04-06 | **Última actualización:** 2026-04-09
**Estado:** En producción — desarrollo continuo

---

## Sitio en producción
- **URL:** legamo.proyectoenjambre.cl
- **Repo:** https://github.com/ttruucoo/Legamo (rama master)
- **Hosting:** proyectoenjambre.cl — servidor con PHP, subdominio legamo

---

## Estructura de archivos actual

```
legamo/
├── index.html              ✅ Página principal
├── produccion.html         ✅ Para productores/técnicos
├── gira.html               ✅ Gira Chile 2026 - Círculo de Fuego
├── alencuentro.html        ✅ Historia "Al encuentro de sí mismo"
├── management.html         ✅ Dashboard interno (solo URL directa)
├── send_email.php          ✅ Formulario de contacto
│
├── css/
│   ├── main.css            ✅ Estilos globales + variables
│   ├── index.css           ✅ Estilos página principal + audio player
│   ├── produccion.css      ✅ Estilos página producción
│   ├── gira.css            ✅ Estilos página gira
│   ├── alencuentro.css     ✅ Estilos página historia
│   └── management.css      ✅ Estilos dashboard
│
├── js/
│   ├── nav.js              ✅ Navegación sticky + hamburger móvil
│   ├── scroll-reveal.js    ✅ Animaciones al entrar en viewport
│   ├── lightbox.js         ✅ Galería con lightbox fullscreen
│   └── audio-player.js     ✅ Player con múltiples canciones
│
├── api/
│   ├── stats.php           ✅ Backend APIs (YouTube, Spotify, Instagram) + caché 1h
│   ├── config.php          ✅ Credenciales API — NO en GitHub (subir manualmente)
│   └── config.example.php  ✅ Plantilla de credenciales (en GitHub)
│
└── assets/
    ├── logo.png            ✅
    ├── musica/             ✅ 5 MP3 (Jaco, De Facto, Walve, Tijereta, Campanas, Verano2001)
    ├── playlist.json       ✅ 6 canciones declaradas
    ├── docs/               ✅ dossier-2026.pdf, fichatecnica.pdf, escenario.pdf
    ├── icons/              ✅ SVG redes sociales
    ├── galeria/            ✅ 7 fotos (1.jpg–7.jpg + banda-prensa.jpg)
    ├── discos/             ✅ 7 carátulas de álbumes
    ├── alencuentro/        ✅ borde.jpg, jacoipse.jpeg, historia.txt, PDF
    └── gira/               ⏳ afiches placeholder — pendiente afiches oficiales
```

---

## Estado de páginas

### `index.html` ✅
Hero con video, bio, discografía (7 álbumes), galería lightbox, shows, contacto PHP, audio player fijo.

### `produccion.html` ✅
Dossier, ficha técnica, planta de escenario (visores PDF), press kit con fotos y logos.

### `gira.html` ✅
8 fechas Círculo de Fuego 2026, grid de afiches, CTA.
Venues por confirmar: Concepción (22 MAY), Iquique (05 JUN), Antofagasta (06 JUN).

### `alencuentro.html` ✅
Historia "Al encuentro de sí mismo" — fondo jacoipse.jpeg, bordes borde.jpg, texto dorado #f0c040, audio player integrado.

### `management.html` ✅
Dashboard interno. Acceso solo por URL directa (no está en el nav).
- YouTube ✅ — suscriptores, vistas totales, últimos 6 videos
- Instagram ✅ — seguidores, alcance 7d, impresiones, posts
- Spotify ⚠️ — requiere Premium en la cuenta developer.spotify.com (pendiente)
- Google Analytics ✅ — link directo al dashboard GA (ID: G-T94X42T9TQ)
- Exportar Excel (CSV) ✅
- Exportar PDF ✅

---

## APIs y credenciales

| Servicio | Estado | Notas |
|---|---|---|
| YouTube Data API v3 | ✅ | Channel ID: UCKMkjHHpyYCmc8BjUi99i6Q |
| Spotify Web API | ⚠️ | Requiere Premium — cuenta actual es Free |
| Instagram Graph API | ✅ | Token expira ~2026-06-08 — renovar en developers.facebook.com |
| Google Analytics | ✅ | G-T94X42T9TQ — instalado en las 4 páginas |

**Renovar token Instagram (~8 junio 2026):**
1. Ir a developers.facebook.com/tools/explorer
2. Generar token con: `pages_show_list`, `pages_read_engagement`, `instagram_basic`, `instagram_manage_insights`
3. Pasar token a Claude → genera token 60 días → actualizar `api/config.php` en servidor

---

## Estética y stack

- **Stack:** HTML5 + CSS3 puro + Vanilla JS + PHP (solo formulario y API backend)
- **Tipografía:** Bebas Neue (títulos) + Barlow Condensed (body, 300–600)
- **Paleta:** `--bg: #000` / `--accent: #a6ff00` / `--text: #fff` / `--muted: #555`
- **Efectos:** grain CSS, scroll-reveal, nav sticky, lightbox, glitch logo hover

---

## Pendientes — contenido

- [ ] Venues por confirmar: Concepción (22 MAY), Iquique (05 JUN), Antofagasta (06 JUN)
- [ ] Links de entradas para todas las fechas de la gira
- [ ] Fotos de prensa alta resolución → `assets/prensa/`
- [ ] Afiches oficiales por ciudad → `assets/gira/`
- [ ] Canciones adicionales → `assets/musica/` + `playlist.json` + fallback en `audio-player.js`

## Pendientes — desarrollo

- [ ] **Spotify dashboard** — resolver cuando se tenga cuenta Premium en developer.spotify.com
- [ ] **Reproductor persistente entre páginas** — sessionStorage para conservar pista + timestamp al navegar
- [ ] **Formulario de contacto** — verificar en producción con tráfico real
