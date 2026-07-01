(() => {
  const gallery = Array.isArray(window.gallery)
    ? window.gallery
    : Array.isArray(window.OUR_MUSEUM?.gallery)
      ? window.OUR_MUSEUM.gallery
      : [];

  const query = new URLSearchParams(window.location.search);

  const backBtn = document.querySelector(".back-btn");
  const shareBtn = document.getElementById("shareBtn");
  const shareBtn2 = document.getElementById("shareBtn2");
  const infoBtn = document.getElementById("infoBtn");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const closeSheetBtn = document.getElementById("closeSheetBtn");
  const photoStage = document.getElementById("photoStage");
  const heroPhoto = document.getElementById("heroPhoto");
  const albumPill = document.getElementById("albumPill");
  const photoCounter = document.getElementById("photoCounter");
  const sheetBackdrop = document.getElementById("sheetBackdrop");
  const infoSheet = document.getElementById("infoSheet");
  const sheetAlbum = document.getElementById("sheetAlbum");
  const sheetTitle = document.getElementById("sheetTitle");
  const sheetStory = document.getElementById("sheetStory");
  const sheetMeta = document.getElementById("sheetMeta");
  const sheetTags = document.getElementById("sheetTags");
  const sheetMap = document.getElementById("sheetMap");
  const toast = document.getElementById("toast");

  const PLACEHOLDER_IMAGE =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000">
        <defs>
          <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="#f6e9ef"/>
            <stop offset="55%" stop-color="#d8c0e8"/>
            <stop offset="100%" stop-color="#c6d7ef"/>
          </linearGradient>
        </defs>
        <rect width="800" height="1000" rx="48" fill="url(#g)"/>
        <rect x="60" y="70" width="680" height="860" rx="42" fill="rgba(255,255,255,0.20)"/>
        <circle cx="250" cy="340" r="42" fill="rgba(255,255,255,0.55)"/>
        <path d="M132 740l128-150 92 96 92-118 216 192v36H132z" fill="rgba(255,255,255,0.40)"/>
      </svg>
    `);

  const albumById = (id) => {
    if (!id) return null;
    if (typeof window.getAlbumById === "function") {
      const byHelper = window.getAlbumById(id);
      if (byHelper) return byHelper;
    }

    if (typeof window.getAlbumByFolder === "function") {
      const byFolder = window.getAlbumByFolder(id);
      if (byFolder) return byFolder;
    }

    return (
      gallery.find(
        (item) => String(item.id) === String(id) || item.folder === id,
      ) || null
    );
  };

  const activeAlbum =
    albumById(query.get("album")) || (gallery.length ? gallery[0] : null);

  const photoList = activeAlbum
    ? Array.isArray(activeAlbum.photos) && activeAlbum.photos.length
      ? activeAlbum.photos
      : [activeAlbum.cover].filter(Boolean)
    : [];

  let activeIndex = Math.max(0, Number(query.get("photo") || 0));
  if (photoList.length) {
    activeIndex = Math.min(activeIndex, photoList.length - 1);
  } else {
    activeIndex = 0;
  }

  let sheetOpen = false;

  const formatMetaBits = (album) => {
    const bits = [];
    if (album?.date) bits.push(album.date);
    if (album?.location) bits.push(album.location);
    if (album?.mood) bits.push(album.mood);
    return bits;
  };

  const getPhotoCandidates = (src) => {
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

  const showToast = (message) => {
    if (!toast) return;

    toast.textContent = message;
    toast.hidden = false;
    toast.classList.add("is-visible");

    window.clearTimeout(showToast._timer);
    showToast._timer = window.setTimeout(() => {
      toast.classList.remove("is-visible");
      window.setTimeout(() => {
        toast.hidden = true;
      }, 180);
    }, 1500);
  };

  const openSheet = () => {
    sheetOpen = true;
    infoSheet?.classList.add("is-open");
    infoSheet?.setAttribute("aria-hidden", "false");

    if (sheetBackdrop) {
      sheetBackdrop.hidden = false;
      requestAnimationFrame(() => sheetBackdrop.classList.add("is-visible"));
    }
  };

  const closeSheet = () => {
    sheetOpen = false;
    infoSheet?.classList.remove("is-open");
    infoSheet?.setAttribute("aria-hidden", "true");

    if (sheetBackdrop) {
      sheetBackdrop.classList.remove("is-visible");
      window.setTimeout(() => {
        sheetBackdrop.hidden = true;
      }, 180);
    }
  };

  const toggleSheet = () => {
    if (sheetOpen) closeSheet();
    else openSheet();
  };

  const updateInfo = () => {
    if (!activeAlbum) {
      albumPill.textContent = "No memory";
      photoCounter.textContent = "0 / 0";
      sheetAlbum.textContent = "Memory";
      sheetTitle.textContent = "No album selected";
      sheetStory.textContent = "Pilih album dari gallery dulu.";
      sheetMeta.innerHTML = "";
      sheetTags.innerHTML = "";
      sheetMap.textContent = "Open location";
      sheetMap.href = "#";
      return;
    }

    const title = activeAlbum.title || "Untitled";
    const subtitle = activeAlbum.subtitle || "Memory";
    const story = activeAlbum.story || subtitle;
    const tags = Array.isArray(activeAlbum.tags) ? activeAlbum.tags : [];
    const metaBits = formatMetaBits(activeAlbum);

    albumPill.textContent = title;
    photoCounter.textContent = `${activeIndex + 1} / ${Math.max(photoList.length, 1)}`;

    sheetAlbum.textContent = subtitle;
    sheetTitle.textContent = title;
    sheetStory.textContent = story;

    sheetMeta.innerHTML = metaBits
      .map((item) => `<span class="sheet-chip">${item}</span>`)
      .join("");

    sheetTags.innerHTML = tags
      .map((tag) => `<span class="sheet-tag">${tag}</span>`)
      .join("");

    if (activeAlbum.maps) {
      sheetMap.textContent = "Open location";
      sheetMap.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        activeAlbum.maps,
      )}`;
    } else {
      sheetMap.textContent = "No location";
      sheetMap.href = "#";
    }
  };

  const setHeroPhoto = (src) => {
    if (!heroPhoto) return;

    const candidates = getPhotoCandidates(src);
    let index = 0;

    heroPhoto.classList.add("is-loading");
    heroPhoto.removeAttribute("src");

    const tryLoad = () => {
      const next = candidates[index];
      index += 1;

      if (next) {
        heroPhoto.src = next;
      } else {
        heroPhoto.src = PLACEHOLDER_IMAGE;
      }
    };

    heroPhoto.onerror = () => {
      if (index < candidates.length) {
        tryLoad();
      } else {
        heroPhoto.src = PLACEHOLDER_IMAGE;
      }
    };

    heroPhoto.onload = () => {
      heroPhoto.classList.remove("is-loading");
    };

    tryLoad();
  };

  const renderPhoto = () => {
    if (!activeAlbum || !photoList.length) {
      setHeroPhoto(PLACEHOLDER_IMAGE);
      updateInfo();
      return;
    }

    const src =
      photoList[activeIndex] ||
      photoList[0] ||
      activeAlbum.cover ||
      PLACEHOLDER_IMAGE;
    setHeroPhoto(src);
    updateInfo();
  };

  const nextPhoto = () => {
    if (!photoList.length) return;
    activeIndex = (activeIndex + 1) % photoList.length;
    renderPhoto();
  };

  const prevPhoto = () => {
    if (!photoList.length) return;
    activeIndex = (activeIndex - 1 + photoList.length) % photoList.length;
    renderPhoto();
  };

  const shareMemory = async () => {
    if (!activeAlbum) return;

    const title = activeAlbum.title || "Our Museum memory";
    const text =
      activeAlbum.story || activeAlbum.subtitle || "A memory from Our Museum.";
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
        return;
      }
    } catch {}

    try {
      await navigator.clipboard.writeText(url);
      showToast("Link copied");
    } catch {
      showToast("Share unavailable");
    }
  };

  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    window.location.href = "../index.html";
  };

  backBtn?.addEventListener("click", (event) => {
    event.preventDefault();
    goBack();
  });

  shareBtn?.addEventListener("click", shareMemory);
  shareBtn2?.addEventListener("click", shareMemory);
  infoBtn?.addEventListener("click", openSheet);
  closeSheetBtn?.addEventListener("click", closeSheet);
  sheetBackdrop?.addEventListener("click", closeSheet);
  prevBtn?.addEventListener("click", prevPhoto);
  nextBtn?.addEventListener("click", nextPhoto);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeSheet();
    if (event.key === "ArrowLeft") prevPhoto();
    if (event.key === "ArrowRight") nextPhoto();
    if (event.key === "ArrowUp") openSheet();
  });

  let stageStart = null;

  photoStage?.addEventListener(
    "pointerdown",
    (event) => {
      stageStart = {
        x: event.clientX,
        y: event.clientY,
        time: Date.now(),
      };
      photoStage.setPointerCapture?.(event.pointerId);
    },
    { passive: true },
  );

  photoStage?.addEventListener(
    "pointerup",
    (event) => {
      if (!stageStart) return;

      const dx = event.clientX - stageStart.x;
      const dy = event.clientY - stageStart.y;

      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) nextPhoto();
        else prevPhoto();
      } else if (dy < -70) {
        openSheet();
      } else if (dy > 70 && sheetOpen) {
        closeSheet();
      }

      stageStart = null;
    },
    { passive: true },
  );

  let sheetStart = null;

  infoSheet?.addEventListener(
    "pointerdown",
    (event) => {
      sheetStart = {
        x: event.clientX,
        y: event.clientY,
      };
      infoSheet.setPointerCapture?.(event.pointerId);
    },
    { passive: true },
  );

  infoSheet?.addEventListener(
    "pointerup",
    (event) => {
      if (!sheetStart) return;

      const dy = event.clientY - sheetStart.y;
      const dx = event.clientX - sheetStart.x;

      if (dy > 70 && Math.abs(dy) > Math.abs(dx)) {
        closeSheet();
      }

      sheetStart = null;
    },
    { passive: true },
  );

  if (!activeAlbum) {
    albumPill.textContent = "No memory";
    setHeroPhoto(PLACEHOLDER_IMAGE);
    updateInfo();
    return;
  }

  renderPhoto();
})();
