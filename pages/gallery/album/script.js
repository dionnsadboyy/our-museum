(() => {
  const chips = Array.from(document.querySelectorAll(".chip"));
  const albumCards = Array.from(document.querySelectorAll(".album-card"));

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");

      const filter = chip.dataset.filter;

      albumCards.forEach((card) => {
        const matches = filter === "all" || card.dataset.album === filter;
        card.style.display = matches ? "" : "none";
      });
    });
  });
})();
