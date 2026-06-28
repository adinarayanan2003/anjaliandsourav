/* ── Hero: static images, no scroll-drift ── */
/* images stay in place — all movement is CSS floating animation */

/* ── Nav background on scroll ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.pageYOffset > 60);
});

/* ── Scroll Reveal ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.story, .moment, .film, .closing').forEach((el) => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

/* ── Staggered Gallery Reveal ── */
const gallerySection = document.querySelector('.gallery-section');
if (gallerySection) {
  gallerySection.classList.add('reveal');
  revealObserver.observe(gallerySection);

  const galleryCards = gallerySection.querySelectorAll('.gallery-card');
  const galleryObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll('.gallery-card');
        cards.forEach((card, i) => {
          card.classList.add('reveal');
          card.style.transitionDelay = `${i * 80}ms`;
          setTimeout(() => card.classList.add('visible'), 50);
        });
        galleryObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  galleryObserver.observe(gallerySection);
}

/* ── 3D Tilt on Gallery Cards ── */
document.querySelectorAll('.gallery-card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateX(${-y * 18}deg) rotateY(${x * 18}deg) scale3d(1.02,1.02,1)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale3d(1,1,1)';
  });
});

/* ── Blur-up Loading ── */
document.querySelectorAll('.img-load').forEach((img) => {
  if (img.complete) {
    img.classList.add('loaded');
  } else {
    img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
    img.addEventListener('error', () => img.classList.add('loaded'), { once: true });
  }
});

/* ── Ambient Music ── */
const musicToggle = document.getElementById('musicToggle');
const ambient = document.getElementById('ambient');
let musicPlaying = false;

if (musicToggle && ambient) {
  // Try autoplay; if blocked, play on first user interaction
  const tryPlay = () => {
    ambient.play().then(() => {
      musicPlaying = true;
      musicToggle.classList.add('playing');
    }).catch(() => {
      // Autoplay blocked — wait for interaction
      const resume = () => {
        ambient.play().then(() => {
          musicPlaying = true;
          musicToggle.classList.add('playing');
        }).catch(() => {});
        document.removeEventListener('click', resume);
        document.removeEventListener('scroll', resume);
        document.removeEventListener('touchstart', resume);
      };
      document.addEventListener('click', resume, { once: true });
      document.addEventListener('scroll', resume, { once: true });
      document.addEventListener('touchstart', resume, { once: true });
    });
  };
  tryPlay();

  musicToggle.addEventListener('click', () => {
    if (musicPlaying) {
      ambient.pause();
      musicToggle.classList.remove('playing');
    } else {
      ambient.play().then(() => {
        musicToggle.classList.add('playing');
      }).catch(() => {});
    }
    musicPlaying = !musicPlaying;
  });
}

/* ── Back to Top ── */
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.pageYOffset > 500);
});
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── Lightbox ── */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lbClose = document.querySelector('.lb-close');
const lbPrev = document.querySelector('.lb-prev');
const lbNext = document.querySelector('.lb-next');
const lightboxTriggers = Array.from(document.querySelectorAll('[data-lightbox]'));
let lbIndex = 0;

function openLightbox(index) {
  lbIndex = index;
  lightboxImg.src = lightboxTriggers[index].dataset.lightbox;
  lightbox.classList.add('active');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function nextPhoto(e) {
  if (e) e.stopPropagation();
  lbIndex = (lbIndex + 1) % lightboxTriggers.length;
  lightboxImg.src = lightboxTriggers[lbIndex].dataset.lightbox;
}

function prevPhoto(e) {
  if (e) e.stopPropagation();
  lbIndex = (lbIndex - 1 + lightboxTriggers.length) % lightboxTriggers.length;
  lightboxImg.src = lightboxTriggers[lbIndex].dataset.lightbox;
}

lightboxTriggers.forEach((el, i) => {
  el.addEventListener('click', () => openLightbox(i));
});

lbClose.addEventListener('click', closeLightbox);
lbNext.addEventListener('click', nextPhoto);
lbPrev.addEventListener('click', prevPhoto);

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') nextPhoto();
  if (e.key === 'ArrowLeft') prevPhoto();
});
