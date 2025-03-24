// =========== 💰 KALKULATOR OSZCZĘDNOŚCI ENERGETYCZNYCH ===========
/* 
 * Ten plik zawiera funkcje do obsługi kalkulatora oszczędności energetycznych.
 * Oblicza potencjalne oszczędności finansowe i ekologiczne po wymianie okien.
 * 💡 Jeśli nie jesteś programistą, nie martw się! Wszystko zostało wytłumaczone krok po kroku.
 */

// Czekaj na załadowanie całej strony przed uruchomieniem kodu
document.addEventListener('DOMContentLoaded', function() {
    // Inicjalizacja kalkulatora
    initEnergyCalculator();
});

// ======= 💰 INICJALIZACJA KALKULATORA =======
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
    
    // Obsługa przycisku "Pobierz raport PDF"
    const downloadReportButton = document.getElementById('download-report');
    if (downloadReportButton) {
        downloadReportButton.addEventListener('click', function(e) {
            e.preventDefault();
            generatePDFReport();
        });
    }
    
    // Obsługa przycisku "Jak to działa?"
    const methodologyToggle = document.getElementById('methodology-toggle');
    const methodologyDescription = document.getElementById('methodology-description');
    
    if (methodologyToggle && methodologyDescription) {
        methodologyToggle.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Przełącz widoczność opisu metodologii
            if (methodologyDescription.style.display === 'none') {
                methodologyDescription.style.display = 'block';
                // Animacja rozwijania
                methodologyDescription.style.maxHeight = '0';
                setTimeout(() => {
                    methodologyDescription.style.maxHeight = methodologyDescription.scrollHeight + 'px';
                }, 10);
            } else {
                // Animacja zwijania
                methodologyDescription.style.maxHeight = '0';
                setTimeout(() => {
                    methodologyDescription.style.display = 'none';
                }, 300);
            }
        });
    }
    
    console.log('✅ Kalkulator oszczędności energetycznych zainicjalizowany');
}

// ======= 💰 OBLICZANIE OSZCZĘDNOŚCI =======
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
    
    // 🔍 Współczynniki przenikania ciepła (U) dla różnych typów okien (W/m²K)
    const windowUValues = {
        'old-single': 5.0,     // Stare okna jednoszybowe
        'old-double': 2.8,     // Stare okna dwuszybowe
        'standard-double': 1.5, // Standardowe okna dwuszybowe
        'standard-triple': 1.1, // Standardowe okna trzyszybowe
        'new-triple': 0.8      // Nowe okna trzyszybowe (nasza oferta)
    };
    
    // 💵 Ceny energii za kWh dla różnych rodzajów ogrzewania (zł/kWh)
    const energyPrices = {
        'gas': 0.35,        // Gaz ziemny
        'electric': 0.75,   // Prąd elektryczny
        'coal': 0.25,       // Węgiel
        'pellet': 0.30,     // Pellet drzewny
        'oil': 0.48         // Olej opałowy
    };
    
    // 🌿 Emisja CO2 dla różnych rodzajów ogrzewania (kg CO2 / kWh)
    const co2Emissions = {
        'gas': 0.2056,      // Gaz ziemny
        'electric': 0.662,  // Prąd elektryczny
        'coal': 0.4125,     // Węgiel
        'pellet': 0.03,     // Pellet drzewny
        'oil': 0.3          // Olej opałowy
    };
    
    // 📆 Parametry dla obliczeń
    const heatingDays = 200;                 // Liczba dni grzewczych w roku
    const averageTempDifference = 20;        // Średnia różnica temperatur wewnątrz i na zewnątrz (°C)
    const heatingHoursCoefficient = 24;      // Liczba godzin ogrzewania na dobę
    
    // Porównujemy obecne okna z naszymi najlepszymi oknami
    const currentUValue = windowUValues[windowType];         // Współczynnik przenikania obecnych okien
    const newUValue = windowUValues['new-triple'];           // Współczynnik przenikania naszych okien
    
    // 🧮 Obliczamy roczne straty ciepła przez okna (kWh/rok)
    // Q = U * A * ΔT * t * 0.001
    // gdzie U - współczynnik przenikania, A - powierzchnia, ΔT - różnica temperatur, 
    // t - czas (w godzinach), 0.001 - przelicznik na kWh
    const currentHeatLoss = currentUValue * windowArea * averageTempDifference * heatingDays * heatingHoursCoefficient * 0.001;
    const newHeatLoss = newUValue * windowArea * averageTempDifference * heatingDays * heatingHoursCoefficient * 0.001;
    
    // Oszczędność energii (kWh/rok)
    const energySavings = currentHeatLoss - newHeatLoss;
    
    // 💵 Oszczędność finansowa (zł/rok)
    const financialSavings = energySavings * energyPrices[heatingType];
    
    // 🌿 Oszczędność CO2 (kg/rok)
    const co2Savings = energySavings * co2Emissions[heatingType];
    
    // 💰 Oszczędność w ciągu 10 lat
    const tenYearSavings = financialSavings * 10;
    
    // Dodatkowe dane do raportu (niepokazywane w interfejsie)
    const paybackTime = calculatePaybackTime(windowArea, financialSavings);
    const energyEfficiency = calculateEnergyEfficiency(currentHeatLoss, newHeatLoss);
    
    // Aktualizujemy wyniki na stronie
    document.getElementById('yearly-savings').textContent = formatNumber(financialSavings) + ' zł';
    document.getElementById('ten-year-savings').textContent = formatNumber(tenYearSavings) + ' zł';
    document.getElementById('co2-reduction').textContent = formatNumber(co2Savings) + ' kg/rok';
    
    // Dodajemy animacje dla wyników
    animateResults();
    
    // Zapisujemy wyniki do obiektu globalnego (dla raportu PDF)
    window.calculationResults = {
        windowArea,
        windowType,
        heatingType,
        currentUValue,
        newUValue,
        currentHeatLoss,
        newHeatLoss,
        energySavings,
        financialSavings,
        tenYearSavings,
        co2Savings,
        paybackTime,
        energyEfficiency
    };
    
    console.log('✅ Oszczędności obliczone pomyślnie');
}

// ======= 🎨 ANIMACJA WYNIKÓW =======
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

// ======= 📋 GENEROWANIE RAPORTU PDF =======
function generatePDFReport() {
    // Jeśli nie mamy wyników lub biblioteki jsPDF, pokazujemy komunikat
    if (!window.calculationResults) {
        alert('Proszę najpierw wykonać obliczenia.');
        return;
    }
    
    // Symulacja generowania PDF (w rzeczywistym projekcie użyj biblioteki jsPDF)
    alert('Funkcja generowania raportu PDF będzie dostępna wkrótce.\n\nRaport będzie zawierał szczegółowe informacje o potencjalnych oszczędnościach, wykres porównawczy oraz szczegółowe wyliczenia.');
    
    /* 
    // Przykładowy kod generowania PDF (wymaga biblioteki jsPDF)
    
    // Utwórz nowy dokument PDF
    const doc = new jsPDF();
    
    // Dodaj nagłówek
    doc.setFontSize(22);
    doc.setTextColor(0, 86, 179); // Kolor primary
    doc.text('Raport oszczędności energetycznych', 105, 20, { align: 'center' });
    
    // Dodaj logo firmy (jeśli dostępne)
    // doc.addImage('images/logo.png', 'PNG', 20, 10, 30, 10);
    
    // Dodaj datę wygenerowania
    const today = new Date();
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Wygenerowano: ${today.toLocaleDateString()}`, 20, 30);
    
    // Dodaj podsumowanie
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Podsumowanie oszczędności', 20, 40);
    
    doc.setFontSize(12);
    doc.text(`Powierzchnia okien: ${window.calculationResults.windowArea} m²`, 20, 50);
    doc.text(`Roczne oszczędności: ${formatNumber(window.calculationResults.financialSavings)} zł`, 20, 60);
    doc.text(`Oszczędności w ciągu 10 lat: ${formatNumber(window.calculationResults.tenYearSavings)} zł`, 20, 70);
    doc.text(`Redukcja emisji CO₂: ${formatNumber(window.calculationResults.co2Savings)} kg/rok`, 20, 80);
    doc.text(`Szacowany czas zwrotu: ${window.calculationResults.paybackTime} lat`, 20, 90);
    
    // Dodaj szczegółowe wyliczenia
    doc.setFontSize(14);
    doc.text('Szczegółowe wyliczenia', 20, 110);
    
    doc.setFontSize(12);
    doc.text(`Współczynnik przenikania ciepła obecnych okien: ${window.calculationResults.currentUValue} W/m²K`, 20, 120);
    doc.text(`Współczynnik przenikania ciepła nowych okien: ${window.calculationResults.newUValue} W/m²K`, 20, 130);
    doc.text(`Obecne straty ciepła: ${formatNumber(window.calculationResults.currentHeatLoss)} kWh/rok`, 20, 140);
    doc.text(`Straty ciepła po wymianie okien: ${formatNumber(window.calculationResults.newHeatLoss)} kWh/rok`, 20, 150);
    doc.text(`Oszczędność energii: ${formatNumber(window.calculationResults.energySavings)} kWh/rok`, 20, 160);
    doc.text(`Poprawa efektywności energetycznej: ${window.calculationResults.energyEfficiency}%`, 20, 170);
    
    // Dodaj stopkę
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('AKO - Producent okien i drzwi | Kontakt: +48 123 456 789 | www.ako.pl', 105, 280, { align: 'center' });
    
    // Zapisz PDF
    doc.save('Raport_oszczednosci_energetycznych.pdf');
    */
}

// ======= 🔍 FUNKCJE POMOCNICZE =======

// Funkcja obliczająca szacowany czas zwrotu inwestycji
function calculatePaybackTime(windowArea, yearlySavings) {
    // Szacunkowe koszty wymiany okien (zł/m²)
    const replacementCostPerSquareMeter = 1000; // Przykładowa wartość
    
    // Całkowity koszt wymiany okien
    const totalReplacementCost = windowArea * replacementCostPerSquareMeter;
    
    // Czas zwrotu (w latach)
    const paybackTime = totalReplacementCost / yearlySavings;
    
    return paybackTime.toFixed(1);
}

// Funkcja obliczająca procentową poprawę efektywności energetycznej
function calculateEnergyEfficiency(oldHeatLoss, newHeatLoss) {
    const improvementPercentage = ((oldHeatLoss - newHeatLoss) / oldHeatLoss) * 100;
    return improvementPercentage.toFixed(1);
}

// Funkcja formatująca liczby (z separatorem tysięcznym)
function formatNumber(number, decimals = 0) {
    return Number(number.toFixed(decimals)).toLocaleString('pl-PL');
}

// Eksportujemy funkcje, aby były dostępne globalnie
window.calculateEnergySavings = calculateEnergySavings;
window.generatePDFReport = generatePDFReport;