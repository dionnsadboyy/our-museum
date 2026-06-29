(() => {
  const BASE = "/assets/images";

  const photoPath = (folder, file) => `${BASE}/${folder}/${file}`;
  const coverPath = (folder, file) => photoPath(folder, file);

  const gallery = [
    {
      id: 1,
      folder: "day-uno",
      title: "Opening Chapter",
      subtitle: "Hari Kedua Kita Kenal",
      cover: "uno1.jpeg",
      date: "17 June 2026",
      location: "Jatiwangi, Cikarang",
      maps: "Jalan Kampung RT 4 RW 2, Desa Jatiwangi, Kontrakan Warna Pink, Belakang Rumah Putih, Kontrakan No.21",
      mood: "🥹❤️",
      story:
        "Hari kedua setelah kita kenal. Awalnya kumpul rame-rame bertujuh buat main UNO. Yang kalah harus dicoret-coret mukanya. Di hari itu akhirnya aku memberanikan diri ngajak foto bareng. Walaupun sederhana, ternyata dari momen kecil itu semuanya mulai terasa berbeda.",
      tags: ["UNO", "Random", "Friends", "First Photo"],
      photos: [
        "uno1.jpeg",
        "uno2.jpeg",
        "uno3.jpeg",
        "uno4.jpeg",
        "uno5.jpeg",
        "uno6.jpeg",
        "uno7.jpeg",
        "uno8.jpeg",
        "uno9.jpeg",
        "uno10.jpeg",
        "uno11.jpeg",
        "uno12.jpeg",
      ],
    },
  ];

  const enrichAlbum = (album) => {
    const coverFile = album.cover || album.photos?.[0] || "cover.jpeg";

    return {
      ...album,
      cover: coverPath(album.folder, coverFile),
      photos: (album.photos || []).map((file) => photoPath(album.folder, file)),
      coverFile,
      photoFiles: [...(album.photos || [])],
    };
  };

  const galleryData = gallery.map(enrichAlbum);

  const getAlbumById = (id) =>
    galleryData.find((item) => String(item.id) === String(id));

  const getAlbumByFolder = (folder) =>
    galleryData.find((item) => item.folder === folder);

  const getPhotoByIndex = (album, index) => {
    if (!album || !album.photos || !album.photos[index]) return "";
    return album.photos[index];
  };

  const getRandomAlbum = () => {
    if (!galleryData.length) return null;
    return galleryData[Math.floor(Math.random() * galleryData.length)];
  };

  const getRandomCover = () => {
    const album = getRandomAlbum();
    return album ? album.cover : "";
  };

  window.OUR_MUSEUM = {
    BASE,
    gallery: galleryData,
    getAlbumById,
    getAlbumByFolder,
    getPhotoByIndex,
    getRandomAlbum,
    getRandomCover,
  };

  window.gallery = galleryData;
  window.getAlbumById = getAlbumById;
  window.getAlbumByFolder = getAlbumByFolder;
  window.getPhotoByIndex = getPhotoByIndex;
  window.getRandomAlbum = getRandomAlbum;
  window.getRandomCover = getRandomCover;
})();
