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

// Calendar functionality
class EventsCalendar {
    constructor() {
        this.currentDate = new Date();
        this.events = [
            // Weekly Thursday sits
            {
                type: 'weekly-sit',
                title: 'Weekly Meditation Sit',
                day: 4, // Thursday (0 = Sunday)
                recurring: true
            }
        ];
        
        this.months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        this.init();
    }
    
    init() {
        this.renderCalendar();
        this.attachEventListeners();
    }
    
    attachEventListeners() {
        const prevBtn = document.getElementById('prev-month');
        const nextBtn = document.getElementById('next-month');
        const subscribeBtn = document.getElementById('subscribe-btn');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.previousMonth());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextMonth());
        if (subscribeBtn) subscribeBtn.addEventListener('click', () => this.generateICS());
    }
    
    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.renderCalendar();
    }
    
    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.renderCalendar();
    }
    
    renderCalendar() {
        const monthHeader = document.getElementById('current-month');
        const calendarDays = document.getElementById('calendar-days');
        
        if (!monthHeader || !calendarDays) return;
        
        // Update header
        monthHeader.textContent = `${this.months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        
        // Clear existing days
        calendarDays.innerHTML = '';
        
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const today = new Date();
        
        // First day of the month and number of days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        // Add previous month days
        const prevMonth = new Date(year, month - 1, 0);
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            const dayDiv = this.createDayElement(
                prevMonth.getDate() - i,
                'other-month',
                new Date(year, month - 1, prevMonth.getDate() - i)
            );
            calendarDays.appendChild(dayDiv);
        }
        
        // Add current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            let className = '';
            
            if (date.toDateString() === today.toDateString()) {
                className = 'today';
            }
            
            const dayDiv = this.createDayElement(day, className, date);
            calendarDays.appendChild(dayDiv);
        }
        
        // Add next month days to fill the grid
        const totalCells = 42; // 6 rows × 7 days
        const cellsUsed = startingDayOfWeek + daysInMonth;
        for (let day = 1; cellsUsed + day - 1 < totalCells; day++) {
            const dayDiv = this.createDayElement(
                day,
                'other-month',
                new Date(year, month + 1, day)
            );
            calendarDays.appendChild(dayDiv);
        }
    }
    
    createDayElement(dayNumber, className, date) {
        const dayDiv = document.createElement('div');
        dayDiv.className = `calendar-day ${className}`;
        
        const dayNumberDiv = document.createElement('div');
        dayNumberDiv.className = 'day-number';
        dayNumberDiv.textContent = dayNumber;
        dayDiv.appendChild(dayNumberDiv);
        
        // Add events for this day
        this.addEventsToDay(dayDiv, date);
        
        return dayDiv;
    }
    
    addEventsToDay(dayDiv, date) {
        this.events.forEach(event => {
            let hasEvent = false;
            
            if (event.recurring && event.day === date.getDay()) {
                hasEvent = true;
            }
            
            if (hasEvent) {
                const dot = document.createElement('div');
                dot.className = `event-dot ${event.type}`;
                dot.title = event.title;
                dayDiv.appendChild(dot);
            }
        });
    }
    
    generateICS() {
        const icsContent = this.createICSContent();
        const blob = new Blob([icsContent], { type: 'text/calendar' });
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'brooklyn-insight-sangha-events.ics';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }
    
    createICSContent() {
        const now = new Date();
        const formatDate = (date) => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };
        
        let ics = 'BEGIN:VCALENDAR\r\n';
        ics += 'VERSION:2.0\r\n';
        ics += 'PRODID:-//Brooklyn Insight Sangha//Events Calendar//EN\r\n';
        ics += 'CALSCALE:GREGORIAN\r\n';
        ics += 'METHOD:PUBLISH\r\n';
        ics += 'X-WR-CALNAME:Brooklyn Insight Sangha Events\r\n';
        ics += 'X-WR-TIMEZONE:America/New_York\r\n';
        
        // Add weekly meditation sit (recurring event)
        const startDate = new Date();
        startDate.setHours(19, 0, 0, 0); // 7:00 PM
        
        // Find next Thursday
        const daysUntilThursday = (4 - startDate.getDay() + 7) % 7;
        startDate.setDate(startDate.getDate() + daysUntilThursday);
        
        const endDate = new Date(startDate);
        endDate.setHours(21, 0, 0, 0); // 9:00 PM
        
        ics += 'BEGIN:VEVENT\r\n';
        ics += `UID:weekly-sit-${formatDate(now)}@brooklyninsightsangha.org\r\n`;
        ics += `DTSTART:${formatDate(startDate)}\r\n`;
        ics += `DTEND:${formatDate(endDate)}\r\n`;
        ics += 'RRULE:FREQ=WEEKLY;BYDAY=TH\r\n';
        ics += 'SUMMARY:Weekly Meditation Sit\r\n';
        ics += 'DESCRIPTION:Join us for our regular Thursday evening meditation session. All experience levels welcome.\\n\\nContact: hello@bkinsight.nyc\r\n';
        ics += 'LOCATION:Brooklyn (Contact for specific location)\r\n';
        ics += `DTSTAMP:${formatDate(now)}\r\n`;
        ics += 'END:VEVENT\r\n';
        
        ics += 'END:VCALENDAR\r\n';
        
        return ics;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create stars
    createStars();
    
    // Initialize calendar
    new EventsCalendar();
    
    // Add smooth parallax effect
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const stars = document.getElementById('stars-container');
        if (stars) {
            stars.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

});