const api = new TmdbApi("eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNmMwZWQzNDlkM2IxNjViODU2MGJmZmZhYjE3ZjU2MyIsIm5iZiI6MTczMjg4MjkyNS44Mjk3NDE1LCJzdWIiOiI2NzQ5YWViZTZhM2Y1ZDA1YTdkYzdlMWMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.OlaQjB9pHanWzoSZbUUJh8H4LX4dPQuFVXkJCbPzxBw");

const movieList = document.getElementById("movieList");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const pagination = document.getElementById("pagination");
const languageForm = document.getElementById("languageForm");
const languageSelect = document.getElementById("languageSelect");

const imageBaseUrl = "https://image.tmdb.org/t/p/w500";

function displayMovies(movies) {
    movieList.innerHTML = "";
    if (!movies || movies.length === 0) {
        movieList.innerHTML = "<p>Aucun film trouvé.</p>";
        return;
    }
    movies.forEach(movie => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");

        const moviePoster = movie.poster_path
            ? `<img src="${imageBaseUrl}${movie.poster_path}" alt="${movie.title}">`
            : `<div style="height: 300px; background: #ccc; display: flex; align-items: center; justify-content: center;">Pas d'image</div>`;

        movieCard.innerHTML = `
            ${moviePoster}
            <h2>${movie.title}</h2>
            <p>${movie.overview || "Description non disponible"}</p>
            <p>Note : ${movie.vote_average}/10</p>
        `;
        movieList.appendChild(movieCard);
    });
}

function setupPagination(totalPages, currentPage, callback) {
    pagination.innerHTML = "";
    for (let i = 1; i <= Math.min(totalPages, 5); i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.disabled = i === currentPage;
        button.addEventListener("click", () => callback(i));
        pagination.appendChild(button);
    }
}

async function loadDiscoverMovies(page = 1) {
    const data = await api.discoverMovies(page);
    if (data) {
        displayMovies(data.results);
        setupPagination(data.total_pages, page, loadDiscoverMovies);
    }
}

async function searchMovies(query, page = 1) {
    const data = await api.searchMovies(query, page);
    if (data) {
        displayMovies(data.results);
        setupPagination(data.total_pages, page, (newPage) => searchMovies(query, newPage));
    }
}

languageForm.addEventListener("change", () => {
    const selectedLanguage = languageSelect.value;
    api.language = selectedLanguage;
    loadDiscoverMovies();
});

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
        searchMovies(query);
    }
});

loadDiscoverMovies();
