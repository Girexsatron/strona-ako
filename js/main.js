// =========== GŁÓWNE FUNKCJE JAVASCRIPT ===========
// 🛠️ Ten plik zawiera główne funkcje potrzebne do działania strony

document.addEventListener('DOMContentLoaded', function() {
    // inne funkcje...
    
    // Tutaj dodaj:
    closeDropdownsOnScroll();
});

document.addEventListener('DOMContentLoaded', function() {
    // 🔄 Funkcja menu mobilnego
    setupMobileMenu();
    
    // ❓ Obsługa akordeonu FAQ
    setupFaqAccordion();
    
    // 📊 Animacja liczników
    setupCounters();
    
    // 📝 Obsługa formularza kontaktowego
    setupContactForm();
});

// 🔄 MENU MOBILNE
function setupMobileMenu() {
    // Znajdujemy przycisk menu mobilnego i menu główne
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainMenu = document.querySelector('.main-menu');
    const dropdowns = document.querySelectorAll('.dropdown');
    
    // Obsługa kliknięcia przycisku menu
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            // Przełączamy klasę active dla menu
            mainMenu.classList.toggle('active');
            
            // Zmieniamy ikonę przycisku (z hamburger na X)
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Obsługa kliknięcia w dropdown w menu mobilnym
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        if (link && window.innerWidth < 992) { // Tylko na małych ekranach
            link.addEventListener('click', function(e) {
                // Zatrzymujemy domyślne działanie linku
                e.preventDefault();
                
                // Przełączamy klasę active dla dropdown
                dropdown.classList.toggle('active');
            });
        }
    });
    
    // Zamykanie menu po kliknięciu poza menu
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.main-header') && mainMenu.classList.contains('active')) {
            mainMenu.classList.remove('active');
            const icon = mobileMenuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// ❓ AKORDEON FAQ
function setupFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-toggle i');
        
        // Ustawiamy początkową wysokość na 0
        if (answer) {
            answer.style.maxHeight = '0px';
        }
        
        if (question) {
            question.addEventListener('click', function() {
                // Zamykamy wszystkie inne odpowiedzi
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        if (otherAnswer) otherAnswer.style.maxHeight = '0px';
                        const otherIcon = otherItem.querySelector('.faq-toggle i');
                        if (otherIcon) {
                            otherIcon.classList.remove('fa-minus');
                            otherIcon.classList.add('fa-plus');
                        }
                    }
                });
                
                // Przełączamy stan aktualnego elementu
                item.classList.toggle('active');
                
                if (item.classList.contains('active')) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    icon.classList.remove('fa-plus');
                    icon.classList.add('fa-minus');
                } else {
                    answer.style.maxHeight = '0px';
                    icon.classList.remove('fa-minus');
                    icon.classList.add('fa-plus');
                }
            });
        }
    });
}

// 📊 ANIMACJA LICZNIKÓW
function setupCounters() {
    const counters = document.querySelectorAll('.counter-value');
    
    // Funkcja sprawdzająca, czy element jest widoczny na ekranie
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Funkcja animująca licznik
    function animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-count'));
        
        // Nie zaczynamy ponownie, jeśli licznik jest już animowany
        if (counter.textContent !== "0") return;
        
        const duration = 2000; // Czas trwania animacji w ms
        const step = target / duration * 10; // Co ile ms aktualizujemy licznik
        let current = 0;
        
        const timer = setInterval(function() {
            current += step;
            if (current >= target) {
                clearInterval(timer);
                counter.textContent = target.toLocaleString(); // Formatowanie liczb z separatorami
            } else {
                counter.textContent = Math.floor(current).toLocaleString();
            }
        }, 10);
    }
    
    // Uruchamiamy animację, gdy liczniki są widoczne
    function checkCounters() {
        counters.forEach(counter => {
            if (isElementInViewport(counter) && counter.textContent === "0") {
                animateCounter(counter);
            }
        });
    }
    
    // Sprawdzamy przy przewijaniu
    window.addEventListener('scroll', checkCounters);
    
    // Sprawdzamy również na starcie
    checkCounters();
}

// 📝 OBSŁUGA FORMULARZA KONTAKTOWEGO
function setupContactForm() {
    const contactForm = document.getElementById('home-contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Zapobiegamy domyślnemu wysłaniu formularza
            
            // Sprawdzamy poprawność formularza
            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            // Sprawdzamy wszystkie wymagane pola
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            // Sprawdzamy poprawność adresu email
            const emailField = contactForm.querySelector('input[type="email"]');
            if (emailField && emailField.value.trim()) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailField.value)) {
                    isValid = false;
                    emailField.classList.add('error');
                }
            }
            
            if (!isValid) {
                // Pokazujemy komunikat o błędzie
                alert('❌ Proszę wypełnić poprawnie wszystkie wymagane pola.');
                return;
            }
            
            // Zbieramy dane z formularza
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                message: document.getElementById('message').value,
                privacy: document.getElementById('privacy').checked
            };
            
            // 🔔 Tutaj możesz dodać kod do wysyłania formularza przez AJAX
            // Na razie tylko pokażemy alert z sukcesem
            
            // Symulujemy wysyłanie (w rzeczywistości musisz to zastąpić prawdziwą funkcją)
            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.innerHTML = 'Wysyłanie...';
            
            setTimeout(function() {
                alert('✅ Dziękujemy za wiadomość! Skontaktujemy się wkrótce.');
                contactForm.reset(); // Czyszczenie formularza
                submitButton.disabled = false;
                submitButton.innerHTML = 'Wyślij wiadomość';
            }, 1000);
        });
        
        // Usuwamy klasę error gdy użytkownik zaczyna wpisywać
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('input', function() {
                this.classList.remove('error');
            });
        });
    }
}

// 🔄 POKAZYWANIE PRZYCISKU "WRÓĆ DO GÓRY" PO PRZEWINIĘCIU
function setupScrollToTop() {
    const scrollTopBtn = document.querySelector('.scroll-top');
    
    if (scrollTopBtn) {
        // Pokazujemy przycisk po przewinięciu
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });
        
        // Przewijamy do góry po kliknięciu
        scrollTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            // Funkcja do zamykania menu dropdown przy przewijaniu
function closeDropdownsOnScroll() {
    window.addEventListener('scroll', function() {
        // Znajdź wszystkie otwarte menu dropdown
        const dropdownMenus = document.querySelectorAll('.dropdown-menu');
        const dropdowns = document.querySelectorAll('.dropdown');
        
        // Ukryj wszystkie menu dropdown
        dropdownMenus.forEach(menu => {
            menu.style.display = 'none';
        });
        
        // Usuń klasę active z dropdownów (jeśli używasz jej do wersji mobilnej)
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    });
}

// Dodaj wywołanie tej funkcji wewnątrz DOMContentLoaded
closeDropdownsOnScroll();
        });
    }
}