(() => {
  const button = document.getElementById("enterMuseum");

  if (!button) return;

  button.addEventListener("click", (event) => {
    event.preventDefault();

    localStorage.setItem("museum-music-on", "1");

    if (window.MuseumMusic) {
      MuseumMusic.enable();
    }

    const page = document.querySelector(".welcome-page");
    if (page) page.classList.add("fade-out");
    MuseumMusic.enable().then((ok) => {
      console.log("PLAY RESULT:", ok);

      setTimeout(() => {
        window.location.href = button.href;
      }, 1000);
    });

    setTimeout(() => {
      window.location.href = button.getAttribute("href");
    }, 320);
  });
})();
