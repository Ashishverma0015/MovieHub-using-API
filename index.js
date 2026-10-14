const API_KEY = "69178ccf"

const movieForm = document.querySelector("#movieForm")
const movieInput = document.querySelector("#movie-input")
const movieHub = document.querySelector("#movieHub")
const resultsTitle = document.querySelector("#resultsTitle")

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]))
const message = (title, text) => `<p class="message"><strong>${esc(title)}</strong>${esc(text)}</p>`

movieForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const query = movieInput.value.trim()
    if (!query) return
    searchMovies(query)
})

document.querySelector("#tags").addEventListener("click", (e) => {
    if (!e.target.classList.contains("tag")) return
    movieInput.value = e.target.textContent
    searchMovies(e.target.textContent)
})

searchMovies("Avengers", true)

async function searchMovies(movieName, isDefault = false) {
    resultsTitle.hidden = false
    resultsTitle.textContent = isDefault ? "Popular right now" : `Results for “${movieName}”`
    movieHub.innerHTML = `<div class="loader" role="status" aria-label="Loading"></div>`
    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(movieName)}`)
        const data = await response.json()
        if (data.Response === "True") {
            displayMovie(data.Search)
        } else {
            movieHub.innerHTML = message("No movies found", `Nothing matched “${movieName}”. Check the spelling or try a shorter title.`)
        }
    } catch {
        movieHub.innerHTML = message("Couldn't load results", "Check your internet connection and search again.")
    }
}

function displayMovie(data) {
    movieHub.innerHTML = ""
    data.forEach((movie) => {
        const div = document.createElement("div")
        div.dataset.imdbID = movie.imdbID
        div.className = "movie-card"
        div.tabIndex = 0
        div.setAttribute("role", "link")
        const poster = movie.Poster !== "N/A"
            ? `<img src="${esc(movie.Poster)}" alt="Poster of ${esc(movie.Title)}" loading="lazy">`
            : `<div class="no-poster">No poster</div>`
        div.innerHTML = `
            <div class="poster">${poster}</div>
            <p class="title">${esc(movie.Title)}</p>
            <p class="year">${esc(movie.Year)}</p>`
        movieHub.append(div)
    })
}

function openCard(e) {
    const card = e.target.closest(".movie-card")
    if (card) location.href = `movieDetail.html?id=${card.dataset.imdbID}`
}
movieHub.addEventListener("click", openCard)
movieHub.addEventListener("keydown", (e) => { if (e.key === "Enter") openCard(e) })
