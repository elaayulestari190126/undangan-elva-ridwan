// ==========================================
// URL GOOGLE APPS SCRIPT
// ==========================================
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycby_NYHNjn14SD-QR8VNQ8RqWhlUmmTi0wek6rFzcdTDY_hdkuGTZsNNZr3N3VtbMB5nNw/exec";


// ==========================================
// ELEMEN WEBSITE
// ==========================================
const cover = document.getElementById("cover");
const btnOpen = document.getElementById("btnOpen");
const mainContent = document.getElementById("mainContent");
const musicPlayer = document.getElementById("musicPlayer");
const bgMusic = document.getElementById("bgMusic");

const rsvpForm = document.getElementById("rsvpForm");
const wishesList = document.getElementById("wishesList");


// ==========================================
// BUKA UNDANGAN
// ==========================================
if (btnOpen) {
  btnOpen.addEventListener("click", function () {

    if (cover) {
      cover.classList.add("hidden");
    }

    if (mainContent) {
      mainContent.classList.add("visible");
    }

    playMusic();

    // Ambil ucapan yang sudah tersimpan
    loadWishes();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}


// ==========================================
// MUSIK
// ==========================================
let isPlaying = false;

function playMusic() {

  if (!bgMusic) return;

  bgMusic.volume = 0.4;

  bgMusic.play()
    .then(function () {

      isPlaying = true;

      if (musicPlayer) {
        musicPlayer.classList.add("playing");
      }

    })
    .catch(function (error) {

      console.log("Musik tidak dapat diputar otomatis:", error);

    });
}


if (musicPlayer) {

  musicPlayer.addEventListener("click", function () {

    if (!bgMusic) return;

    if (isPlaying) {

      bgMusic.pause();
      isPlaying = false;

      musicPlayer.classList.remove("playing");

    } else {

      bgMusic.play()
        .then(function () {

          isPlaying = true;
          musicPlayer.classList.add("playing");

        })
        .catch(function (error) {

          console.log("Musik gagal diputar:", error);

        });

    }

  });

}


// ==========================================
// FORM UCAPAN
// ==========================================
if (rsvpForm) {

  rsvpForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const nameElement = document.getElementById("name");
    const statusElement = document.getElementById("status");
    const messageElement = document.getElementById("message");

    const name = nameElement ? nameElement.value.trim() : "";
    const status = statusElement ? statusElement.value : "";
    const message = messageElement ? messageElement.value.trim() : "";


    // Cek data
    if (!name || !status || !message) {

      alert("Mohon lengkapi semua data terlebih dahulu.");

      return;
    }


    // Tombol submit
    const submitButton = rsvpForm.querySelector(
      'button[type="submit"]'
    );

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Mengirim...";
    }


    // ==========================================
    // KIRIM KE GOOGLE SHEET
    // ==========================================
    try {

      const data = new URLSearchParams();

      data.append("nama", name);
      data.append("status", status);
      data.append("ucapan", message);


      await fetch(GOOGLE_SCRIPT_URL, {

        method: "POST",

        body: data

      });


      // ==========================================
      // TAMPILKAN UCAPAN DI WEBSITE
      // ==========================================
      addWishToPage(
        name,
        status,
        message
      );


      // Kosongkan form
      rsvpForm.reset();


      alert("Ucapan berhasil dikirim ❤️");


    } catch (error) {

      console.error(
        "Gagal mengirim ucapan:",
        error
      );

      alert(
        "Ucapan gagal dikirim. Silakan coba lagi."
      );


    } finally {

      if (submitButton) {

        submitButton.disabled = false;

        submitButton.textContent = "Kirim Ucapan";

      }

    }

  });

}


// ==========================================
// MENAMBAHKAN UCAPAN KE HALAMAN
// ==========================================
function addWishToPage(
  name,
  status,
  message
) {

  if (!wishesList) return;


  const wishItem = document.createElement("div");

  wishItem.classList.add("wish-item");


  wishItem.innerHTML = `
    <p class="wish-name">
      ${escapeHtml(name)}
    </p>

    <p class="wish-status">
      ${escapeHtml(status)}
    </p>

    <p class="wish-message">
      ${escapeHtml(message)}
    </p>
  `;


  wishesList.prepend(wishItem);


  wishItem.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

}


// ==========================================
// MENGAMBIL UCAPAN DARI GOOGLE SHEET
// ==========================================
async function loadWishes() {

  if (!wishesList) return;


  try {

    const response = await fetch(
      GOOGLE_SCRIPT_URL
    );


    const data = await response.json();


    // Bersihkan daftar lama
    wishesList.innerHTML = "";


    // Jika belum ada ucapan
    if (!Array.isArray(data)) {

      console.log(
        "Data ucapan belum tersedia:",
        data
      );

      return;
    }


    // Tampilkan semua ucapan
    data.reverse().forEach(function (wish) {

      addWishToPage(
        wish.nama || "",
        wish.status || "",
        wish.ucapan || ""
      );

    });


  } catch (error) {

    console.error(
      "Gagal mengambil ucapan:",
      error
    );

  }

}


// ==========================================
// AMANKAN TEKS DARI USER
// ==========================================
function escapeHtml(text) {

  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;

}


// ==========================================
// ANIMASI SECTION
// ==========================================
const observerOptions = {

  threshold: 0.1,

  rootMargin: "0px 0px -50px 0px"

};


const observer = new IntersectionObserver(

  function (entries) {

    entries.forEach(function (entry) {

      if (entry.isIntersecting) {

        entry.target.style.opacity = "1";

        entry.target.style.transform =
          "translateY(0)";

      }

    });

  },

  observerOptions

);


document
  .querySelectorAll(
    ".hero, .couple, .events, .gallery, .rsvp"
  )
  .forEach(function (section) {

    section.style.opacity = "0";

    section.style.transform =
      "translateY(30px)";

    section.style.transition =
      "opacity 0.8s ease, transform 0.8s ease";

    observer.observe(section);

  });
