(() => {
  const albums = Array.isArray(window.gallery)
    ? [...window.gallery].sort((a, b) => Number(b.id || 0) - Number(a.id || 0))
    : Array.isArray(window.OUR_MUSEUM?.gallery)
      ? [...window.OUR_MUSEUM.gallery].sort(
          (a, b) => Number(b.id || 0) - Number(a.id || 0),
        )
      : [];

  const collectionsGrid = document.getElementById("collectionsGrid");
  const pinnedRow = document.getElementById("pinnedRow");
  const albumList = document.getElementById("albumList");
  const pinnedMeta = document.getElementById("pinnedMeta");
  const scrollToPinned = document.getElementById("scrollToPinned");
  const jumpBtn = document.getElementById("jumpBtn");
  const page = document.querySelector(".collections-page");

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

  const totalMemories = albums.reduce(
    (sum, album) => sum + (album.photos?.length || 0),
    0,
  );

  const formatShort = (album) => {
    const pieces = [];
    if (album?.date) pieces.push(album.date);
    if (album?.location) pieces.push(album.location);
    return pieces.join(" • ");
  };

  const buildHref = (album) => {
    const id = album?.id ?? album?.folder ?? "";
    return `../detail/index.html?album=${encodeURIComponent(id)}&photo=0`;
  };

  const makeSafeImg = (src, alt = "") => {
    const img = document.createElement("img");
    img.alt = alt;
    img.loading = "lazy";
    img.decoding = "async";

    const clean = String(src || "")
      .split("?")[0]
      .split("#")[0];
    const candidates = [clean];

    if (/\.jpg$/i.test(clean)) {
      candidates.push(clean.replace(/\.jpg$/i, ".jpeg"));
    } else if (/\.jpeg$/i.test(clean)) {
      candidates.push(clean.replace(/\.jpeg$/i, ".jpg"));
    }

    let index = 0;

    const next = () => {
      const candidate = candidates[index++];
      img.src = candidate || PLACEHOLDER_IMAGE;
    };

    img.addEventListener("error", () => {
      if (index < candidates.length) {
        next();
      } else {
        img.src = PLACEHOLDER_IMAGE;
      }
    });

    next();
    return img;
  };

  const leaveTo = (url) => {
    if (page) {
      page.classList.add("leaving");
    }

    window.setTimeout(() => {
      window.location.href = url;
    }, 180);
  };

  const renderCollections = () => {
    if (!collectionsGrid) return;

    collectionsGrid.innerHTML = "";

    albums.forEach((album, index) => {
      const card = document.createElement("a");
      card.className = "collection-card";
      card.href = buildHref(album);

      const img = makeSafeImg(
        album.cover || album.photos?.[0] || "",
        album.title || "Collection",
      );

      const copy = document.createElement("div");
      copy.className = "collection-copy";
      copy.innerHTML = `
        <span class="date">${album.date || "Memory"}</span>
        <h3>${album.title || "Untitled"}</h3>
        <div class="collection-meta">
          <span>${album.photos?.length || 0} memories</span>
          ${album.location ? `<span>•</span><span>${album.location}</span>` : ""}
        </div>
      `;

      const badge = document.createElement("div");
      badge.className = "collection-badge";
      badge.textContent = `${String(index + 1).padStart(2, "0")}`;

      card.appendChild(img);
      card.appendChild(copy);
      card.appendChild(badge);
      collectionsGrid.appendChild(card);
    });
  };

  const renderPinned = () => {
    if (!pinnedRow) return;

    const first = albums[0];
    const second = albums[1];

    const pinnedItems = [];

    if (first) {
      pinnedItems.push({
        type: "album",
        title: "Favourite",
        subtitle: first.title || "Top memory",
        src: first.cover || first.photos?.[0] || "",
        href: buildHref(first),
      });
    }

    if (second) {
      pinnedItems.push({
        type: "album",
        title: "Recently Saved",
        subtitle: second.title || "Latest memory",
        src: second.cover || second.photos?.[0] || "",
        href: buildHref(second),
      });
    }

    pinnedItems.push({
      type: "stats",
      title: "All memories",
      subtitle: `${totalMemories} photos • ${albums.length} collections`,
      href: "../index.html",
      src: first?.cover || first?.photos?.[0] || "",
    });

    pinnedRow.innerHTML = "";

    pinnedItems.forEach((item) => {
      const card = document.createElement("a");
      card.className = `pinned-card ${item.type === "stats" ? "stats" : ""}`;
      card.href = item.href;

      if (item.type !== "stats") {
        const img = makeSafeImg(item.src, item.title);
        const copy = document.createElement("div");
        copy.className = "pinned-copy";
        copy.innerHTML = `
          <strong>${item.title}</strong>
          <small>${item.subtitle}</small>
        `;

        card.appendChild(img);
        card.appendChild(copy);
      } else {
        const box = document.createElement("div");
        box.className = "stats-box";
        box.innerHTML = `
          <div class="big">${albums.length}</div>
          <small>${item.subtitle}</small>
        `;
        card.appendChild(box);
      }

      pinnedRow.appendChild(card);
    });

    if (pinnedMeta) {
      pinnedMeta.textContent = `${albums.length} collections`;
    }
  };

  const renderAlbumList = () => {
    if (!albumList) return;

    albumList.innerHTML = "";

    albums.forEach((album) => {
      const row = document.createElement("a");
      row.className = "album-row";
      row.href = buildHref(album);

      const preview = document.createElement("div");
      preview.className = "album-preview";
      preview.style.backgroundImage = `url('${album.cover || album.photos?.[0] || ""}')`;

      const info = document.createElement("div");
      info.className = "album-info";
      info.innerHTML = `
        <strong>${album.title || "Untitled"}</strong>
        <small>${album.photos?.length || 0} memories${album.date ? ` • ${album.date}` : ""}</small>
      `;

      const arrow = document.createElement("span");
      arrow.className = "album-arrow";
      arrow.textContent = "→";

      row.appendChild(preview);
      row.appendChild(info);
      row.appendChild(arrow);
      albumList.appendChild(row);
    });
  };

  const openFirstCollection = () => {
    if (albums[0]) {
      leaveTo(buildHref(albums[0]));
    }
  };

  collectionsGrid?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const card = target.closest(".collection-card");
    if (!card) return;
  });

  scrollToPinned?.addEventListener("click", () => {
    pinnedRow?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  jumpBtn?.addEventListener("click", openFirstCollection);

  renderCollections();
  renderPinned();
  renderAlbumList();
})();
