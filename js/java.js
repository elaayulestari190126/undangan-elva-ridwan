// ==========================================
// JAVA.JS - UNDANGAN ELVA & RIDWAN
// ==========================================


// ==========================================
// AMBIL ELEMEN HTML
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

if (btnOpen && cover && mainContent) {

    btnOpen.addEventListener("click", function () {

        // Hilangkan cover
        cover.classList.add("hidden");

        // Tampilkan isi undangan
        mainContent.classList.add("visible");

        // Putar musik
        playMusic();

        // Kembali ke bagian paling atas
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

            console.log("Musik belum dapat diputar:", error);

        });

}


// Tombol musik

if (musicPlayer && bgMusic) {

    musicPlayer.addEventListener("click", function () {

        if (isPlaying) {

            // Pause musik
            bgMusic.pause();

            isPlaying = false;

            musicPlayer.classList.remove("playing");

        } else {

            // Play musik
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

    rsvpForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const nameInput = document.getElementById("name");
        const statusInput = document.getElementById("status");
        const messageInput = document.getElementById("message");


        const name = nameInput
            ? nameInput.value.trim()
            : "";

        const status = statusInput
            ? statusInput.value
            : "";

        const message = messageInput
            ? messageInput.value.trim()
            : "";


        // Cek data

        if (!name || !status || !message) {

            alert("Mohon lengkapi semua data terlebih dahulu.");

            return;

        }


        // Tambahkan ucapan ke halaman

        addWish(
            name,
            status,
            message
        );


        // Kosongkan form

        rsvpForm.reset();


        alert("Ucapan berhasil dikirim ❤️");

    });

}


// ==========================================
// MENAMBAHKAN UCAPAN
// ==========================================

function addWish(name, status, message) {

    if (!wishesList) return;


    const wishItem = document.createElement("div");

    wishItem.className = "wish-item";


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


    // Ucapan terbaru di atas

    wishesList.prepend(wishItem);

}


// ==========================================
// KEAMANAN TEKS
// ==========================================

function escapeHtml(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// ==========================================
// ANIMASI SECTION
// ==========================================

if ("IntersectionObserver" in window) {

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

        {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        }

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

}
