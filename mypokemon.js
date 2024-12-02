// Selezioniamo l'elemento HTML in cui verranno visualizzati i Pokémon catturati
const myPokemonListElement = document.getElementById('my-pokemon-cards');

// Funzione per visualizzare i Pokémon catturati
async function displayMyPokemons() {
    // Puliamo il contenuto dell'elemento per evitare duplicati ogni volta che viene chiamata la funzione
    myPokemonListElement.innerHTML = '';

    // Recuperiamo la lista dei Pokémon dal LocalStorage, se non ci sono Pokémon salvati, impostiamo un array vuoto
    const myPokemon = JSON.parse(localStorage.getItem('myPokemon')) || [];

    // Per ogni nome di Pokémon nella lista, facciamo una chiamata API per ottenere i dettagli
    for (const pokemonName of myPokemon) {
        try {
            // Fetch dalla PokeAPI per ottenere i dettagli del Pokémon
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
            
            // Se la risposta non è OK, lanciamo un errore
            if (!response.ok) throw new Error('Errore nel caricamento dei dettagli del Pokémon');

            // Converto la risposta JSON in un oggetto JavaScript
            const pokemon = await response.json();

            // Creiamo un elemento card per visualizzare il Pokémon
            const card = document.createElement('div');
            card.className = 'card bg-base-100 shadow-xl';
            card.innerHTML = `
                <figure class="p-4">
                    <!-- Immagine del Pokémon -->
                    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                </figure>
                <div class="card-body">
                    <!-- Nome del Pokémon, con la prima lettera maiuscola -->
                    <h2 class="card-title">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
                    <div class="card-actions justify-end">
                        <!-- Pulsante per rimuovere il Pokémon dalla collezione -->
                        <button class="btn btn-error" onclick="removePokemon('${pokemon.name}')">Rimuovi</button>
                    </div>
                </div>
            `;
            
            // Aggiungiamo la card creata al contenitore dei Pokémon
            myPokemonListElement.appendChild(card);
        } catch (error) {
            // Se c'è un errore nella chiamata API, lo mostriamo nella console e avvisiamo l'utente
            console.error(error);
            alert('Errore nel caricamento dei dettagli del Pokémon catturato.');
        }
    }
}

// Funzione per rimuovere un Pokémon dalla collezione
function removePokemon(name) {
    // Recuperiamo la lista dei Pokémon dal LocalStorage
    let myPokemon = JSON.parse(localStorage.getItem('myPokemon')) || [];
    
    // Filtriamo l'array per rimuovere il Pokémon selezionato
    myPokemon = myPokemon.filter((pokemon) => pokemon !== name);
    
    // Riemettiamo l'array aggiornato nel LocalStorage
    localStorage.setItem('myPokemon', JSON.stringify(myPokemon));
    
    // Ricarichiamo la visualizzazione dei Pokémon
    displayMyPokemons();
}

// Inizializza la visualizzazione dei Pokémon catturati al caricamento della pagina
displayMyPokemons();
