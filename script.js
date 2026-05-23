if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {

    // ===== RECORDING TIMER =====
    const timerDisplay = document.getElementById('timerDisplay');
    const recTimeDisplay = document.getElementById('recTime');
    let startTime = Date.now();

    function updateTimer() {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
        const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
        const s = String(elapsed % 60).padStart(2, '0');
        const val = h + ':' + m + ':' + s;
        if (timerDisplay) timerDisplay.textContent = val;
        if (recTimeDisplay) recTimeDisplay.textContent = val;
    }

    updateTimer();
    setInterval(updateTimer, 1000);

    // ===== SCROLL REVEAL - STAGGERED PER SECTION =====
    const sections = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const section = entry.target;
                section.classList.add('visible');

                // Stagger children based on section type
                const cls = section.className;

                if (cls.includes('sec-skills')) {
                    section.querySelectorAll('.cloud-tag').forEach((t, i) => {
                        t.style.transitionDelay = (i * 60) + 'ms';
                    });
                }

                if (cls.includes('sec-comp')) {
                    section.querySelectorAll('.comp-tag').forEach((t, i) => {
                        t.style.transitionDelay = (i * 40) + 'ms';
                    });
                }

                if (cls.includes('sec-work') || cls.includes('sec-edu')) {
                    section.querySelectorAll('.timeline-item').forEach((t, i) => {
                        t.style.transitionDelay = (i * 120) + 'ms';
                        t.style.opacity = '0';
                        t.style.transform = i % 2 === 0 ? 'translateX(-20px)' : 'translateX(20px)';
                        t.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                        requestAnimationFrame(() => {
                            t.style.opacity = '1';
                            t.style.transform = 'translateX(0)';
                        });
                    });
                }

                if (cls.includes('sec-portfolio')) {
                    const glitchLink = section.querySelector('.glitch-link');
                    if (glitchLink && !glitchLink.dataset.decoded) {
                        glitchLink.dataset.decoded = 'true';
                        setTimeout(() => triggerDecode(glitchLink, 0.4), 400);
                    }
                }

                if (cls.includes('sec-lang')) {
                    section.querySelectorAll('.lang-pill').forEach((t, i) => {
                        const dirs = ['translateX(-20px)', 'translateY(-20px)', 'translateX(20px)'];
                        t.style.opacity = '0';
                        t.style.transform = t.style.transform + ' ' + dirs[i];
                        t.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                        t.style.transitionDelay = (i * 150) + 'ms';
                        requestAnimationFrame(() => {
                            t.style.opacity = '1';
                            t.style.transform = t.style.transform.replace(dirs[i], '');
                        });
                    });
                }
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(s => revealObserver.observe(s));

    // ===== SKILLS & COMPETENCIES COLLAPSE TOGGLE =====
    document.querySelectorAll('.sec-skills .sec-headline, .sec-comp .sec-headline').forEach(headline => {
        headline.addEventListener('click', () => {
            const section = headline.closest('.section');
            const content = section.querySelector('.collapse-content');
            const isOpen = content.classList.toggle('open');
            headline.classList.toggle('open');

            if (isOpen && section.classList.contains('sec-skills')) {
                section.querySelectorAll('.cloud-tag').forEach((t, i) => {
                    t.style.transitionDelay = (i * 60) + 'ms';
                });
            }
            if (isOpen && section.classList.contains('sec-comp')) {
                section.querySelectorAll('.comp-tag').forEach((t, i) => {
                    t.style.transitionDelay = (i * 40) + 'ms';
                });
            }
        });
    });

    // ===== BACK TO TOP =====
    const backBtn = document.createElement('button');
    backBtn.className = 'back-to-top';
    backBtn.innerHTML = '&#8593;';
    backBtn.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backBtn);

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                backBtn.classList.toggle('visible', window.scrollY > 300);
                ticking = false;
            });
            ticking = true;
        }
    });

    backBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===== HERO NAV HEADER VISIBLE ON SCROLL =====
    const heroNavHeader = document.querySelector('.hero-nav-header');
    if (heroNavHeader) {
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    heroNavHeader.classList.toggle('visible', window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 100);
                    ticking = false;
                });
                ticking = true;
            }
        });
        window.dispatchEvent(new Event('scroll'));
    }

    // ===== DECODE EFFECT (reusable) =====
    function triggerDecode(el, speedMul) {
        const originalText = el.getAttribute('data-text') || el.textContent;
        const chars = '!@#$%^&*0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        el.classList.add('decoding');
        let count = 0;
        const maxSteps = 10;
        const baseSpeeds = [80, 70, 60, 50, 40, 30, 25, 20, 15, 10];
        const speeds = baseSpeeds.map(s => Math.round(s * (speedMul || 1)));
        const decodeTimer = setInterval(() => {
            let scrambled = '';
            for (let i = 0; i < originalText.length; i++) {
                if (count > maxSteps - 3 && Math.random() > 0.5) {
                    scrambled += originalText[i];
                } else {
                    scrambled += chars[Math.floor(Math.random() * chars.length)];
                }
            }
            el.textContent = scrambled;
            count++;
            if (count >= maxSteps) {
                clearInterval(decodeTimer);
                el.textContent = originalText;
                el.classList.remove('decoding');
            }
        }, speeds[count] || 50);
    }

    // ===== VISION GLITCH — fire decode on load =====
    const glitchWord = document.querySelector('.glitch-word');
    if (glitchWord) triggerDecode(glitchWord);

    // ===== PORTFOLIO LABEL DECODE =====
    const decryptTarget = document.querySelector('.decrypt-target');
    if (decryptTarget) triggerDecode(decryptTarget);

    // ===== LIGHTBOX =====
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <button class="lightbox-close" aria-label="Close">&times;</button>
            <button class="lightbox-prev" aria-label="Previous">&#8249;</button>
            <button class="lightbox-next" aria-label="Next">&#8250;</button>
            <div class="lightbox-content">
                <div class="lightbox-image"></div>
                <p class="lightbox-caption"></p>
            </div>
        `;
        document.body.appendChild(lightbox);

        const lbImg = lightbox.querySelector('.lightbox-image');
        const lbCaption = lightbox.querySelector('.lightbox-caption');
        const lbClose = lightbox.querySelector('.lightbox-close');
        const lbPrev = lightbox.querySelector('.lightbox-prev');
        const lbNext = lightbox.querySelector('.lightbox-next');

        let currentIndex = 0;
        const images = [];

        galleryItems.forEach((item, index) => {
            const caption = item.querySelector('.gallery-caption');
            const img = item.querySelector('.gallery-thumb-img');
            images.push({
                caption: caption ? caption.textContent : '',
                src: img ? img.getAttribute('src') || '' : ''
            });
            item.style.cursor = 'pointer';
            item.addEventListener('click', () => openLightbox(index));
        });

        function openLightbox(index) {
            currentIndex = index;
            updateLightbox();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function updateLightbox() {
            const data = images[currentIndex];
            if (data.src) {
                lbImg.style.backgroundImage = 'url(' + data.src + ')';
            } else {
                lbImg.style.backgroundImage = 'linear-gradient(135deg, #0a0a0a, #111111)';
            }
            lbCaption.textContent = data.caption;
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        function prevImage() {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateLightbox();
        }

        function nextImage() {
            currentIndex = (currentIndex + 1) % images.length;
            updateLightbox();
        }

        lbClose.addEventListener('click', closeLightbox);
        lbPrev.addEventListener('click', prevImage);
        lbNext.addEventListener('click', nextImage);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'ArrowRight') nextImage();
        });
    }

    // ===== PORTFOLIO FILTER =====
    const filterContainer = document.querySelector('.filter-bar');
    const filterCards = document.querySelectorAll('.category-card');
    if (filterContainer && filterCards.length) {
        const filterBtns = filterContainer.querySelectorAll('.filter-btn');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;

                filterCards.forEach(card => {
                    const cat = card.dataset.category;
                    if (filter === 'all' || cat === filter) {
                        card.style.display = '';
                        setTimeout(() => card.style.opacity = '1', 10);
                    } else {
                        card.style.opacity = '0';
                        setTimeout(() => card.style.display = 'none', 300);
                    }
                });
            });
        });

        filterCards.forEach(c => c.style.transition = 'opacity 0.3s ease');
        filterBtns[0]?.click();
    }

    // ===== LOGO CAROUSEL =====
    const carousel = document.getElementById('logoCarousel');
    if (carousel) {
        const track = carousel.querySelector('.carousel-track');
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = carousel.querySelector('.carousel-prev');
        const nextBtn = carousel.querySelector('.carousel-next');
        const dotsContainer = carousel.querySelector('.carousel-dots');
        let currentIndex = 0;
        const totalSlides = slides.length;

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        function goToSlide(index) {
            currentIndex = index;
            track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
            dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
                d.classList.toggle('active', i === currentIndex);
            });
        }

        prevBtn.addEventListener('click', () => {
            goToSlide((currentIndex - 1 + totalSlides) % totalSlides);
        });

        nextBtn.addEventListener('click', () => {
            goToSlide((currentIndex + 1) % totalSlides);
        });
    }

    // ===== CONTACT FORM =====
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const submitBtn = contactForm.querySelector('.contact-submit');
        const originalText = submitBtn.textContent;

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = contactForm.querySelector('#contact-name').value.trim();
            const email = contactForm.querySelector('#contact-email').value.trim();
            const message = contactForm.querySelector('#contact-message').value.trim();

            if (!name || !email || !message) {
                showFormMessage('Please fill in all fields', 'error');
                return;
            }

            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);

            try {
                const res = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (res.ok) {
                    showFormMessage('Message sent successfully!', 'success');
                    contactForm.reset();
                } else {
                    showFormMessage('Something went wrong. Try again.', 'error');
                }
            } catch {
                showFormMessage('Connection error. Try again later.', 'error');
            }

            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });

        function showFormMessage(text, type) {
            const existing = contactForm.querySelector('.form-message');
            if (existing) existing.remove();

            const msg = document.createElement('p');
            msg.className = 'form-message form-message-' + type;
            msg.textContent = text;
            contactForm.appendChild(msg);

            setTimeout(() => msg.remove(), 4000);
        }
    }
});
