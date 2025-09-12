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
        const navbar = document.getElementById('navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 80;
        const offset = navbarHeight - 40; // navbar height - 40px (scroll lower)
        const targetPosition = targetSection.offsetTop - offset;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
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
            const navbar = document.getElementById('navbar');
            const navbarHeight = navbar ? navbar.offsetHeight : 80;
            const offset = navbarHeight - 40; // navbar height - 40px (scroll lower)
            const targetPosition = target.offsetTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
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
            // Weekly Thursday meditations
            {
                type: 'weekly-meditation',
                emoji: '🧘',
                title: 'Weekly Group Meditation',
                day: 4, // Thursday (0 = Sunday)
                recurring: true
            },
            // Dharma Dance event
            {
                type: 'dharma-dance',
                emoji: '💃',
                title: 'Dharma Dance',
                date: new Date(2025, 8, 6), // September 6, 2025 (month is 0-indexed)
                recurring: false
            },
            // Day-long Silent Retreat event
            {
                type: 'silent-retreat',
                emoji: '🌅',
                title: 'Day-long Silent Retreat',
                date: new Date(2025, 8, 7), // September 7, 2025 (month is 0-indexed)
                recurring: false
            },
            // Open Mic Night event
            {
                type: 'open-mic',
                emoji: '🎤',
                title: 'Open Mic Night',
                date: new Date(2025, 8, 20), // September 20, 2025 (month is 0-indexed)
                recurring: false
            }
            // Other specific event dates will be added later
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
        this.attachResizeListener();
    }
    
    attachEventListeners() {
        const prevBtn = document.getElementById('prev-month');
        const nextBtn = document.getElementById('next-month');
        const todayBtn = document.getElementById('today-btn');
        const subscribeBtn = document.getElementById('subscribe-btn');
        
        console.log('Calendar buttons found:', { prevBtn: !!prevBtn, nextBtn: !!nextBtn, todayBtn: !!todayBtn, subscribeBtn: !!subscribeBtn });
        
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Previous month clicked');
                this.previousMonth();
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Next month clicked');
                this.nextMonth();
            });
        }
        if (todayBtn) {
            todayBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Today button clicked');
                this.goToToday();
            });
        }
        if (subscribeBtn) {
            subscribeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Subscribe button clicked');
                this.openGoogleCalendarSubscription();
            });
        }
    }
    
    attachResizeListener() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.renderCalendar();
            }, 250); // Debounce resize events
        });
    }
    
    previousMonth() {
        console.log('previousMonth called, current date:', this.currentDate);
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        console.log('new date:', this.currentDate);
        this.renderCalendar();
    }
    
    nextMonth() {
        console.log('nextMonth called, current date:', this.currentDate);
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        console.log('new date:', this.currentDate);
        this.renderCalendar();
    }
    
    goToToday() {
        console.log('goToToday called, resetting to current date');
        this.currentDate = new Date();
        console.log('reset to today:', this.currentDate);
        this.renderCalendar();
    }
    
    renderCalendar() {
        const monthHeader = document.getElementById('current-month');
        const calendarDays = document.getElementById('calendar-days');
        
        console.log('renderCalendar called, elements found:', { monthHeader: !!monthHeader, calendarDays: !!calendarDays });
        
        if (!monthHeader || !calendarDays) {
            console.log('Calendar elements not found');
            return;
        }
        
        // Check if we're on mobile
        const isMobile = window.innerWidth <= 767;
        
        if (isMobile) {
            this.renderWeekView(monthHeader, calendarDays);
        } else {
            this.renderMonthView(monthHeader, calendarDays);
        }
    }
    
    renderMonthView(monthHeader, calendarDays) {
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
    
    renderWeekView(monthHeader, calendarDays) {
        // Get the week containing the current date
        const today = new Date();
        const currentWeekStart = this.getWeekStart(this.currentDate);
        
        // Update header to show week range (without year on mobile)
        const weekEnd = new Date(currentWeekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        
        const startMonth = this.months[currentWeekStart.getMonth()];
        const endMonth = this.months[weekEnd.getMonth()];
        
        if (currentWeekStart.getMonth() === weekEnd.getMonth()) {
            monthHeader.textContent = `${startMonth} ${currentWeekStart.getDate()}-${weekEnd.getDate()}`;
        } else {
            monthHeader.textContent = `${startMonth} ${currentWeekStart.getDate()} - ${endMonth} ${weekEnd.getDate()}`;
        }
        
        // Clear existing days
        calendarDays.innerHTML = '';
        
        // Add 7 days for the current week
        for (let i = 0; i < 7; i++) {
            const date = new Date(currentWeekStart);
            date.setDate(date.getDate() + i);
            
            let className = '';
            if (date.toDateString() === today.toDateString()) {
                className = 'today';
            }
            
            const dayDiv = this.createDayElement(date.getDate(), className, date);
            calendarDays.appendChild(dayDiv);
        }
    }
    
    getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day; // Get Sunday of current week
        return new Date(d.setDate(diff));
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
                if (event.weekOfMonth) {
                    // Monthly recurring event (specific week of month)
                    const weekOfMonth = this.getWeekOfMonth(date);
                    if (weekOfMonth === event.weekOfMonth) {
                        hasEvent = true;
                    }
                } else {
                    // Weekly recurring event
                    hasEvent = true;
                }
            } else if (!event.recurring && event.date) {
                // Specific date event
                if (event.date.getFullYear() === date.getFullYear() &&
                    event.date.getMonth() === date.getMonth() &&
                    event.date.getDate() === date.getDate()) {
                    hasEvent = true;
                }
            }
            
            if (hasEvent) {
                const eventIndicator = document.createElement('div');
                eventIndicator.className = `event-indicator ${event.type}`;
                eventIndicator.textContent = event.emoji;
                eventIndicator.title = event.title;
                dayDiv.appendChild(eventIndicator);
            }
        });
    }
    
    getWeekOfMonth(date) {
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const firstDayOfWeek = firstDay.getDay();
        const dayOfMonth = date.getDate();
        return Math.ceil((dayOfMonth + firstDayOfWeek) / 7);
    }
    
    openGoogleCalendarSubscription() {
        console.log('Opening Google Calendar subscription');
        
        // Brooklyn Insight Sangha Google Calendar ID
        const calendarId = '522801e9a40e8e8a44124e81c9f3f2c79bce6760693302dfa38a8ea371468884d@group.calendar.google.com';
        const subscriptionUrl = `https://calendar.google.com/calendar/u/0/r/settings/addcalendar?cid=${encodeURIComponent(calendarId)}`;
        
        // Open Google Calendar subscription page
        window.open(subscriptionUrl, '_blank');
    }
    
    getNextUpcomingEvent() {
        const today = new Date();
        const upcomingEvents = [];
        
        // Get events for the next 3 months
        for (let i = 0; i < 90; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(today.getDate() + i);
            
            this.events.forEach(event => {
                if (event.recurring && event.day === checkDate.getDay()) {
                    upcomingEvents.push({
                        ...event,
                        date: new Date(checkDate)
                    });
                } else if (!event.recurring && event.date && 
                          event.date >= today && 
                          event.date.getTime() === checkDate.getTime()) {
                    upcomingEvents.push(event);
                }
            });
            
            if (upcomingEvents.length > 0) break;
        }
        
        return upcomingEvents[0] || null;
    }
    
    createGoogleCalendarEventUrl(event) {
        const startDate = new Date(event.date);
        const endDate = new Date(startDate);
        endDate.setHours(startDate.getHours() + 1); // Default 1 hour duration
        
        const formatDate = (date) => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };
        
        const params = new URLSearchParams({
            action: 'TEMPLATE',
            text: event.title,
            dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
            details: `Join us for ${event.title} at Brooklyn Insight Sangha. Visit https://brooklyninsightsangha.org for more details.`,
            location: 'Brooklyn, NY',
            sf: true,
            output: 'xml'
        });
        
        return `https://calendar.google.com/calendar/render?${params.toString()}`;
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

// Mobile menu functionality
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create stars
    createStars();
    
    // Initialize calendar
    new EventsCalendar();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Add smooth parallax effect
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const stars = document.getElementById('stars-container');
        if (stars) {
            stars.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

});