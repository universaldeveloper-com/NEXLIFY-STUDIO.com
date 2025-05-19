// script.js - (Keep the version from the previous response, as it already handles the AI simulation and modal logic)
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
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href').startsWith('#')) {
                    body.classList.remove('menu-open');
                    menuToggleBtn.classList.remove('active');
                    menuToggleBtn.setAttribute('aria-expanded', 'false');
                    mobileMenu.classList.remove('active');
                }
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
    const savedTheme = localStorage.getItem('nexlifyTheme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            applyTheme('light');
        } else {
            applyTheme('dark');
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
            if (href.length > 1 && document.querySelector(href)) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                const headerOffset = document.querySelector('.site-header')?.offsetHeight || 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });

    // --- Intersection Observer for Scroll-Triggered Animations ---
    const scrollRevealElements = document.querySelectorAll('[data-scroll-reveal]');
    const revealObserverOptions = { root: null, threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, revealObserverOptions);
    scrollRevealElements.forEach(el => { revealObserver.observe(el); });

    // --- Parallax Card Effect (Demo Page) ---
    const parallaxCards = document.querySelectorAll('.parallax-card');
    if (parallaxCards.length > 0 && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            parallaxCards.forEach((card, index) => {
                const speed = (index + 1) * 0.15;
                const parentTop = card.parentElement ? card.parentElement.getBoundingClientRect().top : 0;
                let moveY = (parentTop * speed) - (100 * speed * (index +1) *0.2) ;
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
            });
        });
    });

    // --- Homepage Contact Form - Invalid Message Popup ---
    const contactForm = document.querySelector('.contact-form');
    const invalidMessageModal = document.getElementById('invalidMessageModal');
    const closeInvalidModalBtn = document.getElementById('closeInvalidModalBtn');
    if (contactForm && invalidMessageModal && closeInvalidModalBtn) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            invalidMessageModal.classList.add('active');
        });
        closeInvalidModalBtn.addEventListener('click', () => {
            invalidMessageModal.classList.remove('active');
        });
        invalidMessageModal.addEventListener('click', (e) => {
            if (e.target === invalidMessageModal) {
                invalidMessageModal.classList.remove('active');
            }
        });
    }

    // --- NEXLIFY AI Simulation ---
    const aiChatWindow = document.querySelector('.ai-chat-window');
    const aiUserInput = document.getElementById('aiUserInput');
    const aiSendBtn = document.getElementById('aiSendBtn');
    const nexlifyAIResponses = {
        "hello": "Hi there! How can NEXLIFY STUDIO assist you today?", "hi": "Hello! I'm the NEXLIFY AI. What can I do for you?",
        "what services do you offer?": "NEXLIFY STUDIO specializes in creating stunning Personal & Portfolio Websites, professional Business Websites, and fully Custom Web Solutions. We also excel in Advanced Animations & UI/UX design. Would you like to know more about a specific service?",
        "services": "We offer Personal & Portfolio Sites, Business Websites, Custom Web Solutions, and Advanced Animations & UI/UX. For details, you can ask about one, or visit our Premium page!",
        "tell me about your design process": "Our design process is collaborative! We start with understanding your vision, then move to wireframing, mockups (with your feedback!), development, testing, and finally, launch. We keep you in the loop every step of the way. 📝",
        "process": "We follow a collaborative process: Discovery & Strategy ➡️ Design & Prototyping ➡️ Development ➡️ Testing & QA ➡️ Launch & Support. Full transparency!",
        "portfolio": "You can see examples of our work and capabilities on our 'Showcase' page. We've built a variety of dynamic and visually appealing websites!",
        "showcase": "Head over to our 'Showcase' page to see interactive demos of 3D elements, parallax effects, advanced animations, and polished UI components we can create!",
        "pricing": "For pricing details, it's best to discuss your specific project needs. Please use our contact form or email us, and we can provide a custom quote. We also have a 'Premium Services' page with more info!",
        "contact": "You can reach us via the contact form on this page or email us directly at universaldeveloper07@gmail.com. We're excited to hear from you! 📧",
        "who are you?": "I'm a simulated AI assistant for NEXLIFY STUDIO, here to help answer your questions about their services. I'm powered by imagination and some clever JavaScript! 😉",
        "what is nexlify studio?": "NEXLIFY STUDIO, developed by the Universal Developer Team, is a creative web design and development studio dedicated to crafting exceptional digital experiences. We build personal, portfolio, business, and custom websites with a focus on modern aesthetics and cutting-edge technology.",
        "default": "Thanks for your question! For more detailed information or specific inquiries, please reach out to the NEXLIFY STUDIO team directly via the contact form or email. They'd be happy to assist you!"
    };
    function addAiMessage(message, sender) {
        if (!aiChatWindow) return;
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('ai-message', `ai-message-${sender}`);
        const avatarDiv = document.createElement('div');
        avatarDiv.classList.add('ai-avatar', sender === 'bot' ? 'bot-avatar' : 'user-avatar');
        avatarDiv.textContent = sender === 'bot' ? 'AI' : 'You';
        const bubbleDiv = document.createElement('div');
        bubbleDiv.classList.add('ai-bubble');
        bubbleDiv.textContent = message;
        messageDiv.appendChild(avatarDiv); messageDiv.appendChild(bubbleDiv);
        aiChatWindow.appendChild(messageDiv);
        aiChatWindow.scrollTop = aiChatWindow.scrollHeight;
    }
    function getAIResponse(userInput) {
        const lowerInput = userInput.toLowerCase().trim().replace(/[?.,!]/g, "");
        let foundResponse = nexlifyAIResponses.default;
        for (const keyword in nexlifyAIResponses) { if (lowerInput.includes(keyword)) { foundResponse = nexlifyAIResponses[keyword]; break; } }
        return foundResponse;
    }
    function handleAISend() {
        if (!aiUserInput || !aiSendBtn) return;
        const userInputText = aiUserInput.value.trim();
        if (userInputText === "") return;
        addAiMessage(userInputText, 'user');
        aiUserInput.value = "";
        aiUserInput.style.height = 'auto';
        aiSendBtn.disabled = true;
        setTimeout(() => {
            const botResponse = getAIResponse(userInputText);
            addAiMessage(botResponse, 'bot');
            aiSendBtn.disabled = false;
        }, 800 + Math.random() * 700);
    }
    if (aiSendBtn && aiUserInput) {
        aiSendBtn.addEventListener('click', handleAISend);
        aiUserInput.addEventListener('keypress', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAISend(); } });
        aiUserInput.addEventListener('input', () => { aiUserInput.style.height = 'auto'; aiUserInput.style.height = (aiUserInput.scrollHeight) + 'px'; });
    }
});
