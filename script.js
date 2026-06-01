function getViewportHeight() {
    if (window.visualViewport && window.visualViewport.height > 0) {
        return Math.round(window.visualViewport.height);
    }
    return Math.round(window.innerHeight);
}

function fixHeroHeight() {
    const hero = document.querySelector('.hero');
    const main = document.querySelector('main');
    if (!hero) return;
    const h = getViewportHeight();
    hero.style.height = h + 'px';
    if (main) main.style.paddingTop = h + 'px';
}
fixHeroHeight();
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);
window.addEventListener('resize', fixHeroHeight);
if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', fixHeroHeight);
}
document.addEventListener('DOMContentLoaded', fixHeroHeight);
window.addEventListener('load', fixHeroHeight);

document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('pageshow', () => {
        fixHeroHeight();
        window.scrollTo(0, 0);
    });

    // ===== HERO-CONTENT-PORTFOLIO SNAP CHAIN =====
    (function() {
        let prevY = window.scrollY;
        let lastSnap = 0;
        let contentTop = 0;
        let portfolioTop = 0;

        function calcTargets() {
            const vh = window.innerHeight;
            const hero = document.querySelector('.hero');
            const heroH = hero ? hero.offsetHeight : vh;
            contentTop = heroH + vh;
            const portfolio = document.querySelector('.sec-portfolio');
            portfolioTop = portfolio ? portfolio.offsetTop : contentTop + vh * 3;
        }

        calcTargets();
        window.addEventListener('resize', calcTargets);
        window.addEventListener('load', calcTargets);

        window.addEventListener('scroll', function() {
            const y = window.scrollY;
            const vh = window.innerHeight;
            const goingDown = y > prevY;
            const goingUp = y < prevY;
            const now = Date.now();

            if (now - lastSnap < 300) return;

            if (goingDown) {
                if (y > 20 && y < contentTop) {
                    lastSnap = now;
                    window.scrollTo(0, contentTop);
                } else if (y >= contentTop && y < portfolioTop) {
                    lastSnap = now;
                    window.scrollTo(0, portfolioTop);
                }
            }

            if (goingUp) {
                if (y < portfolioTop && y > contentTop) {
                    lastSnap = now;
                    window.scrollTo(0, contentTop);
                } else if (y <= contentTop && y > 20) {
                    lastSnap = now;
                    window.scrollTo(0, 0);
                }
            }

            prevY = y;
        }, { passive: true });
    })();

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
    let timerInterval = setInterval(updateTimer, 1000);

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

    // ===== DECODE EFFECT (reusable) =====
    function triggerDecode(el, speedMul, callback) {
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
                if (callback) callback();
            }
        }, speeds[count] || 50);
    }

    // ===== DECODE SEQUENCE: Vision → Logo Ripple → Portfolio → Glitch =====
    const glitchWord = document.querySelector('.glitch-word');
    const decryptTarget = document.querySelector('.decrypt-target');

    if (glitchWord) {
        triggerDecode(glitchWord, 1, function() {
            const ctaLogo = document.querySelector('.hero-cta-logo');
            if (ctaLogo) {
                ctaLogo.classList.add('chromatic');
                setTimeout(function() {
                    if (decryptTarget) {
                        triggerDecode(decryptTarget, 1, function() {
                            glitchWord.classList.add('glitch-active');
                        });
                    } else {
                        glitchWord.classList.add('glitch-active');
                    }
            }, 1900);
            } else if (decryptTarget) {
                triggerDecode(decryptTarget, 1, function() {
                    glitchWord.classList.add('glitch-active');
                });
            } else {
                glitchWord.classList.add('glitch-active');
            }
        });
    }

    // ===== NAV LABEL CYCLE (1.7s camera / 0.3s scan / 1s clickable) =====
    const navHeader = document.querySelector('.hero-nav-header');
    if (navHeader) {
        const pills = navHeader.querySelectorAll('.nav-pill');
        let cycleTimer;

        function showCameraLabels() {
            pills.forEach(function(p) {
                p.textContent = p.getAttribute('aria-label');
                p.style.pointerEvents = 'none';
            });
            cycleTimer = setTimeout(showRealLabels, 1700);
        }

        function showRealLabels() {
            navHeader.classList.add('scanning', 'fill-wave');
            pills.forEach(function(p) {
                p.textContent = p.dataset.real;
                p.style.pointerEvents = 'auto';
            });
            cycleTimer = setTimeout(function() {
                navHeader.classList.remove('scanning', 'fill-wave');
                showCameraLabels();
            }, 1000);
        }

        showCameraLabels();

        // ===== NAV INDICATOR ARROW =====
        const indicatorArrow = document.querySelector('.nav-indicator-arrow');
        if (indicatorArrow) {
            function positionArrow(pill) {
                const y = pill.offsetTop + pill.offsetHeight / 2;
                indicatorArrow.style.top = (y - 5) + 'px';
            }

            function freezeAndNavigate(href, steps) {
                if (cycleTimer) clearTimeout(cycleTimer);
                clearInterval(timerInterval);
                document.querySelector('.hero').classList.add('paused', 'focus-lock');
                pills.forEach(function(p) {
                    p.textContent = p.dataset.real;
                });
                setTimeout(function() {
                    document.querySelector('.hero').classList.remove('focus-lock');
                    const duration = steps * 0.3;
                    const targetPill = Array.from(pills).find(function(p) {
                        return p.getAttribute('href') === href;
                    });
                    if (targetPill) {
                        indicatorArrow.style.transition = 'top ' + duration + 's cubic-bezier(0.34, 1.56, 0.64, 1)';
                        positionArrow(targetPill);
                    }
                    setTimeout(function() {
                        window.location.href = href;
                    }, duration * 1000);
                }, 300);
            }

            // Initial position
            positionArrow(pills[0]);

            // Nav pill clicks
            pills.forEach(function(pill) {
                pill.addEventListener('click', function(e) {
                    if (pill.classList.contains('active')) return;
                    e.preventDefault();
                    const activeIndex = Array.from(pills).findIndex(function(p) {
                        return p.classList.contains('active');
                    });
                    const targetIndex = Array.from(pills).indexOf(pill);
                    const steps = Math.abs(targetIndex - activeIndex);
                    freezeAndNavigate(pill.getAttribute('href'), steps);
                });
            });

            // Portfolio word click (under logo) — no freeze
            const heroLabelLink = document.querySelector('.hero-label a');
            if (heroLabelLink) {
                heroLabelLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    const href = this.getAttribute('href');
                    const portfolioPill = pills[1];

                    indicatorArrow.style.transition = 'top 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    positionArrow(portfolioPill);
                    this.classList.add('selecting');
                    playSelectSound();

                    setTimeout(function() {
                        window.location.href = href;
                    }, 300);
                });
            }
        }
    }

    // ===== SFX: CYBORG SELECTION (old) =====
    function playCyborgSound() {
        try {
            var ctx = new (window.AudioContext || window.webkitAudioContext)();
            var osc = ctx.createOscillator();
            var gain = ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(600, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
            osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.18);
            gain.gain.setValueAtTime(0.25, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.2);
        } catch(e) {}
    }

    // ===== SFX: MGS V MENU CLICK =====
    function playSelectSound() {
        try {
            var ctx = new (window.AudioContext || window.webkitAudioContext)();
            var t = ctx.currentTime;

            var osc = ctx.createOscillator();
            var gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(300, t);
            osc.frequency.exponentialRampToValueAtTime(1400, t + 0.08);
            osc.frequency.exponentialRampToValueAtTime(1000, t + 0.18);
            gain.gain.setValueAtTime(0.3, t);
            gain.gain.exponentialRampToValueAtTime(0.25, t + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(t);
            osc.stop(t + 0.2);

            var osc2 = ctx.createOscillator();
            var gain2 = ctx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(450, t);
            osc2.frequency.exponentialRampToValueAtTime(2100, t + 0.06);
            osc2.frequency.exponentialRampToValueAtTime(1500, t + 0.15);
            gain2.gain.setValueAtTime(0.12, t);
            gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.18);
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.start(t);
            osc2.stop(t + 0.18);
        } catch(e) {}
    }

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

    // ===== GLOBAL LINK CLICK SFX =====
    document.addEventListener('click', function(e) {
        var a = e.target.closest('a');
        if (a && a.href) {
            if (a.closest('.hero-label')) return;
            playCyborgSound();
        }
    });

    // ===== SUPER MARIO EASTER EGG (speaker toggle) =====
    (function() {
        var btn = document.getElementById('musicToggle');
        var iconMuted = document.getElementById('musicIconMuted');
        var iconOn = document.getElementById('musicIconOn');
        var audio = null;
        var isPlaying = false;

        if (!btn) return;

        btn.addEventListener('click', function() {
            if (!isPlaying) {
                if (!audio) {
                    audio = new Audio('assets/super-mario-theme.mp3');
                    audio.loop = true;
                    audio.volume = 0.5;
                }
                audio.play().then(function() {
                    isPlaying = true;
                    iconMuted.classList.add('hidden');
                    iconOn.classList.remove('hidden');
                }).catch(function() {});
            } else {
                audio.pause();
                isPlaying = false;
                iconOn.classList.add('hidden');
                iconMuted.classList.remove('hidden');
            }
        });
    })();
});
