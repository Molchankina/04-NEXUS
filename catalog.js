let games = [];
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
async function loadGames() {
    try {
        const { data, error } = await window.supabase
            .from("games")
            .select("*")
            .eq("published", true)
            .order("id", { ascending: true });
        if (error) {
            throw error;
        }
        games = data.map((game) => ({
            id: game.slug,
            title: game.title,
            universe: game.universe,
            category: game.category,
            image: game.image,
            alt: game.alt,
            url: game.url,
            story: game.story ? "story" : "open",
            modes: game.modes ?? [],
            genres: game.genres ?? [],
            camera: game.camera,
            moods: game.moods ?? [],
            tags: game.tags ?? []
        }));
        renderGames();
    } catch (error) {
        console.error("Ошибка загрузки игр из Supabase:", error);
        grid.hidden = true;
        emptyState.hidden = false;
        emptyState.querySelector("h3").textContent = "Не удалось загрузить игры.";
        emptyState.querySelector("p").textContent =
            "Проверь подключение к Supabase и настройки базы данных.";
        resultsCount.textContent = "00";
    }
}
loadGames();