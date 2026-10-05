// ========================================
// KONFIGURASI GOOGLE APPS SCRIPT
// ========================================

const API_URL = "https://script.google.com/macros/s/AKfycby_NYHNjn14SD-QR8VNQ8RqWhlUmmTi0wek6rFzcdTDY_hdkuGTZsNNZr3N3VtbMB5nNw/exec";


// ========================================
// ELEMEN
// ========================================

const cover = document.getElementById("cover");
const btnOpen = document.getElementById("btnOpen");
const mainContent = document.getElementById("mainContent");

const musicPlayer = document.getElementById("musicPlayer");
const bgMusic = document.getElementById("bgMusic");

const rsvpForm = document.getElementById("rsvpForm");
const wishesList = document.getElementById("wishesList");


// ========================================
// BUKA UNDANGAN
// ========================================

btnOpen.addEventListener("click", function () {

    cover.classList.add("hidden");

    mainContent.classList.add("visible");

    playMusic();

    // Ambil ucapan dari Google Spreadsheet
    loadWishes();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


// ========================================
// MUSIK
// ========================================

let isPlaying = false;

function playMusic() {

    bgMusic.volume = 0.4;

    bgMusic.play()
        .then(function () {

            isPlaying = true;

            musicPlayer.classList.add("playing");

        })
        .catch(function (error) {

            console.log("Musik tidak dapat diputar:", error);

        });

}


musicPlayer.addEventListener("click", function () {

    if (isPlaying) {

        bgMusic.pause();

        isPlaying = false;

        musicPlayer.classList.remove("playing");

    } else {

        bgMusic.play();

        isPlaying = true;

        musicPlayer.classList.add("playing");

    }

});


// ========================================
// MENGAMBIL UCAPAN DARI GOOGLE SPREADSHEET
// ========================================

function loadWishes() {

    const callbackName = "wishesCallback_" + Date.now();

    window[callbackName] = function (data) {

        wishesList.innerHTML = "";

        if (!data || data.length === 0) {

            wishesList.innerHTML = `
                <p style="text-align:center;">
                    Belum ada ucapan.
                </p>
            `;

        } else {

            data.reverse().forEach(function (item) {

                const wishItem = document.createElement("div");

                wishItem.className = "wish-item";

                wishItem.innerHTML = `
                    <p class="wish-name">
                        ${escapeHtml(item.nama)}
                    </p>

                    <p class="wish-status">
                        ${escapeHtml(item.status)}
                    </p>

                    <p class="wish-message">
                        ${escapeHtml(item.ucapan)}
                    </p>
                `;

                wishesList.appendChild(wishItem);

            });

        }

        delete window[callbackName];

        if (script) {
            script.remove();
        }

    };


    const script = document.createElement("script");

    script.src =
        API_URL +
        "?callback=" +
        callbackName +
        "&t=" +
        Date.now();

    document.body.appendChild(script);

}


// ========================================
// KIRIM UCAPAN KE GOOGLE SPREADSHEET
// ========================================

rsvpForm.addEventListener("submit", function (e) {

    e.preventDefault();


    const name =
        document.getElementById("name").value.trim();

    const status =
        document.getElementById("status").value;

    const message =
        document.getElementById("message").value.trim();


    if (!name || !status || !message) {

        alert("Mohon lengkapi semua data terlebih dahulu.");

        return;

    }


    // ====================================
    // FORM TERSEMBUNYI
    // ====================================

    const hiddenForm = document.createElement("form");

    hiddenForm.method = "POST";

    hiddenForm.action = API_URL;

    hiddenForm.target = "google_sheet_iframe";


    // Nama
    const namaInput = document.createElement("input");

    namaInput.type = "hidden";

    namaInput.name = "nama";

    namaInput.value = name;

    hiddenForm.appendChild(namaInput);


    // Status
    const statusInput = document.createElement("input");

    statusInput.type = "hidden";

    statusInput.name = "status";

    statusInput.value = status;

    hiddenForm.appendChild(statusInput);


    // Ucapan
    const ucapanInput = document.createElement("input");

    ucapanInput.type = "hidden";

    ucapanInput.name = "ucapan";

    ucapanInput.value = message;

    hiddenForm.appendChild(ucapanInput);


    document.body.appendChild(hiddenForm);


    // Kirim ke Google Spreadsheet
    hiddenForm.submit();


    // Hapus form sementara
    setTimeout(function () {

        hiddenForm.remove();

    }, 1000);


    // ====================================
    // TAMPILKAN UCAPAN DI WEBSITE
    // ====================================

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


    wishesList.prepend(wishItem);


    // Kosongkan form
    rsvpForm.reset();


    alert("Ucapan berhasil dikirim ❤️");

});


// ========================================
// KEAMANAN TEKS
// ========================================

function escapeHtml(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}
