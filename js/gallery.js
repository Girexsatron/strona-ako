// =========== FUNKCJE GALERII REALIZACJI ===========
// 📸 Ten plik zawiera funkcje do obsługi galerii zdjęć naszych realizacji

document.addEventListener('DOMContentLoaded', function() {
    // Inicjalizujemy galerię realizacji
    initGallery();
});

// 📸 INICJALIZACJA I OBSŁUGA GALERII
function initGallery() {
    // POPRAWKA: Najpierw sprawdźmy, czy jesteśmy na podstronie z galerią
    // Zamiast szukać konkretnego elementu .gallery-container, sprawdźmy czy jest klasa .gallery-page
    const isGalleryPage = document.body.classList.contains('gallery-page');
    
    // Jeśli nie jesteśmy na stronie galerii, stwórzmy prostą funkcję przygotowawczą na potrzeby przyszłej galerii
    if (!isGalleryPage) {
        // Inicjujemy podstawowe komponenty potrzebne do ogólnych funkcji galerii
        prepareGalleryComponents();
        return;
    }
    
    // Jeśli jesteśmy na stronie galerii, znajdujemy elementy galerii
    const galleryContainer = document.querySelector('.gallery-container');
    
    // Jeśli nie znaleźliśmy kontenera, kończymy
    if (!galleryContainer) {
        console.warn('⚠️ Nie znaleziono kontenera galerii (.gallery-container) na stronie galerii');
        return;
    }
    
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

// POPRAWKA: Dodajemy funkcję do przygotowania podstawowych komponentów galerii
function prepareGalleryComponents() {
    // Sprawdzamy, czy istnieją na stronie elementy z klasą .gallery-preview
    // które mogą być używane na głównej stronie jako zapowiedź galerii
    const galleryPreviews = document.querySelectorAll('.gallery-preview');
    
    if (galleryPreviews.length === 0) {
        // Brak elementów galerii na tej stronie, nie robimy nic
        return;
    }
    
    // Dla każdego podglądu galerii dodajemy obsługę kliknięcia
    galleryPreviews.forEach(preview => {
        // Dodajemy efekt przy najechaniu
        preview.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        
        preview.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
        
        // Dodajemy obsługę kliknięcia - przekierowanie do galerii
        preview.addEventListener('click', function(e) {
            // Pobieramy link do galerii z atrybutu data-gallery-url
            const galleryUrl = this.getAttribute('data-gallery-url');
            
            // Jeśli link istnieje, przekierowujemy
            if (galleryUrl) {
                window.location.href = galleryUrl;
            } else {
                // Jeśli nie ma linku, przekierujemy na domyślną stronę galerii
                window.location.href = 'gallery.html';
            }
        });
    });
    
    console.log('✅ Komponenty podglądu galerii zainicjalizowane');
}

// 🔍 FILTROWANIE ELEMENTÓW GALERII
function setupFiltering(filterButtons, galleryItems) {
    // Jeśli nie ma przycisków filtrowania, kończymy
    if (!filterButtons || filterButtons.length === 0) return;
    
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
            
            // POPRAWKA: Dodajemy informację dla czytników ekranu
            const galleryContainer = document.querySelector('.gallery-container');
            if (galleryContainer) {
                const filterName = filterValue === 'all' ? 'wszystkie realizacje' : `kategoria ${filterValue}`;
                const filterMessage = document.createElement('div');
                filterMessage.className = 'sr-only filter-message';
                filterMessage.textContent = `Filtrowanie: ${filterName}`;
                
                // Usuwamy poprzednie komunikaty
                const oldMessages = galleryContainer.querySelectorAll('.filter-message');
                oldMessages.forEach(msg => msg.remove());
                
                galleryContainer.appendChild(filterMessage);
                
                // Usuwamy komunikat po chwili (tylko wizualnie)
                setTimeout(() => {
                    filterMessage.remove();
                }, 3000);
            }
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
    } else {
        // Domyślnie aktywujemy pierwszy przycisk
        filterButtons[0].click();
    }
}

// 🎭 FILTROWANIE POSZCZEGÓLNYCH ELEMENTÓW
function filterGalleryItems(items, filterValue) {
    // Jeśli nie ma elementów do filtrowania, kończymy
    if (!items || items.length === 0) return;
    
    items.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        // Pokazujemy wszystkie lub tylko te pasujące do filtra
        if (filterValue === 'all' || filterValue === itemCategory) {
            // POPRAWKA: Zamiast bezpośrednio manipulować stylami, używamy klas CSS
            item.classList.remove('hidden');
            // Dodajemy klasę 'fade-in' dla płynnej animacji pojawiania się
            setTimeout(() => {
                item.classList.add('visible');
            }, 50);
        } else {
            // Ukrywamy element (najpierw usuwamy klasę visible dla animacji)
            item.classList.remove('visible');
            // Po zakończeniu animacji dodajemy klasę 'hidden'
            setTimeout(() => {
                item.classList.add('hidden');
            }, 300); // Ten czas powinien odpowiadać czasowi trwania animacji w CSS
        }
    });
}

// 🖼️ POWIĘKSZANIE ZDJĘĆ
function setupZoom(galleryItems, galleryModal, modalImage, modalTitle, modalDescription) {
    // Jeśli brakuje któregoś z elementów, kończymy
    if (!galleryItems || !galleryModal || !modalImage) return;
    
    const zoomButtons = document.querySelectorAll('.gallery-zoom');
    
    zoomButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Pobieramy dane z rodzica przycisku
            const galleryItem = this.closest('.gallery-item');
            const image = galleryItem.querySelector('img');
            const title = galleryItem.querySelector('h3')?.textContent || '';
            const description = galleryItem.querySelector('p')?.textContent || '';
            
            // POPRAWKA: Pobieramy wysokiej jakości wersję obrazu, jeśli istnieje
            const highResImage = image.getAttribute('data-high-res') || image.src;
            
            // Ustawiamy dane w modalu
            modalImage.src = highResImage;
            modalImage.alt = image.alt || title;
            
            // Dodajemy event listener na załadowanie obrazu
            modalImage.onload = function() {
                this.classList.add('loaded');
            };
            
            // Ustawiamy tytuł i opis, jeśli istnieją odpowiednie elementy
            if (modalTitle) modalTitle.textContent = title;
            if (modalDescription) modalDescription.textContent = description;
            
            // Pokazujemy modal
            galleryModal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Blokujemy przewijanie strony
            
            // POPRAWKA: Fokusujemy modal dla dostępności
            galleryModal.setAttribute('tabindex', '-1');
            galleryModal.focus();
        });
    });
}

// ❌ ZAMYKANIE MODALU
function setupModalClosing(galleryModal, modalClose) {
    // Jeśli nie ma modalu, kończymy
    if (!galleryModal) return;
    
    // Funkcja zamykająca modal
    function closeModal() {
        // POPRAWKA: Dodajemy klasę 'closing' dla animacji zamykania
        galleryModal.classList.add('closing');
        
        // Po zakończeniu animacji ukrywamy modal całkowicie
        setTimeout(() => {
            galleryModal.style.display = 'none';
            galleryModal.classList.remove('closing');
            document.body.style.overflow = 'auto'; // Przywracamy przewijanie strony
            
            // Resetujemy klasę animacji
            const modalImage = document.getElementById('modal-image');
            if (modalImage) {
                modalImage.classList.remove('loaded');
            }
        }, 300); // Czas odpowiadający animacji zamykania w CSS
    }
    
    // Zamykanie po kliknięciu przycisku zamknięcia
    if (modalClose) {
        modalClose.addEventListener('click', function(e) {
            e.preventDefault();
            closeModal();
        });
    }
    
    // Zamykanie po kliknięciu poza obrazem
    galleryModal.addEventListener('click', function(e) {
        if (e.target === galleryModal) {
            closeModal();
        }
    });
    
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

// POPRAWKA: Dodajemy funkcję do tworzenia podstawowego modalu galerii, jeśli go nie ma
function createGalleryModal() {
    // Sprawdzamy, czy modal już istnieje
    let galleryModal = document.querySelector('.gallery-modal');
    
    if (!galleryModal) {
        // Tworzymy elementy modalu
        galleryModal = document.createElement('div');
        galleryModal.className = 'gallery-modal';
        galleryModal.setAttribute('tabindex', '-1');
        galleryModal.setAttribute('aria-hidden', 'true');
        galleryModal.setAttribute('role', 'dialog');
        galleryModal.setAttribute('aria-label', 'Podgląd zdjęcia');
        
        const modalClose = document.createElement('span');
        modalClose.className = 'modal-close';
        modalClose.innerHTML = '&times;';
        modalClose.setAttribute('aria-label', 'Zamknij');
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        
        const modalImage = document.createElement('img');
        modalImage.id = 'modal-image';
        modalImage.setAttribute('alt', '');
        
        const modalTitle = document.createElement('h3');
        modalTitle.id = 'modal-title';
        
        const modalDescription = document.createElement('p');
        modalDescription.id = 'modal-description';
        
        // Składamy elementy
        modalContent.appendChild(modalImage);
        modalContent.appendChild(modalTitle);
        modalContent.appendChild(modalDescription);
        
        galleryModal.appendChild(modalClose);
        galleryModal.appendChild(modalContent);
        
        // Dodajemy do body
        document.body.appendChild(galleryModal);
        
        // Konfigurujemy zamykanie
        setupModalClosing(galleryModal, modalClose);
        
        console.log('✅ Utworzono nowy modal galerii');
    }
    
    return galleryModal;
}

// Eksportujemy funkcje aby były dostępne globalnie
window.refreshGallery = refreshGallery;
window.createGalleryModal = createGalleryModal;