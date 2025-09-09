// ACE Argentina Website JavaScript
// Optimized for AEO, GEO, LLMO and accessibility

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeFAQ();
    initializeContactForm();
    initializeScrollEffects();
    initializeAccessibility();
    initializeAnalytics();
    initializeBreadcrumbs();
    enhanceProductCTAs();
    optimizeImages();
    
    // Add skip link for accessibility
    addSkipLink();
});

// Navigation functionality
function initializeNavigation() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navMenu.classList.contains('mobile-open')) {
                    toggleMobileMenu();
                }
                
                // Update URL for better UX and SEO
                history.pushState(null, null, `#${targetId}`);
            }
        });
    });
}

function toggleMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.classList.toggle('active');
        navMenu.classList.toggle('mobile-open');
        
        // Update ARIA attributes for accessibility
        const isOpen = navMenu.classList.contains('mobile-open');
        mobileMenuBtn.setAttribute('aria-expanded', isOpen);
        navMenu.setAttribute('aria-hidden', !isOpen);
    }
}

// FAQ functionality optimized for LLMO
function initializeFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            toggleFAQ(this);
        });
        
        // Add keyboard support
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFAQ(this);
            }
        });
    });
}

function toggleFAQ(questionElement) {
    const faqItem = questionElement.closest('.faq-item');
    const isActive = faqItem.classList.contains('active');
    
    // Close all other FAQ items for better UX
    document.querySelectorAll('.faq-item.active').forEach(item => {
        if (item !== faqItem) {
            item.classList.remove('active');
            const otherQuestion = item.querySelector('.faq-question');
            const otherAnswer = item.querySelector('.faq-answer');
            otherQuestion.setAttribute('aria-expanded', 'false');
            if (otherAnswer) otherAnswer.style.maxHeight = null;
        }
    });
    
    // Toggle current FAQ item
    faqItem.classList.toggle('active');
    questionElement.setAttribute('aria-expanded', !isActive);
    const answer = faqItem.querySelector('.faq-answer');
    if (answer) {
        if (!isActive) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
            answer.style.maxHeight = null;
        }
    }
    
    // Track FAQ interactions for analytics
    if (typeof gtag !== 'undefined') {
        const questionText = questionElement.querySelector('h3').textContent;
        gtag('event', 'faq_interaction', {
            'event_category': 'engagement',
            'event_label': questionText,
            'value': isActive ? 0 : 1
        });
    }
}

// Contact form with validation and analytics
function initializeContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateContactForm()) {
                submitContactForm();
            }
        });
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }
}

function validateContactForm() {
    const form = document.querySelector('.contact-form');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Validate email format
    const emailField = form.querySelector('#email');
    if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            showFieldError(emailField, 'Por favor, ingresá un email válido');
            isValid = false;
        }
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'Este campo es obligatorio');
        return false;
    }
    
    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = 'var(--ace-orange)';
    errorElement.style.fontSize = 'var(--font-size-sm)';
    errorElement.style.marginTop = 'var(--spacing-1)';
    
    field.parentNode.appendChild(errorElement);
    field.style.borderColor = 'var(--ace-orange)';
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', 'error-' + field.id);
    errorElement.id = 'error-' + field.id;
}

function clearFieldError(field) {
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
    
    field.style.borderColor = '';
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
}

function submitContactForm() {
    const form = document.querySelector('.contact-form');
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Show loading state
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
        // Track form submission
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                'event_category': 'engagement',
                'event_label': 'contact_form'
            });
        }
        
        // Show success message
        showSuccessMessage();
        form.reset();
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 2000);
}

function showSuccessMessage() {
    const form = document.querySelector('.contact-form');
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <div style="background: #10B981; color: white; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
            <strong>¡Mensaje enviado exitosamente!</strong><br>
            Te contactaremos a la brevedad.
        </div>
    `;
    
    form.parentNode.insertBefore(successMessage, form);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
}

// Scroll effects and animations
function initializeScrollEffects() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Track section views for analytics
                if (typeof gtag !== 'undefined') {
                    const sectionName = entry.target.id || entry.target.className;
                    gtag('event', 'section_view', {
                        'event_category': 'engagement',
                        'event_label': sectionName
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe sections for animations
    const sections = document.querySelectorAll('section, .product-card, .care-card');
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Header scroll effect
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Accessibility enhancements
function initializeAccessibility() {
    // Add focus indicators for keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Announce page changes to screen readers
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.position = 'absolute';
    announcer.style.left = '-10000px';
    announcer.style.width = '1px';
    announcer.style.height = '1px';
    announcer.style.overflow = 'hidden';
    document.body.appendChild(announcer);
    
    window.announcer = announcer;
    
    // Improve focus management for modals and dropdowns
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close any open modals or dropdowns
            const openFAQs = document.querySelectorAll('.faq-item.active');
            openFAQs.forEach(faq => {
                faq.classList.remove('active');
                const question = faq.querySelector('.faq-question');
                question.setAttribute('aria-expanded', 'false');
            });
            
            // Close mobile menu
            const navMenu = document.getElementById('nav-menu');
            if (navMenu && navMenu.classList.contains('mobile-open')) {
                toggleMobileMenu();
            }
        }
    });
}

function addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Saltar al contenido principal';
    skipLink.className = 'skip-link';
    skipLink.addEventListener('click', function(e) {
        e.preventDefault();
        const main = document.querySelector('main') || document.querySelector('.hero');
        if (main) {
            main.focus();
            main.scrollIntoView();
        }
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// Analytics and tracking for AEO/GEO/LLMO optimization
function initializeAnalytics() {
    // Track user interactions for AI optimization
    trackUserBehavior();
    trackContentEngagement();
    trackSearchQueries();
}

function trackUserBehavior() {
    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            
            // Track milestone scroll depths
            if ([25, 50, 75, 90].includes(scrollPercent)) {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'scroll_depth', {
                        'event_category': 'engagement',
                        'event_label': `${scrollPercent}%`,
                        'value': scrollPercent
                    });
                }
            }
        }
    });
    
    // Track time on page
    const startTime = Date.now();
    window.addEventListener('beforeunload', () => {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000);
        if (typeof gtag !== 'undefined') {
            gtag('event', 'time_on_page', {
                'event_category': 'engagement',
                'value': timeOnPage
            });
        }
    });
}

function trackContentEngagement() {
    // Track clicks on product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            const productName = card.querySelector('h3').textContent;
            if (typeof gtag !== 'undefined') {
                gtag('event', 'product_interest', {
                    'event_category': 'engagement',
                    'event_label': productName,
                    'value': index + 1
                });
            }
        });
    });
    
    // Track care guide clicks
    const careLinks = document.querySelectorAll('.care-link');
    careLinks.forEach(link => {
        link.addEventListener('click', () => {
            const guideTitle = link.closest('.care-card').querySelector('h3').textContent;
            if (typeof gtag !== 'undefined') {
                gtag('event', 'guide_click', {
                    'event_category': 'engagement',
                    'event_label': guideTitle
                });
            }
        });
    });
}

// Dynamic breadcrumbs (basic): inject current page name if breadcrumb exists
function initializeBreadcrumbs() {
    const breadcrumb = document.querySelector('.breadcrumb-list');
    if (!breadcrumb) return;
    const last = breadcrumb.lastElementChild;
    if (last && !last.querySelector('a')) {
        last.setAttribute('aria-current', 'page');
    }
}

// Track MercadoLibre CTAs and external product clicks
function enhanceProductCTAs() {
    const ctas = document.querySelectorAll('a[href*="tienda.mercadolibre.com.ar"], a[href*="mercadolibre.com.ar"], button[onclick*="mercadolibre"]');
    ctas.forEach((el) => {
        el.addEventListener('click', () => {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'ml_click', {
                    'event_category': 'ecommerce',
                    'event_label': el.href || 'ml_button',
                });
            }
        });
    });
}

function trackSearchQueries() {
    // Track internal search if implemented
    const searchButton = document.querySelector('.search-btn');
    if (searchButton) {
        searchButton.addEventListener('click', () => {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'search_intent', {
                    'event_category': 'engagement',
                    'event_label': 'search_button_click'
                });
            }
        });
    }
}

// Search functionality (placeholder for future implementation)
function toggleSearch() {
    // This would open a search modal or expand search input
    console.log('Search functionality to be implemented');
    
    // For now, track the intent
    if (typeof gtag !== 'undefined') {
        gtag('event', 'search_attempt', {
            'event_category': 'engagement',
            'event_label': 'search_toggle'
        });
    }
}

// Utility functions for AI optimization
function generateStructuredData(type, data) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': type,
        ...data
    });
    document.head.appendChild(script);
}

function updateMetaDescription(description) {
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;
}

// Performance optimization
function optimizeImages() {
    // Lazy loading for images (when implemented)
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Error handling and fallbacks
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    
    // Track errors for debugging
    if (typeof gtag !== 'undefined') {
        gtag('event', 'javascript_error', {
            'event_category': 'error',
            'event_label': e.error.message,
            'value': 1
        });
    }
});

// Service Worker registration for PWA capabilities (future enhancement)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export functions for testing and external use
window.ACEWebsite = {
    toggleMobileMenu,
    toggleFAQ,
    toggleSearch,
    validateContactForm,
    generateStructuredData,
    updateMetaDescription
};

