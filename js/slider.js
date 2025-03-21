// =========== FUNKCJE SLIDERÓW ===========
// 🎠 Ten plik zawiera funkcje do obsługi wszystkich sliderów/karuzel na stronie

document.addEventListener('DOMContentLoaded', function() {
    // Inicjalizujemy główny slider na stronie głównej
    initHeroSlider();
    
    // Inicjalizujemy slider z opiniami
    initTestimonialsSlider();
});

// 🖼️ GŁÓWNY SLIDER
function initHeroSlider() {
    const heroSlider = document.querySelector('.hero-slider');
    
    // Jeśli slider nie istnieje na tej stronie, kończymy
    if (!heroSlider) return;
    
    // Znajdź wszystkie slajdy
    const slides = heroSlider.querySelectorAll('.slide');
    
    // Jeśli mamy tylko jeden slajd, nie potrzebujemy slidera
    if (slides.length <= 1) {
        slides[0].classList.add('active');
        return;
    }
    
    // Dodajemy przyciski nawigacyjne
    const prevButton = document.createElement('button');
    prevButton.className = 'slider-nav prev';
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    heroSlider.appendChild(prevButton);
    
    const nextButton = document.createElement('button');
    nextButton.className = 'slider-nav next';
    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    heroSlider.appendChild(nextButton);
    
    // Dodajemy wskaźniki slajdów (kropki)
    const indicators = document.createElement('div');
    indicators.className = 'slider-indicators';
    
    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('span');
        dot.className = i === 0 ? 'indicator active' : 'indicator';
        dot.dataset.slide = i;
        indicators.appendChild(dot);
    }
    
    heroSlider.appendChild(indicators);
    
    // Zmienne do kontroli slidera
    let currentSlide = 0;
    let isAnimating = false;
    let autoPlayTimer;
    
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
        const dots = indicators.querySelectorAll('.indicator');
        dots.forEach((dot, i) => {
            if (i === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // Po zakończeniu animacji
        setTimeout(() => {
            isAnimating = false;
        }, 700); // Czas powinien być zgodny z czasem animacji w CSS
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
        autoPlayTimer = setInterval(nextSlide, 5000); // Co 5 sekund
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayTimer);
    }
    
    // Obsługa przycisków nawigacyjnych
    nextButton.addEventListener('click', () => {
        stopAutoPlay();
        nextSlide();
        startAutoPlay();
    });
    
    prevButton.addEventListener('click', () => {
        stopAutoPlay();
        prevSlide();
        startAutoPlay();
    });
    
    // Obsługa kliknięcia wskaźników
    indicators.querySelectorAll('.indicator').forEach(dot => {
        dot.addEventListener('click', () => {
            const slideIndex = parseInt(dot.dataset.slide);
            stopAutoPlay();
            showSlide(slideIndex);
            startAutoPlay();
        });
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
    
    // Aktywujemy pierwszy slajd i zaczynamy automatyczne przełączanie
    slides[0].classList.add('active');
    startAutoPlay();
    
    // Zatrzymujemy automatyczne przełączanie przy najechaniu myszką
    heroSlider.addEventListener('mouseenter', stopAutoPlay);
    heroSlider.addEventListener('mouseleave', startAutoPlay);
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
    testimonialsSlider.appendChild(prevButton);
    
    const nextButton = document.createElement('button');
    nextButton.className = 'slider-nav next';
    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    testimonialsSlider.appendChild(nextButton);
    
    // Dodajemy wskaźniki (kropki)
    const indicators = document.createElement('div');
    indicators.className = 'slider-indicators';
    
    for (let i = 0; i < testimonials.length; i++) {
        const dot = document.createElement('span');
        dot.className = i === 0 ? 'indicator active' : 'indicator';
        dot.dataset.slide = i;
        indicators.appendChild(dot);
    }
    
    testimonialsSlider.appendChild(indicators);
    
    // Zmienne do kontroli slidera
    let currentTestimonial = 0;
    let isAnimating = false;
    let autoPlayTimer;
    
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
        
        // Po zakończeniu animacji
        setTimeout(() => {
            isAnimating = false;
        }, 500);
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
}