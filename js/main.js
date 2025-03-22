// =========== GŁÓWNE FUNKCJE JAVASCRIPT ===========
// 🛠️ Ten plik zawiera główne funkcje potrzebne do działania strony

document.addEventListener('DOMContentLoaded', function() {
    // 🛠️ Naprawa menu dropdown przy pierwszym załadowaniu + animacje
function fixDropdownMenus() {
    const style = document.createElement('style');
    style.textContent = `
        .dropdown-menu {
            display: none;
            flex-direction: column !important;
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            min-width: 200px;
            background-color: white;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            border-radius: 0;
            padding: 0.5rem 0;
            z-index: 1000;
            transform-origin: top center;
            overflow: hidden;
        }
        
        .dropdown:hover .dropdown-menu {
            display: block !important;
            animation: slideDown 0.3s ease forwards;
        }
        
        .dropdown-menu li {
            opacity: 0;
            transform: translateY(-10px);
            animation: fadeInItem 0.5s ease forwards;
        }
        
        .dropdown-menu li:nth-child(1) { animation-delay: 0.05s; }
        .dropdown-menu li:nth-child(2) { animation-delay: 0.1s; }
        .dropdown-menu li:nth-child(3) { animation-delay: 0.15s; }
        .dropdown-menu li:nth-child(4) { animation-delay: 0.2s; }
        .dropdown-menu li:nth-child(5) { animation-delay: 0.25s; }
        
        @keyframes slideDown {
            from {
                transform: translateX(-50%) scaleY(0);
                transform-origin: top center;
            }
            to {
                transform: translateX(-50%) scaleY(1);
                transform-origin: top center;
            }
        }
        
        @keyframes fadeInItem {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    // 🔍 Dodatkowe zabezpieczenie - ukryj wszystkie menu rozwijane
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');
    dropdownMenus.forEach(menu => {
        menu.style.display = 'none';
    });
    
    console.log('✨ Menu dropdown naprawione i upiększone animacją');
}

    // Wywołaj funkcję naprawiającą na początku
    fixDropdownMenus();
    
    // 🔄 Funkcja menu mobilnego
    setupMobileMenu();
    
    // ❓ Obsługa akordeonu FAQ
    setupFaqAccordion();
    
    // 📊 Animacja liczników
    setupCounters();
    
    // 📝 Obsługa formularza kontaktowego
    setupContactForm();
    
    // ⬆️ Przycisk powrotu do góry
    setupScrollToTop();
    
    // 🔽 Zamykanie menu rozwijanego przy przewijaniu
    setupDropdownCloseOnScroll();
    
    // 📬 Obsługa formularza newslettera
    setupNewsletter();
    
    // 📌 Inicjalizacja sticky menu - NOWA FUNKCJA
    setupStickyMenu();
    
    console.log('✅ Strona załadowana poprawnie');
});

// 📌 INICJALIZACJA STICKY MENU
function setupStickyMenu() {
    // 🔍 Znajdujemy elementy menu
    const mainHeader = document.querySelector('.main-header');
    
    // Sprawdzamy, czy header istnieje na stronie
    if (!mainHeader) return;
    
    // 📜 Funkcja dodająca efekty do menu podczas przewijania
    function handleScroll() {
        // Dodajemy klasę scrolled do headera po przewinięciu
        if (window.scrollY > 50) { // Klasa dodawana po przewinięciu o 50px
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }
    }
    
    // 🔄 Sprawdzamy scroll przy ładowaniu strony
    handleScroll();
    
    // 👂 Nasłuchujemy zdarzenia scroll
    window.addEventListener('scroll', handleScroll);
    
    // 📱 Poprawka mobilnego menu - lepsze zamykanie przy kliknięciu w link
    const mobileMenuLinks = document.querySelectorAll('.main-menu a');
    const mainMenu = document.querySelector('.main-menu');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    
    // Obsługa przycisku menu mobilnego (hamburger)
    if (mobileMenuToggle && mainMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            // Przełączamy klasę active dla menu
            mainMenu.classList.toggle('active');
            
            // Zmieniamy ikonę przycisku (z hamburger na X)
            const icon = this.querySelector('i');
            if (icon) {
                if (icon.classList.contains('fa-bars')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }
    
    // Jeśli znajdziemy linki w menu mobilnym
    if (mobileMenuLinks.length > 0 && mainMenu && mobileMenuToggle) {
        mobileMenuLinks.forEach(link => {
            // Dodajemy obsługę kliknięcia dla każdego linku
            link.addEventListener('click', function(e) {
                // Sprawdzamy, czy to link w dropdown
                const parentLi = this.closest('li');
                
                // Jeśli jesteśmy na małym ekranie (mobilnym)
                if (window.innerWidth < 992) {
                    // Jeśli link jest w dropdown, to obsługujemy rozwijanie
                    if (parentLi && parentLi.classList.contains('dropdown')) {
                        // Zatrzymujemy domyślne działanie linku
                        e.preventDefault();
                        
                        // Zamykamy wszystkie inne rozwinięte menu
                        const activeDropdowns = document.querySelectorAll('.dropdown.active');
                        activeDropdowns.forEach(dropdown => {
                            if (dropdown !== parentLi) {
                                dropdown.classList.remove('active');
                            }
                        });
                        
                        // Przełączamy klasę active dla dropdown
                        parentLi.classList.toggle('active');
                    } else {
                        // Dla zwykłych linków (nie dropdown) zamykamy menu po kliknięciu
                        if (mainMenu.classList.contains('active')) {
                            mainMenu.classList.remove('active');
                            
                            // Zmieniamy ikonę przycisku menu
                            const icon = mobileMenuToggle.querySelector('i');
                            if (icon) {
                                icon.classList.remove('fa-times');
                                icon.classList.add('fa-bars');
                            }
                        }
                    }
                }
            });
        });
    }
    
    // 🖱️ Poprawka dostępności - obsługa menu za pomocą klawiatury
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        const submenu = dropdown.querySelector('.dropdown-menu');
        
        if (link && submenu) {
            // Dodajemy atrybuty ARIA dla dostępności
            link.setAttribute('aria-haspopup', 'true');
            link.setAttribute('aria-expanded', 'false');
            
            // Obsługa klawisza Enter na linku dropdown
            link.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    // Zatrzymujemy domyślne działanie
                    e.preventDefault();
                    
                    // Przełączamy klasę active dla dropdown
                    dropdown.classList.toggle('active');
                    
                    // Aktualizujemy atrybut aria-expanded
                    const isExpanded = dropdown.classList.contains('active');
                    link.setAttribute('aria-expanded', isExpanded);
                }
            });
        }
    });
    
    // 🔍 Dodajemy efekt hover dla desktopowych menu za pomocą JS
    // (to pomoże z problemami w starszych przeglądarkach)
    if (window.innerWidth >= 992) {
        dropdowns.forEach(dropdown => {
            // Efekt po najechaniu myszką
            dropdown.addEventListener('mouseenter', function() {
                const submenu = this.querySelector('.dropdown-menu');
                if (submenu) {
                    submenu.style.display = 'block';
                    setTimeout(() => {
                        submenu.style.opacity = '1';
                        submenu.style.visibility = 'visible';
                    }, 10);
                }
            });
            
            // Efekt po zjechaniu myszką
            dropdown.addEventListener('mouseleave', function() {
                const submenu = this.querySelector('.dropdown-menu');
                if (submenu) {
                    submenu.style.opacity = '0';
                    submenu.style.visibility = 'hidden';
                    
                    // Opóźniamy ukrycie, aby animacja mogła się zakończyć
                    setTimeout(() => {
                        if (!this.matches(':hover')) {
                            submenu.style.display = 'none';
                        }
                    }, 300);
                }
            });
        });
    }
    
    console.log('✅ Sticky menu zainicjalizowane pomyślnie');
}

// 🔄 MENU MOBILNE
function setupMobileMenu() {
    // Znajdujemy przycisk menu mobilnego i menu główne
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainMenu = document.querySelector('.main-menu');
    const dropdowns = document.querySelectorAll('.dropdown');
    
    // Obsługa kliknięcia przycisku menu
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function(e) {
            // Zatrzymujemy domyślne zachowanie
            e.preventDefault();
            
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
        
        // Obsługa kliknięcia w nagłówek menu rozwijanego na urządzeniach mobilnych
        if (link) {
            link.addEventListener('click', function(e) {
                // Sprawdzamy, czy jesteśmy na małym ekranie (mobilnym)
                if (window.innerWidth < 992) {
                    // Zatrzymujemy domyślne działanie linku
                    e.preventDefault();
                    
                    // Przełączamy klasę active dla dropdown
                    dropdown.classList.toggle('active');
                    
                    // Opcjonalnie możemy też zmienić ikonę wskaźnika
                    const indicator = dropdown.querySelector('.dropdown-indicator');
                    if (indicator) {
                        if (dropdown.classList.contains('active')) {
                            indicator.innerHTML = '<i class="fas fa-chevron-up"></i>';
                        } else {
                            indicator.innerHTML = '<i class="fas fa-chevron-down"></i>';
                        }
                    }
                }
            });
        }
    });
    
    // Zamykanie menu po kliknięciu poza menu
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.main-header') && mainMenu && mainMenu.classList.contains('active')) {
            mainMenu.classList.remove('active');
            
            // Znajdź i zmień ikonę menu na hamburger
            if (mobileMenuToggle) {
                const icon = mobileMenuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
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
        
        // Ustawiamy początkową wysokość 
        if (answer) {
            // Ustawiamy tylko max-height przez klasę CSS
            answer.style.maxHeight = '0px';
        }
        
        if (question) {
            question.addEventListener('click', function() {
                // Zamykamy wszystkie inne odpowiedzi
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        if (otherAnswer) {
                            otherAnswer.style.maxHeight = '0px';
                        }
                        
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
                    // Dynamicznie ustawiamy wysokość na podstawie rzeczywistej zawartości
                    // Plus dodajemy margines bezpieczeństwa (+50px) dla pewności
                    answer.style.maxHeight = (answer.scrollHeight + 50) + 'px';
                    
                    if (icon) {
                        icon.classList.remove('fa-plus');
                        icon.classList.add('fa-minus');
                    }
                } else {
                    answer.style.maxHeight = '0px';
                    if (icon) {
                        icon.classList.remove('fa-minus');
                        icon.classList.add('fa-plus');
                    }
                }
            });
        }
    });
    
    // Obsługa zmiany rozmiaru okna - aktualizacja wysokości aktywnych elementów FAQ
    window.addEventListener('resize', function() {
        const activeItems = document.querySelectorAll('.faq-item.active');
        activeItems.forEach(item => {
            const answer = item.querySelector('.faq-answer');
            if (answer) {
                // Aktualizacja wysokości przy zmianie rozmiaru okna
                answer.style.maxHeight = (answer.scrollHeight + 50) + 'px';
            }
        });
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
                    
                    // Dodajemy potrząśnięcie polem, które jest niepoprawne
                    field.classList.add('shake');
                    setTimeout(() => {
                        field.classList.remove('shake');
                    }, 500);
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
                    
                    // Dodajemy potrząśnięcie polem email
                    emailField.classList.add('shake');
                    setTimeout(() => {
                        emailField.classList.remove('shake');
                    }, 500);
                }
            }
            
            if (!isValid) {
                // Pokazujemy komunikat o błędzie
                showFormMessage(contactForm, '❌ Proszę wypełnić poprawnie wszystkie wymagane pola.', 'error');
                return;
            }
            
            // Zbieramy dane z formularza
            const formData = new FormData(contactForm);
            
            // Zmieniamy stan przycisku
            const submitButton = contactForm.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = 'Wysyłanie... <i class="fas fa-spinner fa-spin"></i>';
            }
            
            // Symulacja dla celów demonstracyjnych - usuń w rzeczywistej implementacji
            setTimeout(function() {
                // Tutaj udajemy, że formularz został wysłany pomyślnie
                showFormMessage(contactForm, '✅ Dziękujemy za wiadomość! Skontaktujemy się wkrótce.', 'success');
                contactForm.reset(); // Czyszczenie formularza
                
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = 'Wyślij wiadomość';
                }
            }, 1500);
            
            // Prawdziwa implementacja z fetch API - odkomentuj w rzeczywistym projekcie
            /*
            fetch('send-email.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Problem z połączeniem z serwerem.');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    // Sukces
                    showFormMessage(contactForm, '✅ Dziękujemy za wiadomość! Skontaktujemy się wkrótce.', 'success');
                    contactForm.reset(); // Czyszczenie formularza
                } else {
                    // Błąd po stronie serwera
                    showFormMessage(contactForm, `❌ ${data.message || 'Wystąpił błąd podczas wysyłania wiadomości.'}`, 'error');
                }
            })
            .catch(error => {
                // Błąd połączenia
                showFormMessage(contactForm, '❌ Wystąpił problem z wysłaniem formularza. Spróbuj ponownie później.', 'error');
                console.error('Błąd:', error);
            })
            .finally(() => {
                // Zawsze wykonaj na końcu
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = 'Wyślij wiadomość';
                }
            });
            */
        });
        
        // Funkcja do wyświetlania komunikatów
        function showFormMessage(form, message, type = 'success') {
            // Sprawdź, czy komunikat już istnieje i usuń go
            const existingMessage = form.querySelector('.form-message');
            if (existingMessage) {
                existingMessage.remove();
            }
            
            // Utwórz nowy element komunikatu
            const messageElement = document.createElement('div');
            messageElement.className = `form-message ${type}`;
            messageElement.innerHTML = message;
            
            // Wstaw komunikat na początku formularza
            form.insertBefore(messageElement, form.firstChild);
            
            // Animacja pojawienia się
            setTimeout(() => {
                messageElement.classList.add('show');
            }, 10);
            
            // Usuń komunikat po 5 sekundach w przypadku sukcesu
            if (type === 'success') {
                setTimeout(() => {
                    messageElement.classList.remove('show');
                    setTimeout(() => {
                        messageElement.remove();
                    }, 300);
                }, 5000);
            }
        }
        
        // Usuwamy klasę error gdy użytkownik zaczyna wpisywać
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('input', function() {
                this.classList.remove('error');
                
                // Usuń komunikat błędu, jeśli użytkownik poprawia dane
                const errorMessage = contactForm.querySelector('.form-message.error');
                if (errorMessage) {
                    errorMessage.classList.remove('show');
                    setTimeout(() => {
                        errorMessage.remove();
                    }, 300);
                }
            });
        });
    }
}

// ⬆️ PRZYCISK "WRÓĆ DO GÓRY"
function setupScrollToTop() {
    // Najpierw sprawdzamy, czy przycisk już istnieje - jeśli nie, tworzymy go
    let scrollTopBtn = document.querySelector('.scroll-top');
    
    if (!scrollTopBtn) {
        // Tworzymy przycisk i dodajemy go do strony
        scrollTopBtn = document.createElement('a');
        scrollTopBtn.className = 'scroll-top';
        scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollTopBtn.setAttribute('href', '#');
        scrollTopBtn.setAttribute('aria-label', 'Przewiń do góry');
        document.body.appendChild(scrollTopBtn);
    }
    
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
    });
}

// 🔽 ZAMYKANIE DROPDOWN MENU PRZY PRZEWIJANIU
function setupDropdownCloseOnScroll() {
    // Funkcja zamykająca menu dropdown - używa klas zamiast bezpośredniej manipulacji stylami
    function closeDropdowns() {
        // Znajdź wszystkie elementy dropdown
        const dropdowns = document.querySelectorAll('.dropdown');
        
        // Usuń klasę active z elementów dropdown
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
    
    // Zamykaj menu przy przewijaniu
    window.addEventListener('scroll', closeDropdowns);
    
    // Zamykaj menu przy kliknięciu poza dropdown
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            closeDropdowns();
        }
    });
    
    // Obsługa klawisza Escape do zamykania menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeDropdowns();
            
            // Zamykamy również menu mobilne
            const mainMenu = document.querySelector('.main-menu');
            const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
            
            if (mainMenu && mainMenu.classList.contains('active')) {
                mainMenu.classList.remove('active');
                
                if (mobileMenuToggle) {
                    const icon = mobileMenuToggle.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            }
        }
    });
}

// 📬 OBSŁUGA NEWSLETTERA
function setupNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const submitButton = this.querySelector('button');
            
            if (!emailInput.value.trim()) {
                // Email jest pusty
                emailInput.classList.add('error');
                return;
            }
            
            // Sprawdzamy poprawność emaila
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailInput.value.trim())) {
                // Email jest niepoprawny
                emailInput.classList.add('error');
                return;
            }
            
            // Zmiana stanu przycisku
            if (submitButton) {
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                submitButton.disabled = true;
            }
            
            // Symulujemy wysyłanie - w rzeczywistym projekcie użyj fetch API
            setTimeout(() => {
                // Pokazujemy komunikat
                const messageElement = document.createElement('div');
                messageElement.className = 'newsletter-message';
                messageElement.style.color = 'white';
                messageElement.style.marginTop = '10px';
                messageElement.style.fontSize = '0.9rem';
                messageElement.innerHTML = '✅ Dziękujemy za zapisanie się do newslettera!';
                
                // Dodajemy komunikat po formularzu
                newsletterForm.parentNode.appendChild(messageElement);
                
                // Resetujemy formularz
                newsletterForm.reset();
                
                // Przywracamy przycisk
                if (submitButton) {
                    submitButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
                    submitButton.disabled = false;
                }
                
                // Usuwamy komunikat po 5 sekundach
                setTimeout(() => {
                    messageElement.remove();
                }, 5000);
            }, 1500);
        });
        
        // Usuwamy klasę error gdy użytkownik zaczyna wpisywać
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        if (emailInput) {
            emailInput.addEventListener('input', function() {
                this.classList.remove('error');
            });
        }
    }
}

// 🔄 ANIMACJE PRZY PRZEWIJANIU
document.addEventListener('DOMContentLoaded', function() {
    // Wybieramy wszystkie elementy z klasą reveal-element
    const revealElements = document.querySelectorAll('.reveal-element');
    
    // Funkcja sprawdzająca, czy element jest widoczny (dla komputerów)
    function checkReveal() {
        // Pętla przez wszystkie elementy do animacji
        revealElements.forEach(element => {
            // Pobieramy pozycję elementu
            const elementTop = element.getBoundingClientRect().top;
            
            // Sprawdzamy, czy element jest w widoku (z małym offsetem)
            const isVisible = (
                elementTop < window.innerHeight - 100
            );
            
            // Jeśli element jest widoczny, dodajemy klasę revealed
            if (isVisible) {
                element.classList.add('revealed');
            }
        });
    }
    
    // Wywołujemy funkcję przy ładowaniu strony
    checkReveal();
    
    // Dodajemy nasłuchiwanie na przewijanie
    window.addEventListener('scroll', checkReveal);
});