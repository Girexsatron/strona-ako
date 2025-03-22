// =========== KALKULATOR OSZCZĘDNOŚCI ENERGETYCZNYCH ===========
// 💰 Ten plik zawiera funkcje do obsługi kalkulatora oszczędności energetycznych

document.addEventListener('DOMContentLoaded', function() {
    // Inicjalizujemy kalkulator oszczędności energetycznych
    initEnergyCalculator();
});

// 🔢 INICJALIZACJA KALKULATORA
function initEnergyCalculator() {
    const calculatorForm = document.querySelector('.calculator-form');
    
    // Jeśli nie ma kalkulatora na stronie, kończymy
    if (!calculatorForm) return;
    
    // Znajdź przycisk obliczania i dodaj obsługę kliknięcia
    const calculateButton = document.getElementById('calculate-savings');
    
    if (calculateButton) {
        calculateButton.addEventListener('click', calculateEnergySavings);
        
        // Wstępne obliczenie przy załadowaniu strony
        calculateEnergySavings();
    }
    
    // Dodaj obsługę zmiany wartości w polach formularza
    const inputFields = calculatorForm.querySelectorAll('input, select');
    inputFields.forEach(field => {
        field.addEventListener('change', () => {
            // Dodajemy lekkie opóźnienie, aby animacja się wykonała
            setTimeout(calculateEnergySavings, 100);
        });
    });
    
    console.log('✅ Kalkulator oszczędności energetycznych zainicjalizowany');
}

// 🧮 OBLICZANIE OSZCZĘDNOŚCI
function calculateEnergySavings() {
    // Pobieramy wartości z formularza
    const windowArea = parseFloat(document.getElementById('window-area').value || 0);
    const windowType = document.getElementById('window-type').value;
    const heatingType = document.getElementById('heating-type').value;
    
    // Walidacja danych
    if (windowArea <= 0) {
        alert('Proszę podać prawidłową powierzchnię okien');
        return;
    }
    
    // Pobieramy współczynniki przenikania ciepła (U) dla różnych typów okien (W/m²K)
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
    // Q = U * A * ΔT * t * 0.001
    // gdzie U - współczynnik przenikania, A - powierzchnia, ΔT - różnica temperatur, 
    // t - czas (w godzinach), 0.001 - przelicznik na kWh
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

// 💫 ANIMACJA WYNIKÓW
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
    
    // Dodajemy styl CSS dla animacji (jeśli jeszcze nie istnieje)
    if (!document.getElementById('energy-calculator-style')) {
        const style = document.createElement('style');
        style.id = 'energy-calculator-style';
        style.textContent = `
            .result-value.highlight {
                animation: highlight 1s ease;
            }
            
            @keyframes highlight {
                0% { color: var(--primary-color); }
                50% { color: var(--accent-color); }
                100% { color: var(--primary-color); }
            }
        `;
        document.head.appendChild(style);
    }
}

// 🔧 FUNKCJE POMOCNICZE DO FORMATOWANIA WYNIKU
function formatNumber(number, decimals = 0) {
    return number.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// Eksportujemy funkcje aby były dostępne globalnie
window.calculateEnergySavings = calculateEnergySavings;

document.getElementById('methodology-toggle').addEventListener('click', function(e) {
    e.preventDefault();
    const description = document.getElementById('methodology-description');
    description.style.display = description.style.display === 'none' ? 'block' : 'none';
});