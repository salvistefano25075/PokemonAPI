// Selezioniamo l'elemento della ruota e il pulsante
const wheel = document.querySelector('.wheel');
const spinButton = document.getElementById('spin-button');

// Variabile per evitare clic multipli durante la rotazione
let spinning = false;

// Aggiungiamo un evento di clic al pulsante per far girare la ruota
spinButton.addEventListener('click', () => {
    // Se la ruota è già in rotazione, non eseguire nulla
    if (spinning) return; // Evita clic multipli
    spinning = true; // Imposta lo stato di spinning su true per bloccare altri clic

    // Calcoliamo un angolo casuale per la rotazione (almeno 10 giri + un angolo random)
    const spinDegrees = Math.floor(3600 + Math.random() * 360); // Gira almeno 10 volte
    const duration = 3000; // Durata della rotazione in millisecondi (3 secondi)

    // Impostiamo la transizione CSS per la ruota (tempo e effetto)
    wheel.style.transition = `transform ${duration}ms ease-out`;
    wheel.style.transform = `rotate(${spinDegrees}deg)`; // Impostiamo la rotazione effettiva

    // Dopo la durata della rotazione, determiniamo il segmento vincente
    setTimeout(() => {
        // Normalizziamo l'angolo per ottenere un valore tra 0 e 360
        const normalizedDegrees = spinDegrees % 360;

        // Calcoliamo l'angolo di ogni segmento (6 segmenti in totale)
        const segmentAngle = 360 / 6;

        // Determiniamo quale segmento è stato selezionato in base alla rotazione
        const winningSegment = Math.floor((360 - normalizedDegrees) / segmentAngle) % 6;

        // Selezioniamo tutti i segmenti della ruota
        const segments = document.querySelectorAll('.wheel-segment');

        // Otteniamo il valore del segmento vincente
        const winningValue = segments[winningSegment].dataset.value;

        // Recuperiamo il valore attuale delle monete dal localStorage, o 0 se non esistono
        let coins = JSON.parse(localStorage.getItem('coins')) || 0;

        // Aggiungiamo il valore vinto alle monete
        coins += parseInt(winningValue);

        // Salviamo il totale delle monete aggiornato nel localStorage
        localStorage.setItem('coins', JSON.stringify(coins));

        // Mostriamo un messaggio di alert con il valore vinto e il totale aggiornato
        alert(`Hai vinto ${winningValue} monete! Ora hai un totale di ${coins} monete.`);

        // Torniamo alla pagina principale dopo aver fatto girare la ruota
        window.location.href = 'index.html';
    }, duration); // Eseguiamo questa logica dopo che la ruota ha smesso di girare
});
