document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // ==========================================================================
    // THEME SWITCHER
    // ==========================================================================
    const themeBtn = document.getElementById('theme-btn');
    const body = document.body;

    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);

    themeBtn.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // ==========================================================================
    // MOBILE BURGER MENU
    // ==========================================================================
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const navLinksList = document.querySelectorAll('.nav-link');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking link
    navLinksList.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // ==========================================================================
    // STICKY HEADER & SCROLL SPY
    // ==========================================================================
    const header = document.getElementById('main-header');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        // Sticky Header class addition
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Scroll Spy active nav indicators
        let currentSec = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 180)) {
                currentSec = section.getAttribute('id');
            }
        });

        navLinksList.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSec}`) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================================================
    // STATS COUNT UP ANIMATION
    // ==========================================================================
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    const animateCounters = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            let count = 0;
            const duration = 2000; // 2 seconds animation
            const stepTime = Math.max(Math.floor(duration / target), 15);
            
            const timer = setInterval(() => {
                count += 1;
                
                // Customize display for 24/7 or percentages
                if (target === 24) {
                    stat.textContent = count + '/7';
                } else if (target === 100) {
                    stat.textContent = count + '%';
                } else {
                    stat.textContent = count + '+';
                }

                if (count >= target) {
                    if (target === 24) {
                        stat.textContent = '24/7';
                    } else if (target === 100) {
                        stat.textContent = '100%';
                    } else {
                        stat.textContent = target + '+';
                    }
                    clearInterval(timer);
                }
            }, stepTime);
        });
    };

    // Intersection Observer to trigger counters
    const observerOptions = {
        root: null,
        threshold: 0.3
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersStarted) {
                countersStarted = true;
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) {
        statsObserver.observe(statsBar);
    }

    // ==========================================================================
    // HERO 3D PARALLAX INTERACTION
    // ==========================================================================
    const heroMockupWrapper = document.getElementById('scene-3d');
    const laptop = document.getElementById('laptop-node');
    const phone = document.getElementById('phone-node');
    const floatCode = document.getElementById('float-code-card');
    const floatGlobe = document.getElementById('float-globe-card');
    const floatCog = document.getElementById('float-cog-card');
    const floatAnalytics = document.getElementById('float-analytics-card');

    if (heroMockupWrapper) {
        window.addEventListener('mousemove', (e) => {
            // Get center point of wrapper (or window for global tracking)
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            const mouseX = e.clientX - width / 2;
            const mouseY = e.clientY - height / 2;

            // Compute tilt ratios (-1 to 1)
            const ratioX = mouseX / (width / 2);
            const ratioY = mouseY / (height / 2);

            // Apply different degrees of 3D parallax offsets
            // Laptop base tilt
            laptop.style.transform = `translateZ(20px) rotateY(${-10 + ratioX * 12}deg) rotateX(${10 - ratioY * 12}deg)`;
            
            // Phone tilt (slightly faster response)
            phone.style.transform = `translateZ(50px) rotateY(${15 + ratioX * 18}deg) rotateX(${10 - ratioY * 18}deg) translateY(${ratioY * -10}px)`;

            // Floating floaters depth parallax translation
            floatCode.style.transform = `translateZ(85px) translateX(${ratioX * 30}px) translateY(${ratioY * 30}px)`;
            floatGlobe.style.transform = `translateZ(95px) translateX(${ratioX * -25}px) translateY(${ratioY * -25}px)`;
            floatCog.style.transform = `translateZ(65px) translateX(${ratioX * 20}px) translateY(${ratioY * -20}px)`;
            floatAnalytics.style.transform = `translateZ(75px) translateX(${ratioX * -35}px) translateY(${ratioY * 35}px)`;
        });
    }

    // ==========================================================================
    // PORTFOLIO FILTER
    // ==========================================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Set active class
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                // Add scale out/in animations
                item.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
                
                if (filterValue === 'all' || category === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.transform = 'scale(1)';
                        item.style.opacity = '1';
                    }, 50);
                } else {
                    item.style.transform = 'scale(0.8)';
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ==========================================================================
    // MODALS SECTION (QUOTE & SUCCESS POPUPS)
    // ==========================================================================
    const ctaQuoteBtn = document.getElementById('cta-quote-btn');
    const quoteModal = document.getElementById('quote-modal-overlay');
    const modalCloseIcon = document.getElementById('modal-close-icon');

    const successModal = document.getElementById('success-modal-overlay');
    const successCloseIcon = document.getElementById('success-modal-close-icon');
    const successBtn = document.getElementById('success-modal-btn');

    // Quote Modal actions
    const openModal = () => {
        quoteModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scrolling
    };

    const closeModal = () => {
        quoteModal.classList.remove('active');
        document.body.style.overflow = ''; 
        document.getElementById('modal-quote-form').reset();
        document.getElementById('modal-success-alert').style.display = 'none';
        document.getElementById('modal-quote-form').style.display = 'block';
    };

    // Success Modal actions
    const openSuccessModal = () => {
        successModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeSuccessModal = () => {
        successModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Privacy Modal actions
    const privacyLink = document.getElementById('privacy-link');
    const privacyModal = document.getElementById('privacy-modal-overlay');
    const privacyCloseIcon = document.getElementById('privacy-modal-close-icon');

    const openPrivacyModal = (e) => {
        if (e) e.preventDefault();
        privacyModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closePrivacyModal = () => {
        privacyModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Terms Modal actions
    const termsLink = document.getElementById('terms-link');
    const termsModal = document.getElementById('terms-modal-overlay');
    const termsCloseIcon = document.getElementById('terms-modal-close-icon');

    const openTermsModal = (e) => {
        if (e) e.preventDefault();
        termsModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeTermsModal = () => {
        termsModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (ctaQuoteBtn) ctaQuoteBtn.addEventListener('click', openModal);
    if (modalCloseIcon) modalCloseIcon.addEventListener('click', closeModal);

    if (successCloseIcon) successCloseIcon.addEventListener('click', closeSuccessModal);
    if (successBtn) successBtn.addEventListener('click', closeSuccessModal);

    if (privacyLink) privacyLink.addEventListener('click', openPrivacyModal);
    if (privacyCloseIcon) privacyCloseIcon.addEventListener('click', closePrivacyModal);

    if (termsLink) termsLink.addEventListener('click', openTermsModal);
    if (termsCloseIcon) termsCloseIcon.addEventListener('click', closeTermsModal);

    // Close modals when clicking outside content area
    window.addEventListener('click', (e) => {
        if (e.target === quoteModal) {
            closeModal();
        }
        if (e.target === successModal) {
            closeSuccessModal();
        }
        if (e.target === privacyModal) {
            closePrivacyModal();
        }
        if (e.target === termsModal) {
            closeTermsModal();
        }
    });

    // ==========================================================================
    // FORM SUBMISSIONS HANDLER (MOCKED WITH LOCAL STORAGE)
    // ==========================================================================
    const contactForm = document.getElementById('contact-form-element');
    const contactAlert = document.getElementById('contact-success-alert');
    const contactSubmitBtn = document.getElementById('contact-submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Gather values
            const name = document.getElementById('form-name').value;
            const email = document.getElementById('form-email').value;
            const subject = document.getElementById('form-subject').value;
            const message = document.getElementById('form-message').value;

            // Create record
            const submission = {
                type: 'contact',
                name,
                email,
                subject,
                message,
                timestamp: new Date().toISOString()
            };

            // Store in LocalStorage
            saveSubmission(submission);

            // Change button state to loading
            contactSubmitBtn.innerHTML = 'Sending... <i data-lucide="loader" class="btn-icon" style="animation: spinRing 2s linear infinite;"></i>';
            lucide.createIcons();
            contactSubmitBtn.disabled = true;

            const subjectMap = {
                web: 'Web',
                app: 'App',
                marketing: 'Marketing',
                content: 'Content',
                other: 'General Inquiry'
            };
            const categoryLabel = subjectMap[subject] || 'General';

            // Submit directly using FormSubmit AJAX
            fetch("https://formsubmit.co/ajax/help@kytechserv.com", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    _subject: `Contact Inquiry: ${categoryLabel}`,
                    "Dear Team": "You have received a new contact form submission from your website.",
                    "Name": name,
                    "Email": email,
                    "Client Message": message,
                    "This message was submitted through the contact form on": "https://kytechserv.com/",
                    "Best Regards": "Ky Tech Services Pvt Ltd"
                })
            })
            .then(response => response.json())
            .then(data => {
                // Show Alert
                contactAlert.style.display = 'flex';
                contactForm.reset();
                // Open success popup modal
                openSuccessModal();
            })
            .catch(error => {
                console.error("Direct send failed, using mailto fallback:", error);
                // Fallback to mailto link matching exact user template
                const emailSubject = `Contact Inquiry: ${categoryLabel}`;
                const emailBody = `Dear Team,\n\nYou have received a new contact form submission from your website.\n\n## Contact Details\n\nName: ${name}\nEmail: ${email}\n\nClient Message\n\n${message}\n\nThis message was submitted through the contact form on:\n[https://kytechserv.com/]\n\nBest Regards,\nKy Tech Services Pvt Ltd`;
                const mailtoUrl = `mailto:help@kytechserv.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
                window.location.href = mailtoUrl;
            })
            .finally(() => {
                // Restore Button state
                contactSubmitBtn.innerHTML = 'Send Message <i data-lucide="send" class="btn-icon"></i>';
                lucide.createIcons();
                contactSubmitBtn.disabled = false;

                // Hide alert after 5s
                setTimeout(() => {
                    contactAlert.style.display = 'none';
                }, 5000);
            });
        });
    }

    // Modal Quote Form Handler
    const modalForm = document.getElementById('modal-quote-form');
    const modalAlert = document.getElementById('modal-success-alert');

    if (modalForm) {
        modalForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('modal-name').value;
            const email = document.getElementById('modal-email').value;
            const budget = document.getElementById('modal-budget').value;
            const desc = document.getElementById('modal-desc').value;

            const submission = {
                type: 'quote',
                name,
                email,
                budget,
                desc,
                timestamp: new Date().toISOString()
            };

            saveSubmission(submission);

            // Change button state to loading
            const submitBtn = modalForm.querySelector('button[type="submit"]');
            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Sending... <i data-lucide="loader" class="btn-icon" style="animation: spinRing 2s linear infinite;"></i>';
            lucide.createIcons();
            submitBtn.disabled = true;

            // Submit directly using FormSubmit AJAX
            fetch("https://formsubmit.co/ajax/help@kytechserv.com", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    SubmissionType: "Custom Quote Request",
                    Name: name,
                    Email: email,
                    Budget: budget,
                    Summary: desc
                })
            })
            .then(response => response.json())
            .then(data => {
                closeModal();
                openSuccessModal();
            })
            .catch(error => {
                console.error("Direct quote request failed, using mailto fallback:", error);
                const emailSubject = `KY Tech Quote Request`;
                const emailBody = `Name: ${name}\nEmail: ${email}\nEstimated Budget: ${budget}\n\nProject Summary:\n${desc}`;
                const mailtoUrl = `mailto:help@kytechserv.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
                window.location.href = mailtoUrl;
                closeModal();
            })
            .finally(() => {
                submitBtn.innerHTML = originalBtnHtml;
                lucide.createIcons();
                submitBtn.disabled = false;
            });
        });
    }

    // Newsletter Form Handler
    const newsletterForm = document.getElementById('newsletter-form-element');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('.newsletter-input');
            const emailVal = emailInput.value;

            const submission = {
                type: 'newsletter',
                email: emailVal,
                timestamp: new Date().toISOString()
            };

            saveSubmission(submission);

            // Change state
            const submitBtn = newsletterForm.querySelector('.newsletter-btn');
            const originalIcon = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i data-lucide="check" style="width: 16px; height: 16px;"></i>';
            lucide.createIcons();
            emailInput.value = '';
            emailInput.placeholder = 'Subscribed successfully!';
            emailInput.disabled = true;

            setTimeout(() => {
                submitBtn.innerHTML = originalIcon;
                lucide.createIcons();
                emailInput.placeholder = 'Your Email Address';
                emailInput.disabled = false;
            }, 4000);
        });
    }

    // Helper to store in localStorage
    function saveSubmission(data) {
        let items = JSON.parse(localStorage.getItem('ky_submissions') || '[]');
        items.push(data);
        localStorage.setItem('ky_submissions', JSON.stringify(items));
    }
});
