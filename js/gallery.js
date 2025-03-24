// =========== 📸 FUNKCJE GALERII ZDJĘĆ ===========
/* 
 * Ten plik zawiera funkcje do obsługi galerii zdjęć i filtrowania.
 * Obsługuje filtry, efekty lightbox i animacje.
 * 💡 Jeśli nie jesteś programistą, nie martw się! Wszystko zostało wytłumaczone krok po kroku.
 */

// Czekaj na załadowanie całej strony przed uruchomieniem kodu
document.addEventListener('DOMContentLoaded', function() {
    // Inicjalizacja galerii i filtrów
    initGalleryFilters();
    
    // Inicjalizacja modalu galerii (lightbox)
    initGalleryModal();
    
    // Specjalne efekty dla elementów galerii
    enhanceGalleryItems();
    
    console.log('✅ Galeria zdjęć zainicjalizowana pomyślnie');
});

// ======= 🔍 FILTRY GALERII =======
function initGalleryFilters() {
    // Znajdź przyciski filtrów i elementy galerii
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Jeśli nie ma przycisków lub elementów galerii, zakończ
    if (filterButtons.length === 0 || galleryItems.length === 0) return;
    
    // 🔄 Funkcja filtrująca elementy galerii
    function filterGallery(category) {
        // Ukryj wszystkie komunikaty dla czytników ekranowych
        document.querySelectorAll('.filter-message').forEach(message => {
            message.textContent = '';
        });
        
        // Licznik widocznych elementów
        let visibleCount = 0;
        
        // Filtruj elementy
        galleryItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            
            // Jeśli kategoria to 'all' lub kategoria elementu pasuje do wybranej
            if (category === 'all' || itemCategory === category) {
                // Pokaż element z animacją
                item.classList.add('visible');
                item.classList.remove('hidden');
                visibleCount++;
                
                // Dodaj opóźnienie, aby uzyskać efekt kaskadowy
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 50 * visibleCount); // Każdy kolejny element z małym opóźnieniem
            } else {
                // Ukryj element z animacją
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    item.classList.add('hidden');
                    item.classList.remove('visible');
                }, 300); // Po zakończeniu animacji zanikania
            }
        });
        
        // Dodaj komunikat dla czytników ekranowych
        const messageElement = document.createElement('div');
        messageElement.className = 'filter-message sr-only';
        messageElement.textContent = `Wyświetlanie ${visibleCount} elementów w kategorii ${category}`;
        document.querySelector('.gallery-container').appendChild(messageElement);
    }
    
    // 🔄 Obsługa kliknięcia przycisków filtrów
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Usuń klasę active z wszystkich przycisków
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            
            // Dodaj klasę active do klikniętego przycisku
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            
            // Filtruj elementy galerii
            const category = this.getAttribute('data-filter');
            filterGallery(category);
        });
        
        // Dla dostępności - obsługa klawiatury
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Domyślnie pokaż wszystkie elementy (pierwszy przycisk)
    if (filterButtons.length > 0) {
        filterButtons[0].classList.add('active');
        filterButtons[0].setAttribute('aria-pressed', 'true');
    }
    
    console.log('✅ Filtry galerii zainicjalizowane');
}

// ======= 🖼️ MODAL GALERII (LIGHTBOX) =======
function initGalleryModal() {
    // Znajdź przyciski otwierające modal i sam modal
    const galleryZoomButtons = document.querySelectorAll('.gallery-zoom');
    const galleryModal = document.querySelector('.gallery-modal');
    
    // Jeśli nie ma przycisków lub modalu, zakończ
    if (galleryZoomButtons.length === 0 || !galleryModal) return;
    
    // Zmienne dla nawigacji modalu
    let currentImageIndex = 0;
    let galleryImages = [];
    
    // 🔄 Funkcja otwierająca modal
    function openModal(index) {
        // Pobierz wszystkie aktywne elementy galerii
        const visibleItems = document.querySelectorAll('.gallery-item:not(.hidden)');
        galleryImages = Array.from(visibleItems).map(item => {
            return {
                src: item.querySelector('img').src,
                title: item.querySelector('h3').textContent,
                description: item.querySelector('p').textContent
            };
        });
        
        // Sprawdź, czy mamy obrazy
        if (galleryImages.length === 0) return;
        
        // Ustaw aktualny indeks
        currentImageIndex = index < galleryImages.length ? index : 0;
        
        // Zaktualizuj zawartość modalu
        updateModalContent();
        
        // Pokaż modal
        galleryModal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Zapobiegaj przewijaniu strony
        
        // Animacja wejścia
        setTimeout(() => {
            galleryModal.classList.add('active');
            document.getElementById('modal-image').classList.add('loaded');
        }, 10);
        
        // Dodaj/zaktualizuj przyciski nawigacyjne, jeśli mamy więcej niż 1 obraz
        if (galleryImages.length > 1) {
            addNavigationButtons();
        }
    }
    
    // 🔄 Funkcja aktualizująca zawartość modalu
    function updateModalContent() {
        const image = galleryImages[currentImageIndex];
        
        // Ustaw treść modalu
        document.getElementById('modal-title').textContent = image.title;
        document.getElementById('modal-description').textContent = image.description;
        
        // Ustaw obrazek z ładowaniem
        const modalImage = document.getElementById('modal-image');
        modalImage.classList.remove('loaded');
        modalImage.src = image.src;
        
        // Dodaj klasę loaded po załadowaniu
        modalImage.onload = () => {
            modalImage.classList.add('loaded');
        };
    }
    
    // 🔄 Funkcja dodająca przyciski nawigacyjne
    function addNavigationButtons() {
        // Sprawdź, czy przyciski już istnieją
        if (document.querySelector('.modal-nav')) return;
        
        // Utwórz przyciski
        const prevButton = document.createElement('button');
        prevButton.className = 'modal-nav prev';
        prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevButton.setAttribute('aria-label', 'Poprzednie zdjęcie');
        
        const nextButton = document.createElement('button');
        nextButton.className = 'modal-nav next';
        nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextButton.setAttribute('aria-label', 'Następne zdjęcie');
        
        // Dodaj obsługę kliknięć
        prevButton.addEventListener('click', showPreviousImage);
        nextButton.addEventListener('click', showNextImage);
        
        // Dodaj przyciski do modalu
        galleryModal.appendChild(prevButton);
        galleryModal.appendChild(nextButton);
        
        // Dodaj style CSS dla przycisków
        if (!document.getElementById('gallery-modal-nav-style')) {
            const style = document.createElement('style');
            style.id = 'gallery-modal-nav-style';
            style.textContent = `
                .modal-nav {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background-color: rgba(0, 0, 0, 0.5);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    z-index: 2;
                    transition: background-color 0.3s ease;
                }
                
                .modal-nav:hover {
                    background-color: rgba(0, 0, 0, 0.8);
                }
                
                .modal-nav.prev {
                    left: 20px;
                }
                
                .modal-nav.next {
                    right: 20px;
                }
                
                @media (max-width: 768px) {
                    .modal-nav {
                        width: 40px;
                        height: 40px;
                    }
                    
                    .modal-nav.prev {
                        left: 10px;
                    }
                    
                    .modal-nav.next {
                        right: 10px;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // 🔄 Funkcja pokazująca poprzednie zdjęcie
    function showPreviousImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        updateModalContent();
    }
    
    // 🔄 Funkcja pokazująca następne zdjęcie
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        updateModalContent();
    }
    
    // 🔄 Funkcja zamykająca modal
    function closeModal() {
        galleryModal.classList.remove('active');
        
        // Usuń przyciski nawigacyjne
        const navButtons = galleryModal.querySelectorAll('.modal-nav');
        navButtons.forEach(button => button.remove());
        
        setTimeout(() => {
            galleryModal.style.display = 'none';
            document.body.style.overflow = ''; // Przywróć przewijanie strony
        }, 300);
    }
    
    // 🔄 Obsługa kliknięcia przycisku powiększenia
    galleryZoomButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Znajdź indeks aktywnego elementu
            const activeItems = document.querySelectorAll('.gallery-item:not(.hidden)');
            const galleryItem = this.closest('.gallery-item');
            
            // Znajdź indeks klikniętego elementu wśród aktywnych elementów
            let activeIndex = Array.from(activeItems).findIndex(item => item === galleryItem);
            if (activeIndex === -1) activeIndex = 0;
            
            // Otwórz modal z odpowiednim indeksem
            openModal(activeIndex);
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
    
    // 🔄 Obsługa klawiszy dla modalu
    document.addEventListener('keydown', function(e) {
        // Jeśli modal nie jest aktywny, nie rób nic
        if (galleryModal.style.display !== 'flex') return;
        
        switch (e.key) {
            case 'Escape': // Zamknij modal
                closeModal();
                break;
            case 'ArrowLeft': // Poprzednie zdjęcie
                if (galleryImages.length > 1) showPreviousImage();
                break;
            case 'ArrowRight': // Następne zdjęcie
                if (galleryImages.length > 1) showNextImage();
                break;
        }
    });
    
    console.log('✅ Modal galerii zainicjalizowany');
}

// ======= ✨ DODATKOWE EFEKTY DLA ELEMENTÓW GALERII =======
function enhanceGalleryItems() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (galleryItems.length === 0) return;
    
    // Dodaj efekty najechania i animacje
    galleryItems.forEach(item => {
        // Leniwe ładowanie obrazów
        const img = item.querySelector('img');
        if (img && !img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        
        // Dodaj efekt paralaksy przy najechaniu myszą
        item.addEventListener('mousemove', function(e) {
            // Sprawdź, czy urządzenie nie jest dotykowe
            if (window.matchMedia('(hover: hover)').matches) {
                const overlay = this.querySelector('.gallery-overlay');
                
                // Oblicz pozycję myszy względem elementu
                const itemRect = this.getBoundingClientRect();
                const xPos = (e.clientX - itemRect.left) / itemRect.width - 0.5;
                const yPos = (e.clientY - itemRect.top) / itemRect.height - 0.5;
                
                // Zastosuj subtelny efekt paralaksy do obrazu
                const img = this.querySelector('img');
                img.style.transform = `scale(1.05) translate(${xPos * 10}px, ${yPos * 10}px)`;
                
                // Efekt głębi dla overlay
                if (overlay) {
                    overlay.style.opacity = 0.7 + Math.abs(xPos * yPos) * 0.3;
                }
            }
        });
        
        // Przywróć normalny wygląd po zjechaniu myszą
        item.addEventListener('mouseleave', function() {
            const img = this.querySelector('img');
            const overlay = this.querySelector('.gallery-overlay');
            
            // Płynnie przywróć domyślny wygląd
            img.style.transform = '';
            
            if (overlay) {
                overlay.style.opacity = '';
            }
        });
    });
    
    console.log('✅ Efekty galerii zainicjalizowane');
}

// ======= 🔍 FUNKCJE POMOCNICZE =======

// Funkcja generująca unikalny identyfikator
function generateUniqueId(prefix = 'gallery-item') {
    return `${prefix}-${Math.random().toString(36).substring(2, 10)}`;
}

// Funkcja preładująca obrazy
function preloadGalleryImages() {
    const galleryImages = document.querySelectorAll('.gallery-item img');
    
    galleryImages.forEach(img => {
        const src = img.getAttribute('src');
        
        if (src) {
            const preloadImg = new Image();
            preloadImg.src = src;
        }
    });
}

// Funkcja wykrywająca przeglądarki mobilne
function isMobileDevice() {
    return (window.innerWidth <= 768) || 
           ('ontouchstart' in window) || 
           (navigator.maxTouchPoints > 0) || 
           (navigator.msMaxTouchPoints > 0);
}

// ======= 🌟 NOWA FUNKCJA: DYNAMICZNE DODAWANIE ELEMENTÓW GALERII =======
// Ta funkcja nie jest używana w podstawowym kodzie, ale można ją wykorzystać do 
// dynamicznego ładowania elementów galerii z JSON lub API
function addGalleryItem(imageUrl, title, description, category) {
    // Sprawdź, czy kontener galerii istnieje
    const galleryContainer = document.querySelector('.gallery-container');
    if (!galleryContainer) return;
    
    // Generuj unikalny identyfikator
    const itemId = generateUniqueId();
    
    // Utwórz element galerii
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.setAttribute('data-category', category);
    galleryItem.id = itemId;
    
    // Utwórz HTML elementu
    galleryItem.innerHTML = `
        <div class="gallery-image">
            <img src="${imageUrl}" alt="${title}" loading="lazy">
        </div>
        <div class="gallery-overlay">
            <div class="gallery-info">
                <h3>${title}</h3>
                <p>${description}</p>
                <a href="#" class="gallery-zoom" aria-label="Powiększ zdjęcie">
                    <i class="fas fa-search-plus"></i>
                </a>
            </div>
        </div>
    `;
    
    // Dodaj element do kontenera
    galleryContainer.appendChild(galleryItem);
    
    // Dodaj obsługę powiększania
    const zoomButton = galleryItem.querySelector('.gallery-zoom');
    zoomButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Znajdź indeks aktywnego elementu
        const activeItems = document.querySelectorAll('.gallery-item:not(.hidden)');
        const index = Array.from(activeItems).findIndex(item => item.id === itemId);
        
        // Otwórz modal galerii
        if (typeof openModal === 'function') {
            openModal(index >= 0 ? index : 0);
        }
    });
    
    return galleryItem;
}