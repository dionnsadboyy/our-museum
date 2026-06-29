(() => {
  const button = document.getElementById("enterMuseum");

  if (!button) return;

  button.addEventListener("click", (event) => {
    event.preventDefault();

    MuseumMusic.play();

    const page = document.querySelector(".welcome-page");
    page?.classList.add("fade-out");

    setTimeout(() => {
      window.location.href = button.href;
    }, 320);
  });
})();
