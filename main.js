// ── PAGE TRANSITIONS ──
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('a[href]').forEach(function(link) {
    const href = link.getAttribute('href');
    // Only intercept same-site page links, not anchors, not external, not PDF
    if (
      href &&
      !href.startsWith('#') &&
      !href.startsWith('http') &&
      !href.endsWith('.pdf') &&
      link.target !== '_blank'
    ) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        document.body.classList.add('fade-out');
        setTimeout(function() {
          window.location.href = href;
        }, 300);
      });
    }
  });
});

// ── NAV ──
function toggleMenu() {
  const menu = document.getElementById("nav-menu");
  const icon = document.getElementById("menuIcon");
  menu.classList.toggle("active");
  icon.textContent = menu.classList.contains("active") ? "✖" : "☰";
}

function closeMenu() {
  const menu = document.getElementById("nav-menu");
  const icon = document.getElementById("menuIcon");
  if (menu) menu.classList.remove("active");
  if (icon) icon.textContent = "☰";
}

document.addEventListener("click", function(e) {
  const menu = document.getElementById("nav-menu");
  const icon = document.getElementById("menuIcon");
  if (menu && menu.classList.contains("active") && !menu.contains(e.target) && e.target !== icon) {
    menu.classList.remove("active");
    if (icon) icon.textContent = "☰";
  }
});

// ── PARTICLES ──
(function() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = [];
  for (let i = 0; i < 80; i++) {
    particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: Math.random() * 2 });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00c3d1';
    particles.forEach(function(p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      p.y += 0.3;
      if (p.y > canvas.height) p.y = 0;
    });
    requestAnimationFrame(animate);
  }
  animate();
})();

// ── LIGHTBOX ──
function openLightbox(src, alt) {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  if (!lb || !img) return;
  img.src = src;
  img.alt = alt || '';
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (lb) lb.classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeLightbox();
});

// ── CAROUSEL ──
const carouselState = {};

function initCarousels() {
  document.querySelectorAll('.pd-carousel').forEach(function(carousel) {
    const id = carousel.getAttribute('data-id');
    const imgs = carousel.querySelectorAll('.pd-carousel-track img');
    const dotsContainer = document.getElementById('dots-' + id);
    const track = carousel.querySelector('.pd-carousel-track');
    const prevBtn = carousel.querySelector('.prev');
    const nextBtn = carousel.querySelector('.next');

    if (imgs.length === 0) {
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
      return;
    }

    carouselState[id] = 0;

    imgs.forEach(function(img, i) {
      img.addEventListener('click', function() { openLightbox(img.src, img.alt); });
      if (dotsContainer) {
        const dot = document.createElement('span');
        if (i === 0) dot.classList.add('active');
        dot.onclick = function() { goToSlide(id, i); };
        dotsContainer.appendChild(dot);
      }
    });
  });
}

function goToSlide(id, index) {
  const carousel = document.querySelector('.pd-carousel[data-id="' + id + '"]');
  if (!carousel) return;
  const imgs = carousel.querySelectorAll('.pd-carousel-track img');
  const track = carousel.querySelector('.pd-carousel-track');
  const dots = document.querySelectorAll('#dots-' + id + ' span');
  if (imgs.length === 0) return;
  index = (index + imgs.length) % imgs.length;
  carouselState[id] = index;
  track.style.transform = 'translateX(-' + (index * 100) + '%)';
  dots.forEach(function(d, i) { d.classList.toggle('active', i === index); });
}

function carouselMove(id, dir) {
  goToSlide(id, (carouselState[id] || 0) + dir);
}

// ── YOUTUBE RSS ──
function loadYouTube(channelId) {
  const api = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent('https://www.youtube.com/feeds/videos.xml?channel_id=' + channelId);
  fetch(api)
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data.status === 'ok' && data.items && data.items.length > 0) {
        const video = data.items[0];
        const videoId = video.link.split('v=')[1];
        document.getElementById('yt-title').textContent = video.title;
        document.getElementById('yt-iframe').src = 'https://www.youtube.com/embed/' + videoId + '?rel=0&modestbranding=1';
        document.getElementById('yt-loading').style.display = 'none';
        document.getElementById('yt-content').style.display = 'block';
      } else { throw new Error(); }
    })
    .catch(function() {
      document.getElementById('yt-loading').style.display = 'none';
      document.getElementById('yt-error').style.display = 'block';
    });
}

document.addEventListener('DOMContentLoaded', function() {
  initCarousels();
});
