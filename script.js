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

    // ===== SCROLL REVEAL =====
    const sections = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    sections.forEach(s => revealObserver.observe(s));

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
            const thumb = item.querySelector('.gallery-thumb');
            images.push({
                caption: caption ? caption.textContent : '',
                bg: thumb ? getComputedStyle(thumb).backgroundImage || '' : ''
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
            const img = images[currentIndex];
            lbImg.style.backgroundImage = img.bg || 'linear-gradient(135deg, #0a0a0a, #111111)';
            lbCaption.textContent = img.caption;
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

    // ===== VIDEO MODAL =====
    const videoCards = document.querySelectorAll('.project-card');
    if (videoCards.length) {
        const modal = document.createElement('div');
        modal.className = 'video-modal';
        modal.innerHTML = `
            <button class="video-modal-close" aria-label="Close">&times;</button>
            <div class="video-modal-content">
                <div class="video-modal-player"></div>
            </div>
        `;
        document.body.appendChild(modal);

        const player = modal.querySelector('.video-modal-player');
        const closeBtn = modal.querySelector('.video-modal-close');

        let currentIframe = null;

        videoCards.forEach(card => {
            const playBtn = card.querySelector('.play-btn');
            const videoId = card.dataset.videoId;
            if (!playBtn || !videoId) return;

            playBtn.addEventListener('click', () => {
                currentIframe = document.createElement('iframe');
                currentIframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0';
                currentIframe.allow = 'autoplay; encrypted-media';
                currentIframe.allowFullscreen = true;
                player.appendChild(currentIframe);
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            if (currentIframe) {
                currentIframe.remove();
                currentIframe = null;
            }
        }

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (modal.classList.contains('active') && e.key === 'Escape') closeModal();
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
