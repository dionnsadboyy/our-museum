(() => {
  const tabs = Array.from(document.querySelectorAll(".tab"));
  const roomLinks = Array.from(document.querySelectorAll(".room-card"));
  const primaryBtn = document.querySelector(".primary-btn");
  const randomBtn = document.querySelector(".ghost-btn");

  const setActiveTab = (activeTab) => {
    tabs.forEach((tab) => tab.classList.toggle("active", tab === activeTab));
  };

  const filterRooms = (filter) => {
    if (filter === "all") {
      roomLinks.forEach((link) => {
        link.classList.remove("is-dimmed");
        link.style.display = "";
      });
      return;
    }

    roomLinks.forEach((link) => {
      const room = link.dataset.room;
      const visible = room === filter;
      link.style.display = visible ? "" : "none";
      link.classList.toggle("is-dimmed", !visible);
    });
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

  if (primaryBtn) {
    primaryBtn.addEventListener("click", () => {
      const target = document.querySelector('.room-card[data-room="timeline"]');
      if (target) target.click();
    });
  }

  if (randomBtn) {
    randomBtn.addEventListener("click", () => {
      const visibleRooms = roomLinks.filter(
        (link) => link.style.display !== "none",
      );
      const pick =
        visibleRooms[Math.floor(Math.random() * visibleRooms.length)];
      if (pick) pick.click();
    });
  }
})();
