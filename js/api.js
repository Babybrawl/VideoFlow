// Fonction pour récupérer tous les films
async function getAllMovies() {
    const response = await fetch('/api/movies');
    const movies = await response.json();
    console.log("Liste de tous les films :", movies);
    return movies;
}

// Fonction pour récupérer un film par son titre
async function getMovieByTitle(title) {
    const movies = await getAllMovies();
    let foundMovie;
    movies.forEach(movie => {
        if (movie.titre === title) {
            foundMovie = movie;
        }
    });
    console.log(`Film avec le titre ${title} :`, foundMovie);
    return foundMovie;
}

// Fonction pour récupérer un film par son index
async function getMovieByIndex(index) {
    const movies = await getAllMovies();
    const movie = movies[index];
    console.log(`Film à l'index ${index} :`, movie);
    return movie;
}

// Fonction pour récupérer les films par tag
async function getMoviesByTag(tag) {
    const movies = await getAllMovies();
    const moviesWithTag = movies.filter(movie => movie.tag === tag);
    console.log(`Films avec le tag ${tag} :`, moviesWithTag);
    return moviesWithTag;
}