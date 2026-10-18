const tg = window.Telegram?.WebApp;

if (tg) {
    tg.ready();
    tg.expand();
}


/* =========================================
   OPEN TITLE
========================================= */

function openTitle(title) {
    window.location.href =
        "chapter.html?title=" + title;
}


/* =========================================
   OPEN READER
========================================= */

function openReader() {
    window.location.href = "reader.html";
}


/* =========================================
   MANGA DATA
========================================= */

const mangaData = [
    {
        title: "Dash",
        id: "dash",
        cover: "https://cdn.storyabout-us.com/Covers/dash.jpg"
    },

    {
        title: "Evil Deed",
        id: "evil-deed",
        cover: "https://cdn.storyabout-us.com/Covers/evil-deed.png"
    },

    {
        title: "Guiding Hazard",
        id: "guiding-hazard",
        cover: "https://cdn.storyabout-us.com/Covers/guiding-hazard.jpg"
    },

    {
        title: "Semantic Error",
        id: "semantic-error",
        cover: "https://cdn.storyabout-us.com/Covers/semantic-error.jpg"
    }
];

const MANGA_API_BASE = "https://story-about-us-api.aichinose219.workers.dev";


/* =========================================
   ELEMENTS
========================================= */

const mangaList =
    document.getElementById("mangaList");

const alphabetNav =
    document.getElementById("alphabetNav");

const searchInput =
    document.getElementById("searchInput");

const clearSearch =
    document.getElementById("clearSearch");

const noResult =
    document.getElementById("noResult");


/* =========================================
   FAVORITES
========================================= */

let favorites =
    JSON.parse(
        localStorage.getItem("favoriteManga")
    ) || [];


/* =========================================
   SORT A-Z
========================================= */

const sortedManga =
    [...mangaData].sort((a, b) =>
        a.title.localeCompare(
            b.title,
            "en",
            {
                sensitivity: "base"
            }
        )
    );


/* =========================================
   RENDER ALPHABET
========================================= */

function renderAlphabet() {

    alphabetNav.innerHTML = "";

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    letters.split("").forEach(letter => {

        const button =
            document.createElement("button");

        button.type = "button";
        button.textContent = letter;
        button.dataset.letter = letter;

        const hasTitle =
            sortedManga.some(manga =>
                manga.title
                    .charAt(0)
                    .toUpperCase() === letter
            );

        if (!hasTitle) {
            button.classList.add("disabled");
            button.disabled = true;
        }

        button.addEventListener(
            "click",
            () => {

                const target =
                    document.getElementById(
                        `letter-${letter}`
                    );

                if (target) {
                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }

            }
        );

        alphabetNav.appendChild(button);

    });
}


/* =========================================
   RENDER MANGA
========================================= */

function renderManga(keyword = "") {

    mangaList.innerHTML = "";

    const search = keyword.trim().toLowerCase();

    const filteredManga =
        search === ""
            ? sortedManga
            : sortedManga.filter(manga =>
                manga.title.toLowerCase().includes(search)
            );


    /* =========================
       TIDAK ADA HASIL
    ========================= */

    if (search !== "" && filteredManga.length === 0) {

        noResult.classList.add("show");
        alphabetNav.classList.add("hidden");

        mangaList.classList.remove("search-mode");

        return;
    }


    noResult.classList.remove("show");


    /* =========================
       MODE SEARCH
    ========================= */

    if (search !== "") {

        mangaList.classList.add("search-mode");

        alphabetNav.classList.add("hidden");


        filteredManga.forEach(manga => {

            const card =
                document.createElement("article");

            card.className = "manga-card";
            card.classList.add(`manga-card-status-${manga.status || "ongoing"}`);


            const isFavorite =
                favorites.includes(manga.id);


            card.innerHTML = `
                <div class="cover-wrapper">

                    <img
                        src="${manga.cover}"
                        alt="${manga.title}"
                        class="manga-cover"
                        loading="lazy"
                    >

                </div>

                <div class="manga-card-bottom">

                    <h3>
                        ${manga.title}
                    </h3>

                    <button
                        type="button"
                        class="favorite-btn ${
                            isFavorite ? "active" : ""
                        }"
                        aria-label="Favorite">

                        <svg viewBox="0 0 24 24">
                            <path
                                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z">
                            </path>
                        </svg>

                    </button>

                </div>
            `;


            card.addEventListener("click", () => {
                openTitle(manga.id);
            });


            const favoriteButton =
                card.querySelector(".favorite-btn");


            favoriteButton.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    toggleFavorite(
                        manga.id,
                        favoriteButton
                    );

                }
            );


            mangaList.appendChild(card);

        });


        return;
    }


    /* =========================
       MODE GRID
    ========================= */

    mangaList.classList.remove("search-mode");

    alphabetNav.classList.remove("hidden");


    let currentLetter = "";


    filteredManga.forEach(manga => {

        const letter =
            manga.title
                .charAt(0)
                .toUpperCase();


        if (letter !== currentLetter) {

            currentLetter = letter;


            const letterSection =
                document.createElement("div");

            letterSection.className =
                "letter-section";

            letterSection.id =
                `letter-${letter}`;


            letterSection.innerHTML = `
                <h2 class="letter-title">
                    ${letter}
                </h2>
            `;


            mangaList.appendChild(
                letterSection
            );

        }


        const letterSection =
            document.getElementById(
                `letter-${letter}`
            );


        const card =
            document.createElement("article");

        card.className = "manga-card";
        card.classList.add(`manga-card-status-${manga.status || "ongoing"}`);


        const isFavorite =
            favorites.includes(manga.id);


        card.innerHTML = `
            <div class="cover-wrapper">

                <img
                    src="${manga.cover}"
                    alt="${manga.title}"
                    class="manga-cover"
                    loading="lazy"
                >

            </div>

            <div class="manga-card-bottom">

                <h3>
                    ${manga.title}
                </h3>

                <button
                    type="button"
                    class="favorite-btn ${
                        isFavorite ? "active" : ""
                    }"
                    aria-label="Favorite">

                    <svg viewBox="0 0 24 24">
                        <path
                            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z">
                        </path>
                    </svg>

                </button>

            </div>
        `;


        card.addEventListener("click", () => {
            openTitle(manga.id);
        });


        const favoriteButton =
            card.querySelector(".favorite-btn");


        favoriteButton.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                toggleFavorite(
                    manga.id,
                    favoriteButton
                );

            }
        );


        letterSection.appendChild(card);

    });
}

/* =========================================
   TOGGLE FAVORITE
========================================= */

function toggleFavorite(id, button) {

    if (favorites.includes(id)) {

        favorites =
            favorites.filter(
                favoriteId =>
                    favoriteId !== id
            );

        button.classList.remove("active");

    } else {

        favorites.push(id);

        button.classList.add("active");
    }


    localStorage.setItem(
        "favoriteManga",
        JSON.stringify(favorites)
    );
}


/* =========================================
   SEARCH
========================================= */

function renderSearchSuggestions(keyword) {

    const search = keyword.trim().toLowerCase();

    searchSuggestions.innerHTML = "";

    // Kalau search kosong, sembunyikan suggestion
    if (search === "") {
        searchSuggestions.classList.remove("show");
        return;
    }

    // Cari berdasarkan AWAL judul
    const results = sortedManga.filter(manga =>
        manga.title.toLowerCase().startsWith(search)
    );

    // Tidak ada hasil
    if (results.length === 0) {

        const noResult = document.createElement("div");

        noResult.className = "search-no-result";
        noResult.textContent = "No result found";

        searchSuggestions.appendChild(noResult);

        searchSuggestions.classList.add("show");

        return;
    }

    // Tampilkan hasil
    results.forEach(manga => {

        const item = document.createElement("button");

        item.type = "button";
        item.className = "search-suggestion";

        item.textContent = manga.title;

        item.addEventListener("click", () => {
            openTitle(manga.id);
        });

        searchSuggestions.appendChild(item);
    });

    searchSuggestions.classList.add("show");
}


/* =========================================
   INITIALIZE
========================================= */

renderAlphabet();
renderManga();

fetch(`${MANGA_API_BASE}/api/manga`, { cache: "no-store" })
    .then(response => response.ok ? response.json() : [])
    .then(items => {
        if (!Array.isArray(items)) return;
        const allowedStatuses = new Set(["ongoing", "end", "end-season", "hiatus"]);
        const statusById = new Map(items.map(item => [String(item.id), allowedStatuses.has(item.status) ? item.status : "ongoing"]));
        mangaData.forEach(manga => { manga.status = statusById.get(manga.id) || "ongoing"; });
        renderManga(searchInput?.value || "");
    })
    .catch(() => {});
