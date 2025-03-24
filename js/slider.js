// =========== 🎠 FUNKCJE SLIDERÓW I KARUZEL ===========
/* 
 * Ten plik zawiera funkcje do obsługi wszystkich sliderów i karuzel na stronie.
 * Używa prostych, ale efektywnych technik bez zewnętrznych bibliotek.
 * 💡 Jeśli nie jesteś programistą, nie martw się! Wszystko zostało wytłumaczone krok po kroku.
 */

// Czekaj na załadowanie całej strony przed uruchomieniem kodu
document.addEventListener('DOMContentLoaded', function() {
    // 🖼️ Inicjalizacja głównego slidera
    initHeroSlider();
    
    // 📱 Preładowanie obrazów dla szybszego działania
    preloadSliderImages();
    
    console.log('✅ Wszystkie slidery zainicjalizowane pomyślnie');
});

// ======= 🖼️ GŁÓWNY SLIDER STRONY =======
function initHeroSlider() {
    // Znajdź elementy slidera
    const heroSlider = document.querySelector('.hero-slider');
    
    // Jeśli slider nie istnieje na tej stronie, zakończ
    if (!heroSlider) return;
    
    // Znajdź wszystkie slajdy
    const slides = heroSlider.querySelectorAll('.slide');
    
    // Jeśli jest tylko jeden slajd lub brak slajdów, nie potrzebujemy slidera
    if (slides.length <= 1) {
        // Upewnij się, że pierwszy slajd jest widoczny
        if (slides.length === 1) {
            slides[0].classList.add('active');
        }
        return;
    }
    
    // Znajdź przyciski nawigacyjne i wskaźniki
    const prevButton = heroSlider.querySelector('.slider-nav.prev');
    const nextButton = heroSlider.querySelector('.slider-nav.next');
    const indicators = heroSlider.querySelectorAll('.indicator');
    
    // Zmienne kontrolne slidera
    let currentSlide = 0;
    let isAnimating = false;
    let autoPlayTimer;
    const autoPlayDelay = 7000; // Czas wyświetlania slajdu (7 sekund)
    
    // 🔄 Funkcja pokazująca wybrany slajd
    function showSlide(index) {
        // Zapobieganie kliknięciu podczas animacji
        if (isAnimating) return;
        isAnimating = true;
        
        // Ukryj aktualny slajd (usuń klasę active)
        slides[currentSlide].classList.remove('active');
        
        // Aktualizuj indeks aktualnego slajdu
        currentSlide = index;
        
        // Jeśli indeks jest poza zakresem, skoryguj go
        if (currentSlide >= slides.length) currentSlide = 0;
        if (currentSlide < 0) currentSlide = slides.length - 1;
        
        // Pokaż nowy slajd (dodaj klasę active)
        slides[currentSlide].classList.add('active');
        
        // Aktualizuj aktywny wskaźnik (kropkę)
        updateIndicators();
        
        // Zresetuj animację po zakończeniu przejścia
        setTimeout(() => {
            isAnimating = false;
        }, 1500); // Czas zgodny z transition w CSS (1.5s)
    }
    
    // 🔄 Funkcja aktualizująca wskaźniki (kropki)
    function updateIndicators() {
        indicators.forEach((indicator, index) => {
            if (index === currentSlide) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    // 🔄 Funkcje nawigacyjne
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    function prevSlide() {
        showSlide(currentSlide - 1);
    }
    
    // 🔄 Funkcje kontroli automatycznego odtwarzania
    function startAutoPlay() {
        // Wyczyść istniejący timer, aby uniknąć wielu jednoczesnych timerów
        clearInterval(autoPlayTimer);
        autoPlayTimer = setInterval(nextSlide, autoPlayDelay);
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayTimer);
    }
    
    // 🔄 Obsługa przycisków nawigacyjnych
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            stopAutoPlay(); // Zatrzymaj automatyczne przewijanie
            prevSlide();    // Pokaż poprzedni slajd
            startAutoPlay(); // Uruchom ponownie automatyczne przewijanie
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            stopAutoPlay(); // Zatrzymaj automatyczne przewijanie
            nextSlide();    // Pokaż następny slajd
            startAutoPlay(); // Uruchom ponownie automatyczne przewijanie
        });
    }
    
    // 🔄 Obsługa wskaźników (kropek)
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            // Pokaż odpowiedni slajd tylko jeśli nie jest już aktywny
            if (currentSlide !== index) {
                stopAutoPlay();
                showSlide(index);
                startAutoPlay();
            }
        });
        
        // Dla dostępności - obsługa klawiatury
        indicator.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                stopAutoPlay();
                showSlide(index);
                startAutoPlay();
            }
        });
    });
    
    // 🔄 Obsługa klawiszy strzałek dla slidera
    heroSlider.setAttribute('tabindex', '0'); // Umożliwiamy focus
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
    
    // 📱 Obsługa gestów dotykowych (swipe)
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Rozpoczęcie dotyku
    heroSlider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    // Zakończenie dotyku
    heroSlider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    // Funkcja obsługująca gest przesunięcia
    function handleSwipe() {
        const swipeThreshold = 50; // Minimalny dystans przesunięcia
        
        // Przesunięcie w prawo - poprzedni slajd
        if (touchEndX - touchStartX > swipeThreshold) {
            stopAutoPlay();
            prevSlide();
            startAutoPlay();
        }
        // Przesunięcie w lewo - następny slajd
        else if (touchStartX - touchEndX > swipeThreshold) {
            stopAutoPlay();
            nextSlide();
            startAutoPlay();
        }
    }
    
    // 🔄 Zatrzymanie automatycznego odtwarzania przy najechaniu myszą
    heroSlider.addEventListener('mouseenter', stopAutoPlay);
    heroSlider.addEventListener('mouseleave', startAutoPlay);
    
    // 🔄 Zatrzymanie automatycznego odtwarzania, gdy strona jest niewidoczna
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }
    });
    
    // 🔄 Sprawdzanie, czy slider jest w widoku
    function checkSliderVisibility() {
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
    }
    
    // Sprawdź widoczność przy przewijaniu
    window.addEventListener('scroll', checkSliderVisibility);
    
    // 🔄 Inicjalizacja - upewnij się, że pierwszy slajd jest aktywny i uruchom automatyczne odtwarzanie
    if (!slides[currentSlide].classList.contains('active')) {
        slides[currentSlide].classList.add('active');
    }
    updateIndicators();
    startAutoPlay();
    
    console.log('✅ Główny slider zainicjalizowany');
}

// ======= 🖼️ PREŁADOWANIE OBRAZÓW SLIDERA =======
function preloadSliderImages() {
    // Znajdź wszystkie slajdy
    const slides = document.querySelectorAll('.slide');
    
    if (slides.length === 0) return; // Jeśli nie ma slajdów, zakończ
    
    // Dla każdego slajdu, załaduj obraz w tle
    slides.forEach(slide => {
        const bgElement = slide.querySelector('.slide-bg');
        if (bgElement) {
            // Pobierz styl tła
            const computedStyle = window.getComputedStyle(bgElement);
            const backgroundImage = computedStyle.backgroundImage;
            
            // Wyodrębnij URL obrazu
            const urlMatch = backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/);
            
            if (urlMatch && urlMatch[1]) {
                // Utwórz nowy element Image do załadowania obrazu
                const img = new Image();
                img.src = urlMatch[1];
                
                // Opcjonalnie: Możesz dodać obsługę zdarzeń load/error
                img.onload = () => console.log(`✅ Załadowano obraz: ${urlMatch[1]}`);
                img.onerror = () => console.error(`❌ Błąd ładowania obrazu: ${urlMatch[1]}`);
            }
        }
    });
    
    console.log('✅ Rozpoczęto preładowanie obrazów slidera');
}

// ======= 🎠 DODATKOWA FUNKCJA: KARUZELĘ PRODUKTÓW =======
// Ta funkcja nie jest używana w głównym kodzie, ale została dodana jako przykład
// rozszerzenia funkcjonalności w przyszłości
function initProductCarousel() {
    // Znajdź kontener karuzeli
    const carousel = document.querySelector('.product-carousel');
    
    if (!carousel) return; // Jeśli nie ma karuzeli, zakończ
    
    // Znajdź elementy karuzeli
    const carouselTrack = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-item');
    const nextButton = carousel.querySelector('.carousel-next');
    const prevButton = carousel.querySelector('.carousel-prev');
    
    // Jeśli nie ma wystarczającej liczby slajdów, zakończ
    if (slides.length <= 1) return;
    
    // Zmienne kontrolne
    let currentIndex = 0;
    const slidesToShow = 3; // Ile slajdów pokazywać jednocześnie
    const slideWidth = 100 / slidesToShow; // Szerokość slajdu w procentach
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    
    // Ustaw początkowy wygląd karuzeli
    slides.forEach(slide => {
        slide.style.width = `${slideWidth}%`;
    });
    
    // Funkcja przesuwająca karuzelę
    function moveCarousel(direction) {
        if (direction === 'next') {
            currentIndex = Math.min(currentIndex + 1, slides.length - slidesToShow);
        } else {
            currentIndex = Math.max(currentIndex - 1, 0);
        }
        
        updateCarousel();
    }
    
    // Funkcja aktualizująca pozycję karuzeli
    function updateCarousel() {
        const translateValue = -currentIndex * slideWidth;
        carouselTrack.style.transform = `translateX(${translateValue}%)`;
    }
    
    // Obsługa przycisków
    if (nextButton) {
        nextButton.addEventListener('click', () => moveCarousel('next'));
    }
    
    if (prevButton) {
        prevButton.addEventListener('click', () => moveCarousel('prev'));
    }
    
    // Obsługa przeciągania (drag) - dla urządzeń dotykowych
    
    // Początek przeciągania
    carouselTrack.addEventListener('mousedown', dragStart);
    carouselTrack.addEventListener('touchstart', dragStart);
    
    // Ruch podczas przeciągania
    window.addEventListener('mousemove', drag);
    window.addEventListener('touchmove', drag);
    
    // Koniec przeciągania
    window.addEventListener('mouseup', dragEnd);
    window.addEventListener('touchend', dragEnd);
    
    // Funkcja rozpoczynająca przeciąganie
    function dragStart(e) {
        e.preventDefault();
        
        if (e.type === 'touchstart') {
            startPos = e.touches[0].clientX;
        } else {
            startPos = e.clientX;
        }
        
        isDragging = true;
        prevTranslate = currentTranslate;
    }
    
    // Funkcja obsługująca ruch podczas przeciągania
    function drag(e) {
        if (!isDragging) return;
        
        let currentPosition;
        if (e.type === 'touchmove') {
            currentPosition = e.touches[0].clientX;
        } else {
            currentPosition = e.clientX;
        }
        
        const diff = currentPosition - startPos;
        currentTranslate = prevTranslate + diff / carousel.offsetWidth * 100;
        
        // Ograniczenie zakresu przesunięcia
        const maxTranslate = 0;
        const minTranslate = -(slides.length - slidesToShow) * slideWidth;
        
        currentTranslate = Math.max(minTranslate, Math.min(maxTranslate, currentTranslate));
        
        carouselTrack.style.transform = `translateX(${currentTranslate}%)`;
    }
    
    // Funkcja kończąca przeciąganie
    function dragEnd() {
        isDragging = false;
        
        // Oblicz najbliższy indeks slajdu
        currentIndex = Math.round(Math.abs(currentTranslate) / slideWidth);
        
        // Ograniczenie zakresu indeksu
        currentIndex = Math.max(0, Math.min(slides.length - slidesToShow, currentIndex));
        
        // Aktualizuj karuzelę
        updateCarousel();
    }
    
    console.log('✅ Karuzela produktów zainicjalizowana');
}