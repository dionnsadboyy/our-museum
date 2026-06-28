(() => {
  const splash = document.querySelector(".splash");
  const loadingText = document.getElementById("loadingText");

  const loadingStates = [
    "Opening Museum",
    "Preparing the exhibition",
    "Curating memories",
  ];

  let stateIndex = 0;
  let dots = 0;

  const textTimer = setInterval(() => {
    stateIndex = (stateIndex + 1) % loadingStates.length;
    if (loadingText) loadingText.textContent = loadingStates[stateIndex];
  }, 650);

  const dotTimer = setInterval(() => {
    dots = (dots + 1) % 4;
    const suffix = ".".repeat(dots);
    if (loadingText) {
      const base = loadingStates[stateIndex];
      loadingText.textContent = `${base}${suffix}`;
    }
  }, 260);

  const nextPage = "../welcome/index.html";

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const delay = reduceMotion ? 700 : 1800;

  const goNext = () => {
    if (!splash) return;
    splash.classList.add("fade-out");

    window.setTimeout(() => {
      window.location.href = nextPage;
    }, 480);
  };

  window.setTimeout(() => {
    clearInterval(textTimer);
    clearInterval(dotTimer);
    goNext();
  }, delay);
})();
