const apiKey = "1bfdbff05c2698dc917dd28c08d41096";

async function fetchMovieDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get("id");

  if (!movieId) {
    console.error("Movie ID not provided in the URL");
    return;
  }

  const [movieResponse, similarMoviesResponse, genreListResponse] =
    await Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`),
      fetch(`https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${apiKey}&language=en-US&page=1`),
      fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`),
    ]);

  const [movieData, similarMoviesData, genreListData] =
    await Promise.all([
      movieResponse.json(),
      similarMoviesResponse.json(),
      genreListResponse.json(),
    ]);

  displayMovieDetails(movieData);
  displaySimilarMovies(similarMoviesData.results, genreListData);
}

function displayMovieDetails(data) {
  const movieDetails = $("#movieDetails");

  movieDetails.html(`
    <div class="details-head">
      <img src="https://image.tmdb.org/t/p/w500${data.poster_path}" alt="${data.title}" class="details-img">
      <div class="details-overlay">
        <div class="ratings">
          <ion-icon name="star-outline"></ion-icon>
          <span>${data.vote_average}</span>
        </div>
      </div>
    </div>
    <div class="details-body">
      <h1 class="details-title">${data.title}</h1>
      <div class="details-info">
        <span class="genre">${getGenres(data.genres)}</span>
        <span class="year">${getReleaseYear(data.release_date)}</span>
      </div>
      <p class="overview">${data.overview}</p>
      <div class="additional-details">
        <p><strong>Status:</strong> ${data.status}</p>
        <p><strong>Revenue:</strong> ${formatCurrency(data.revenue)}</p>
        <p><strong>Runtime:</strong> ${formatRuntime(data.runtime)}</p>
      </div>
    </div>
  `);
}

async function fetchGenres() {
  const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`);
  const data = await response.json();
  return data.genres.reduce((acc, genre) => {
    acc[genre.id] = genre.name;
    return acc;
  }, {});
}

async function displaySimilarMovies(similarMovies) {
  const genres = await fetchGenres();
  const similarMoviesGrid = $("#similarMovies");

  similarMovies.forEach((movie) => {
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
        <div class="card-body">
          <h3 class="card-title">${movie.title}</h3>
          <div class="card-info">
            <span class="genre">${getGenress(movie.genre_ids, genres)}</span>
            <span class="year">${getReleaseYear(movie.release_date)}</span>
          </div>
        </div>
      </a>
    `);

    similarMoviesGrid.append(movieCard);
  });
}

function getGenres(genres) {
  return genres.map((genre) => genre.name).join("/");
}

function getGenress(genreIds, genres) {
  const firstGenreId = genreIds[0];
  return genres[firstGenreId];
}

function getReleaseYear(releaseDate) {
  return new Date(releaseDate).getFullYear();
}

function formatCurrency(amount) {
  return `$${amount.toLocaleString()}`;
}

function formatRuntime(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

fetchMovieDetails();