const games = [
    {
        id: "witcher3",
        title: "The Witcher 3: Wild Hunt",
        universe: "WILD HUNT",
        category: "DARK FANTASY",
        image: "images/witcher.jpg",
        alt: "Постер The Witcher 3: Wild Hunt",
        url: "witcher3/witcher3.html",
        story: "story",
        modes: ["solo"],
        genres: ["action", "adventure", "rpg"],
        camera: "third",
        moods: ["dark", "emotional"],
        tags: ["Сюжет", "Открытый мир", "RPG"]
    },
    {
        id: "gta5",
        title: "Grand Theft Auto V",
        universe: "LOS SANTOS",
        category: "OPEN WORLD",
        image: "images/gta.jpg",
        alt: "Постер Grand Theft Auto V",
        url: "gta/gta5.html",
        story: "open",
        modes: ["solo", "multi"],
        genres: ["action", "adventure"],
        camera: "third",
        moods: ["energetic"],
        tags: ["Открытый мир", "Экшен", "Онлайн"]
    },
    {
        id: "detroit",
        title: "Detroit: Become Human",
        universe: "FUTURE CITY",
        category: "CHOICE / STORY",
        image: "images/detroit.jpg",
        alt: "Постер Detroit: Become Human",
        url: "detroit/detroit.html",
        story: "story",
        modes: ["solo"],
        genres: ["adventure"],
        camera: "third",
        moods: ["dark", "emotional"],
        tags: ["Выборы", "Сюжет", "Драма"]
    },
    {
        id: "ittakestwo",
        title: "It Takes Two",
        universe: "TOGETHER",
        category: "CO-OP ADVENTURE",
        image: "images/it_takes_two.jpg",
        alt: "Постер It Takes Two",
        url: "it-takes-two/it-takes-two.html",
        story: "story",
        modes: ["coop"],
        genres: ["action", "adventure", "puzzle"],
        camera: "third",
        moods: ["calm", "energetic", "emotional"],
        tags: ["Кооператив", "Приключение", "Головоломки"]
    },
    {
        id: "syberia3",
        title: "Syberia 3",
        universe: "FROZEN LANDS",
        category: "PUZZLE ADVENTURE",
        image: "images/syberia.jpg",
        alt: "Постер Syberia 3",
        url: "syberia-3/syberia-3.html",
        story: "story",
        modes: ["solo"],
        genres: ["adventure", "puzzle"],
        camera: "third",
        moods: ["calm", "emotional"],
        tags: ["Приключение", "Загадки", "Исследование"]
    },
    {
        id: "tlou1",
        title: "The Last of Us Part I",
        universe: "THE JOURNEY",
        category: "SURVIVAL / STORY",
        image: "images/the_last_of_us.jpg",
        alt: "Постер The Last of Us Part I",
        url: "the-last-of-us-1/the-last-of-us-1.html",
        story: "story",
        modes: ["solo"],
        genres: ["action", "adventure"],
        camera: "third",
        moods: ["dark", "emotional"],
        tags: ["Сюжет", "Выживание", "Драма"]
    },
    {
        id: "tlou2",
        title: "The Last of Us Part II",
        universe: "CONSEQUENCES",
        category: "SURVIVAL / DRAMA",
        image: "images/the_last_of_us_2.jpg",
        alt: "Постер The Last of Us Part II",
        url: "the-last-of-us-2/the-last-of-us-2.html",
        story: "story",
        modes: ["solo"],
        genres: ["action", "adventure"],
        camera: "third",
        moods: ["dark", "emotional"],
        tags: ["Сюжет", "Выживание", "Драма"]
    },
    {
        id: "outlast",
        title: "Outlast",
        universe: "MOUNT MASSIVE",
        category: "PSYCHOLOGICAL HORROR",
        image: "images/Outlast.jpg",
        alt: "Постер Outlast",
        url: "outlast/outlast.html",
        story: "story",
        modes: ["solo"],
        genres: ["horror", "adventure"],
        camera: "first",
        moods: ["dark"],
        tags: ["Хоррор", "От первого лица", "Выживание"]
    },
    {
        id: "untildawn",
        title: "Until Dawn",
        universe: "BLACKWOOD PINES",
        category: "SURVIVAL HORROR",
        image: "images/untill_dawn.jpg",
        alt: "Постер Until Dawn",
        url: "until-dawn/until-dawn.html",
        story: "story",
        modes: ["solo"],
        genres: ["horror", "adventure"],
        camera: "third",
        moods: ["dark", "emotional"],
        tags: ["Хоррор", "Выборы", "Сюжет"]
    },
    {
        id: "re7",
        title: "Resident Evil 7",
        universe: "THE BAKER ESTATE",
        category: "SURVIVAL HORROR",
        image: "images/resident_7.jpg",
        alt: "Постер Resident Evil 7",
        url: "resident-evil-7/resident-evil-7.html",
        story: "story",
        modes: ["solo"],
        genres: ["horror", "action"],
        camera: "first",
        moods: ["dark"],
        tags: ["Хоррор", "Выживание", "Сюжет"]
    },
    {
        id: "revillage",
        title: "Resident Evil Village",
        universe: "EUROPEAN NIGHTMARE",
        category: "GOTHIC HORROR",
        image: "images/resident_8.jpg",
        alt: "Постер Resident Evil Village",
        url: "resident-evil-8/resident-evil-8.html",
        story: "story",
        modes: ["solo"],
        genres: ["horror", "action"],
        camera: "first",
        moods: ["dark", "energetic"],
        tags: ["Хоррор", "Экшен", "Сюжет"]
    },
    {
        id: "spiderman",
        title: "Marvel's Spider-Man",
        universe: "FRIENDLY NEIGHBORHOOD",
        category: "SUPERHERO / ACTION",
        image: "images/Marvel’sSpiderMan2.jpg",
        alt: "Постер Marvel's Spider-Man",
        url: "spider-man/spider-man.html",
        story: "story",
        modes: ["solo"],
        genres: ["action", "adventure"],
        camera: "third",
        moods: ["energetic", "emotional"],
        tags: ["Супергерой", "Экшен", "Открытый мир"]
    },
    {
        id: "stray",
        title: "Stray",
        universe: "WALLED CITY",
        category: "SCI-FI ADVENTURE",
        image: "images/stray.jpg",
        alt: "Постер Stray",
        url: "stray/stray.html",
        story: "story",
        modes: ["solo"],
        genres: ["adventure", "puzzle"],
        camera: "third",
        moods: ["calm", "dark"],
        tags: ["Исследование", "Загадки", "Приключение"]
    },
    {
        id: "cyberpunk",
        title: "Cyberpunk 2077",
        universe: "NEVER STOP FIGHTING",
        category: "SCI-FI / OPEN WORLD",
        image: "images/cyberpunk.jpg",
        alt: "Постер Cyberpunk 2077",
        url: "cyberpunk/cyberpunk.html",
        story: "open",
        modes: ["solo"],
        genres: ["action", "adventure", "rpg"],
        camera: "first",
        moods: ["dark", "energetic"],
        tags: ["RPG", "Открытый мир", "Киберпанк"]
    }
];
const grid = document.querySelector("#game-grid");
const searchInput = document.querySelector("#game-search");
const storyFilter = document.querySelector("#story-filter");
const modeFilter = document.querySelector("#mode-filter");
const genreFilter = document.querySelector("#genre-filter");
const cameraFilter = document.querySelector("#camera-filter");
const moodFilter = document.querySelector("#mood-filter");
const resetButton = document.querySelector("#reset-filters");
const emptyState = document.querySelector("#empty-state");
const resultsCount = document.querySelector("#results-count");
const activeFilterNote = document.querySelector("#active-filter-note");
function createCard(game, index) {
    const card = document.createElement("a");
    card.className = "catalog-card";
    card.href = game.url;
    card.style.animationDelay = `${Math.min(index * 25, 250)}ms`;
    card.setAttribute("aria-label", `Открыть страницу игры ${game.title}`);
    const top = document.createElement("div");
    top.className = "card-top";
    const number = document.createElement("span");
    number.className = "card-number";
    number.textContent = String(games.indexOf(game) + 1).padStart(2, "0");
    const category = document.createElement("span");
    category.className = "card-category";
    category.textContent = game.category;
    top.append(number, category);
    const poster = document.createElement("div");
    poster.className = "card-poster";
    const image = document.createElement("img");
    image.src = game.image;
    image.alt = game.alt;
    image.loading = "lazy";
    image.decoding = "async";
    poster.append(image);
    const info = document.createElement("div");
    info.className = "card-info";
    const universe = document.createElement("span");
    universe.className = "card-universe";
    universe.textContent = game.universe;
    const title = document.createElement("h3");
    title.textContent = game.title;
    const tags = document.createElement("div");
    tags.className = "card-tags";
    game.tags.slice(0, 3).forEach((tagText) => {
        const tag = document.createElement("span");
        tag.textContent = tagText;
        tags.append(tag);
    });
    const open = document.createElement("div");
    open.className = "card-open";
    open.append(document.createTextNode("ОТКРЫТЬ ИГРУ"));
    const arrow = document.createElement("span");
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "↗";
    open.append(arrow);
    info.append(universe, title, tags, open);
    card.append(top, poster, info);
    return card;
}
function getFilteredGames() {
    const query = searchInput.value.trim().toLocaleLowerCase("ru");
    return games.filter((game) => {
        const searchableText = `${game.title} ${game.universe} ${game.category} ${game.tags.join(" ")}`.toLocaleLowerCase("ru");
        const matchesSearch = !query || searchableText.includes(query);
        const matchesStory = storyFilter.value === "all" || game.story === storyFilter.value;
        const matchesMode = modeFilter.value === "all" || game.modes.includes(modeFilter.value);
        const matchesGenre = genreFilter.value === "all" || game.genres.includes(genreFilter.value);
        const matchesCamera = cameraFilter.value === "all" || game.camera === cameraFilter.value;
        const matchesMood = moodFilter.value === "all" || game.moods.includes(moodFilter.value);
        return matchesSearch && matchesStory && matchesMode && matchesGenre && matchesCamera && matchesMood;
    });
}
function describeFilters() {
    const selected = [];
    if (storyFilter.value !== "all") selected.push(storyFilter.options[storyFilter.selectedIndex].text);
    if (modeFilter.value !== "all") selected.push(modeFilter.options[modeFilter.selectedIndex].text);
    if (genreFilter.value !== "all") selected.push(genreFilter.options[genreFilter.selectedIndex].text);
    if (cameraFilter.value !== "all") selected.push(cameraFilter.options[cameraFilter.selectedIndex].text);
    if (moodFilter.value !== "all") selected.push(moodFilter.options[moodFilter.selectedIndex].text);
    if (searchInput.value.trim()) selected.push(`Поиск: «${searchInput.value.trim()}»`);
    activeFilterNote.textContent = selected.length ? selected.join(" · ") : "Все игры каталога";
}
function renderGames() {
    const filteredGames = getFilteredGames();
    const fragment = document.createDocumentFragment();
    filteredGames.forEach((game, index) => fragment.append(createCard(game, index)));
    grid.replaceChildren(fragment);
    resultsCount.textContent = String(filteredGames.length).padStart(2, "0");
    emptyState.hidden = filteredGames.length > 0;
    grid.hidden = filteredGames.length === 0;
    describeFilters();
}
function resetFilters() {
    searchInput.value = "";
    storyFilter.value = "all";
    modeFilter.value = "all";
    genreFilter.value = "all";
    cameraFilter.value = "all";
    moodFilter.value = "all";
    renderGames();
}
[searchInput, storyFilter, modeFilter, genreFilter, cameraFilter, moodFilter].forEach((control) => {
    control.addEventListener(control === searchInput ? "input" : "change", renderGames);
});
resetButton.addEventListener("click", resetFilters);
document.querySelectorAll(".empty-reset").forEach((button) => {
    button.addEventListener("click", resetFilters);
});
renderGames();