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
        "hari kedua setelah kita kenal, kita kumpul rame-rame buat main uno bertujuh. yang kalah mukanya dicoret-coret pake spidol, jadi suasananya rame banget. sebenernya di hari itu nggak ada yang terlalu besar, tapi entah kenapa aku berani ngajak kamu foto bareng. dari momen yang keliatannya biasa aja itu, semuanya mulai kerasa beda buat aku.",
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
    {
      id: 2,
      folder: "day-date",
      title: "Date",
      subtitle: "Keliling Malam Tanpa Tujuan",
      cover: "date1.jpeg",
      date: "22 June 2026",
      location: "Central Park Meikarta",
      maps: "Central Park Meikarta, Cikarang Selatan, Bekasi",
      mood: "🌃🤍",
      story:
        "awalnya cuma kepikiran buat keluar bentar habis pulang kerja, nggak ada rencana apa-apa, cuma pengen muter aja. yang nggak aku sangka, kamu malah dandan hampir dua jam sampai nyatok segala. akhirnya kita cuma ke indomaret beli jajan, terus duduk di pinggir danau dekat jembatan central park meikarta. ngobrol random, ngelihatin air, sesederhana itu. tapi anehnya malam itu rasanya nyaman banget buat aku.",
      tags: ["Night Ride", "Meikarta", "Lake", "Random Talk"],
      photos: [
        "date1.jpeg",
        "date2.jpeg",
        "date3.jpeg",
        "date4.jpeg",
        "date5.jpeg",
        "date6.jpeg",
        "date7.jpeg",
        "date8.jpeg",
        "date9.jpeg",
        "date10.jpeg",
      ],
    },
    {
      id: 3,
      folder: "jababeka-day",
      title: "Jababeka Day",
      subtitle: "Alasan Buat Ketemu",
      cover: "jababeka1.jpg",
      date: "25 June 2026",
      location: "Jababeka, Cikarang",
      maps: "Jababeka, Cikarang Utara, Bekasi",
      mood: "🛵🍛🤍",
      story:
        "awalnya cuma bilang mau benerin iphone, padahal sebenernya itu cuma alasan biar bisa ketemu lagi. selesai servis, kita muter-muter di jababeka, bingung mau makan apa, sempet mampir ke chiefs, terus akhirnya nyerah dan milih nasi goreng. pulangnya udah lumayan malem, bahkan sempet ada drama karena aku nganter kamu sampai sekitar jam sepuluh. sesimpel itu, tapi malah jadi salah satu malam yang paling aku inget.",
      tags: [
        "Jababeka",
        "iPhone Service",
        "Cifest",
        "Nasi Goreng",
        "Night Ride",
      ],
      photos: [
        "jababeka1.jpg",
        "jababeka2.jpg",
        "jababeka3.jpg",
        "jababeka4.jpg",
        "jababeka5.jpg",
        "jababeka6.jpg",
        "jababeka7.jpg",
        "jababeka8.jpg",
        "jababeka9.jpg",
        "jababeka10.jpg",
        "jababeka11.jpg",
        "jababeka12.jpg",
        "jababeka13.jpg",
        "jababeka14.jpg",
      ],
    },
    {
      id: 4,
      folder: "012-day",
      title: "012 Day",
      subtitle: "Hari Kedua Belas",
      cover: "012-1.jpg",
      date: "29 June 2026",
      location: "Jatiwangi, Cikarang Barat",
      maps: "Jatiwangi, Cikarang Barat, Bekasi",
      mood: "🍦🐈🤍",
      story:
        "hari itu kamu sebenernya lagi nggak baik-baik aja. habis diomongin macem-macem sama masa lalu, sampai sempet nangis juga di tempat kerja. aku nggak bisa ngelakuin banyak hal, jadi yang kepikiran cuma ngajak kamu muter bentar habis pulang kerja. kita keliling cikarang barat tanpa tujuan, berhenti di alfamart jatiwangi, beli es krim, duduk sebentar, ngasih makan kucing, terus pulang. nggak ada yang mewah, tapi ngeliat kamu bisa ketawa lagi malam itu rasanya udah lebih dari cukup buat aku.",
      tags: [
        "Day 12",
        "Night Ride",
        "Ice Cream",
        "Jatiwangi",
        "Cat",
        "Healing",
      ],
      photos: [
        "012-1.jpg",
        "012-2.jpg",
        "012-3.jpg",
        "012-4.jpg",
        "012-5.jpg",
        "012-6.jpg",
        "012-7.jpg",
        "012-8.jpg",
        "012-9.jpg",
      ],
    },
    {
      id: 5,
      folder: "014-day",
      title: "014 Day",
      subtitle: "Kebab Before Work",
      cover: "014-day1.jpg",
      date: "1 July 2026",
      location: "Cibarengkok, Jatiwangi",
      maps: "Cibarengkok, Jatiwangi, Cikarang Barat, Bekasi",
      mood: "🥙🥤📺🤍",
      story:
        "hari itu waktunya mepet banget. kamu baru pulang shift pagi, sementara aku bentar lagi masuk shift malem. di sela waktu satu dua jam itu kita mutusin buat keluar sebentar. beli kebab, beli smoothies, terus balik lagi ke kos. makannya sambil nonton upin ipin, ngobrol ngalor ngidul, ketawa-ketawa nggak jelas. cuma beberapa jam, tapi rasanya cukup buat bikin capek satu hari hilang.",
      tags: ["Day 14", "Kebab", "Smoothies", "Kos", "Upin Ipin", "Before Work"],
      photos: ["014-day1.jpg", "014-day2.jpg", "014-day3.jpg"],
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
