(() => {
  const tabs = [...document.querySelectorAll(".tab")];
  const roomLinks = [...document.querySelectorAll(".room-card")];
  const randomBtn = document.querySelector(".ghost-btn");
  const primaryBtn = document.querySelector(".primary-btn");

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
    const museum = window.OUR_MUSEUM;
    const preview = document.getElementById("memoryPreview");
    const badge = document.getElementById("memoryBadge");

    if (!museum || !preview) return;

    const pool = museum.gallery.flatMap((album) => {
      const photos = Array.isArray(album.photos) ? album.photos : [];
      return [album.cover, ...photos].filter(Boolean);
    });

    const unique = [...new Set(pool)];
    const shuffled = unique.sort(() => Math.random() - 0.5);
    const picks = shuffled.slice(0, 3);

    const fallback = [
      "/assets/images/day-uno/uno1.jpeg",
      "/assets/images/day-uno/uno2.jpeg",
      "/assets/images/day-uno/uno3.jpeg",
    ];

    const photos = (picks.length ? picks : fallback).slice(0, 3);
    const count = Math.max(pool.length - 3, 20);

    preview.innerHTML = `
      <img class="memory-photo memory-photo-main" src="${photos[0]}" alt="" />
      <img class="memory-photo memory-photo-secondary" src="${photos[1] || photos[0]}" alt="" />
      <img class="memory-photo memory-photo-tertiary" src="${photos[2] || photos[0]}" alt="" />
      <div class="memory-badge" id="memoryBadge">+${count}</div>
    `;

    if (badge) badge.remove();
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

  renderRandomPreview();
})();
