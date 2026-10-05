// ==========================================
// ELEMEN
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

            console.log("Musik belum bisa diputar:", error);

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

                    console.log("Musik gagal:", error);

                });
        }

    });

}


// ==========================================
// FORM UCAPAN
// ==========================================
if (rsvpForm) {

    rsvpForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const nameElement = document.getElementById("name");
        const statusElement = document.getElementById("status");
        const messageElement = document.getElementById("message");

        const name = nameElement ? nameElement.value.trim() : "";
        const status = statusElement ? statusElement.value : "";
        const message = messageElement ? messageElement.value.trim() : "";

        if (!name || !status || !message) {

            alert("Mohon lengkapi semua data terlebih dahulu.");

            return;
        }

        addWishToPage(name, status, message);

        rsvpForm.reset();

        alert("Ucapan berhasil ditambahkan ❤️");

    });

}


// ==========================================
// TAMBAH UCAPAN KE HALAMAN
// ==========================================
function addWishToPage(name, status, message) {

    if (!wishesList) return;

    const wishItem = document.createElement("div");

    wishItem.classList.add("wish-item");

    wishItem.innerHTML = `
        <p class="wish-name">${escapeHtml(name)}</p>
        <p class="wish-status">${escapeHtml(status)}</p>
        <p class="wish-message">${escapeHtml(message)}</p>
    `;

    wishesList.prepend(wishItem);

}


// ==========================================
// AMANKAN TEKS
// ==========================================
function escapeHtml(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// ==========================================
// ANIMASI
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
