/**
 * MacBook Guide - Interactive Features
 * Handles navigation, animations, and user interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initKeyboardShortcuts();
    initAnimations();
    initSpotlightDemo();
});

/**
 * Navigation System
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.section');
    
    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-section');
            
            // Update active states
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Show target section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                    // Scroll to top of content
                    document.querySelector('.content').scrollTop = 0;
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
            
            // Update URL hash
            history.pushState(null, null, `#${targetId}`);
        });
    });
    
    // Handle initial hash
    const initialHash = window.location.hash.slice(1);
    if (initialHash) {
        const targetLink = document.querySelector(`[data-section="${initialHash}"]`);
        if (targetLink) {
            targetLink.click();
        }
    }
    
    // Handle browser back/forward
    window.addEventListener('popstate', () => {
        const hash = window.location.hash.slice(1) || 'intro';
        const targetLink = document.querySelector(`[data-section="${hash}"]`);
        if (targetLink) {
            navLinks.forEach(l => l.classList.remove('active'));
            targetLink.classList.add('active');
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === hash) {
                    section.classList.add('active');
                }
            });
        }
    });
}

/**
 * Keyboard Navigation
 */
function initKeyboardShortcuts() {
    const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
    
    document.addEventListener('keydown', (e) => {
        // Navigate sections with arrow keys when sidebar is focused
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            const activeLink = document.querySelector('.nav-links a.active');
            const currentIndex = navLinks.indexOf(activeLink);
            
            let newIndex;
            if (e.key === 'ArrowDown') {
                newIndex = currentIndex < navLinks.length - 1 ? currentIndex + 1 : 0;
            } else {
                newIndex = currentIndex > 0 ? currentIndex - 1 : navLinks.length - 1;
            }
            
            // Only navigate if user pressed cmd/ctrl
            if (e.metaKey || e.ctrlKey) {
                e.preventDefault();
                navLinks[newIndex].click();
            }
        }
        
        // Quick search with /
        if (e.key === '/' && !e.metaKey && !e.ctrlKey) {
            const spotlight = document.querySelector('#spotlight');
            if (spotlight) {
                e.preventDefault();
                document.querySelector('[data-section="spotlight"]').click();
            }
        }
        
        // Go to home with Escape
        if (e.key === 'Escape') {
            document.querySelector('[data-section="intro"]').click();
        }
    });
}

/**
 * Scroll Animations
 */
function initAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe cards and animated elements
    const animatedElements = document.querySelectorAll(
        '.intro-card, .shortcut-card, .gesture-card, .tip-card, .video-card, .feature-card'
    );
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`;
        observer.observe(el);
    });
    
    // Add visible class styles
    const style = document.createElement('style');
    style.textContent = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
    
    // Trigger initial animations for visible elements
    setTimeout(() => {
        const activeSection = document.querySelector('.section.active');
        if (activeSection) {
            activeSection.querySelectorAll('.intro-card, .shortcut-card, .gesture-card, .tip-card, .video-card, .feature-card')
                .forEach(el => el.classList.add('visible'));
        }
    }, 100);
}

/**
 * Spotlight Demo Interactive
 */
function initSpotlightDemo() {
    const spotlightBar = document.querySelector('.spotlight-bar');
    if (!spotlightBar) return;
    
    const spotlightText = spotlightBar.querySelector('.spotlight-text');
    const examples = [
        'Safari',
        '234 * 567',
        'weather Kraków',
        '100 USD in PLN',
        'define serendipity',
        'Notes',
        '5 miles in km',
        'Terminal',
        'zdjęcia wakacje'
    ];
    
    let currentExample = 0;
    
    // Typing animation
    function typeText(text, callback) {
        let i = 0;
        spotlightText.textContent = '';
        spotlightText.style.borderRight = '2px solid var(--accent-blue)';
        
        const typing = setInterval(() => {
            if (i < text.length) {
                spotlightText.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typing);
                setTimeout(() => {
                    spotlightText.style.borderRight = 'none';
                    if (callback) callback();
                }, 1500);
            }
        }, 80);
    }
    
    function deleteText(callback) {
        const text = spotlightText.textContent;
        let i = text.length;
        spotlightText.style.borderRight = '2px solid var(--accent-blue)';
        
        const deleting = setInterval(() => {
            if (i > 0) {
                spotlightText.textContent = text.substring(0, i - 1);
                i--;
            } else {
                clearInterval(deleting);
                if (callback) callback();
            }
        }, 40);
    }
    
    function animateNextExample() {
        deleteText(() => {
            currentExample = (currentExample + 1) % examples.length;
            typeText(examples[currentExample], () => {
                setTimeout(animateNextExample, 2000);
            });
        });
    }
    
    // Start animation after a delay
    setTimeout(() => {
        typeText(examples[0], () => {
            setTimeout(animateNextExample, 2000);
        });
    }, 1000);
}

/**
 * Interactive Keyboard Keys
 */
document.querySelectorAll('.key, .shortcut-card .keys span').forEach(key => {
    key.addEventListener('mousedown', () => {
        key.style.transform = 'translateY(2px)';
        key.style.boxShadow = '0 1px 0 #0a0a0f';
    });
    
    key.addEventListener('mouseup', () => {
        key.style.transform = '';
        key.style.boxShadow = '';
    });
    
    key.addEventListener('mouseleave', () => {
        key.style.transform = '';
        key.style.boxShadow = '';
    });
});

/**
 * Copy shortcut to clipboard
 */
document.querySelectorAll('.shortcut-card').forEach(card => {
    card.addEventListener('click', () => {
        const keys = card.querySelectorAll('.keys span');
        const shortcut = Array.from(keys).map(k => k.textContent).join(' + ');
        const desc = card.querySelector('.desc').textContent;
        
        // Show feedback
        const originalDesc = card.querySelector('.desc').textContent;
        card.querySelector('.desc').textContent = '✓ Skopiowano!';
        card.style.borderColor = 'rgba(48, 209, 88, 0.5)';
        
        // Copy to clipboard
        navigator.clipboard.writeText(`${shortcut}: ${desc}`).catch(() => {
            // Fallback for older browsers
            console.log('Clipboard not available');
        });
        
        setTimeout(() => {
            card.querySelector('.desc').textContent = originalDesc;
            card.style.borderColor = '';
        }, 1500);
    });
    
    // Add cursor pointer
    card.style.cursor = 'pointer';
});

/**
 * Track visited sections
 */
const visitedSections = new Set(['intro']);

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        const section = link.getAttribute('data-section');
        visitedSections.add(section);
        
        // Update visual indicator for visited sections
        link.classList.add('visited');
    });
});

/**
 * Progress indicator
 */
function updateProgress() {
    const totalSections = document.querySelectorAll('.nav-links a').length;
    const visitedCount = visitedSections.size;
    const progress = Math.round((visitedCount / totalSections) * 100);
    
    // Could add a progress bar here
    console.log(`Progress: ${progress}% (${visitedCount}/${totalSections} sections visited)`);
}

/**
 * Easter egg - Konami code
 */
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            // Easter egg activated!
            document.body.style.animation = 'rainbow 2s linear';
            
            const style = document.createElement('style');
            style.textContent = `
                @keyframes rainbow {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
            
            setTimeout(() => {
                document.body.style.animation = '';
            }, 2000);
            
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

/**
 * Smooth scroll for hash links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href').slice(1);
        const target = document.getElementById(targetId);
        
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

console.log('%c🍎 MacBook Guide', 'font-size: 24px; font-weight: bold; color: #bf5af2;');
console.log('%cWitaj! Przeglądaj sekcje, klikaj na skróty aby je skopiować.', 'font-size: 12px; color: #a1a1aa;');
console.log('%cPro tip: Wpisz kod Konami (↑↑↓↓←→←→BA) dla niespodzianki! 🎮', 'font-size: 12px; color: #ff9f0a;');

