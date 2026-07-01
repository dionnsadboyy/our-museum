(() => {
  const albums = Array.isArray(window.gallery)
    ? [...window.gallery].sort((a, b) => Number(b.id || 0) - Number(a.id || 0))
    : Array.isArray(window.OUR_MUSEUM?.gallery)
      ? [...window.OUR_MUSEUM.gallery].sort(
          (a, b) => Number(b.id || 0) - Number(a.id || 0),
        )
      : [];

  const photoWall = document.getElementById("photoWall");
  const browseBtn = document.getElementById("browseBtn");
  const viewCollectionsBtn = document.querySelector(
    '[data-route="collections"]',
  );
  const page = document.querySelector(".gallery-page");

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

  const makeSrcCandidates = (src) => {
    const clean = String(src || "")
      .trim()
      .split("?")[0]
      .split("#")[0];
    const candidates = [];

    if (clean) candidates.push(clean);

    if (/\.jpg$/i.test(clean)) {
      candidates.push(clean.replace(/\.jpg$/i, ".jpeg"));
    } else if (/\.jpeg$/i.test(clean)) {
      candidates.push(clean.replace(/\.jpeg$/i, ".jpg"));
    } else if (/\.(jpe?g)$/i.test(clean)) {
      candidates.push(clean.replace(/\.(jpe?g)$/i, ".jpg"));
      candidates.push(clean.replace(/\.(jpe?g)$/i, ".jpeg"));
    }

    return [...new Set(candidates)].filter(Boolean);
  };

  const createPhotoTile = (item, index) => {
    const label = item.album?.title || "Memory";
    const href = buildDetailHref(item.album, item.index || 0);

    const tile = document.createElement("a");
    tile.className = `photo-tile ${tileClasses[index % tileClasses.length]}`;
    tile.href = href;
    tile.setAttribute("aria-label", label);

    const img = document.createElement("img");
    img.alt = label;
    img.loading = index < 8 ? "eager" : "lazy";
    img.decoding = "async";
    img.src = PLACEHOLDER_IMAGE;

    const candidates = makeSrcCandidates(item.src);
    let pointer = 0;

    const loadNext = () => {
      const next = candidates[pointer++];
      img.src = next || PLACEHOLDER_IMAGE;
    };

    img.addEventListener("error", () => {
      if (pointer < candidates.length) {
        loadNext();
      } else {
        img.src = PLACEHOLDER_IMAGE;
      }
    });

    loadNext();
    tile.appendChild(img);
    return tile;
  };

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

    const batchSize = 8;
    let cursor = 0;

    const appendBatch = () => {
      const frag = document.createDocumentFragment();
      const end = Math.min(cursor + batchSize, list.length);

      for (; cursor < end; cursor++) {
        frag.appendChild(createPhotoTile(list[cursor], cursor));
      }

      photoWall.appendChild(frag);

      if (cursor < list.length) {
        requestAnimationFrame(appendBatch);
      }
    };

    appendBatch();
  };

  browseBtn?.addEventListener("click", () => {
    photoWall?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  viewCollectionsBtn?.addEventListener("click", (event) => {
    event.preventDefault();
    if (page) page.classList.add("is-leaving");
    window.setTimeout(() => {
      window.location.href = "./album/index.html";
    }, 180);
  });

  renderWall();
})();
