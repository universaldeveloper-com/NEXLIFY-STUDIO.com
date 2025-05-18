document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const menuToggleBtn = document.getElementById('menuToggleBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const currentYearSpan = document.getElementById('currentYear');

    // --- Mobile Menu ---
    if (menuToggleBtn && mobileMenu) {
        menuToggleBtn.addEventListener('click', () => {
            body.classList.toggle('menu-open');
            menuToggleBtn.classList.toggle('active');
            menuToggleBtn.setAttribute('aria-expanded', menuToggleBtn.classList.contains('active'));
            mobileMenu.classList.toggle('active');
        });

        // Close menu when a link inside it is clicked (for single-page anchors)
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                // Only close if it's an anchor link on the same page
                if (link.getAttribute('href').startsWith('#')) {
                    body.classList.remove('menu-open');
                    menuToggleBtn.classList.remove('active');
                    menuToggleBtn.setAttribute('aria-expanded', 'false');
                    mobileMenu.classList.remove('active');
                }
                // For multi-page navigation, the page will reload anyway, closing the menu.
            });
        });
    }

    // --- Theme Toggle (Dark/Light Mode) ---
    const applyTheme = (theme) => {
        if (theme === 'light') {
            body.classList.add('light-mode');
            body.classList.remove('dark-mode');
        } else {
            body.classList.add('dark-mode');
            body.classList.remove('light-mode');
        }
    };

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const newTheme = body.classList.contains('light-mode') ? 'dark' : 'light';
            applyTheme(newTheme);
            localStorage.setItem('nexlifyTheme', newTheme);
        });
    }

    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('nexlifyTheme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        // Optional: Check system preference if no theme saved
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            applyTheme('light');
        } else {
            applyTheme('dark'); // Default to dark if no preference/storage
        }
    }

    // --- Current Year for Footer ---
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Smooth Scroll for internal links & Active Nav Highlighting ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.length > 1 && document.querySelector(href)) { // Check if it's a valid selector
                e.preventDefault();
                const targetElement = document.querySelector(href);
                const headerOffset = document.querySelector('.site-header')?.offsetHeight || 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // --- Intersection Observer for Scroll-Triggered Animations ---
    const scrollRevealElements = document.querySelectorAll('[data-scroll-reveal]');
    const revealObserverOptions = {
        root: null, // viewport
        threshold: 0.15, // 15% of item visible
        rootMargin: "0px 0px -50px 0px" // trigger a bit earlier
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: unobserve after revealing to save resources
                // observer.unobserve(entry.target);
            } else {
                // Optional: remove class if you want animation to replay on scroll up
                // entry.target.classList.remove('is-visible');
            }
        });
    }, revealObserverOptions);

    scrollRevealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Parallax Card Effect (Demo Page) ---
    const parallaxCards = document.querySelectorAll('.parallax-card');
    if (parallaxCards.length > 0 && window.innerWidth > 768) { // Only apply on larger screens
        window.addEventListener('scroll', () => {
            parallaxCards.forEach((card, index) => {
                const speed = (index + 1) * 0.15; // Different speed for each card
                // Ensure card.parentElement is not null
                const parentTop = card.parentElement ? card.parentElement.getBoundingClientRect().top : 0;
                let moveY = (parentTop * speed) - (100 * speed * (index +1) *0.2) ; // Adjust initial offset too

                // Cap movement to avoid excessive displacement
                moveY = Math.max(-150, Math.min(150, moveY));

                card.style.transform = `translateY(${moveY}px)`;
            });
        });
    }


    // --- Magnetic Button Effect (Demo Page) ---
    const magneticButtons = document.querySelectorAll('.btn-hover-magnetic');
    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            button.style.transform = `translate(${x * 0.15}px, ${y * 0.25}px) scale(1.05)`;
            button.style.boxShadow = `0 ${Math.abs(y*0.2)}px ${Math.abs(y*0.4)}px rgba(var(--accent-blue-rgb, 0, 122, 255), 0.3)`;
        });
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0,0) scale(1)';
            button.style.boxShadow = 'none';
        });
    });

    // --- Segmented Control (Demo Page) ---
    const segmentedControls = document.querySelectorAll('.segmented-control');
    segmentedControls.forEach(control => {
        const segments = control.querySelectorAll('.segment');
        segments.forEach(segment => {
            segment.addEventListener('click', () => {
                segments.forEach(s => s.classList.remove('active'));
                segment.classList.add('active');
                // console.log('Selected segment:', segment.dataset.value);
                // Add logic here based on selected segment if needed
            });
        });
    });

});
