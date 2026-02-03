Enter// ===== تهيئة التطبيق =====
document.addEventListener('DOMContentLoaded', function() {
    // تفعيل تغيير السمة
    initThemeToggle();
    
    // تفعيل القائمة المتنقلة
    initMobileMenu();
    
    // تفعيل التمرير السلس
    initSmoothScroll();
    
    // تفعيل عدادات الأرقام
    initCounters();
    
    // تفعيل رسوميات الفوتر
    initFloatingElements();
    
    // تفعيل النموذج
    initContactForm();
    
    // تفعيل ظهور العناصر عند التمرير
    initScrollAnimations();
});

// ===== تغيير السمة (داكن/فاتح) =====
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
        updateThemeIcon('dark');
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

// ===== القائمة المتنقلة =====
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            this.classList.toggle('active');
            
            // تحويل الزر إلى X
            const spans = this.querySelectorAll('span');
            if (mobileMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                spans[1].style.opacity = '0';
                spans[1].style.transform = 'rotate(-45deg) translate(6px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[1].style.transform = 'none';
            }
        });
        
    // إغلاق القائمة عند النقر على رابط
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[1].style.transform = 'none';
        });
    });
}
}

// ===== التمرير السلس =====
function initSmoothScroll() {
    // الروابط الداخلية
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // تحديث الروابط النشطة
                updateActiveNavLink(targetId);
                
                // التمرير السلس
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // إغلاق القائمة المتنقلة إذا كانت مفتوحة
                const mobileMenu = document.getElementById('mobileMenu');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    const menuToggle = document.getElementById('menuToggle');
                    if (menuToggle) {
                        const spans = menuToggle.querySelectorAll('span');
                        spans[0].style.transform = 'none';
                        spans[1].style.opacity = '1';
                        spans[1].style.transform = 'none';
                    }
                }
            }
        });
    });
    
    // تحديث الروابط النشطة أثناء التمرير
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                updateActiveNavLink('#' + sectionId);
            }
        });
    });
}

function updateActiveNavLink(targetId) {
    // تحديث الروابط في الشريط العلوي
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        }
    });
    
    // تحديث الروابط في القائمة المتنقلة
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        }
    });
}

// ===== عدادات الأرقام المتحركة =====
function initCounters() {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    
    if (statNumbers.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const target = parseInt(element.getAttribute('data-count'));
                    const duration = 2000; // 2 seconds
                    const step = target / (duration / 16); // 60fps
                    let current = 0;
                    
                    const timer = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            element.textContent = target;
                            clearInterval(timer);
                        } else {
                            element.textContent = Math.floor(current);
                        }
                    }, 16);
                    
                    observer.unobserve(element);
                }
            });
        }, { threshold: 0.5 });
        
        statNumbers.forEach(number => {
            observer.observe(number);
        });
    }
}

// ===== عناصر الفوتر المتحركة =====
function initFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-element');
    
    floatingElements.forEach((element, index) => {
        // تأخير مختلف لكل عنصر
        element.style.animationDelay = `${index * 2}s`;
        
        // تأثير عند التمرير فوق العنصر
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(10deg)';
            this.style.boxShadow = 'var(--shadow-xl)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
            this.style.boxShadow = 'var(--shadow-md)';
        });
    });
}

// ===== نموذج التواصل =====
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.querySelector('span').textContent;
            const originalIcon = submitButton.querySelector('i').className;
            
            // محاكاة الإرسال
            submitButton.disabled = true;
            submitButton.querySelector('span').textContent = 'جاري الإرسال...';
            submitButton.querySelector('i').className = 'fas fa-spinner fa-spin';
            
            // محاكاة تأخير الشبكة
            setTimeout(() => {
                // نجاح الإرسال
                submitButton.querySelector('span').textContent = 'تم الإرسال بنجاح!';
                submitButton.querySelector('i').className = 'fas fa-check';
                submitButton.style.background = 'linear-gradient(135deg, var(--success), #34d399)';
                
                // إظهار رسالة نجاح
                showNotification('تم إرسال رسالتك بنجاح! سأتواصل معك قريبًا.', 'success');
                
                // إعادة تعيين النموذج
                setTimeout(() => {
                    contactForm.reset();
                    submitButton.disabled = false;
                    submitButton.querySelector('span').textContent = originalText;
                    submitButton.querySelector('i').className = originalIcon;
                    submitButton.style.background = 'linear-gradient(135deg, var(--primary-color), var(--primary-light))';
                }, 3000);
            }, 2000);
        });
        
        // تأثيرات على حقول النموذج
        const formInputs = contactForm.querySelectorAll('input, textarea, select');
        formInputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });
        });
    }
}

// ===== ظهور العناصر عند التمرير =====
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.about-card, .service-card, .project-card'
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

// ===== وظائف مساعدة =====
function showNotification(message, type = 'success') {
    // إنصراف الإشعار
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    // تحديد الأيقونة بناءً على النوع
    let icon = 'fa-check-circle';
    let bgColor = 'var(--success)';
    
    if (type === 'error') {
        icon = 'fa-exclamation-circle';
        bgColor = 'var(--error)';
    } else if (type === 'warning') {
        icon = 'fa-exclamation-triangle';
        bgColor = 'var(--warning)';
    }
    
    notification.innerHTML = `
        <div class="notification-content" style="background: ${bgColor}">
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
    
    const notificationContent = notification.querySelector('.notification-content');
    notificationContent.style.cssText = `
        background: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        box-shadow: var(--shadow-lg);
        min-width: 300px;
        max-width: 400px;
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
            notification.remove();
            style.remove();
        }, 300);
    }, 3000);
}

// ===== تحسين الأداء =====
// تحميل متأخر للصور
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// تحسين التمرير
let scrollTimeout;
window.addEventListener('scroll', function() {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    
    scrollTimeout = setTimeout(function() {
        // إجراءات بعد توقف التمرير
    }, 100);
});
