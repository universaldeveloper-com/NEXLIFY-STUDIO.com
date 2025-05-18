document.addEventListener('DOMContentLoaded', () => {

    // Smooth scroll for internal links & active nav highlighting
    const navLinks = document.querySelectorAll('header nav a[href^="#"], .hero-cta-group a[href^="#"]');
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#') && href.length > 1) { // Check it's an actual anchor
                e.preventDefault();
                const targetId = href;
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerOffset = document.querySelector('header').offsetHeight + 20; // Adjust for fixed header + some padding
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Current Year for Footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Active Nav Link based on current page (simple version)
    const currentPage = window.location.pathname.split("/").pop();
    const headerNavLinks = document.querySelectorAll('header nav a');
    headerNavLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage || (currentPage === '' && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });


    // Demo Page: Counters Animation
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // The lower the slower

    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const inc = target / speed;

        if (count < target) {
            counter.innerText = Math.ceil(count + inc);
            setTimeout(() => animateCounter(counter), 15);
        } else {
            counter.innerText = target;
        }
    };

    // Intersection Observer for counters (start when visible)
    const observerOptions = {
        root: null,
        threshold: 0.5 // Trigger when 50% of the element is visible
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });


    // Demo Page: Accordion
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            // Close all other items
            accordionItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.accordion-content').style.maxHeight = null;
                }
            });
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
                content.style.maxHeight = null;
            } else {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // Demo Page: Modal
    const modal = document.getElementById("demoModal");
    const openModalBtn = document.getElementById("openModalBtn");
    const closeModalSpans = document.querySelectorAll(".close-modal-btn, #closeModalInsideBtn");

    if (openModalBtn && modal) {
        openModalBtn.onclick = function() {
            modal.style.display = "block";
        }
    }

    closeModalSpans.forEach(span => {
        if (span && modal) {
            span.onclick = function() {
                modal.style.display = "none";
            }
        }
    });

    if (modal) {
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }

});
