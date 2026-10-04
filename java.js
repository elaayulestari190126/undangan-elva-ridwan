// ========== ELEMEN ==========
const cover = document.getElementById('cover');
const btnOpen = document.getElementById('btnOpen');
const mainContent = document.getElementById('mainContent');
const musicPlayer = document.getElementById('musicPlayer');
const bgMusic = document.getElementById('bgMusic');
const rsvpForm = document.getElementById('rsvpForm');
const wishesList = document.getElementById('wishesList');

// ========== BUKA UNDANGAN ==========
btnOpen.addEventListener('click', function () {
  cover.classList.add('hidden');
  mainContent.classList.add('visible');

  // Putar musik otomatis setelah interaksi pengguna
  playMusic();

  // Scroll ke atas
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ========== MUSIC PLAYER ==========
let isPlaying = false;

function playMusic() {
  bgMusic.volume = 0.4;
  bgMusic.play().then(() => {
    isPlaying = true;
    musicPlayer.classList.add('playing');
  }).catch((err) => {
    console.log('Autoplay diblokir:', err);
  });
}

musicPlayer.addEventListener('click', function () {
  if (isPlaying) {
    bgMusic.pause();
    isPlaying = false;
    musicPlayer.classList.remove('playing');
  } else {
    bgMusic.play();
    isPlaying = true;
    musicPlayer.classList.add('playing');
  }
});

// ========== RSVP FORM ==========
rsvpForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const status = document.getElementById('status').value;
  const message = document.getElementById('message').value.trim();

  if (!name || !status || !message) {
    alert('Mohon lengkapi semua data terlebih dahulu.');
    return;
  }

  // Buat elemen ucapan baru
  const wishItem = document.createElement('div');
  wishItem.classList.add('wish-item');
  wishItem.innerHTML = `
    <p class="wish-name">${escapeHtml(name)}</p>
    <p class="wish-status">${escapeHtml(status)}</p>
    <p class="wish-message">${escapeHtml(message)}</p>
  `;

  // Tambahkan ke daftar paling atas
  wishesList.prepend(wishItem);

  // Reset form
  rsvpForm.reset();

  // Scroll ke ucapan terbaru
  wishItem.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // Animasi
  wishItem.style.animation = 'none';
  wishItem.offsetHeight; // trigger reflow
  wishItem.style.animation = 'fadeIn 0.5s ease';
});

// Fungsi escape HTML untuk keamanan
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ========== ANIMASI SCROLL (OPSIONAL) ==========
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Terapkan ke section-section utama
document.querySelectorAll('.hero, .couple, .events, .gallery, .rsvp').forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(30px)';
  section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  observer.observe(section);
});
