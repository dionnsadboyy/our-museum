(() => {
  const tabs = [...document.querySelectorAll(".tab")];
  const roomLinks = [...document.querySelectorAll(".room-card")];
  const randomBtn = document.querySelector(".ghost-btn");
  const primaryBtn = document.querySelector(".primary-btn");

  const sheet = document.getElementById("musicSheet");
  const backdrop = document.getElementById("musicBackdrop");
  const toggleBtn = document.getElementById("musicToggleBtn");
  const closeBtn = document.getElementById("musicCloseBtn");
  const playBtn = document.getElementById("musicPlayBtn");
  const volumeInput = document.getElementById("musicVolume");
  const statusText = document.getElementById("musicStatus");
  const timeText = document.getElementById("musicTime");
  const progressFill = document.getElementById("musicProgressFill");
  const titleText = document.getElementById("musicTitle");

  const audio =
    window.MuseumMusic?.audio || document.getElementById("museum-player");

  const go = (url) => window.location.assign(url);

  const setActiveTab = (activeTab) => {
    tabs.forEach((tab) => tab.classList.toggle("active", tab === activeTab));
  };

  const filterRooms = (filter) => {
    roomLinks.forEach((link) => {
      const room = link.dataset.room;
      const visible = filter === "all" || room === filter;
      link.style.display = visible ? "" : "none";
    });
  };

  const renderRandomPreview = () => {
    const preview = document.getElementById("memoryPreview");
    if (!preview) return;

    preview.innerHTML = `
      <img class="memory-photo memory-photo-main" src="/assets/images/day-uno/uno2.jpeg" alt="" />
      <img class="memory-photo memory-photo-secondary" src="/assets/images/day-uno/uno12.jpeg" alt="" />
      <img class="memory-photo memory-photo-tertiary" src="/assets/images/day-uno/uno4.jpeg" alt="" />
      <div class="memory-badge">+20</div>
    `;
  };

  function renderStories() {
    const row = document.getElementById("storyRow");
    if (!row || !window.gallery) return;

    row.innerHTML = "";

    window.gallery.forEach((album) => {
      row.innerHTML += `
        <article class="story-card">
          <div class="story-avatar avatar-purple">D</div>
          <div class="story-thumb" style="background-image:url('${album.cover}')"></div>
          <p>${album.title}</p>
        </article>
      `;
    });
  }

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

    if (timeText) {
      timeText.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
    }

    if (progressFill) {
      progressFill.style.width = duration
        ? `${Math.min(100, (current / duration) * 100)}%`
        : "0%";
    }

    if (statusText) {
      statusText.textContent = audio.paused ? "tap play to start" : "playing";
    }

    if (playBtn) {
      playBtn.textContent = audio.paused ? "Play" : "Pause";
    }

    if (volumeInput && audio) {
      volumeInput.value = String(audio.volume ?? 0.65);
    }

    if (titleText) {
      titleText.textContent = "museum.mp3";
    }
  };

  const openSheet = () => {
    if (!sheet || !backdrop) return;
    sheet.classList.add("is-open");
    backdrop.hidden = false;
    requestAnimationFrame(() => backdrop.classList.add("is-visible"));
    syncMusicUI();
  };

  const closeSheet = () => {
    if (!sheet || !backdrop) return;
    sheet.classList.remove("is-open");
    backdrop.classList.remove("is-visible");
    window.setTimeout(() => {
      backdrop.hidden = true;
    }, 180);
  };

  const toggleSheet = () => {
    if (!sheet) return;
    if (sheet.classList.contains("is-open")) closeSheet();
    else openSheet();
  };

  const playOrPauseMusic = async () => {
    if (!window.MuseumMusic || !audio) return;

    if (audio.paused) {
      await window.MuseumMusic.enable();
    } else {
      window.MuseumMusic.pause();
    }

    syncMusicUI();
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      setActiveTab(tab);
      filterRooms(tab.dataset.filter);
    });
  });

  roomLinks.forEach((link) => {
    link.addEventListener("click", () => {
      roomLinks.forEach((item) => item.classList.remove("active"));
      link.classList.add("active");
    });
  });

  randomBtn?.addEventListener("click", () => {
    const visibleRooms = roomLinks.filter(
      (link) => link.style.display !== "none",
    );
    const pick = visibleRooms[Math.floor(Math.random() * visibleRooms.length)];
    if (pick) return pick.click();
    go("/pages/gallery/index.html");
  });

  primaryBtn?.addEventListener("click", (event) => {
    event.preventDefault();
    go("/pages/gallery/index.html");
  });

  toggleBtn?.addEventListener("click", (event) => {
    event.preventDefault();
    toggleSheet();
  });

  closeBtn?.addEventListener("click", closeSheet);
  backdrop?.addEventListener("click", closeSheet);

  playBtn?.addEventListener("click", playOrPauseMusic);

  volumeInput?.addEventListener("input", () => {
    if (!window.MuseumMusic) return;
    window.MuseumMusic.setVolume(Number(volumeInput.value));
    syncMusicUI();
  });

  audio?.addEventListener("timeupdate", syncMusicUI);
  audio?.addEventListener("play", syncMusicUI);
  audio?.addEventListener("pause", syncMusicUI);
  audio?.addEventListener("loadedmetadata", syncMusicUI);
  audio?.addEventListener("volumechange", syncMusicUI);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeSheet();
  });

  let touchStartY = null;

  document.addEventListener(
    "touchstart",
    (event) => {
      const touch = event.touches?.[0];
      if (!touch) return;

      if (touch.clientY < 110) {
        touchStartY = touch.clientY;
      } else {
        touchStartY = null;
      }
    },
    { passive: true },
  );

  document.addEventListener(
    "touchend",
    (event) => {
      const touch = event.changedTouches?.[0];
      if (touchStartY === null || !touch) return;

      const deltaY = touch.clientY - touchStartY;

      if (deltaY > 70) openSheet();
      if (deltaY < -70) closeSheet();

      touchStartY = null;
    },
    { passive: true },
  );

  renderRandomPreview();
  renderStories();
  syncMusicUI();

  window.addEventListener("pageshow", syncMusicUI);
})();
