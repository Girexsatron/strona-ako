// =========== GŁÓWNE FUNKCJE JAVASCRIPT ===========
// 🛠️ Ten plik zawiera główne funkcje potrzebne do działania strony

document.addEventListener('DOMContentLoaded', function() {
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
    
    // ✨ Efekt parallax dla tła bannera
    setupParallaxEffect();

    // 🔔 Inicjalizuj inne funkcje tutaj, jeśli potrzebujesz
    console.log('✅ Strona załadowana poprawnie');
});

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
        
        // Ustawiamy początkową wysokość - POPRAWKA: nie ustawiamy sztywnej wysokości
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
                            // POPRAWKA: Najpierw odczytujemy aktualną wysokość, potem ustawiamy 0
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
                    // POPRAWKA: Dynamicznie ustawiamy wysokość na podstawie rzeczywistej zawartości
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
    
    // POPRAWKA: Obsługa zmiany rozmiaru okna - aktualizacja wysokości aktywnych elementów FAQ
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

// 📝 OBSŁUGA FORMULARZA KONTAKTOWEGO - POPRAWIONA WERSJA
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
                    
                    // POPRAWKA: Dodajemy potrząśnięcie polem, które jest niepoprawne
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
                    
                    // POPRAWKA: Dodajemy potrząśnięcie polem email
                    emailField.classList.add('shake');
                    setTimeout(() => {
                        emailField.classList.remove('shake');
                    }, 500);
                }
            }
            
            if (!isValid) {
                // Pokazujemy komunikat o błędzie
                // POPRAWKA: Tworzymy element komunikatu zamiast alert
                showFormMessage(contactForm, '❌ Proszę wypełnić poprawnie wszystkie wymagane pola.', 'error');
                return;
            }
            
            // Zbieramy dane z formularza
            const formData = new FormData(contactForm);
            
            // POPRAWKA: Tutaj implementujemy prawdziwe wysyłanie formularza przez fetch API
            
            // Zmieniamy stan przycisku
            const submitButton = contactForm.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = 'Wysyłanie... <i class="fas fa-spinner fa-spin"></i>';
            }
            
            // POPRAWKA: Tu byłoby prawdziwe wysyłanie - teraz symulujemy dla demonstracji
            // W rzeczywistości użyj poniższego kodu, zamieniając 'send-email.php' na rzeczywisty endpoint API
            
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
        
        // POPRAWKA: Funkcja do wyświetlania komunikatów
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
    // POPRAWKA: Funkcja zamykająca menu dropdown - używa klas zamiast bezpośredniej manipulacji stylami
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
    
    // POPRAWKA: Obsługa klawisza Escape do zamykania menu
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

// ✨ EFEKT PARALLAX DLA BANNERA GŁÓWNEGO
function setupParallaxEffect() {
    const bannerBackground = document.querySelector('.banner-background');
    
    if (bannerBackground) {
        window.addEventListener('scroll', function() {
            // Obliczamy o ile przesunąć tło (im większa liczba, tym wolniejszy efekt)
            const offset = window.pageYOffset;
            const parallaxSpeed = 0.5;
            
            // Przesuwamy tło wolniej niż przewija się strona, tworząc efekt parallax
            bannerBackground.style.transform = `translateY(${offset * parallaxSpeed}px) scale(1.1)`;
        });
    }
}