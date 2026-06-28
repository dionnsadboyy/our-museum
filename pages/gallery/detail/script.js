(() => {
  const thumbs = Array.from(document.querySelectorAll(".thumb"));
  const heroMedia = document.getElementById("heroMedia");
  const photoTitle = document.getElementById("photoTitle");
  const photoSubtitle = document.getElementById("photoSubtitle");
  const storyTag = document.getElementById("storyTag");
  const storyTitle = document.getElementById("storyTitle");
  const storyText = document.getElementById("storyText");
  const storyDate = document.getElementById("storyDate");
  const storyLocation = document.getElementById("storyLocation");
  const storyMood = document.getElementById("storyMood");

  const themeClassList = [
    "theme-coffee",
    "theme-pink",
    "theme-night",
    "theme-candid",
  ];

  const storyMap = {
    coffee: {
      title: "First Coffee at the Quiet Cafe",
      subtitle:
        "Momen kecil yang ternyata jadi salah satu pintu paling hangat dalam museum ini.",
      tag: "Romantic • Warm",
      text: "Awalnya cuma niat ngopi sebentar. Tapi justru dari momen santai kayak gini, akhirnya obrolan jadi lebih panjang, lebih jujur, dan lebih dekat. Foto ini jadi salah satu bukti kalau hal kecil bisa jadi kenangan yang paling sering dibuka lagi.",
      date: "12 Mei 2026",
      location: "Jababeka",
      mood: "Happy",
      theme: "theme-coffee",
    },
    mirror: {
      title: "Mirror Smile in the Pink Room",
      subtitle:
        "Foto sederhana, tapi ada rasa lembut yang selalu balik lagi saat dibuka.",
      tag: "Soft • Pastel",
      text: "Kadang momen paling manis justru muncul dari hal sederhana: cermin, cahaya pelan, dan senyum yang nggak dibuat-buat. Foto ini terasa seperti halaman yang lembut di museum hubungan.",
      date: "06 Mei 2026",
      location: "Home",
      mood: "Romantic",
      theme: "theme-pink",
    },
    ride: {
      title: "Night Ride After Rain",
      subtitle:
        "Lampu jalan, udara dingin, dan perjalanan yang bikin suasana jadi tenang.",
      tag: "Night • Calm",
      text: "Malam itu terasa panjang, tapi justru karena itu memorinya kuat. Jalanan basah, lampu kota, dan suasana yang diam-diam nyaman. Kadang perjalanan pelan justru yang paling susah dilupakan.",
      date: "04 Mei 2026",
      location: "Cikarang",
      mood: "Calm",
      theme: "theme-night",
    },
    laugh: {
      title: "Little Laugh on a Random Day",
      subtitle:
        "Candid kecil yang justru paling jujur. Museum ini suka momen kayak gini.",
      tag: "Candid • Real",
      text: "Nggak semua memory harus serius. Kadang satu candaan kecil, satu ekspresi blur, atau satu foto yang nggak sengaja malah jadi yang paling hidup saat dilihat lagi. Ini salah satu tipe memori favorit museum ini.",
      date: "28 Apr 2026",
      location: "Cafe Stop",
      mood: "Funny",
      theme: "theme-candid",
    },
  };

  const setActive = (button) => {
    thumbs.forEach((thumb) => thumb.classList.remove("active"));
    button.classList.add("active");

    themeClassList.forEach((cls) => heroMedia.classList.remove(cls));
    const data = storyMap[button.dataset.theme.replace("theme-", "")];

    heroMedia.classList.add(button.dataset.theme);
    if (!data) return;

    photoTitle.textContent = data.title;
    photoSubtitle.textContent = data.subtitle;
    storyTag.textContent = data.tag;
    storyTitle.textContent = data.title;
    storyText.textContent = data.text;
    storyDate.textContent = data.date;
    storyLocation.textContent = data.location;
    storyMood.textContent = data.mood;
  };

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => setActive(thumb));
  });

  const defaultThumb = document.querySelector(".thumb.active");
  if (defaultThumb) {
    setActive(defaultThumb);
  }

  const openStoryBtn = document.querySelector(".primary-btn");
  if (openStoryBtn) {
    openStoryBtn.addEventListener("click", () => {
      const panel = document.querySelector(".story-card");
      if (!panel) return;
      panel.animate(
        [
          { transform: "translateY(0)", filter: "blur(0px)" },
          { transform: "translateY(-2px)", filter: "blur(0.8px)" },
          { transform: "translateY(0)", filter: "blur(0px)" },
        ],
        { duration: 360, easing: "ease-out" },
      );
    });
  }
})();
