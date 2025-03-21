// =========== FUNKCJE GALERII REALIZACJI ===========
// 📸 Ten plik zawiera funkcje do obsługi galerii zdjęć naszych realizacji

document.addEventListener('DOMContentLoaded', function() {
    // Inicjalizujemy galerię realizacji
    initGallery();
});

// 📸 INICJALIZACJA I OBSŁUGA GALERII
function initGallery() {
    // Znajdujemy elementy galerii
    const galleryContainer = document.querySelector('.gallery-container');
    
    // Jeśli galeria nie istnieje na tej stronie, kończymy
    if (!galleryContainer) return;
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryModal = document.querySelector('.gallery-modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalClose = document.querySelector('.modal-close');
    
    // 🔍 Obsługa filtrowania
    setupFiltering(filterButtons, galleryItems);
    
    // 🖼️ Obsługa powiększania zdjęć
    setupZoom(galleryItems, galleryModal, modalImage, modalTitle, modalDescription);
    
    // ❌ Zamykanie modalu
    setupModalClosing(galleryModal, modalClose);
    
    // 🔄 Inicjalizacja - domyślnie pokazujemy wszystkie elementy
    if (filterButtons.length > 0) {
        filterButtons[0].click();
    }
    
    console.log('✅ Galeria zainicjalizowana pomyślnie');
}

// 🔍 FILTROWANIE ELEMENTÓW GALERII
function setupFiltering(filterButtons, galleryItems) {
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Usuwamy klasę 'active' ze wszystkich przycisków
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Dodajemy klasę 'active' do klikniętego przycisku
            this.classList.add('active');
            
            // Pobieramy kategorię do filtrowania
            const filterValue = this.getAttribute('data-filter');
            
            // Zapisujemy aktywną kategorię w przeglądarce (do zapamiętania po odświeżeniu)
            localStorage.setItem('activeGalleryFilter', filterValue);
            
            // Filtrujemy elementy galerii
            filterGalleryItems(galleryItems, filterValue);
        });
    });
    
    // Sprawdzamy, czy mamy zapisaną kategorię w pamięci
    const savedFilter = localStorage.getItem('activeGalleryFilter');
    if (savedFilter) {
        // Znajdź przycisk z zapisaną kategorią
        const savedButton = Array.from(filterButtons).find(
            button => button.getAttribute('data-filter') === savedFilter
        );
        
        // Jeśli znaleziono przycisk, aktywuj go
        if (savedButton) {
            savedButton.click();
        } else {
            // Jeśli nie znaleziono, aktywuj pierwszy
            filterButtons[0].click();
        }
    }
}

// 🎭 FILTROWANIE POSZCZEGÓLNYCH ELEMENTÓW
function filterGalleryItems(items, filterValue) {
    items.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        // Pokazujemy wszystkie lub tylko te pasujące do filtra
        if (filterValue === 'all' || filterValue === itemCategory) {
            // Pokazujemy z animacją
            item.style.display = 'block';
            setTimeout(() => {
                item.style.opacity = 1;
                item.style.transform = 'scale(1)';
            }, 50);
        } else {
            // Ukrywamy z animacją
            item.style.opacity = 0;
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}

// 🖼️ POWIĘKSZANIE ZDJĘĆ
function setupZoom(galleryItems, galleryModal, modalImage, modalTitle, modalDescription) {
    const zoomButtons = document.querySelectorAll('.gallery-zoom');
    
    zoomButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Pobieramy dane z rodzica przycisku
            const galleryItem = this.closest('.gallery-item');
            const image = galleryItem.querySelector('img');
            const title = galleryItem.querySelector('h3').textContent;
            const description = galleryItem.querySelector('p').textContent;
            
            // Ustawiamy dane w modalu
            modalImage.src = image.src;
            modalImage.alt = image.alt;
            modalTitle.textContent = title;
            modalDescription.textContent = description;
            
            // Pokazujemy modal
            galleryModal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Blokujemy przewijanie strony
            
            // Dodajemy klasę dla animacji
            setTimeout(() => {
                modalImage.classList.add('loaded');
            }, 50);
        });
    });
}

// ❌ ZAMYKANIE MODALU
function setupModalClosing(galleryModal, modalClose) {
    // Funkcja zamykająca modal
    function closeModal() {
        galleryModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Przywracamy przewijanie strony
        
        // Resetujemy klasę animacji
        const modalImage = document.getElementById('modal-image');
        if (modalImage) {
            modalImage.classList.remove('loaded');
        }
    }
    
    // Zamykanie po kliknięciu przycisku zamknięcia
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    // Zamykanie po kliknięciu poza obrazem
    if (galleryModal) {
        galleryModal.addEventListener('click', function(e) {
            if (e.target === galleryModal) {
                closeModal();
            }
        });
    }
    
    // Obsługa klawisza ESC do zamykania modalu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && galleryModal && galleryModal.style.display === 'flex') {
            closeModal();
        }
    });
}

// 🔄 ODŚWIEŻANIE GALERII
// Funkcja pomocnicza do wywołania po dodaniu nowych zdjęć dynamicznie
function refreshGallery() {
    // Ponownie znajdujemy wszystkie elementy
    const galleryItems = document.querySelectorAll('.gallery-item');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryModal = document.querySelector('.gallery-modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalClose = document.querySelector('.modal-close');
    
    // Aktualizujemy obsługę filtrowania
    setupFiltering(filterButtons, galleryItems);
    
    // Aktualizujemy obsługę powiększania
    setupZoom(galleryItems, galleryModal, modalImage, modalTitle, modalDescription);
    
    // Aktualizujemy obsługę zamykania modalu
    setupModalClosing(galleryModal, modalClose);
    
    console.log('🔄 Galeria została odświeżona');
}

// Eksportujemy funkcję odświeżania, gdyby była potrzebna gdzie indziej
window.refreshGallery = refreshGallery;