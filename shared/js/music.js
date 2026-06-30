(() => {
  const MUSIC_SRC = "/assets/music/museum.mp3";
  const KEY_ON = "museum-music-on";
  const KEY_TIME = "museum-music-time";
  const KEY_VOLUME = "museum-music-volume";

  let audio = document.getElementById("museum-player");

  if (!audio) {
    audio = document.createElement("audio");
    audio.id = "museum-player";
    audio.src = MUSIC_SRC;
    audio.loop = true;
    audio.preload = "auto";
    audio.playsInline = true;
    document.body.appendChild(audio);
  }

  const isOn = () => localStorage.getItem(KEY_ON) === "1";

  const saveTime = () => {
    sessionStorage.setItem(KEY_TIME, String(audio.currentTime || 0));
  };

  const restoreTime = () => {
    const saved = Number(sessionStorage.getItem(KEY_TIME) || "0");
    if (Number.isFinite(saved) && saved > 0) {
      try {
        audio.currentTime = saved;
      } catch {}
    }
  };

  const restoreVolume = () => {
    const raw = localStorage.getItem(KEY_VOLUME);
    const saved = raw === null || raw === "" ? 0.65 : Number(raw);

    audio.volume = Number.isFinite(saved)
      ? Math.min(1, Math.max(0, saved))
      : 0.65;

    audio.muted = false;
  };

  const playNow = async () => {
    if (!isOn()) return false;

    restoreVolume();

    try {
      if (audio.readyState < 1) {
        await new Promise((resolve) => {
          audio.addEventListener("loadedmetadata", resolve, { once: true });
        });
      }

      restoreTime();
      await audio.play();
      return true;
    } catch {
      return false;
    }
  };

  const syncPlay = () => {
    if (!isOn()) return;
    if (!audio.paused) return;
    playNow();
  };

  audio.addEventListener("timeupdate", saveTime);
  audio.addEventListener("pause", saveTime);
  window.addEventListener("pagehide", saveTime);
  window.addEventListener("beforeunload", saveTime);

  window.addEventListener("pageshow", () => {
    syncPlay();
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) syncPlay();
  });
  if (localStorage.getItem("museum-music-on") === "1") {
    playNow();
  }
  window.MuseumMusic = {
    enable() {
      localStorage.setItem(KEY_ON, "1");
      return playNow();
    },

    disable() {
      localStorage.setItem(KEY_ON, "0");
      audio.pause();
      saveTime();
    },

    resume() {
      localStorage.setItem(KEY_ON, "1");
      return playNow();
    },

    pause() {
      audio.pause();
      saveTime();
    },

    toggle() {
      if (audio.paused) return this.resume();
      this.pause();
    },

    setVolume(v) {
      const volume = Math.min(1, Math.max(0, Number(v) || 0));
      audio.volume = volume;
      localStorage.setItem(KEY_VOLUME, String(volume));
    },

    audio,
  };
})();
