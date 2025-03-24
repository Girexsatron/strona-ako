// =========== 🛠️ GŁÓWNE FUNKCJE JAVASCRIPT ===========
/* 
 * Ten plik zawiera główne funkcje JavaScript potrzebne do działania strony.
 * Wszystkie funkcje są pogrupowane tematycznie i zawierają szczegółowe komentarze.
 * 💡 Jeśli nie jesteś programistą, nie martw się! Wszystko zostało wytłumaczone krok po kroku.
 */

// Czekaj na załadowanie całej strony przed uruchomieniem kodu
document.addEventListener('DOMContentLoaded', function() {
    // 📌 Inicjalizacja wszystkich głównych funkcji strony
    initStickyHeader();       // 📌 Przyklejane menu
    initMobileMenu();         // 📱 Menu mobilne
    initDropdownMenus();      // 🔽 Menu rozwijane
    initFaqAccordion();       // ❓ Akordeony FAQ
    initCounters();           // 📊 Animowane liczniki
    initContactForm();        // 📝 Formularz kontaktowy
    initScrollToTop();        // ⬆️ Przycisk "wróć do góry"
    initNewsletterForm();     // 📬 Formularz newslettera
    initRevealOnScroll();     // 🔍 Animacje elementów podczas przewijania
    initGalleryModal();       // 🖼️ Modal z powiększonymi zdjęciami
    initVideoModal();         // 🎥 Modal z wideo
    initProduct3dCards();     // 🔄 Karty 3D
    initDarkModeToggle();     // 🌙 Przełącznik trybu ciemnego
    initReviewsCarousel();    // 💬 Opinie klientów
    
    // Dodatkowe funkcje na stronie głównej
    if (document.querySelector('.energy-savings')) {
        initEnergyCalculator();  // 💰 Kalkulator oszczędności energetycznych
    }
    
    console.log('✅ Wszystkie funkcje zainicjalizowane pomyślnie');
});

// ======= 📌 STICKY HEADER - PRZYKLEJANE MENU =======
function initStickyHeader() {
    const header = document.querySelector('.main-header');
    
    if (!header) return; // Zabezpieczenie przed brakiem elementu
    
    // Funkcja sprawdzająca scroll i dodająca/usuwająca klasę
    function checkScroll() {
        if (window.scrollY > 50) { // Po przewinięciu o 50px
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Sprawdź na starcie
    checkScroll();
    
    // Nasłuchuj przewijania
    window.addEventListener('scroll', checkScroll);
    
    console.log('✅ Sticky header zainicjalizowany');
}

// ======= 📱 MENU MOBILNE =======
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainMenu = document.querySelector('.main-menu');
    
    if (!menuToggle || !mainMenu) return; // Zabezpieczenie przed brakiem elementów
    
    // 🔄 Obsługa kliknięcia przycisku menu
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault(); // Zapobiegamy domyślnej akcji
        
        // Przełącz klasę active
        mainMenu.classList.toggle('active');
        
        // Zmień ikonę przycisku (hamburger/zamknij)
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
        
        // Ustaw atrybuty ARIA dla dostępności
        const isExpanded = mainMenu.classList.contains('active');
        menuToggle.setAttribute('aria-expanded', isExpanded);
    });
    
    // 🔄 Zamykanie menu przy kliknięciu poza nim
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.main-header') && mainMenu.classList.contains('active')) {
            mainMenu.classList.remove('active');
            
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
            
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
    
    console.log('✅ Menu mobilne zainicjalizowane');
}

// ======= 🔽 MENU ROZWIJANE =======
function initDropdownMenus() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    if (dropdowns.length === 0) return; // Zabezpieczenie przed brakiem elementów
    
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        const submenu = dropdown.querySelector('.dropdown-menu');
        
        if (!link || !submenu) return; // Zabezpieczenie
        
        // Ustawienia ARIA dla dostępności
        link.setAttribute('aria-haspopup', 'true');
        link.setAttribute('aria-expanded', 'false');
        
        // 🔄 Obsługa menu rozwijanego na urządzeniach mobilnych
        link.addEventListener('click', function(e) {
            // Sprawdź, czy jesteśmy na urządzeniu mobilnym
            if (window.innerWidth < 992) {
                e.preventDefault(); // Zapobiegamy domyślnej akcji (przejściu do linku)
                
                // Zamknij inne otwarte menu
                dropdowns.forEach(d => {
                    if (d !== dropdown && d.classList.contains('active')) {
                        d.classList.remove('active');
                        const dLink = d.querySelector('a');
                        if (dLink) dLink.setAttribute('aria-expanded', 'false');
                    }
                });
                
                // Przełącz aktualny dropdown
                dropdown.classList.toggle('active');
                
                // Aktualizuj ARIA
                const isExpanded = dropdown.classList.contains('active');
                link.setAttribute('aria-expanded', isExpanded);
            }
        });
        
        // 🔄 Obsługa klawiszy (dla dostępności)
        link.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                
                // Na telefonach przełącz menu
                if (window.innerWidth < 992) {
                    dropdown.classList.toggle('active');
                    link.setAttribute('aria-expanded', dropdown.classList.contains('active'));
                } 
                // Na desktopach otwórz menu
                else {
                    dropdown.classList.add('hover-active');
                    submenu.style.opacity = '1';
                    submenu.style.visibility = 'visible';
                    link.setAttribute('aria-expanded', 'true');
                }
            }
            
            // Escape - zamknij menu
            if (e.key === 'Escape') {
                dropdown.classList.remove('active', 'hover-active');
                submenu.style.opacity = '0';
                submenu.style.visibility = 'hidden';
                link.setAttribute('aria-expanded', 'false');
            }
        });
        
        // 🔄 Obsługa kliknięcia poza menu (zamykanie)
        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active', 'hover-active');
                link.setAttribute('aria-expanded', 'false');
            }
        });
    });
    
    console.log('✅ Menu rozwijane zainicjalizowane');
}

// ======= ❓ AKORDEONY FAQ =======
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length === 0) return; // Zabezpieczenie przed brakiem elementów
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('.faq-toggle i');
        
        if (!question || !answer) return; // Zabezpieczenie
        
        // Ustawienie początkowego stanu
        answer.style.maxHeight = '0px'; // Zamknięte na start
        
        // 🔄 Obsługa kliknięcia pytania
        question.addEventListener('click', function() {
            // Zamykamy inne otwarte FAQ
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
                    
                    const otherQuestion = otherItem.querySelector('.faq-question');
                    if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
                }
            });
            
            // Przełączamy aktualny element
            const isActive = item.classList.contains('active');
            item.classList.toggle('active');
            
            // Aktualizujemy ARIA
            question.setAttribute('aria-expanded', !isActive);
            
            // Animacja rozwijania/zwijania
            if (!isActive) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
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
    });
    
    console.log('✅ Akordeony FAQ zainicjalizowane');
}

// ======= 📊 ANIMOWANE LICZNIKI =======
function initCounters() {
    const counters = document.querySelectorAll('.counter-value');
    
    if (counters.length === 0) return; // Zabezpieczenie przed brakiem elementów
    
    // 🔄 Funkcja sprawdzająca czy element jest widoczny na ekranie
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // 🔄 Funkcja animująca licznik
    function animateCounter(counter) {
        // Pobierz docelową wartość z atrybutu data-count
        const target = parseInt(counter.getAttribute('data-count'));
        
        // Nie animuj ponownie już uruchomionych liczników
        if (counter.textContent !== "0") return;
        
        // Ustawienia animacji
        const duration = 2000; // Czas trwania animacji w ms
        const frameRate = 10; // Co ile ms aktualizujemy licznik
        const increment = target / (duration / frameRate); // Przyrost na klatkę
        
        let current = 0;
        
        // Animacja z użyciem setInterval
        const timer = setInterval(function() {
            current += increment;
            
            // Zakończ animację po osiągnięciu celu
            if (current >= target) {
                clearInterval(timer);
                counter.textContent = target.toLocaleString(); // Formatuj liczbę
            } else {
                counter.textContent = Math.floor(current).toLocaleString();
            }
        }, frameRate);
    }
    
    // 🔄 Funkcja sprawdzająca liczniki i uruchamiająca animacje
    function checkCounters() {
        counters.forEach(counter => {
            if (isElementInViewport(counter) && counter.textContent === "0") {
                animateCounter(counter);
            }
        });
    }
    
    // Sprawdź liczniki przy przewijaniu
    window.addEventListener('scroll', checkCounters);
    
    // Sprawdź na starcie (gdyby liczniki były już widoczne)
    checkCounters();
    
    console.log('✅ Animowane liczniki zainicjalizowane');
}

// ======= 📝 FORMULARZ KONTAKTOWY =======
function initContactForm() {
    const contactForm = document.getElementById('home-contact-form');
    
    if (!contactForm) return; // Zabezpieczenie przed brakiem elementu
    
    // 🔄 Obsługa wysyłki formularza
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Zapobiegamy domyślnemu zachowaniu formularza
        
        // Walidacja formularza
        if (!validateForm(contactForm)) {
            // Jeśli formularz jest niepoprawny, przerwij
            showFormMessage(contactForm, '❌ Proszę wypełnić poprawnie wszystkie wymagane pola.', 'error');
            return;
        }
        
        // Pobierz dane z formularza
        const formData = new FormData(contactForm);
        
        // Zmień stan przycisku wysyłki
        const submitButton = contactForm.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = 'Wysyłanie... <i class="fas fa-spinner fa-spin"></i>';
        }
        
        // Symulacja wysyłki (zastąp prawdziwym kodem wysyłki)
        setTimeout(function() {
            // Tutaj udajemy odpowiedź z serwera
            showFormMessage(contactForm, '✅ Dziękujemy za wiadomość! Skontaktujemy się wkrótce.', 'success');
            contactForm.reset(); // Wyczyść formularz
            
            // Przywróć przycisk
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = 'Wyślij wiadomość';
            }
        }, 1500);
        
        // UWAGA: W rzeczywistym projekcie użyj kodu podobnego do poniższego
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
                showFormMessage(contactForm, '✅ Dziękujemy za wiadomość! Skontaktujemy się wkrótce.', 'success');
                contactForm.reset();
            } else {
                showFormMessage(contactForm, `❌ ${data.message || 'Wystąpił błąd podczas wysyłania wiadomości.'}`, 'error');
            }
        })
        .catch(error => {
            showFormMessage(contactForm, '❌ Wystąpił problem z wysłaniem formularza. Spróbuj ponownie później.', 'error');
            console.error('Błąd:', error);
        })
        .finally(() => {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = 'Wyślij wiadomość';
            }
        });
        */
    });
    
    // 🔄 Resetowanie stanu błędu po wpisaniu tekstu
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('error', 'shake');
            
            // Usuń komunikat błędu, gdy użytkownik poprawia dane
            const errorMessage = contactForm.querySelector('.form-message.error');
            if (errorMessage) {
                errorMessage.classList.remove('show');
                setTimeout(() => {
                    errorMessage.remove();
                }, 300);
            }
        });
    });
    
    console.log('✅ Formularz kontaktowy zainicjalizowany');
}

// 🔄 Funkcja walidująca formularz
function validateForm(form) {
    let isValid = true;
    
    // Sprawdź wszystkie wymagane pola
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
            
            // Dodaj efekt potrząśnięcia
            field.classList.add('shake');
            setTimeout(() => {
                field.classList.remove('shake');
            }, 500);
        } else {
            field.classList.remove('error');
        }
    });
    
    // Sprawdź email
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailField.value)) {
            isValid = false;
            emailField.classList.add('error');
            
            // Dodaj efekt potrząśnięcia
            emailField.classList.add('shake');
            setTimeout(() => {
                emailField.classList.remove('shake');
            }, 500);
        }
    }
    
    return isValid;
}

// 🔄 Funkcja pokazująca komunikat formularza
function showFormMessage(form, message, type = 'success') {
    // Usuń istniejący komunikat
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Stwórz nowy komunikat
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.innerHTML = message;
    
    // Dodaj komunikat na początku formularza
    form.insertBefore(messageElement, form.firstChild);
    
    // Animacja pojawienia się komunikatu
    setTimeout(() => {
        messageElement.classList.add('show');
    }, 10);
    
    // Usuń komunikat po 5 sekundach, jeśli jest success
    if (type === 'success') {
        setTimeout(() => {
            messageElement.classList.remove('show');
            setTimeout(() => {
                messageElement.remove();
            }, 300);
        }, 5000);
    }
}

// ======= ⬆️ PRZYCISK "WRÓĆ DO GÓRY" =======
function initScrollToTop() {
    // 🔄 Utwórz przycisk, jeśli nie istnieje
    let scrollTopBtn = document.querySelector('.scroll-top');
    
    // Jeśli przycisk nie istnieje, utwórz go
    if (!scrollTopBtn) {
        scrollTopBtn = document.createElement('a');
        scrollTopBtn.className = 'scroll-top';
        scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollTopBtn.setAttribute('href', '#');
        scrollTopBtn.setAttribute('aria-label', 'Przewiń do góry');
        document.body.appendChild(scrollTopBtn);
    }
    
    // 🔄 Funkcja pokazująca/ukrywająca przycisk
    function toggleScrollButton() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }
    
    // Sprawdź na starcie i przy przewijaniu
    toggleScrollButton();
    window.addEventListener('scroll', toggleScrollButton);
    
    // 🔄 Obsługa kliknięcia przycisku
    scrollTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    console.log('✅ Przycisk "wróć do góry" zainicjalizowany');
}

// ======= 📬 FORMULARZ NEWSLETTERA =======
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (!newsletterForm) return; // Zabezpieczenie przed brakiem elementu
    
    // 🔄 Obsługa wysyłki formularza
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('input[type="email"]');
        const submitButton = this.querySelector('button');
        
        // Sprawdź, czy email jest wpisany
        if (!emailInput.value.trim()) {
            emailInput.classList.add('error');
            return;
        }
        
        // Sprawdź, czy email ma poprawny format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailInput.value.trim())) {
            emailInput.classList.add('error');
            return;
        }
        
        // Zmień stan przycisku
        if (submitButton) {
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            submitButton.disabled = true;
        }
        
        // Symulacja wysyłki
        setTimeout(() => {
            // Tutaj udajemy odpowiedź z serwera
            
            // Pokaż komunikat sukcesu
            const messageElement = document.createElement('div');
            messageElement.className = 'newsletter-message';
            messageElement.style.color = 'white';
            messageElement.style.marginTop = '10px';
            messageElement.style.fontSize = '0.9rem';
            messageElement.innerHTML = '✅ Dziękujemy za zapisanie się do newslettera!';
            
            // Dodaj komunikat pod formularzem
            newsletterForm.parentNode.appendChild(messageElement);
            
            // Resetuj formularz
            newsletterForm.reset();
            
            // Przywróć przycisk
            if (submitButton) {
                submitButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
                submitButton.disabled = false;
            }
            
            // Usuń komunikat po 5 sekundach
            setTimeout(() => {
                messageElement.remove();
            }, 5000);
        }, 1500);
    });
    
    // 🔄 Resetowanie stanu błędu po wpisaniu tekstu
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            this.classList.remove('error');
        });
    }
    
    console.log('✅ Formularz newslettera zainicjalizowany');
}

// ======= 🔍 ANIMACJE ELEMENTÓW PODCZAS PRZEWIJANIA =======
function initRevealOnScroll() {
    // Znajdź wszystkie elementy do animacji
    const revealElements = document.querySelectorAll('.reveal-element');
    
    if (revealElements.length === 0) return; // Zabezpieczenie przed brakiem elementów
    
    // 🔄 Funkcja sprawdzająca, czy element jest widoczny na ekranie
    function checkElementsInView() {
        revealElements.forEach(element => {
            // Pobierz pozycję elementu
            const rect = element.getBoundingClientRect();
            
            // Sprawdź, czy element jest w widoku
            const isVisible = (
                rect.top < window.innerHeight - 50 && // Element jest poniżej górnej krawędzi ekranu (-50px offset)
                rect.bottom > 0 // Element jest powyżej dolnej krawędzi ekranu
            );
            
            // Dodaj klasę revealed, jeśli element jest widoczny
            if (isVisible) {
                element.classList.add('revealed');
            }
            // Opcjonalnie: możesz dodać else, aby ponownie ukrywać element, gdy jest poza widokiem
            // else {
            //     element.classList.remove('revealed');
            // }
        });
    }
    
    // Sprawdź elementy na starcie
    checkElementsInView();
    
    // Sprawdź przy przewijaniu
    window.addEventListener('scroll', checkElementsInView);
    
    // Sprawdź też przy zmianie rozmiaru okna
    window.addEventListener('resize', checkElementsInView);
    
    console.log('✅ Animacje elementów podczas przewijania zainicjalizowane');
}

// ======= 🖼️ MODAL Z POWIĘKSZONYMI ZDJĘCIAMI =======
function initGalleryModal() {
    // Znajdź wszystkie przyciski otwierające modal
    const galleryZoomButtons = document.querySelectorAll('.gallery-zoom');
    const galleryModal = document.querySelector('.gallery-modal');
    
    if (galleryZoomButtons.length === 0 || !galleryModal) return; // Zabezpieczenie przed brakiem elementów
    
    // 🔄 Funkcja otwierająca modal
    function openModal(title, description, imgSrc) {
        // Ustaw treść modalu
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-description').textContent = description;
        
        // Ustaw obrazek z ładowaniem
        const modalImage = document.getElementById('modal-image');
        modalImage.src = imgSrc;
        modalImage.classList.remove('loaded');
        
        // Pokaż modal
        galleryModal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Zapobiegaj przewijaniu strony
        
        // Animacja wejścia
        setTimeout(() => {
            galleryModal.classList.add('active');
            modalImage.classList.add('loaded');
        }, 10);
    }
    
    // 🔄 Funkcja zamykająca modal
    function closeModal() {
        galleryModal.classList.remove('active');
        setTimeout(() => {
            galleryModal.style.display = 'none';
            document.body.style.overflow = ''; // Przywróć przewijanie strony
        }, 300);
    }
    
    // 🔄 Obsługa kliknięcia przycisku powiększenia
    galleryZoomButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Pobierz informacje z elementu galerii
            const galleryItem = this.closest('.gallery-item');
            const title = galleryItem.querySelector('h3').textContent;
            const description = galleryItem.querySelector('p').textContent;
            const imgSrc = galleryItem.querySelector('img').src;
            
            // Otwórz modal z danymi
            openModal(title, description, imgSrc);
        });
    });
    
    // 🔄 Obsługa kliknięcia przycisku zamknięcia modalu
    const closeButton = galleryModal.querySelector('.modal-close');
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }
    
    // 🔄 Zamykanie modalu po kliknięciu poza zawartością
    galleryModal.addEventListener('click', function(e) {
        if (e.target === galleryModal) {
            closeModal();
        }
    });
    
    // 🔄 Zamykanie modalu po wciśnięciu Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && galleryModal.classList.contains('active')) {
            closeModal();
        }
    });
    
    console.log('✅ Modal galerii zainicjalizowany');
}

// ======= 🎥 MODAL Z WIDEO =======
function initVideoModal() {
    // Znajdź przycisk wideo i modal
    const videoButtons = document.querySelectorAll('.video-btn');
    const videoModal = document.getElementById('demo-video');
    
    if (videoButtons.length === 0 || !videoModal) return; // Zabezpieczenie przed brakiem elementów
    
    // 🔄 Funkcja otwierająca modal z wideo
    function openVideoModal(videoId) {
        // Ustaw wideo YouTube w iframe
        const iframe = videoModal.querySelector('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        
        // Pokaż modal
        videoModal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Zapobiegaj przewijaniu strony
        
        // Animacja wejścia
        setTimeout(() => {
            videoModal.classList.add('active');
        }, 10);
    }
    
    // 🔄 Funkcja zamykająca modal z wideo
    function closeVideoModal() {
        videoModal.classList.remove('active');
        
        setTimeout(() => {
            videoModal.style.display = 'none';
            document.body.style.overflow = ''; // Przywróć przewijanie strony
            
            // Zatrzymaj wideo
            const iframe = videoModal.querySelector('iframe');
            iframe.src = '';
        }, 300);
    }
    
    // 🔄 Obsługa kliknięcia przycisku wideo
    videoButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // ID filmu YouTube - tutaj przykładowe
            // W rzeczywistym projekcie możesz to pobrać z atrybutu data-video-id
            const videoId = 'dQw4w9WgXcQ'; // Przykładowe ID filmu
            
            // Otwórz modal z wideo
            openVideoModal(videoId);
        });
    });
    
    // 🔄 Obsługa kliknięcia przycisku zamknięcia modalu
    const closeButton = videoModal.querySelector('.video-modal-close');
    if (closeButton) {
        closeButton.addEventListener('click', closeVideoModal);
    }
    
    // 🔄 Zamykanie modalu po kliknięciu poza zawartością
    videoModal.addEventListener('click', function(e) {
        if (e.target === videoModal) {
            closeVideoModal();
        }
    });
    
    // 🔄 Zamykanie modalu po wciśnięciu Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && videoModal.classList.contains('active')) {
            closeVideoModal();
        }
    });
    
    console.log('✅ Modal wideo zainicjalizowany');
}

// ======= 🔄 KARTY 3D =======
function initProduct3dCards() {
    // Znajdź wszystkie karty 3D
    const productCards = document.querySelectorAll('.product-3d-container');
    
    if (productCards.length === 0) return; // Zabezpieczenie przed brakiem elementów
    
    // 🔄 Obsługa obracania kart
    productCards.forEach(container => {
        const card = container.querySelector('.product-3d-card');
        const rotateHint = container.querySelector('.rotate-hint');
        
        if (!card || !rotateHint) return; // Zabezpieczenie
        
        // Sprawdź, czy urządzenie jest dotykowe
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // 🔄 Obsługa przycisku obracania
        rotateHint.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Zapobiegaj propagacji zdarzenia
            
            // Przełącz klasę flipped
            card.classList.toggle('flipped');
        });
        
        // Różne zachowanie dla urządzeń dotykowych i komputerów
        if (isTouchDevice) {
            // Na urządzeniach dotykowych: dwuklik w kartę
            container.addEventListener('dblclick', function(e) {
                // Ignoruj, jeśli kliknięto w przycisk lub link
                if (e.target.closest('.rotate-hint') || e.target.closest('a')) return;
                
                // Przełącz klasę flipped
                card.classList.toggle('flipped');
            });
        } else {
            // Na komputerach: hover effect
            container.addEventListener('mouseenter', function() {
                // Nie obracaj całkowicie - tylko lekki efekt 3D
                if (!card.classList.contains('flipped')) {
                    card.style.transform = 'rotateY(10deg)';
                }
            });
            
            container.addEventListener('mouseleave', function() {
                // Przywróć pozycję, jeśli karta nie jest obrócona
                if (!card.classList.contains('flipped')) {
                    card.style.transform = '';
                }
            });
        }
    });
    
    console.log('✅ Karty 3D zainicjalizowane');
}

// ======= 🌙 PRZEŁĄCZNIK TRYBU CIEMNEGO =======
function initDarkModeToggle() {
    const themeToggle = document.getElementById('theme-switch');
    
    if (!themeToggle) return; // Zabezpieczenie przed brakiem elementu
    
    // Funkcja ustawiająca tryb na podstawie preferencji użytkownika
    function setInitialTheme() {
        // Sprawdź zapisane preferencje
        const savedTheme = localStorage.getItem('theme');
        
        // Jeśli użytkownik już wybrał motyw, użyj go
        if (savedTheme) {
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-theme');
                updateIcon(true);
            }
            return;
        }
        
        // W przeciwnym razie sprawdź preferencje systemowe
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            document.body.classList.add('dark-theme');
            updateIcon(true);
        }
    }
    
    // Funkcja aktualizująca ikonę
    function updateIcon(isDark) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            if (isDark) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        }
    }
    
    // Ustaw początkowy motyw
    setInitialTheme();
    
    // Obsługa kliknięcia przycisku
    themeToggle.addEventListener('click', function() {
        // Przełącz klasę dark-theme
        const isDark = document.body.classList.toggle('dark-theme');
        
        // Zapisz preferencje
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Aktualizuj ikonę
        updateIcon(isDark);
    });
    
    // Nasłuchiwanie zmian preferencji systemowych
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        // Zmień motyw tylko jeśli użytkownik nie ustawił własnych preferencji
        if (!localStorage.getItem('theme')) {
            const isDark = e.matches;
            document.body.classList.toggle('dark-theme', isDark);
            updateIcon(isDark);
        }
    });
    
    console.log('✅ Przełącznik trybu ciemnego zainicjalizowany');
}

// ======= 💬 OPINIE KLIENTÓW =======
function initReviewsCarousel() {
    // Znajdź kontener opinii i przyciski nawigacyjne
    const reviewsContainer = document.getElementById('reviews-container');
    const prevButton = document.querySelector('.google-reviews-slider .slider-prev');
    const nextButton = document.querySelector('.google-reviews-slider .slider-next');
    const filterButtons = document.querySelectorAll('.filter-option');
    
    if (!reviewsContainer) return; // Zabezpieczenie przed brakiem elementu
    
    // Przykładowe dane opinii (użyj rzeczywistych danych z API Google)
    const reviewsData = [
        {
            name: "Anna Kowalska",
            avatar: "images/reviews/avatar1.jpg",
            rating: 5,
            date: "2 tygodnie temu",
            content: "Jesteśmy bardzo zadowoleni z okien dostarczonych przez firmę AKO. Profesjonalny montaż, wysoka jakość i świetna obsługa klienta. Polecam wszystkim, którzy szukają najlepszych okien na rynku!",
            isVerified: true,
            reviewUrl: "#"
        },
        {
            name: "Jan Nowak",
            avatar: "images/reviews/avatar2.jpg",
            rating: 5,
            date: "1 miesiąc temu",
            content: "Zamówiłem drzwi wejściowe i jestem zachwycony rezultatem. Jakość wykonania i estetyka na najwyższym poziomie. Montaż przebiegł sprawnie i bez problemów. Szczerze polecam!",
            isVerified: true,
            reviewUrl: "#"
        },
        {
            name: "Małgorzata Wiśniewska",
            avatar: "images/reviews/avatar3.jpg",
            rating: 4,
            date: "2 miesiące temu",
            content: "Okna spełniają moje oczekiwania, są energooszczędne i dobrze wygłuszają hałas z ulicy. Jedyne zastrzeżenie mam do czasu realizacji, który był dłuższy niż początkowo ustalono. Poza tym wszystko w porządku.",
            isVerified: true,
            reviewUrl: "#"
        },
        {
            name: "Piotr Kowalczyk",
            avatar: "images/reviews/avatar4.jpg",
            rating: 5,
            date: "3 miesiące temu",
            content: "Firma AKO zainstalowała u mnie okna w całym domu oraz drzwi tarasowe. Jestem pod wrażeniem jakości produktów i profesjonalizmu ekipy montażowej. Widać, że znają się na rzeczy i dbają o każdy szczegół.",
            isVerified: true,
            reviewUrl: "#"
        }
    ];
    
    // Funkcja renderująca opinie
    function renderReviews(filter = 'all') {
        // Wyczyść kontener
        reviewsContainer.innerHTML = '';
        
        // Filtruj opinie
        let filteredReviews = [...reviewsData];
        
        if (filter === '5') {
            filteredReviews = reviewsData.filter(review => review.rating === 5);
        } else if (filter === '4') {
            filteredReviews = reviewsData.filter(review => review.rating === 4);
        } else if (filter === '3') {
            filteredReviews = reviewsData.filter(review => review.rating <= 3);
        } else if (filter === 'recent') {
            // Tutaj po prostu bierzemy wszystkie opinie, ale w rzeczywistym projekcie można byłoby sortować po dacie
        }
        
        // Renderuj opinie
        filteredReviews.forEach(review => {
            // Generowanie gwiazdek
            let starsHTML = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= review.rating) {
                    starsHTML += '<i class="fas fa-star star-icon"></i>';
                } else {
                    starsHTML += '<i class="far fa-star star-icon"></i>';
                }
            }
            
            // Tworzenie elementu opinii
            const reviewElement = document.createElement('div');
            reviewElement.className = 'review-card';
            reviewElement.innerHTML = `
                <div class="review-header">
                    <div class="reviewer-avatar">
                        <img src="${review.avatar}" alt="${review.name}" width="50" height="50">
                    </div>
                    <div class="reviewer-info">
                        <div class="reviewer-name">${review.name}</div>
                        <div class="review-date">${review.date}</div>
                    </div>
                </div>
                <div class="review-stars" aria-label="Ocena: ${review.rating} na 5 gwiazdek">
                    ${starsHTML}
                </div>
                <div class="review-content">
                    "${review.content}"
                </div>
                <div class="review-footer">
                    <div class="verified-badge">
                        <i class="fas fa-check-circle"></i> Zweryfikowana opinia
                    </div>
                    <a href="${review.reviewUrl}" class="view-on-google" target="_blank" rel="noopener">
                        Zobacz na Google <i class="fas fa-external-link-alt"></i>
                    </a>
                </div>
            `;
            
            // Dodaj element do kontenera
            reviewsContainer.appendChild(reviewElement);
        });
    }
    
    // Renderuj opinie na starcie
    renderReviews();
    
    // Obsługa filtrów
    if (filterButtons) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Usuń klasę active z wszystkich przycisków
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Dodaj klasę active do klikniętego przycisku
                this.classList.add('active');
                
                // Renderuj opinie z filtrem
                renderReviews(this.dataset.filter);
            });
        });
    }
    
    // Obsługa strzałek nawigacyjnych
    if (prevButton && nextButton) {
        // Przewijanie w lewo
        prevButton.addEventListener('click', function() {
            reviewsContainer.scrollBy({
                left: -350, // Szerokość karty opinii
                behavior: 'smooth'
            });
        });
        
        // Przewijanie w prawo
        nextButton.addEventListener('click', function() {
            reviewsContainer.scrollBy({
                left: 350, // Szerokość karty opinii
                behavior: 'smooth'
            });
        });
    }
    
    console.log('✅ Karuzela opinii zainicjalizowana');
}

// ======= 💰 KALKULATOR OSZCZĘDNOŚCI ENERGETYCZNYCH =======
function initEnergyCalculator() {
    const calculatorForm = document.querySelector('.calculator-form');
    const calculateButton = document.getElementById('calculate-savings');
    
    if (!calculatorForm || !calculateButton) return; // Zabezpieczenie przed brakiem elementów
    
    // Obsługa przycisku "Oblicz oszczędności"
    calculateButton.addEventListener('click', calculateEnergySavings);
    
    // Obsługa zmian w polach formularza (obliczanie na bieżąco)
    const inputFields = calculatorForm.querySelectorAll('input, select');
    inputFields.forEach(field => {
        field.addEventListener('change', () => {
            // Dodajemy opóźnienie, aby animacja się wykonała
            setTimeout(calculateEnergySavings, 100);
        });
    });
    
    // Obsługa przycisku "Pobierz raport PDF"
    const downloadReportButton = document.getElementById('download-report');
    if (downloadReportButton) {
        downloadReportButton.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Funkcja generowania raportu PDF będzie dostępna wkrótce.');
        });
    }
    
    // Obsługa togglera metodologii
    const methodologyToggle = document.getElementById('methodology-toggle');
    const methodologyDescription = document.getElementById('methodology-description');
    
    if (methodologyToggle && methodologyDescription) {
        methodologyToggle.addEventListener('click', function(e) {
            e.preventDefault();
            const isHidden = methodologyDescription.style.display === 'none';
            methodologyDescription.style.display = isHidden ? 'block' : 'none';
        });
    }
    
    // Wykonaj pierwsze obliczenie na starcie
    calculateEnergySavings();
    
    console.log('✅ Kalkulator oszczędności energetycznych zainicjalizowany');
}

// Funkcja obliczająca oszczędności energetyczne
function calculateEnergySavings() {
    // Pobierz wartości z formularza
    const windowArea = parseFloat(document.getElementById('window-area').value || 0);
    const windowType = document.getElementById('window-type').value;
    const heatingType = document.getElementById('heating-type').value;
    
    // Walidacja danych
    if (windowArea <= 0) {
        alert('Proszę podać prawidłową powierzchnię okien');
        return;
    }
    
    // Współczynniki przenikania ciepła (U) dla różnych typów okien (W/m²K)
    const windowUValues = {
        'old-single': 5.0,     // Stare okna jednoszybowe
        'old-double': 2.8,     // Stare okna dwuszybowe
        'standard-double': 1.5, // Standardowe okna dwuszybowe
        'standard-triple': 1.1, // Standardowe okna trzyszybowe
        'new-triple': 0.8      // Nowe okna trzyszybowe (nasza oferta)
    };
    
    // Ceny energii za kWh dla różnych rodzajów ogrzewania (zł/kWh)
    const energyPrices = {
        'gas': 0.35,        // Gaz ziemny
        'electric': 0.75,   // Prąd elektryczny
        'coal': 0.25,       // Węgiel
        'pellet': 0.30,     // Pellet drzewny
        'oil': 0.48         // Olej opałowy
    };
    
    // Emisja CO2 dla różnych rodzajów ogrzewania (kg CO2 / kWh)
    const co2Emissions = {
        'gas': 0.2056,      // Gaz ziemny
        'electric': 0.662,  // Prąd elektryczny
        'coal': 0.4125,     // Węgiel
        'pellet': 0.03,     // Pellet drzewny
        'oil': 0.3          // Olej opałowy
    };
    
    // Czas grzania w ciągu roku (dni)
    const heatingDays = 200;
    
    // Średnia różnica temperatur wewnątrz i na zewnątrz budynku w sezonie grzewczym (K)
    const averageTempDifference = 20;
    
    // Współczynnik czasu ogrzewania w ciągu doby (h)
    const heatingHoursCoefficient = 24;
    
    // Porównujemy obecne okna z naszymi najlepszymi oknami
    const currentUValue = windowUValues[windowType];
    const newUValue = windowUValues['new-triple'];
    
    // Obliczamy roczne straty ciepła przez okna (kWh/rok)
    const currentHeatLoss = currentUValue * windowArea * averageTempDifference * heatingDays * heatingHoursCoefficient * 0.001;
    const newHeatLoss = newUValue * windowArea * averageTempDifference * heatingDays * heatingHoursCoefficient * 0.001;
    
    // Oszczędność energii (kWh/rok)
    const energySavings = currentHeatLoss - newHeatLoss;
    
    // Oszczędność finansowa (zł/rok)
    const financialSavings = energySavings * energyPrices[heatingType];
    
    // Oszczędność CO2 (kg/rok)
    const co2Savings = energySavings * co2Emissions[heatingType];
    
    // Oszczędność w ciągu 10 lat
    const tenYearSavings = financialSavings * 10;
    
    // Aktualizujemy wyniki
    document.getElementById('yearly-savings').textContent = Math.round(financialSavings) + ' zł';
    document.getElementById('ten-year-savings').textContent = Math.round(tenYearSavings) + ' zł';
    document.getElementById('co2-reduction').textContent = Math.round(co2Savings) + ' kg/rok';
    
    // Dodajemy animacje dla wyników
    animateResults();
}

// Funkcja animująca wyniki kalkulatora
function animateResults() {
    const results = document.querySelectorAll('.result-value');
    
    results.forEach(result => {
        // Dodajemy klasę dla animacji
        result.classList.add('highlight');
        
        // Usuwamy klasę po zakończeniu animacji
        setTimeout(() => {
            result.classList.remove('highlight');
        }, 1000);
    });
}