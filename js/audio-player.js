/* ============================================================
   js/audio-player.js — Légamo
   Reproductor flotante con playlist múltiple.

   Para agregar canciones: editar assets/playlist.json
   Formato de cada entrada:
   {
     "titulo":  "Nombre de la canción",
     "album":   "Nombre del álbum",
     "año":     "2021",
     "archivo": "assets/musica/nombre-archivo.mp3"
   }

   Para el futuro reproductor multi-banda, este archivo
   expone window.LegamoPlayer para integración externa.
   La playlist también está disponible en /playlist.json.
   ============================================================ */

(function () {
  'use strict';

  /* ── Estado ─────────────────────────────────────────────── */
  var playlist    = [];
  var indiceActual = 0;
  var reproduciendo = false;

  /* ── Elementos DOM ───────────────────────────────────────── */
  var player, audio, btnPlay, btnPrev, btnNext;
  var bar, timeCurrent, timeTotal;
  var apNombre, apAlbum;
  var playlistBtn, playlistPanel;

  /* ── Iconos SVG inline ───────────────────────────────────── */
  var ICON_PLAY  = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
  var ICON_PAUSE = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
  var ICON_PREV  = '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6V6zm3.5 6L18 18V6L9.5 12z"/></svg>';
  var ICON_NEXT  = '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zm2.5-6 8.5 6V6z"/></svg>';
  var ICON_LIST  = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>';

  /* ── Cargar playlist ─────────────────────────────────────── */
  function cargarPlaylist() {
    fetch('assets/playlist.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        playlist = data;
        if (playlist.length) {
          cargarPista(0, true);
          renderizarPlaylist();
        }
      })
      .catch(function () {
        // Fallback completo — se usa cuando fetch falla (ej: file://)
        // Mantener sincronizado con assets/playlist.json
        playlist = [
          { titulo: 'Jaco',                 album: 'Círculo de Fuego', año: '2026', archivo: 'assets/musica/01-Jaco-.mp3'                },
          { titulo: 'De Facto',             album: 'Círculo de Fuego', año: '2026', archivo: 'assets/musica/02-De-Facto-.mp3'            },
          { titulo: 'Walve cobra su parte', album: 'Círculo de Fuego', año: '2026', archivo: 'assets/musica/03-Walve-cobra-su-parte.mp3' },
          { titulo: 'Tijereta',             album: 'Círculo de Fuego', año: '2026', archivo: 'assets/musica/06-Tijereta.mp3'             },
          { titulo: 'Campanas',             album: 'Círculo de Fuego', año: '2026', archivo: 'assets/musica/07-Campanas-.mp3'            },
          { titulo: 'Verano 2001',          album: 'Coraje',           año: '2021', archivo: 'assets/musica/Verano2001.mp3'              }
        ];
        cargarPista(0, true);
        renderizarPlaylist();
      });
  }

  /* ── Cargar pista ────────────────────────────────────────── */
  function cargarPista(idx, autoPlay) {
    if (!playlist.length) return;
    indiceActual = (idx + playlist.length) % playlist.length;
    var pista = playlist[indiceActual];

    audio.src = pista.archivo;
    apNombre.textContent = pista.titulo;
    apAlbum.textContent  = (pista.album || '') + (pista.año ? ', ' + pista.año : '');
    bar.style.width      = '0%';
    timeCurrent.textContent = '0:00';
    timeTotal.textContent   = '0:00';

    actualizarItemActivo();

    if (autoPlay) {
      audio.play().then(function () {
        reproduciendo = true;
        btnPlay.innerHTML = ICON_PAUSE;
        player.classList.remove('ap--blocked');
      }).catch(function () {
        // El navegador bloqueó el autoplay (política de interacción del usuario).
        // El player queda listo: el usuario solo necesita hacer click en play.
        reproduciendo = false;
        btnPlay.innerHTML = ICON_PLAY;
        player.classList.add('ap--blocked');
      });
    }
  }

  /* ── Formatear tiempo ────────────────────────────────────── */
  function fmtTime(seg) {
    if (isNaN(seg)) return '0:00';
    var m = Math.floor(seg / 60);
    var s = Math.floor(seg % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  /* ── Play / Pause ────────────────────────────────────────── */
  function togglePlay() {
    if (reproduciendo) {
      audio.pause();
      reproduciendo = false;
      btnPlay.innerHTML = ICON_PLAY;
    } else {
      audio.play().then(function () {
        reproduciendo = true;
        btnPlay.innerHTML = ICON_PAUSE;
      }).catch(function () {});
    }
  }

  /* ── Actualizar progreso ─────────────────────────────────── */
  function onTimeUpdate() {
    if (!audio.duration) return;
    var pct = (audio.currentTime / audio.duration) * 100;
    bar.style.width = pct + '%';
    timeCurrent.textContent = fmtTime(audio.currentTime);
  }

  function onLoaded() {
    timeTotal.textContent = fmtTime(audio.duration);
  }

  function onEnded() {
    // Avanzar a la siguiente pista automáticamente
    cargarPista(indiceActual + 1, true);
  }

  /* ── Click en barra de progreso ──────────────────────────── */
  function onProgressClick(e) {
    var rect = e.currentTarget.getBoundingClientRect();
    var x    = e.clientX - rect.left;
    var pct  = x / rect.width;
    if (audio.duration) {
      audio.currentTime = pct * audio.duration;
    }
  }

  /* ── Renderizar lista de reproducción ────────────────────── */
  function renderizarPlaylist() {
    playlistPanel.innerHTML =
      '<p class="ap__playlist-title">Lista de reproducción</p>';

    playlist.forEach(function (pista, idx) {
      var item = document.createElement('div');
      item.className = 'ap__playlist-item' + (idx === indiceActual ? ' active' : '');
      item.dataset.idx = idx;
      item.innerHTML =
        '<span class="ap__pi-num">' + (idx + 1) + '</span>' +
        '<div class="ap__pi-info">' +
          '<p class="ap__pi-name">'  + pista.titulo + '</p>' +
          '<p class="ap__pi-album">' + (pista.album || '') + (pista.año ? ' · ' + pista.año : '') + '</p>' +
        '</div>';

      item.addEventListener('click', function () {
        cargarPista(idx, true);
      });

      playlistPanel.appendChild(item);
    });
  }

  /* ── Marcar ítem activo en la lista ──────────────────────── */
  function actualizarItemActivo() {
    var items = playlistPanel.querySelectorAll('.ap__playlist-item');
    items.forEach(function (item) {
      item.classList.toggle('active', Number(item.dataset.idx) === indiceActual);
    });
  }

  /* ── Toggle panel playlist ───────────────────────────────── */
  function togglePlaylist() {
    playlistPanel.classList.toggle('open');
  }

  /* ── Inicializar ─────────────────────────────────────────── */
  function init() {
    player       = document.getElementById('audio-player');
    audio        = document.getElementById('audio-element');
    btnPlay      = document.getElementById('ap-play');
    btnPrev      = document.getElementById('ap-prev');
    btnNext      = document.getElementById('ap-next');
    bar          = document.getElementById('ap-bar');
    timeCurrent  = document.getElementById('ap-time-cur');
    timeTotal    = document.getElementById('ap-time-tot');
    apNombre     = document.getElementById('ap-nombre');
    apAlbum      = document.getElementById('ap-album');
    playlistBtn  = document.getElementById('ap-playlist-btn');
    playlistPanel = document.getElementById('ap-playlist');

    if (!player || !audio) return;

    // Inyectar iconos
    btnPlay.innerHTML = ICON_PLAY;
    btnPrev.innerHTML = ICON_PREV;
    btnNext.innerHTML = ICON_NEXT;
    playlistBtn.innerHTML = ICON_LIST + ' Playlist';

    // Eventos del audio
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('ended', onEnded);

    // Eventos de controles
    btnPlay.addEventListener('click', togglePlay);
    btnPrev.addEventListener('click', function () { cargarPista(indiceActual - 1, reproduciendo); });
    btnNext.addEventListener('click', function () { cargarPista(indiceActual + 1, reproduciendo); });

    // Barra de progreso clickeable
    document.getElementById('ap-progress').addEventListener('click', onProgressClick);

    // Toggle playlist
    playlistBtn.addEventListener('click', togglePlaylist);

    // Cerrar playlist al click fuera
    document.addEventListener('click', function (e) {
      if (!player.contains(e.target)) {
        playlistPanel.classList.remove('open');
      }
    });

    // Cargar playlist
    cargarPlaylist();

    // Exponer para integración futura multi-banda
    window.LegamoPlayer = {
      playlist:    function () { return playlist; },
      reproducir:  function (idx) { cargarPista(idx, true); },
      pausar:      function () { audio.pause(); reproduciendo = false; btnPlay.innerHTML = ICON_PLAY; },
      getEstado:   function () { return { reproduciendo: reproduciendo, indice: indiceActual }; }
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
