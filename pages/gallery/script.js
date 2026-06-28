(() => {
  const chips = Array.from(document.querySelectorAll(".chip"));
  const roomCards = Array.from(
    document.querySelectorAll(".masonry-item, .album-row, .feature-card"),
  );

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");

      const filter = chip.dataset.filter;

      roomCards.forEach((card) => {
        const text = card.textContent.toLowerCase();
        const shouldShow =
          filter === "all" ||
          (filter === "albums" && text.includes("album")) ||
          (filter === "moments" &&
            (text.includes("memory") ||
              text.includes("story") ||
              text.includes("today"))) ||
          (filter === "polaroid" && card.classList.contains("masonry-item")) ||
          (filter === "map" && text.includes("map"));

        if (
          card.classList.contains("feature-card") &&
          filter !== "all" &&
          filter !== "moments" &&
          filter !== "albums"
        ) {
          card.style.display = "none";
        } else {
          card.style.display = shouldShow ? "" : "none";
        }
      });
    });
  });
})();
