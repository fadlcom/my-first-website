// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 موقع فضل الله العياشي يعمل بنجاح!');
    
    // تهيئة جميع المكونات
    initLoadingScreen();
    initThemeToggle();
    initMobileMenu();
    initSmoothScroll();
    initCounters();
    initSkillBars();
    initContactForm();
    initBackToTop();
    initParticles();
    initScrollAnimations();
    
    // إخفاء شاشة التحميل بعد تحميل الصفحة
    window.addEventListener('load', function() {
        setTimeout(() => {
            document.getElementById('loadingScreen').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loadingScreen').style.display = 'none';
            }, 500);
        }, 1000);
    });
});

// ===== LOADING SCREEN =====
function initLoadingScreen() {
    const progressFill = document.querySelector('.progress-fill');
    const loadingPercent = document.querySelector('.loading-percent');
    let progress = 0;
    
    const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress > 100) {
            progress = 100;
            clearInterval(interval);
        }
        
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
        if (loadingPercent) {
            loadingPercent.textContent = `${Math.round(progress)}%`;
        }
    }, 50);
}

// ===== THEME TOGGLE =====
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // التحقق من السمة المحفوظة
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else if (prefersDarkScheme.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        updateThemeIcon('dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        updateThemeIcon('light');
    }
    
    // تفعيل زر التبديل
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
            
            // تأثير بصري
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    }
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const closeMenu = document.getElementById('closeMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuItems = document.querySelectorAll('.mobile-menu-item');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeMenu) {
        closeMenu.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // إغلاق القائمة عند النقر على رابط
    mobileMenuItems.forEach(item => {
        item.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // إغلاق القائمة عند النقر خارجها
    mobileMenu.addEventListener('click', function(e) {
        if (e.target === mobileMenu) {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    // تحديث الروابط النشطة
    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-item, .mobile-menu-item');
        
        let current = '';
        const windowHeight = window.innerHeight;
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    // التمرير السلس
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '#!') {
                e.preventDefault();
                return;
            }
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                
                // إغلاق القائمة المتنقلة إذا كانت مفتوحة
                const mobileMenu = document.getElementById('mobileMenu');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
                
                // التمرير إلى القسم
                const targetPosition = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // تحديث رابط الرابط النشط
                setTimeout(updateActiveLink, 100);
            }
        });
    });
    
    // تحديث الروابط النشطة عند التمرير
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // تحديث أولي
}

// ===== COUNTERS =====
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                const increment = target / speed;
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.ceil(current);
                        setTimeout(updateCounter, 10);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// ===== SKILL BARS =====
function initSkillBars() {
    const skillLevels = document.querySelectorAll('.skill-level');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillLevel = entry.target;
                const level = skillLevel.getAttribute('data-level');
                skillLevel.style.width = `${level}%`;
                observer.unobserve(skillLevel);
            }
        });
    }, { threshold: 0.5 });
    
    skillLevels.forEach(skillLevel => {
        observer.observe(skillLevel);
    });
}

// ===== CONTACT FORM =====
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('button[type="submit"]');
            const originalContent = submitButton.innerHTML;
            
            // محاكاة الإرسال
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>جاري الإرسال...</span>';
            
            // جمع بيانات النموذج
            const formData = {
                name: this.querySelector('#name').value,
                email: this.querySelector('#email').value,
                subject: this.querySelector('#subject').value,
                message: this.querySelector('#message').value
            };
            
            // محاكاة تأخير الشبكة
            setTimeout(() => {
                // في الواقع، هنا ستضيف كود إرسال النموذج الحقيقي
                console.log('📧 بيانات النموذج:', formData);
                
                // نجاح الإرسال
                submitButton.innerHTML = '<i class="fas fa-check"></i><span>تم الإرسال!</span>';
                submitButton.style.background = 'linear-gradient(135deg, #10b981, #34d399)';
                
                // إظهار رسالة نجاح
                showNotification('تم إرسال رسالتك بنجاح! سأتصل بك قريبًا.', 'success');
                
                // إعادة تعيين النموذج
                setTimeout(() => {
                    contactForm.reset();
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalContent;
                    submitButton.style.background = '';
                }, 3000);
            }, 2000);
        });
        
        // تأثيرات على حقول النموذج
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });
            
            // التحقق من صحة الإدخال أثناء الكتابة
            input.addEventListener('input', function() {
                this.parentElement.classList.toggle('has-value', this.value.length > 0);
            });
        });
    }
}

// ===== BACK TO TOP =====
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ===== PARTICLES =====
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // مواضع عشوائية
        const size = Math.random() * 3 + 1;
        const posX = Math.random() * 100;
        const delay = Math.random() * 15;
        const duration = Math.random() * 10 + 10;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}vw`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        
        // ألوان متنوعة
        const colors = ['#00ff9d', '#8b00ff', '#ff0080', '#00ffff'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.background = color;
        
        particlesContainer.appendChild(particle);
    }
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.about-card, .service-card, .skill-item, .tool-card, .contact-card'
    );
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'success') {
    // إنصراف الإشعار
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    // تحديد الأيقونة واللون
    let icon, color;
    switch(type) {
        case 'success':
            icon = 'fa-check-circle';
            color = '#10b981';
            break;
        case 'error':
            icon = 'fa-exclamation-circle';
            color = '#ef4444';
            break;
        case 'warning':
            icon = 'fa-exclamation-triangle';
            color = '#f59e0b';
            break;
        default:
            icon = 'fa-info-circle';
            color = '#3b82f6';
    }
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // إضافة الأنماط
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 9999;
        animation: slideInRight 0.3s ease-out;
    `;
    
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        background: ${color};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        min-width: 300px;
        max-width: 400px;
        font-family: 'Tajawal', sans-serif;
    `;
    
    document.body.appendChild(notification);
    
    // إضافة أنيميشن CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // إخفاء الإشعار بعد 3 ثوانٍ
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
            if (style.parentNode) {
                style.remove();
            }
        }, 300);
    }, 3000);
}

// ===== EXTRA FEATURES =====
// تأثيرات إضافية عند تمرير الماوس
document.querySelectorAll('.service-card, .tool-card, .contact-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(-5px) scale(1)';
    });
});

// تحديث تلقائي للسنة في حقوق النشر
const yearElement = document.querySelector('.copyright');
if (yearElement) {
    const currentYear = new Date().getFullYear();
    yearElement.textContent = yearElement.textContent.replace('2024', currentYear);
}

// تحسين أداء الصور
document.querySelectorAll('img').forEach(img => {
    img.loading = 'lazy';
});

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('❌ خطأ في الموقع:', e.error);
});

// ===== GITHUB PAGES FIXES =====
// إصلاح الروابط النسبية لـ GitHub Pages
if (window.location.hostname.includes('github.io')) {
    // تأكد من أن الروابط تعمل بشكل صحيح
    const base = window.location.pathname.split('/').slice(0, -1).join('/');
    document.querySelectorAll('a[href^="/"]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href.startsWith(base)) {
            link.href = base + href;
        }
    });
                }
