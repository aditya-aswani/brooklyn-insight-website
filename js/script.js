// Create animated starfield
function createStars() {
    const container = document.getElementById('stars-container');
    const starCount = 150;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.width = Math.random() * 3 + 'px';
        star.style.height = star.style.width;
        star.style.animationDelay = Math.random() * 4 + 's';
        star.style.animationDuration = (Math.random() * 3 + 2) + 's';
        container.appendChild(star);
    }
}

// Section navigation functionality - smooth scroll to section
function showSection(sectionId) {
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        // Add fade-in animation
        targetSection.classList.add('fade-in');
        setTimeout(() => {
            targetSection.classList.remove('fade-in');
        }, 600);
    }
}

// Navigation functionality - smooth scrolling for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Add fade-in animation
            target.classList.add('fade-in');
            setTimeout(() => {
                target.classList.remove('fade-in');
            }, 600);
        }
    });
});

// Navbar scroll effect and active section highlighting
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Highlight active section in navigation
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150; // Account for navbar height
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    // Update active nav link
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// Form handlers
function handleNewsletter(event) {
    event.preventDefault();
    alert('Thank you for subscribing! You will receive a confirmation email shortly.');
    event.target.reset();
}

function handleContact(event) {
    event.preventDefault();
    alert('Thank you for your message. We will respond within 24-48 hours.');
    event.target.reset();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create stars
    createStars();
    
    // Add smooth parallax effect
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const stars = document.getElementById('stars-container');
        if (stars) {
            stars.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

});