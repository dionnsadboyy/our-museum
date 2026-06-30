(() => {
  const button = document.getElementById("enterMuseum");

  if (!button) return;

  button.addEventListener("click", (event) => {
    event.preventDefault();

    localStorage.setItem("museum-music-on", "1");

    const page = document.querySelector(".welcome-page");
    if (page) page.classList.add("fade-out");

    window.setTimeout(() => {
      window.location.href = button.getAttribute("href");
    }, 320);
  });
})();
