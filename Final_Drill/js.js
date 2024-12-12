const apiKey = "1bfdbff05c2698dc917dd28c08d41096";
          
async function fetchGenres() {
  const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`);
  const data = await response.json();
  return data.genres.reduce((acc, genre) => {
    acc[genre.id] = genre.name;
    return acc;
  }, {});
}

async function fetchMovies(url, containerId) {
  const genres = await fetchGenres();
  const response = await fetch(url);
  const data = await response.json();
  const moviesGrid = $(`#${containerId}`);

  data.results.forEach((movie) => {
    const movieCard = $("<div>").addClass("movie-card");

    movieCard.html(`
      <a href="/movie-details.html?id=${movie.id}">
        <div class="card-head">
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" class="card-img">
          <div class="card-overlay">
            <div class="bookmark">
              <ion-icon name="bookmark-outline"></ion-icon>
            </div>
            <div class="rating">
              <ion-icon name="star-outline"></ion-icon>
              <span>${movie.vote_average}</span>
            </div>
            <div class="play">
              <ion-icon name="play-circle-outline"></ion-icon>
            </div>
          </div>
        </div>
      </a>
      <div class="card-body">
        <h3 class="card-title">${movie.title}</h3>
        <div class="card-info">
          <span class="genre">${getGenres(movie.genre_ids, genres)}</span>
          <span class="year">${getReleaseYear(movie.release_date)}</span>
        </div>
      </div>
    `);

    moviesGrid.append(movieCard);
  });
}

async function performSearch() {
  const searchInput = $("#search");
  const searchTerm = searchInput.val();

  try {
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchTerm}`);
    const data = await response.json();

    const moviesGrid = $("#moviesGrid");
    moviesGrid.empty();

    for (const movie of data.results) {
      const genres = await fetchGenres();

      const movieCard = $("<div>").addClass("movie-card");
      movieCard.html(`
        <a href="/movie-details.html?id=${movie.id}">
          <div class="card-head">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" class="card-img">
            <div class="card-overlay">
              <div class="bookmark">
                <ion-icon name="bookmark-outline"></ion-icon>
              </div>
              <div class="rating">
                <ion-icon name="star-outline"></ion-icon>
                <span>${movie.vote_average}</span>
              </div>
              <div class="play">
                <ion-icon name="play-circle-outline"></ion-icon>
              </div>
            </div>
          </div>
        </a>
        <div class="card-body">
          <h3 class="card-title">${movie.title}</h3>
          <div class="card-info">
            <span class="genre">${getGenres(movie.genre_ids, genres)}</span>
            <span class="year">${getReleaseYear(movie.release_date)}</span>
          </div>
        </div>
      `);

      moviesGrid.append(movieCard);
    }
  } catch (error) {
    console.error("Error fetching search results:", error);
  }
}

function getGenres(genreIds, genres) {
  const firstGenreId = genreIds[0];
  return genres[firstGenreId];
}

function getReleaseYear(releaseDate) {
  return new Date(releaseDate).getFullYear();
}

fetchMovies(`https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`, "moviesGrid");
fetchMovies(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`, "polularMovies");