/* ===================================================================
   BTech Portfolio — index.js
   Modern, professional JavaScript with all interactions & animations
=================================================================== */

(function () {
    'use strict';

    // ── Particle Canvas Background ──────────────────────────────────
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrameId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticles() {
        particles = [];
        const count = Math.floor((canvas.width * canvas.height) / 22000);
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5 + 0.5,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                alpha: Math.random() * 0.5 + 0.1,
            });
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const isLight = document.body.classList.contains('light-mode');
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = isLight
                ? `rgba(99,102,241,${p.alpha * 0.4})`
                : `rgba(99,102,241,${p.alpha})`;
            ctx.fill();
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        });
        // Draw connections
        particles.forEach((a, i) => {
            particles.slice(i + 1).forEach(b => {
                const dist = Math.hypot(a.x - b.x, a.y - b.y);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    const alpha = (1 - dist / 100) * 0.08;
                    ctx.strokeStyle = isLight
                        ? `rgba(99,102,241,${alpha * 0.4})`
                        : `rgba(99,102,241,${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            });
        });
        animFrameId = requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    createParticles();
    drawParticles();
    window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
    });


    // ── Custom Cursor ───────────────────────────────────────────────
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');
    let mouseX = 0, mouseY = 0, outlineX = 0, outlineY = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    });

    function animateCursor() {
        outlineX += (mouseX - outlineX) * 0.12;
        outlineY += (mouseY - outlineY) * 0.12;
        outline.style.left = outlineX + 'px';
        outline.style.top = outlineY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.querySelectorAll('a, button, .skill-card, .project-card, .cert-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            outline.style.width = '52px';
            outline.style.height = '52px';
            outline.style.opacity = '0.8';
        });
        el.addEventListener('mouseleave', () => {
            outline.style.width = '36px';
            outline.style.height = '36px';
            outline.style.opacity = '0.5';
        });
    });


    // ── Navbar ──────────────────────────────────────────────────────
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveNav();
    });

    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
    });

    document.querySelectorAll('.mob-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
        });
    });

    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY + 100;
        sections.forEach(sec => {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            const id = sec.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                const active = document.querySelector(`.nav-link[data-section="${id}"]`);
                if (active) active.classList.add('active');
            }
        });
    }


    // ── Theme Toggle ────────────────────────────────────────────────
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeToggle.querySelector('i').className = 'fas fa-sun';
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const icon = themeToggle.querySelector('i');
        if (document.body.classList.contains('light-mode')) {
            icon.className = 'fas fa-sun';
            localStorage.setItem('portfolio-theme', 'light');
        } else {
            icon.className = 'fas fa-moon';
            localStorage.setItem('portfolio-theme', 'dark');
        }
    });


    // ── Typed Text Effect ───────────────────────────────────────────
    const typedEl = document.getElementById('typedText');
    const phrases = [
        'MERN Stack Developer',
        'DSA Enthusiast',
        'Competitive Programmer',
        'Full Stack Developer',
        'Java Developer'
    ];
    let phraseIdx = 0, charIdx = 0, isDeleting = false;

    function typeEffect() {
        const current = phrases[phraseIdx];
        if (isDeleting) {
            typedEl.textContent = current.substring(0, charIdx--);
        } else {
            typedEl.textContent = current.substring(0, charIdx++);
        }
        let delay = isDeleting ? 50 : 90;
        if (!isDeleting && charIdx === current.length + 1) {
            delay = 1800;
            isDeleting = true;
        } else if (isDeleting && charIdx < 0) {
            isDeleting = false;
            charIdx = 0;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            delay = 400;
        }
        setTimeout(typeEffect, delay);
    }
    typeEffect();


    // ── Counter Animation ───────────────────────────────────────────
    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 1800;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                el.textContent = target;
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(current);
            }
        }, 16);
    }

    let countersStarted = false;
    function checkCounters() {
        if (countersStarted) return;
        const statsSection = document.querySelector('.stats-section');
        if (!statsSection) return;
        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85) {
            countersStarted = true;
            document.querySelectorAll('.stat-num').forEach(el => animateCounter(el));
        }
    }


    // ── Skill Bar Animation ─────────────────────────────────────────
    const observedBars = new Set();
    function animateSkillBars(panel) {
        panel.querySelectorAll('.skill-fill').forEach(bar => {
            if (observedBars.has(bar)) return;
            observedBars.add(bar);
            const width = bar.getAttribute('data-width');
            setTimeout(() => {
                bar.style.width = width + '%';
            }, 100);
        });
    }

    // Animate active panel on load
    const activePanel = document.querySelector('.skills-panel.active');
    if (activePanel) {
        const skillsSection = document.querySelector('.skills-section');
        const checkSkills = () => {
            const rect = skillsSection.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.85) {
                animateSkillBars(activePanel);
                window.removeEventListener('scroll', checkSkills);
            }
        };
        window.addEventListener('scroll', checkSkills);
    }


    // ── Skills Tabs ─────────────────────────────────────────────────
    document.querySelectorAll('.skill-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.skill-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.skills-panel').forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            const panel = document.querySelector(`.skills-panel[data-panel="${tab.dataset.tab}"]`);
            if (panel) {
                panel.classList.add('active');
                animateSkillBars(panel);
            }
        });
    });


    // ── Project Filter ──────────────────────────────────────────────
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            document.querySelectorAll('.project-card').forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = '';
                    card.style.animation = 'fadeIn 0.4s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
            // Re-handle featured span
            const visible = document.querySelectorAll('.project-card:not([style*="none"])');
            visible.forEach((card, i) => {
                if (i === 0 && filter === 'all') {
                    card.classList.add('featured');
                } else {
                    card.classList.remove('featured');
                }
            });
        });
    });


    // ── Scroll Reveal (Intersection Observer) ──────────────────────
    const fadeEls = document.querySelectorAll(
        '.about-grid, .stat-card, .skill-card, .cert-card, .project-card, .tl-item, .blog-card, .contact-card, .section-header'
    );
    fadeEls.forEach(el => el.classList.add('fade-in'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(el => revealObserver.observe(el));


    // ── Scroll-based counter trigger ───────────────────────────────
    window.addEventListener('scroll', checkCounters);
    checkCounters(); // in case already visible



    // ── Contact Form with EmailJS ───────────────────────────────────
    // =====================================================
    // EMAIL SETUP INSTRUCTIONS (EmailJS — free, no backend)
    // =====================================================
    // 1. Go to https://www.emailjs.com → create a free account.
    // 2. Click "Add New Service" → choose Gmail (recommended)
    //    → complete OAuth → note your SERVICE_ID.
    // 3. Click "Email Templates" → "Create New Template".
    //    Use these variables in the template body:
    //        {{from_name}}  {{from_email}}  {{company}}  {{subject}}  {{message}}
    //    Save → note your TEMPLATE_ID.
    // 4. Go to "Account" → "General" → copy your PUBLIC KEY.
    // 5. Replace the three placeholder strings below with your real values.
    // =====================================================

    const EMAILJS_PUBLIC_KEY  = 'wO4mWAT_jNA-biMKV';   // ← replace
    const EMAILJS_SERVICE_ID  = 'service_p03mg6h';   // ← replace
    const EMAILJS_TEMPLATE_ID = 'template_uik3vmh';  // ← replace

    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }

    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const btn      = document.getElementById('contactSubmitBtn');
            const feedback = document.getElementById('contactFeedback');
            const original = btn.innerHTML;

            // Collect values
            const fromName  = form.querySelector('[name="from_name"]').value.trim();
            const fromEmail = form.querySelector('[name="from_email"]').value.trim();
            const subject   = form.querySelector('[name="subject"]').value.trim();
            const message   = form.querySelector('[name="message"]').value.trim();

            if (!fromName || !fromEmail || !subject) {
                showFeedback('Please fill in Name, Email, and Subject.', '#ef4444');
                return;
            }

            // Loading state
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            btn.disabled = true;
            feedback.style.display = 'none';

            const templateParams = {
                from_name:  fromName,
                from_email: fromEmail,
                company:    form.querySelector('[name="company"]').value.trim() || 'Not provided',
                subject:    subject,
                message:    message || '(no message body)',
            };

            if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY' || typeof emailjs === 'undefined') {
                // Keys not configured yet — show helpful message
                setTimeout(() => {
                    btn.innerHTML = original;
                    btn.disabled = false;
                    showFeedback(
                        '⚠️ EmailJS not configured yet. See setup instructions in index.js',
                        '#f59e0b'
                    );
                }, 800);
                return;
            }

            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
                .then(() => {
                    btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                    btn.style.background = 'linear-gradient(135deg,#10b981,#059669)';
                    showFeedback('✅ Message sent successfully! I\'ll get back to you soon.', '#10b981');
                    form.reset();
                    setTimeout(() => {
                        btn.innerHTML = original;
                        btn.style.background = '';
                        btn.disabled = false;
                    }, 3000);
                })
                .catch(err => {
                    console.error('EmailJS error:', err);
                    btn.innerHTML = original;
                    btn.disabled = false;
                    showFeedback('❌ Failed to send. Please try emailing directly at nkytata11@gmail.com', '#ef4444');
                });
        });
    }

    function showFeedback(msg, color) {
        const fb = document.getElementById('contactFeedback');
        if (!fb) return;
        fb.textContent = msg;
        fb.style.display = 'block';
        fb.style.background = color + '18';
        fb.style.color = color;
        fb.style.border = '1px solid ' + color;
    }



    // ── Smooth scroll for nav anchors ──────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const href = a.getAttribute('href');
            if (href === '#' || href === '') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });


    // ── Back to Top ─────────────────────────────────────────────────
    const backBtn = document.getElementById('backToTop');
    if (backBtn) {
        window.addEventListener('scroll', () => {
            backBtn.style.opacity = window.scrollY > 300 ? '1' : '0';
            backBtn.style.pointerEvents = window.scrollY > 300 ? 'all' : 'none';
        });
        backBtn.style.opacity = '0';
    }


    // ── Add fadeIn keyframe dynamically ────────────────────────────
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

})();
