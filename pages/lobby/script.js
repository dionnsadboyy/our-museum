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
    const preview = document.getElementById("memoryPreview");
    if (!preview) return;

    preview.innerHTML = `
    <img
      class="memory-photo memory-photo-main"
      src="/assets/images/day-uno/uno2.jpeg"
      alt=""
    />

    <img
      class="memory-photo memory-photo-secondary"
      src="/assets/images/day-uno/uno12.jpeg"
      alt=""
    />

    <img
      class="memory-photo memory-photo-tertiary"
      src="/assets/images/day-uno/uno4.jpeg"
      alt=""
    />

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
        <div
          class="story-thumb"
          style="background-image:url('${album.cover}')">
        </div>

        <p>${album.title}</p>
      </article>
    `;
    });
  }

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
  renderStories();
})();
