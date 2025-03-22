// =========== FUNKCJE SLIDERÓW - POPRAWIONA WERSJA ===========
// 🎠 Ten plik zawiera funkcje do obsługi wszystkich sliderów/karuzel na stronie

document.addEventListener('DOMContentLoaded', function() {
    // Preładowanie obrazów tła
    preloadSliderImages();
    
    // Inicjalizujemy główny slider na stronie głównej
    initHeroSlider();
    
    // Inicjalizujemy slider z opiniami
    initTestimonialsSlider();
});

// 🌄 PREŁADOWANIE OBRAZÓW SLIDERA
function preloadSliderImages() {
    const slides = document.querySelectorAll('.slide');
    
    if (slides.length > 0) {
        slides.forEach(slide => {
            const bgElement = slide.querySelector('.slide-bg');
            if (bgElement) {
                const bgStyle = window.getComputedStyle(bgElement);
                const bgImage = bgStyle.backgroundImage;
                
                // Wyodrębniamy URL obrazu
                const imageUrl = bgImage.match(/url\(['"]?(.*?)['"]?\)/);
                
                if (imageUrl && imageUrl[1]) {
                    // Preładujemy obraz
                    const img = new Image();
                    img.src = imageUrl[1];
                    console.log('Preładowanie obrazu:', imageUrl[1]);
                }
            }
        });
    }
}

// 🖼️ GŁÓWNY SLIDER - POPRAWIONA WERSJA
function initHeroSlider() {
    const heroSlider = document.querySelector('.hero-slider');
    
    // Jeśli slider nie istnieje na tej stronie, kończymy
    if (!heroSlider) return;
    
    // Znajdź wszystkie slajdy
    const slides = heroSlider.querySelectorAll('.slide');
    
    // Jeśli mamy tylko jeden slajd, nie potrzebujemy slidera
    if (slides.length <= 1) {
        if (slides.length === 1) {
            slides[0].classList.add('active');
        }
        return;
    }
    
    // Dodajemy przyciski nawigacyjne (jeśli jeszcze nie istnieją)
    let prevButton = heroSlider.querySelector('.slider-nav.prev');
    let nextButton = heroSlider.querySelector('.slider-nav.next');
    
    if (!prevButton) {
        prevButton = document.createElement('button');
        prevButton.className = 'slider-nav prev';
        prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevButton.setAttribute('aria-label', 'Poprzedni slajd');
        heroSlider.appendChild(prevButton);
    }
    
    if (!nextButton) {
        nextButton = document.createElement('button');
        nextButton.className = 'slider-nav next';
        nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextButton.setAttribute('aria-label', 'Następny slajd');
        heroSlider.appendChild(nextButton);
    }
    
    // Dodajemy wskaźniki slajdów (jeśli jeszcze nie istnieją)
    let indicators = heroSlider.querySelector('.slider-indicators');
    
    if (!indicators) {
        indicators = document.createElement('div');
        indicators.className = 'slider-indicators';
        
        for (let i = 0; i < slides.length; i++) {
            const dot = document.createElement('span');
            dot.className = i === 0 ? 'indicator active' : 'indicator';
            dot.dataset.slide = i;
            dot.setAttribute('aria-label', `Slajd ${i + 1}`);
            indicators.appendChild(dot);
        }
        
        heroSlider.appendChild(indicators);
    }
    
    // Pobieramy wszystkie kropki
    const dots = indicators.querySelectorAll('.indicator');
    
    // Zmienne do kontroli slidera
    let currentSlide = 0;
    let isAnimating = false;
    let autoPlayTimer;
    let autoPlayDelay = 7000; // Dłuższy czas wyświetlania slajdu (7 sekund)
    
    // Sprawdzamy, czy jakiś slajd jest już aktywny
    const activeSlide = heroSlider.querySelector('.slide.active');
    if (activeSlide) {
        // Znajdujemy indeks aktywnego slajdu
        slides.forEach((slide, index) => {
            if (slide === activeSlide) {
                currentSlide = index;
            }
        });
    } else {
        // Aktywujemy pierwszy slajd, jeśli żaden nie jest aktywny
        slides[0].classList.add('active');
    }
    
    // Aktualizujemy wskaźniki, aby odpowiadały aktualnemu slajdowi
    updateIndicators();
    
    // Funkcja pokazująca dany slajd
    function showSlide(index) {
        if (isAnimating) return;
        isAnimating = true;
        
        // Ukrywamy aktualny slajd
        slides[currentSlide].classList.remove('active');
        
        // Aktualizujemy indeks aktualnego slajdu
        currentSlide = index;
        
        // Zapewniamy, że indeks jest w prawidłowym zakresie
        if (currentSlide >= slides.length) currentSlide = 0;
        if (currentSlide < 0) currentSlide = slides.length - 1;
        
        // Pokazujemy nowy slajd
        slides[currentSlide].classList.add('active');
        
        // Aktualizujemy wskaźniki
        updateIndicators();
        
        // Po zakończeniu animacji przejścia zezwalamy na kolejne przejście
        setTimeout(() => {
            isAnimating = false;
        }, 1500); // Czas zgodny z transition w CSS (1.5s)
    }
    
    // Funkcja aktualizująca wskaźniki
    function updateIndicators() {
        dots.forEach((dot, i) => {
            if (i === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Funkcja przełączająca do następnego slajdu
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    // Funkcja przełączająca do poprzedniego slajdu
    function prevSlide() {
        showSlide(currentSlide - 1);
    }
    
    // Ustawiamy automatyczne przełączanie slajdów
    function startAutoPlay() {
        // Czyszczenie istniejącego timera dla pewności
        clearInterval(autoPlayTimer);
        autoPlayTimer = setInterval(nextSlide, autoPlayDelay);
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayTimer);
    }
    
    // Obsługa przycisków nawigacyjnych
    prevButton.addEventListener('click', () => {
        stopAutoPlay();
        prevSlide();
        startAutoPlay();
    });
    
    nextButton.addEventListener('click', () => {
        stopAutoPlay();
        nextSlide();
        startAutoPlay();
    });
    
    // Obsługa kliknięcia wskaźników
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const slideIndex = parseInt(dot.dataset.slide);
            if (currentSlide !== slideIndex) { // Zapobiegamy zbędnym przejściom
                stopAutoPlay();
                showSlide(slideIndex);
                startAutoPlay();
            }
        });
    });
    
    // Dodajemy obsługę klawiszy do nawigacji
    heroSlider.setAttribute('tabindex', '0'); // Dodajemy możliwość fokusowania
    
    heroSlider.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            stopAutoPlay();
            prevSlide();
            startAutoPlay();
        } else if (e.key === 'ArrowRight') {
            stopAutoPlay();
            nextSlide();
            startAutoPlay();
        }
    });
    
    // Obsługa dotykowa dla urządzeń mobilnych
    let touchStartX = 0;
    let touchEndX = 0;
    
    heroSlider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    heroSlider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50; // Minimalna odległość przesunięcia
        
        if (touchEndX - touchStartX > swipeThreshold) {
            // Przesunięcie w prawo - poprzedni slajd
            stopAutoPlay();
            prevSlide();
            startAutoPlay();
        } else if (touchStartX - touchEndX > swipeThreshold) {
            // Przesunięcie w lewo - następny slajd
            stopAutoPlay();
            nextSlide();
            startAutoPlay();
        }
    }
    
    // Zatrzymujemy automatyczne przełączanie przy najechaniu myszką
    heroSlider.addEventListener('mouseenter', stopAutoPlay);
    heroSlider.addEventListener('mouseleave', startAutoPlay);
    
    // Zatrzymuj automatyczne przełączanie, gdy strona nie jest widoczna
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }
    });
    
    // Sprawdzamy, czy slajder jest w widoku przy przewijaniu
    window.addEventListener('scroll', () => {
        const rect = heroSlider.getBoundingClientRect();
        const isInView = (
            rect.top >= -rect.height &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + rect.height
        );
        
        if (isInView) {
            startAutoPlay();
        } else {
            stopAutoPlay();
        }
    });
    
    // Startujemy automatyczne przełączanie
    startAutoPlay();
    
    // Domyślnie już aktywowaliśmy pierwszy slajd, więc nie musimy tego robić ponownie
    console.log('✅ Slider główny zainicjalizowany poprawnie');
}

// 💬 SLIDER OPINII
function initTestimonialsSlider() {
    const testimonialsSlider = document.querySelector('.testimonials-slider');
    
    // Jeśli slider nie istnieje na tej stronie, kończymy
    if (!testimonialsSlider) return;
    
    // Znajdź wszystkie opinie
    const testimonials = testimonialsSlider.querySelectorAll('.testimonial');
    
    // Jeśli mamy mniej niż 2 opinie, nie potrzebujemy slidera
    if (testimonials.length <= 1) {
        if (testimonials.length === 1) {
            testimonials[0].classList.add('active');
        }
        return;
    }
    
    // Dodajemy przyciski nawigacyjne
    const prevButton = document.createElement('button');
    prevButton.className = 'slider-nav prev';
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevButton.setAttribute('aria-label', 'Poprzednia opinia');
    testimonialsSlider.appendChild(prevButton);
    
    const nextButton = document.createElement('button');
    nextButton.className = 'slider-nav next';
    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextButton.setAttribute('aria-label', 'Następna opinia');
    testimonialsSlider.appendChild(nextButton);
    
    // Dodajemy wskaźniki (kropki)
    const indicators = document.createElement('div');
    indicators.className = 'slider-indicators';
    
    for (let i = 0; i < testimonials.length; i++) {
        const dot = document.createElement('span');
        dot.className = i === 0 ? 'indicator active' : 'indicator';
        dot.dataset.slide = i;
        dot.setAttribute('aria-label', `Opinia ${i + 1}`);
        indicators.appendChild(dot);
    }
    
    testimonialsSlider.appendChild(indicators);
    
    // Zmienne do kontroli slidera
    let currentTestimonial = 0;
    let isAnimating = false;
    let autoPlayTimer;
    
    // Domyślna wartość w milisekundach dla opinii
    const transitionDuration = 500;
    
    // Funkcja pokazująca daną opinię
    function showTestimonial(index) {
        if (isAnimating) return;
        isAnimating = true;
        
        // Ukrywamy aktualną opinię
        testimonials[currentTestimonial].classList.remove('active');
        
        // Aktualizujemy indeks aktualnej opinii
        currentTestimonial = index;
        
        // Zapewniamy, że indeks jest w prawidłowym zakresie
        if (currentTestimonial >= testimonials.length) currentTestimonial = 0;
        if (currentTestimonial < 0) currentTestimonial = testimonials.length - 1;
        
        // Pokazujemy nową opinię
        testimonials[currentTestimonial].classList.add('active');
        
        // Aktualizujemy wskaźniki
        const dots = indicators.querySelectorAll('.indicator');
        dots.forEach((dot, i) => {
            if (i === currentTestimonial) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // Używamy dynamicznego czasu
        setTimeout(() => {
            isAnimating = false;
        }, transitionDuration);
    }
    
    // Funkcja przełączająca do następnej opinii
    function nextTestimonial() {
        showTestimonial(currentTestimonial + 1);
    }
    
    // Funkcja przełączająca do poprzedniej opinii
    function prevTestimonial() {
        showTestimonial(currentTestimonial - 1);
    }
    
    // Ustawiamy automatyczne przełączanie opinii
    function startAutoPlay() {
        autoPlayTimer = setInterval(nextTestimonial, 6000); // Co 6 sekund
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayTimer);
    }
    
    // Obsługa przycisków nawigacyjnych
    nextButton.addEventListener('click', () => {
        stopAutoPlay();
        nextTestimonial();
        startAutoPlay();
    });
    
    prevButton.addEventListener('click', () => {
        stopAutoPlay();
        prevTestimonial();
        startAutoPlay();
    });
    
    // Obsługa kliknięcia wskaźników
    indicators.querySelectorAll('.indicator').forEach(dot => {
        dot.addEventListener('click', () => {
            const testimonialIndex = parseInt(dot.dataset.slide);
            stopAutoPlay();
            showTestimonial(testimonialIndex);
            startAutoPlay();
        });
    });
    
    // Dodajemy obsługę klawiszy
    testimonialsSlider.setAttribute('tabindex', '0');
    
    testimonialsSlider.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            stopAutoPlay();
            prevTestimonial();
            startAutoPlay();
        } else if (e.key === 'ArrowRight') {
            stopAutoPlay();
            nextTestimonial();
            startAutoPlay();
        }
    });
    
    // Obsługa dotykowa dla urządzeń mobilnych
    let touchStartX = 0;
    let touchEndX = 0;
    
    testimonialsSlider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    testimonialsSlider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50; // Minimalna odległość przesunięcia
        
        if (touchEndX - touchStartX > swipeThreshold) {
            // Przesunięcie w prawo - poprzednia opinia
            stopAutoPlay();
            prevTestimonial();
            startAutoPlay();
        } else if (touchStartX - touchEndX > swipeThreshold) {
            // Przesunięcie w lewo - następna opinia
            stopAutoPlay();
            nextTestimonial();
            startAutoPlay();
        }
    }
    
    // Aktywujemy pierwszą opinię i zaczynamy automatyczne przełączanie
    testimonials[0].classList.add('active');
    startAutoPlay();
    
    // Zatrzymujemy automatyczne przełączanie przy najechaniu myszką
    testimonialsSlider.addEventListener('mouseenter', stopAutoPlay);
    testimonialsSlider.addEventListener('mouseleave', startAutoPlay);
    
    // Zatrzymuj automatyczne przełączanie, gdy strona nie jest widoczna
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoPlay();
        } else {
            // Sprawdzamy, czy slider jest w widoku
            const rect = testimonialsSlider.getBoundingClientRect();
            const isInView = (
                rect.top >= -rect.height &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + rect.height
            );
            
            if (isInView) {
                startAutoPlay();
            }
        }
    });
}