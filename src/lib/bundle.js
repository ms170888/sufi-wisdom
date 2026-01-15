/**
 * Sufi Wisdom - Main JavaScript Bundle
 * Handles quiz functionality, mobile navigation, and results display
 */

(function() {
    'use strict';

    // =====================================================
    // Configuration
    // =====================================================
    const CONFIG = {
        storageKey: 'sufiWisdomQuizData',
        animationDuration: 300,
        paths: {
            love: {
                title: 'The Path of Ishq (Divine Love)',
                description: 'Your responses reveal a heart that seeks through feeling rather than intellect, through connection rather than isolation. The Sufis would recognize you as one drawn to the path of ishq - the burning love that consumes all barriers between lover and Beloved.',
                insight: 'Rumi wrote that there are many paths to the Beloved - through knowledge, through service, through devotion - but "love is the fastest." Your soul seems already to know this. The poetry will not just speak to you; it will speak you.',
                poets: ['Rumi', 'Hafiz'],
                practices: ['Heart Breath', 'Beloved Recognition', 'Evening Gratitude']
            },
            knowledge: {
                title: 'The Path of Marifa (Divine Knowledge)',
                description: 'Your responses suggest a seeker who wants to understand, not just feel. You ask questions. You seek patterns. The Sufis call this marifa - gnosis, direct knowing that goes beyond intellectual understanding to become wisdom embodied.',
                insight: 'Ibn Arabi said that true knowledge is not accumulation but unveiling - removing the veils of ignorance to see what was always there. Your questioning nature is not an obstacle; it is the beginning of the path.',
                poets: ['Ibn Arabi', 'Attar'],
                practices: ['Morning Poem Contemplation', 'Question Practice', 'Study Circle']
            },
            devotion: {
                title: 'The Path of Ibadat (Devotion)',
                description: 'Your heart inclines toward practice, toward doing, toward the comfort of regular devotion. The Sufis honor this as ibadat - worship that transforms the worshipper. Ritual becomes not empty form but living connection.',
                insight: 'Rabia al-Adawiyya taught that true devotion wants nothing in return - not even paradise. When practice becomes its own reward, something profound shifts. You may already sense this.',
                poets: ['Rabia al-Adawiyya', 'Bulleh Shah'],
                practices: ['Dhikr Practice', 'Five Daily Remembrances', 'Breath Counting']
            },
            service: {
                title: 'The Path of Khidmat (Service)',
                description: 'Your responses point to a soul that finds the divine in others, that serves as a form of worship. The Sufis call this khidmat - service that recognizes in every face the face of the Beloved.',
                insight: 'The Prophet said, "None of you truly believes until you love for your brother what you love for yourself." Service is not separate from the spiritual path; it is the path made visible.',
                poets: ['Amir Khusrow', 'Shah Abdul Latif'],
                practices: ['Beloved Recognition', 'Acts of Beauty', 'Community Connection']
            },
            beauty: {
                title: 'The Path of Jamal (Divine Beauty)',
                description: 'Art, poetry, music - these are not decorations on your spiritual life but doorways into it. The Sufis recognize jamal, divine beauty, as a legitimate path to awakening. What moves you aesthetically is moving you spiritually.',
                insight: 'Hafiz asked, "What is this precious love and laughter budding in our hearts?" Beauty opens the heart in ways that words cannot. Trust your aesthetic responses - they are spiritual responses.',
                poets: ['Hafiz', 'Rumi', 'Amir Khusrow'],
                practices: ['Poetry as Prayer', 'Beauty Noticing', 'Qawwali Listening']
            }
        }
    };

    // =====================================================
    // Utility Functions
    // =====================================================

    /**
     * Safely get element by ID
     */
    function getElement(id) {
        return document.getElementById(id);
    }

    /**
     * Safely get elements by selector
     */
    function getElements(selector) {
        return document.querySelectorAll(selector);
    }

    /**
     * Add event listener with error handling
     */
    function addEvent(element, event, handler) {
        if (element) {
            element.addEventListener(event, handler);
        }
    }

    /**
     * Store data in localStorage
     */
    function storeData(data) {
        try {
            localStorage.setItem(CONFIG.storageKey, JSON.stringify(data));
            return true;
        } catch (e) {
            console.warn('Could not store quiz data:', e);
            return false;
        }
    }

    /**
     * Retrieve data from localStorage
     */
    function retrieveData() {
        try {
            const data = localStorage.getItem(CONFIG.storageKey);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.warn('Could not retrieve quiz data:', e);
            return null;
        }
    }

    /**
     * Animate element with fade
     */
    function fadeIn(element, duration = CONFIG.animationDuration) {
        if (!element) return;
        element.style.opacity = '0';
        element.style.display = 'block';

        let start = null;
        function animate(timestamp) {
            if (!start) start = timestamp;
            const progress = (timestamp - start) / duration;
            element.style.opacity = Math.min(progress, 1);
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        requestAnimationFrame(animate);
    }

    // =====================================================
    // Mobile Navigation
    // =====================================================

    function initMobileNav() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links');

        if (!toggle || !navLinks) return;

        addEvent(toggle, 'click', function() {
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking outside
        addEvent(document, 'click', function(e) {
            if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
                toggle.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('active');
            }
        });

        // Close menu on escape key
        addEvent(document, 'keydown', function(e) {
            if (e.key === 'Escape') {
                toggle.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('active');
            }
        });
    }

    // =====================================================
    // Quiz Handling
    // =====================================================

    function initQuiz() {
        const form = getElement('sufi-form');
        if (!form) return;

        addEvent(form, 'submit', handleQuizSubmit);

        // Add visual feedback for radio selections
        const radioLabels = form.querySelectorAll('.radio-label');
        radioLabels.forEach(label => {
            const input = label.querySelector('input[type="radio"]');
            if (input) {
                addEvent(input, 'change', function() {
                    // Remove selected class from siblings
                    const siblings = label.parentElement.querySelectorAll('.radio-label');
                    siblings.forEach(sib => sib.classList.remove('selected'));
                    // Add selected class to current
                    label.classList.add('selected');
                });
            }
        });
    }

    function handleQuizSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);

        // Collect responses
        const data = {
            name: formData.get('name') || 'Seeker',
            email: formData.get('email'),
            q1: formData.get('q1'),
            q2: formData.get('q2'),
            q3: formData.get('q3'),
            timestamp: new Date().toISOString()
        };

        // Validate
        if (!data.q1 || !data.q2 || !data.q3) {
            showFormError('Please answer all questions to receive your personalized path.');
            return;
        }

        if (!data.email || !isValidEmail(data.email)) {
            showFormError('Please enter a valid email address.');
            return;
        }

        // Calculate path
        data.path = calculatePath(data);

        // Store data
        storeData(data);

        // Show loading state
        const submitBtn = form.querySelector('.submit-button');
        if (submitBtn) {
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="button-text">Revealing your path...</span><span class="button-icon">&#10057;</span>';
            submitBtn.disabled = true;

            // Simulate processing (in real app, this would be an API call)
            setTimeout(function() {
                window.location.href = 'results.html';
            }, 1500);
        }
    }

    function calculatePath(data) {
        // Path calculation based on responses
        const pathScores = {
            love: 0,
            knowledge: 0,
            devotion: 0,
            service: 0,
            beauty: 0
        };

        // Q1: Coping mechanism
        switch (data.q1) {
            case 'nature':
                pathScores.beauty += 2;
                pathScores.devotion += 1;
                break;
            case 'people':
                pathScores.service += 2;
                pathScores.love += 1;
                break;
            case 'art':
                pathScores.beauty += 2;
                pathScores.love += 1;
                break;
            case 'action':
                pathScores.service += 2;
                pathScores.devotion += 1;
                break;
            case 'questions':
                pathScores.knowledge += 2;
                pathScores.love += 1;
                break;
        }

        // Q2: Spiritual relationship
        switch (data.q2) {
            case 'questioning':
                pathScores.knowledge += 2;
                break;
            case 'structured':
                pathScores.devotion += 2;
                break;
            case 'personal':
                pathScores.love += 2;
                break;
            case 'mystical':
                pathScores.love += 2;
                pathScores.beauty += 1;
                break;
            case 'emerging':
                pathScores.knowledge += 1;
                pathScores.beauty += 1;
                break;
        }

        // Q3: What draws to Sufism
        switch (data.q3) {
            case 'poetry':
                pathScores.beauty += 2;
                pathScores.love += 1;
                break;
            case 'peace':
                pathScores.devotion += 2;
                pathScores.knowledge += 1;
                break;
            case 'love':
                pathScores.love += 3;
                break;
            case 'heritage':
                pathScores.devotion += 2;
                pathScores.service += 1;
                break;
            case 'curious':
                pathScores.knowledge += 2;
                pathScores.beauty += 1;
                break;
        }

        // Find highest scoring path
        let maxPath = 'love';
        let maxScore = 0;
        for (const path in pathScores) {
            if (pathScores[path] > maxScore) {
                maxScore = pathScores[path];
                maxPath = path;
            }
        }

        return maxPath;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showFormError(message) {
        // Remove existing error
        const existingError = document.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }

        // Create and show error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.setAttribute('role', 'alert');
        errorDiv.innerHTML = message;
        errorDiv.style.cssText = 'background: #fee; color: #c00; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; text-align: center;';

        const form = getElement('sufi-form');
        if (form) {
            form.insertBefore(errorDiv, form.firstChild);
            errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Auto-remove after 5 seconds
        setTimeout(function() {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    // =====================================================
    // Results Display
    // =====================================================

    function initResults() {
        // Check if we're on results page
        const pathCard = getElement('path-recommendation');
        if (!pathCard) return;

        const data = retrieveData();

        if (!data) {
            // No quiz data, show default content
            return;
        }

        // Update seeker name
        const nameElement = getElement('seeker-name');
        if (nameElement && data.name) {
            nameElement.textContent = 'Dear ' + data.name;
        }

        // Update path information
        const pathInfo = CONFIG.paths[data.path] || CONFIG.paths.love;

        const titleElement = getElement('path-title');
        if (titleElement) {
            titleElement.textContent = pathInfo.title;
        }

        const descElement = getElement('path-description');
        if (descElement) {
            descElement.textContent = pathInfo.description;
        }

        const insightElement = getElement('path-insight-text');
        if (insightElement) {
            insightElement.innerHTML = pathInfo.insight;
        }
    }

    // =====================================================
    // Smooth Scrolling
    // =====================================================

    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');

        links.forEach(link => {
            addEvent(link, 'click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Update focus for accessibility
                    target.setAttribute('tabindex', '-1');
                    target.focus();
                }
            });
        });
    }

    // =====================================================
    // Navigation Scroll Effect
    // =====================================================

    function initNavScroll() {
        const nav = document.querySelector('.main-nav');
        if (!nav) return;

        let lastScroll = 0;

        addEvent(window, 'scroll', function() {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.2)';
            } else {
                nav.style.boxShadow = 'none';
            }

            lastScroll = currentScroll;
        });
    }

    // =====================================================
    // Form Enhancement
    // =====================================================

    function initFormEnhancements() {
        // Add floating label effect
        const inputs = document.querySelectorAll('.form-group input');

        inputs.forEach(input => {
            addEvent(input, 'focus', function() {
                this.parentElement.classList.add('focused');
            });

            addEvent(input, 'blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });

            // Check initial state
            if (input.value) {
                input.parentElement.classList.add('focused');
            }
        });
    }

    // =====================================================
    // Accessibility Enhancements
    // =====================================================

    function initAccessibility() {
        // Respect reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.scrollBehavior = 'auto';
        }

        // Add keyboard navigation for custom elements
        const interactiveElements = document.querySelectorAll('.radio-label, .discover-card, .pricing-card');

        interactiveElements.forEach(el => {
            if (!el.hasAttribute('tabindex')) {
                el.setAttribute('tabindex', '0');
            }
        });
    }

    // =====================================================
    // Analytics Placeholder
    // =====================================================

    function trackEvent(category, action, label) {
        // Placeholder for analytics tracking
        // In production, integrate with your analytics provider
        if (window.console && console.log) {
            console.log('[Analytics]', category, action, label);
        }
    }

    // =====================================================
    // Initialize
    // =====================================================

    function init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', onReady);
        } else {
            onReady();
        }
    }

    function onReady() {
        initMobileNav();
        initQuiz();
        initResults();
        initSmoothScroll();
        initNavScroll();
        initFormEnhancements();
        initAccessibility();

        // Track page view
        trackEvent('Page', 'View', window.location.pathname);
    }

    // Start the application
    init();

})();
