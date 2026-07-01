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
    return `./detail/index.html?album=${encodeURIComponent(id)}&photo=${encodeURIComponent(photoIndex)}`;
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

  const createPhotoImg = (src, alt = "") => {
    const img = document.createElement("img");
    img.alt = alt;
    img.loading = "lazy";
    img.decoding = "async";
    img.src = PLACEHOLDER_IMAGE;

    const candidates = makeSrcCandidates(src);
    let index = 0;

    const next = () => {
      const candidate = candidates[index++];
      if (candidate) {
        img.src = candidate;
      } else {
        img.src = PLACEHOLDER_IMAGE;
      }
    };

    img.addEventListener("error", () => {
      next();
    });

    img.dataset.srcReady = "0";
    img.dataset.realSrc = candidates[0] || PLACEHOLDER_IMAGE;
    return img;
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

    const frag = document.createDocumentFragment();

    list.slice(0, 24).forEach((item, index) => {
      const label = item.album?.title || "Memory";
      const href = buildDetailHref(item.album, item.index || 0);

      const tile = document.createElement("a");
      tile.className = `photo-tile ${tileClasses[index % tileClasses.length]}`;
      tile.href = href;
      tile.setAttribute("aria-label", label);

      const img = createPhotoImg(item.src, label);
      tile.appendChild(img);
      frag.appendChild(tile);
    });

    photoWall.appendChild(frag);

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const img = entry.target;
          const realSrc = img.dataset.realSrc;

          if (realSrc && img.src !== realSrc) {
            img.src = realSrc;
          }

          img.dataset.srcReady = "1";
          obs.unobserve(img);
        });
      },
      { root: null, rootMargin: "300px 0px", threshold: 0.01 },
    );

    photoWall.querySelectorAll("img").forEach((img) => observer.observe(img));
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
