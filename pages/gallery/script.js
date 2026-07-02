(() => {
  const view = document.body.dataset.view || "photos";
  const albums = Array.isArray(window.gallery)
    ? [...window.gallery].sort((a, b) => Number(b.id || 0) - Number(a.id || 0))
    : Array.isArray(window.OUR_MUSEUM?.gallery)
      ? [...window.OUR_MUSEUM.gallery].sort(
          (a, b) => Number(b.id || 0) - Number(a.id || 0),
        )
      : [];

  const mediaWall = document.getElementById("mediaWall");
  const browseBtn = document.getElementById("browseBtn");
  const page = document.querySelector(".gallery-page");

  const musicToggleBtn = document.getElementById("musicToggleBtn");
  const musicBackdrop = document.getElementById("musicBackdrop");
  const musicSheet = document.getElementById("musicSheet");
  const musicCloseBtn = document.getElementById("musicCloseBtn");
  const musicPlayBtn = document.getElementById("musicPlayBtn");
  const musicVolume = document.getElementById("musicVolume");
  const musicStatus = document.getElementById("musicStatus");
  const musicTime = document.getElementById("musicTime");
  const musicFill = document.getElementById("musicProgressFill");
  const musicTitle = document.getElementById("musicTitle");
  const audio =
    window.MuseumMusic?.audio || document.getElementById("museum-player");

  const PLACEHOLDER_IMAGE =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">
        <defs>
          <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="#f6e9ef"/>
            <stop offset="55%" stop-color="#d8c0e8"/>
            <stop offset="100%" stop-color="#c6d7ef"/>
          </linearGradient>
        </defs>
        <rect width="400" height="500" rx="36" fill="url(#g)"/>
        <rect x="36" y="40" width="328" height="420" rx="30" fill="rgba(255,255,255,0.25)"/>
        <circle cx="132" cy="158" r="22" fill="rgba(255,255,255,0.55)"/>
        <path d="M72 338l70-78 54 54 48-64 84 74v28H72z" fill="rgba(255,255,255,0.42)"/>
      </svg>
    `);

  const tileClasses = [
    "tile--hero",
    "tile--square",
    "tile--tall",
    "tile--square",
    "tile--wide",
    "tile--square",
  ];

  const buildDetailHref = (album, index = 0, media = "photo") => {
    const id = album?.id ?? album?.folder ?? "";
    return `./detail/index.html?album=${encodeURIComponent(id)}&photo=${encodeURIComponent(index)}&media=${encodeURIComponent(media)}`;
  };

  const makeCandidates = (src) => {
    const clean = String(src || "")
      .trim()
      .split("?")[0]
      .split("#")[0];
    const out = [];
    if (clean) out.push(clean);

    if (/\.jpg$/i.test(clean)) {
      out.push(clean.replace(/\.jpg$/i, ".jpeg"));
    } else if (/\.jpeg$/i.test(clean)) {
      out.push(clean.replace(/\.jpeg$/i, ".jpg"));
    } else if (/\.(jpe?g)$/i.test(clean)) {
      out.push(clean.replace(/\.(jpe?g)$/i, ".jpg"));
      out.push(clean.replace(/\.(jpe?g)$/i, ".jpeg"));
    }

    return [...new Set(out)].filter(Boolean);
  };

  const getItems = () => {
    if (view === "videos") {
      return albums.flatMap((album) =>
        (album.videos || []).map((src, index) => ({
          album,
          src,
          index,
          poster: Array.isArray(album.videoPosters)
            ? album.videoPosters[index]
            : album.cover,
        })),
      );
    }

    return albums.flatMap((album) =>
      (album.photos || []).map((src, index) => ({
        album,
        src,
        index,
      })),
    );
  };

  const shuffle = (list) => [...list].sort(() => Math.random() - 0.5);

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const syncMusicUI = () => {
    if (!audio) return;

    const current = Number(audio.currentTime || 0);
    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;

    if (musicTime) {
      musicTime.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
    }

    if (musicFill) {
      musicFill.style.width = duration
        ? `${Math.min(100, (current / duration) * 100)}%`
        : "0%";
    }

    if (musicStatus) {
      musicStatus.textContent = audio.paused ? "tap play to start" : "playing";
    }

    if (musicPlayBtn) {
      musicPlayBtn.textContent = audio.paused ? "Play" : "Pause";
    }

    if (musicVolume) {
      musicVolume.value = String(audio.volume ?? 0.65);
    }

    if (musicTitle) {
      musicTitle.textContent = "museum.mp3";
    }
  };

  const openSheet = () => {
    if (!musicSheet || !musicBackdrop) return;
    musicSheet.classList.add("is-open");
    musicBackdrop.hidden = false;
    requestAnimationFrame(() => musicBackdrop.classList.add("is-visible"));
    syncMusicUI();
  };

  const closeSheet = () => {
    if (!musicSheet || !musicBackdrop) return;
    musicSheet.classList.remove("is-open");
    musicBackdrop.classList.remove("is-visible");
    window.setTimeout(() => {
      musicBackdrop.hidden = true;
    }, 180);
  };

  const toggleSheet = () => {
    if (musicSheet?.classList.contains("is-open")) closeSheet();
    else openSheet();
  };

  const makeImage = (src, alt = "") => {
    const img = document.createElement("img");
    img.alt = alt;
    img.loading = "lazy";
    img.decoding = "async";
    img.src = PLACEHOLDER_IMAGE;

    const candidates = makeCandidates(src);
    let pointer = 0;

    const next = () => {
      const candidate = candidates[pointer++];
      img.src = candidate || PLACEHOLDER_IMAGE;
    };

    img.addEventListener("error", () => {
      if (pointer < candidates.length) next();
      else img.src = PLACEHOLDER_IMAGE;
    });

    next();
    return img;
  };

  const makeTile = (item, index) => {
    const label = item.album?.title || "Memory";
    const href = buildDetailHref(
      item.album,
      item.index || 0,
      view === "videos" ? "video" : "photo",
    );

    const tile = document.createElement("a");
    tile.className = `media-tile ${tileClasses[index % tileClasses.length]}`;
    tile.href = href;
    tile.setAttribute("aria-label", label);

    if (view === "videos") {
      const img = makeImage(item.poster || item.src, label);
      const badge = document.createElement("div");
      badge.className = "play-badge";
      badge.textContent = "▶";

      const caption = document.createElement("div");
      caption.className = "media-label";
      caption.textContent = item.album?.subtitle || item.album?.date || label;

      tile.appendChild(img);
      tile.appendChild(badge);
      tile.appendChild(caption);
      return tile;
    }

    const img = makeImage(item.src, label);
    tile.appendChild(img);
    return tile;
  };

  const renderWall = () => {
    if (!mediaWall) return;

    const items = getItems();
    const list = items.length ? shuffle(items) : [];

    mediaWall.innerHTML = "";

    if (!list.length) {
      const empty = document.createElement("div");
      empty.className = "media-empty";
      empty.textContent =
        view === "videos"
          ? "Belum ada video yang ditautkan ke gallery.js. Tambah array videos di album yang mau dipakai, nanti page ini langsung hidup."
          : "Belum ada foto yang dimuat.";
      mediaWall.appendChild(empty);
      return;
    }

    const frag = document.createDocumentFragment();
    list.slice(0, 24).forEach((item, index) => {
      frag.appendChild(makeTile(item, index));
    });

    mediaWall.appendChild(frag);
  };

  browseBtn?.addEventListener("click", () => {
    mediaWall?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  const leaveTo = (url) => {
    if (page) page.classList.add("is-leaving");
    window.setTimeout(() => {
      window.location.href = url;
    }, 180);
  };

  document.querySelectorAll('[data-view="collections"]').forEach((el) => {
    el.addEventListener("click", (event) => {
      event.preventDefault();
      leaveTo("./album/index.html");
    });
  });

  musicToggleBtn?.addEventListener("click", (event) => {
    event.preventDefault();
    toggleSheet();
  });

  musicCloseBtn?.addEventListener("click", closeSheet);
  musicBackdrop?.addEventListener("click", closeSheet);
  musicPlayBtn?.addEventListener("click", async () => {
    if (!window.MuseumMusic || !audio) return;

    if (audio.paused) {
      await window.MuseumMusic.enable();
    } else {
      window.MuseumMusic.pause();
    }

    syncMusicUI();
  });

  musicVolume?.addEventListener("input", () => {
    if (!window.MuseumMusic) return;
    window.MuseumMusic.setVolume(Number(musicVolume.value));
    syncMusicUI();
  });

  audio?.addEventListener("timeupdate", syncMusicUI);
  audio?.addEventListener("play", syncMusicUI);
  audio?.addEventListener("pause", syncMusicUI);
  audio?.addEventListener("loadedmetadata", syncMusicUI);
  audio?.addEventListener("volumechange", syncMusicUI);
  window.addEventListener("pageshow", syncMusicUI);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeSheet();
  });

  let topStart = null;

  document.addEventListener(
    "pointerdown",
    (event) => {
      if (event.clientY < 110) {
        topStart = { x: event.clientX, y: event.clientY };
      } else {
        topStart = null;
      }
    },
    { passive: true },
  );

  document.addEventListener(
    "pointerup",
    (event) => {
      if (!topStart) return;
      const dy = event.clientY - topStart.y;
      const dx = event.clientX - topStart.x;

      if (dy > 70 && Math.abs(dy) > Math.abs(dx)) {
        openSheet();
      }

      topStart = null;
    },
    { passive: true },
  );

  renderWall();
  syncMusicUI();
})();
