(() => {
  const albums = Array.isArray(window.gallery)
    ? [...window.gallery].sort((a, b) => Number(b.id || 0) - Number(a.id || 0))
    : Array.isArray(window.OUR_MUSEUM?.gallery)
      ? [...window.OUR_MUSEUM.gallery].sort(
          (a, b) => Number(b.id || 0) - Number(a.id || 0),
        )
      : [];

  const galleryPage = document.querySelector(".gallery-page");
  const photoWall = document.getElementById("photoWall");
  const collectionStrip = document.getElementById("collectionStrip");
  const todayMemory = document.getElementById("todayMemory");
  const galleryStats = document.getElementById("galleryStats");
  const memoryPreview = document.getElementById("memoryPreview");
  const memoryBadge = document.getElementById("memoryBadge");
  const browseBtn = document.getElementById("browseBtn");

  const PLACEHOLDER_IMAGE =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
        <defs>
          <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="#f6e9ef"/>
            <stop offset="55%" stop-color="#d8c0e8"/>
            <stop offset="100%" stop-color="#c6d7ef"/>
          </linearGradient>
        </defs>
        <rect width="400" height="400" rx="36" fill="url(#g)"/>
        <rect x="40" y="42" width="320" height="316" rx="30" fill="rgba(255,255,255,0.28)"/>
        <circle cx="132" cy="142" r="22" fill="rgba(255,255,255,0.6)"/>
        <path d="M76 286l64-70 46 46 46-58 92 82v24H76z" fill="rgba(255,255,255,0.42)"/>
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

  const formatMeta = (album) => {
    const bits = [];
    if (album?.date) bits.push(album.date);
    if (album?.location) bits.push(album.location);
    if (album?.mood) bits.push(album.mood);
    return bits;
  };

  const buildDetailHref = (album, photoIndex = 0) => {
    const id = album?.id ?? album?.folder ?? "";
    return `./detail/index.html?album=${encodeURIComponent(id)}&photo=${encodeURIComponent(
      photoIndex,
    )}`;
  };

  const getAllPhotos = () =>
    albums.flatMap((album) =>
      (album.photos || []).map((src, index) => ({
        album,
        src,
        index,
      })),
    );

  const shuffle = (list) => [...list].sort(() => Math.random() - 0.5);

  const createSafeImage = (src, alt = "") => {
    const img = document.createElement("img");
    img.alt = alt;
    img.loading = "lazy";
    img.decoding = "async";

    const tried = new Set();

    const candidates = (() => {
      const out = [];
      if (typeof src === "string" && src.trim()) out.push(src.trim());

      if (typeof src === "string") {
        const clean = src.split("?")[0].split("#")[0];

        if (/\.jpg$/i.test(clean)) {
          out.push(clean.replace(/\.jpg$/i, ".jpeg"));
        } else if (/\.jpeg$/i.test(clean)) {
          out.push(clean.replace(/\.jpeg$/i, ".jpg"));
        } else {
          out.push(clean.replace(/\.(jpe?g)$/i, ".jpg"));
          out.push(clean.replace(/\.(jpe?g)$/i, ".jpeg"));
        }
      }

      return [...new Set(out)].filter(Boolean);
    })();

    let index = 0;

    const loadNext = () => {
      const next = candidates[index++];
      if (next && !tried.has(next)) {
        tried.add(next);
        img.src = next;
      } else {
        img.src = PLACEHOLDER_IMAGE;
      }
    };

    img.addEventListener("error", () => {
      loadNext();
    });

    loadNext();
    return img;
  };

  const renderStats = () => {
    if (!galleryStats) return;

    const photoCount = getAllPhotos().length;
    galleryStats.innerHTML = `
      <span>${albums.length} collections</span>
      <span>•</span>
      <span>${photoCount} memories</span>
    `;
  };

  const renderPreview = () => {
    if (!memoryPreview) return;

    const pool = getAllPhotos().map((item) => item.src);
    const unique = [...new Set(pool)];
    const fallback = [
      "/assets/images/day-uno/uno1.jpeg",
      "/assets/images/day-uno/uno4.jpeg",
      "/assets/images/day-uno/uno8.jpeg",
    ];

    const picks = shuffle(unique).slice(0, 3);
    const photos = (picks.length >= 3 ? picks : fallback).slice(0, 3);

    memoryPreview.innerHTML = "";

    photos.forEach((src, i) => {
      const img = createSafeImage(src, "");
      img.className = [
        "memory-photo",
        i === 0
          ? "memory-photo-main"
          : i === 1
            ? "memory-photo-secondary"
            : "memory-photo-tertiary",
      ].join(" ");
      memoryPreview.appendChild(img);
    });

    const badgeValue = Math.max(unique.length - 3, 20);

    if (memoryBadge) {
      memoryBadge.textContent = `+${badgeValue}`;
    } else {
      const badge = document.createElement("div");
      badge.className = "memory-badge";
      badge.textContent = `+${badgeValue}`;
      memoryPreview.appendChild(badge);
    }
  };

  const renderToday = () => {
    if (!todayMemory) return;

    const album = albums[0];

    if (!album) {
      todayMemory.innerHTML = `
        <div class="today-copy" style="grid-column: 1 / -1;">
          <p class="today-kicker">Today Memory</p>
          <h4>Belum ada memory yang dimuat.</h4>
          <p>Masukin data album di shared/data/gallery.js dulu.</p>
        </div>
      `;
      return;
    }

    const cover = album.cover || album.photos?.[0] || "";
    const meta = formatMeta(album);

    todayMemory.innerHTML = `
      <a class="today-media" href="${buildDetailHref(album, 0)}" aria-label="${album.title || "Featured memory"}">
        <img src="${cover}" alt="${album.title || "Featured memory"}" loading="lazy" decoding="async" />
      </a>

      <div class="today-copy">
        <p class="today-kicker">Today Memory</p>
        <h4>${album.title || "Untitled"}</h4>
        <p>${album.story || album.subtitle || ""}</p>

        <div class="today-meta">
          ${meta.map((item) => `<span>${item}</span>`).join("<span>•</span>")}
        </div>
      </div>
    `;
  };

  const tileSizeClass = (index) => tileClasses[index % tileClasses.length];

  const renderWall = () => {
    if (!photoWall) return;

    const photos = getAllPhotos();
    const list = photos.length
      ? shuffle(photos)
      : albums.flatMap((album) => ({
          album,
          src: album.cover || "",
          index: 0,
        }));

    photoWall.innerHTML = "";

    list.slice(0, 24).forEach((item, index) => {
      const label = item.album?.title || "Memory";
      const href = buildDetailHref(item.album, item.index || 0);

      const tile = document.createElement("a");
      tile.className = `photo-tile ${tileSizeClass(index)}`;
      tile.href = href;
      tile.setAttribute("aria-label", label);

      const img = createSafeImage(item.src, label);
      tile.appendChild(img);

      photoWall.appendChild(tile);
    });
  };

  const renderCollections = () => {
    if (!collectionStrip) return;

    collectionStrip.innerHTML = "";

    albums.slice(0, 8).forEach((album) => {
      const count = Array.isArray(album.photos) ? album.photos.length : 0;
      const meta = [album.date, album.location].filter(Boolean).join(" • ");

      const card = document.createElement("a");
      card.className = "collection-card";
      card.href = buildDetailHref(album, 0);

      const cover = document.createElement("div");
      cover.className = "collection-cover";
      cover.style.backgroundImage = `url('${album.cover || album.photos?.[0] || ""}')`;

      const copy = document.createElement("div");
      copy.className = "collection-copy";
      copy.innerHTML = `
        <strong>${album.title || "Untitled"}</strong>
        <small>${count} memories${meta ? `<br>${meta}` : ""}</small>
      `;

      card.appendChild(cover);
      card.appendChild(copy);
      collectionStrip.appendChild(card);
    });
  };

  const openPhotoWall = () => {
    document.getElementById("photoWall")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  browseBtn?.addEventListener("click", openPhotoWall);

  if (galleryPage) {
    galleryPage.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      const routeButton = target.closest("[data-route='collections']");
      if (!routeButton) return;

      event.preventDefault();

      galleryPage.classList.add("is-leaving");
      window.setTimeout(() => {
        window.location.href = "./album/index.html";
      }, 180);
    });
  }

  renderStats();
  renderPreview();
  renderToday();
  renderWall();
  renderCollections();
})();
