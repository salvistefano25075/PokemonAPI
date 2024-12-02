// Elementi HTML
const pokemonListElement = document.getElementById('pokemon-cards'); // Seleziona l'elemento dove visualizzare le carte dei Pokémon
const coinCountElement = document.getElementById('coin-count'); // Seleziona l'elemento che mostra il numero di monete
const searchBar = document.getElementById('search-bar'); // Seleziona la barra di ricerca per i Pokémon
const typeFilter = document.getElementById('type-filter'); // Seleziona il filtro per tipo di Pokémon

// Variabili globali
let coins = JSON.parse(localStorage.getItem('coins')) || 0; // Recupera il numero di monete dal localStorage o imposta 0 se non ci sono
let allPokemons = []; // Array per memorizzare tutti i Pokémon caricati

// Funzione per aggiornare la visualizzazione del numero di monete
function updateCoinDisplay() {
    coinCountElement.textContent = coins; // Mostra il numero di monete nell'elemento HTML
    localStorage.setItem('coins', JSON.stringify(coins)); // Salva il numero di monete nel localStorage
}

// Funzione per calcolare il costo di cattura di un Pokémon in base alla colonna
function calculatePokemonCost(index) {
    const column = (index % 3) + 1; // Determina la colonna in base all'indice del Pokémon
    if (column === 1) return 20; // Se nella prima colonna, il costo è 20
    if (column === 2) return 40; // Se nella seconda colonna, il costo è 40
    return 60; // Se nella terza colonna, il costo è 60
}

// Funzione per ottenere la lista dei Pokémon tramite API
async function fetchPokemons() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100&offset=0'); // Recupera i dati di 100 Pokémon
        if (!response.ok) throw new Error('Errore nella richiesta dei dati'); // Gestione degli errori di rete
        const data = await response.json();

        // Recupera i dettagli di ogni Pokémon con più chiamate API parallele
        const pokemonDetails = await Promise.all(
            data.results.map((pokemon) => fetch(pokemon.url).then((res) => res.json()))
        );

        allPokemons = pokemonDetails; // Memorizza i dettagli completi dei Pokémon
        displayPokemons(allPokemons); // Mostra tutti i Pokémon
    } catch (error) {
        console.error(error); // Log degli errori
        alert('Errore durante il caricamento dei Pokémon.'); // Notifica di errore
    }
}

// Funzione per visualizzare i Pokémon sulla pagina
function displayPokemons(pokemons) {
    pokemonListElement.innerHTML = ''; // Pulisce la lista di Pokémon esistente

    // Itera su ogni Pokémon e crea una card con i suoi dettagli
    pokemons.forEach((pokemon, index) => {
        const cost = calculatePokemonCost(index); // Calcola il costo per catturare il Pokémon

        const card = document.createElement('div');
        card.className = 'card bg-base-100 shadow-xl';

        // Aggiunge il contenuto della card, inclusi l'immagine, il nome, e i dettagli
        card.innerHTML = `
            <figure class="p-4" onclick="toggleDetails(this)">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" class="cursor-pointer">
            </figure>
            <div class="card-body">
                <h2 class="card-title">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
                <p><strong>Costo:</strong> ${cost} monete</p>
                <div class="pokemon-details hidden">
                    <p><strong>Tipo:</strong> ${pokemon.types.map((type) => type.type.name).join(', ')}</p>
                    <p><strong>Abilità:</strong> ${pokemon.abilities.map((ability) => ability.ability.name).join(', ')}</p>
                    <p><strong>Statistiche:</strong></p>
                    <ul>
                        <li><strong>HP:</strong> ${pokemon.stats[0].base_stat}</li>
                        <li><strong>Attacco:</strong> ${pokemon.stats[1].base_stat}</li>
                        <li><strong>Difesa:</strong> ${pokemon.stats[2].base_stat}</li>
                        <li><strong>Attacco Speciale:</strong> ${pokemon.stats[3].base_stat}</li>
                        <li><strong>Difesa Speciale:</strong> ${pokemon.stats[4].base_stat}</li>
                        <li><strong>Velocità:</strong> ${pokemon.stats[5].base_stat}</li>
                    </ul>
                </div>
                <div class="card-actions justify-end">
                    <button class="btn btn-primary" onclick="catchPokemon('${pokemon.name}', ${cost})">Cattura</button>
                </div>
            </div>
        `;

        pokemonListElement.appendChild(card); // Aggiunge la card al contenitore
    });
}

// Funzione per catturare un Pokémon
function catchPokemon(name, cost) {
    const myPokemon = JSON.parse(localStorage.getItem('myPokemon')) || []; // Recupera la lista dei Pokémon catturati

    // Verifica se l'utente ha abbastanza monete per catturare il Pokémon
    if (coins < cost) {
        alert('Non hai abbastanza monete per catturare questo Pokémon!');
        return;
    }

    // Verifica se il Pokémon è già stato catturato
    if (!myPokemon.includes(name)) {
        coins -= cost; // Deduce il costo di cattura
        localStorage.setItem('coins', JSON.stringify(coins)); // Salva il numero di monete aggiornato

        myPokemon.push(name); // Aggiunge il Pokémon alla lista dei catturati
        localStorage.setItem('myPokemon', JSON.stringify(myPokemon)); // Salva la lista nel localStorage

        alert(`${name} è stato catturato con successo!`);
    } else {
        alert('Hai già catturato questo Pokémon!');
    }

    updateCoinDisplay(); // Aggiorna il display delle monete
}

// Funzione per visualizzare i dettagli del Pokémon quando si clicca sull'immagine
function toggleDetails(cardElement) {
    const detailsElement = cardElement.closest('.card').querySelector('.pokemon-details');
    detailsElement.classList.toggle('hidden'); // Mostra o nasconde i dettagli
}

// Funzione di ricerca dei Pokémon
function filterPokemons() {
    const query = searchBar.value.toLowerCase(); // Ottieni il valore della barra di ricerca
    const filteredPokemons = allPokemons.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(query) // Filtra i Pokémon che contengono il testo della ricerca
    );
    displayPokemons(filteredPokemons); // Visualizza i Pokémon filtrati
}

// Funzione di filtro per tipo di Pokémon
function filterByType() {
    const type = typeFilter.value.toLowerCase(); // Ottieni il tipo selezionato nel filtro
    if (type === '') {
        displayPokemons(allPokemons); // Mostra tutti i Pokémon se nessun tipo è selezionato
        return;
    }

    const filteredPokemons = allPokemons.filter((pokemon) =>
        pokemon.types.some((t) => t.type.name === type) // Filtra i Pokémon che hanno il tipo selezionato
    );
    displayPokemons(filteredPokemons); // Visualizza i Pokémon filtrati per tipo
}

// Funzione di inizializzazione della pagina
function initializePage() {
    fetchPokemons(); // Carica i Pokémon iniziali
    updateCoinDisplay(); // Mostra il numero di monete

    // Aggiungi gli event listener per la ricerca e il filtro
    searchBar.addEventListener('input', filterPokemons);
    typeFilter.addEventListener('change', filterByType);
}

// Evento che carica la pagina
window.onload = initializePage; // Inizializza la pagina al caricamento
