(() => {
  const MUSIC_SRC = "/assets/music/museum.mp3";

  let audio = document.getElementById("museum-player");

  if (!audio) {
    audio = document.createElement("audio");

    audio.id = "museum-player";
    audio.src = MUSIC_SRC;

    audio.preload = "auto";
    audio.loop = true;

    document.body.appendChild(audio);
  }

  // restore posisi lagu
  const lastTime = parseFloat(sessionStorage.getItem("museum-time") || "0");

  audio.addEventListener(
    "loadedmetadata",
    () => {
      if (!isNaN(lastTime)) {
        audio.currentTime = lastTime;
      }

      if (sessionStorage.getItem("museum-music") === "true") {
        audio.play().catch(() => {});
      }
    },
    { once: true },
  );

  // simpan posisi setiap 1 detik
  audio.addEventListener("timeupdate", () => {
    sessionStorage.setItem("museum-time", audio.currentTime);
  });

  // simpan sebelum pindah halaman
  window.addEventListener("beforeunload", () => {
    sessionStorage.setItem("museum-time", audio.currentTime);
  });

  window.MuseumMusic = {
    play() {
      sessionStorage.setItem("museum-music", "true");
      return audio.play();
    },

    pause() {
      sessionStorage.setItem("museum-music", "false");
      audio.pause();
    },

    toggle() {
      if (audio.paused) {
        this.play();
      } else {
        this.pause();
      }
    },

    setVolume(v) {
      audio.volume = v;
    },

    audio,
  };
})();
