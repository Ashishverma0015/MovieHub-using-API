const API_KEY = "69178ccf"
const movieDetail = document.querySelector("#movieDetail")

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]))
const has = (v) => v && v !== "N/A"

const imdbID = new URLSearchParams(location.search).get("id")
if (imdbID) {
    searchMovie(imdbID.trim())
} else {
    movieDetail.innerHTML = `<p class="message"><strong>No movie selected</strong>Go back and pick a movie from the search results.</p>`
}

async function searchMovie(id) {
    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${encodeURIComponent(id)}&plot=full`)
        const data = await response.json()
        if (data.Response === "True") {
            displayMovie(data)
        } else {
            movieDetail.innerHTML = `<p class="message"><strong>Movie not found</strong>${esc(data.Error)}</p>`
        }
    } catch {
        movieDetail.innerHTML = `<p class="message"><strong>Couldn't load this movie</strong>Check your internet connection and refresh.</p>`
    }
}

const block = (label, value) => has(value) ? `<div class="cell"><p class="label">${label}</p><p>${esc(value)}</p></div>` : ""

function displayMovie(data) {
    document.title = `${data.Title} | MovieHub`
    if (has(data.Poster)) document.body.style.setProperty("--poster", `url("${data.Poster}")`)

    const chips = [data.Released, data.Rated, data.Runtime]
        .filter(has).map((v) => `<span class="chip">${esc(v)}</span>`).join("")
    const genres = has(data.Genre) ? data.Genre.split(",").map((g) => `<span class="chip genre">${esc(g.trim())}</span>`).join("") : ""
    const rating = has(data.imdbRating) ? `<span class="rating">★ ${esc(data.imdbRating)} <small>/ 10</small></span>` : ""

    movieDetail.innerHTML = `
        <div class="d-poster">${has(data.Poster) ? `<img src="${esc(data.Poster)}" alt="Poster of ${esc(data.Title)}">` : `<div class="no-poster">No poster</div>`}</div>
        <div class="info">
            <h2>${esc(data.Title)}</h2>
            <div class="facts">${rating}${chips}${genres}</div>
            <h3>Plot</h3><p class="plot">${esc(data.Plot)}</p>
            <div class="grid">${block("Director", data.Director)}${block("Writer", data.Writer)}${block("Cast", data.Actors)}${block("Language", data.Language)}${block("Country", data.Country)}</div>
            <a class="btn" href="https://www.imdb.com/title/${esc(data.imdbID)}" target="_blank" rel="noopener">View on IMDb</a>
        </div>`
}
