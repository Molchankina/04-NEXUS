const supabaseClient = window.supabase;
const loading = document.querySelector("#game-loading");
const errorSection = document.querySelector("#game-error");
const errorMessage = document.querySelector("#game-error-message");
const gamePage = document.querySelector("#game-page");
const genreLabels = {
    action: "Экшен",
    rpg: "RPG",
    strategy: "Стратегия",
    adventure: "Приключения",
    simulation: "Симулятор",
    racing: "Гонки",
    fighting: "Файтинг",
    stealth: "Стелс",
    arcade: "Аркада",
    casual: "Казуальная"
};
const modeLabels = {
    solo: "Одиночная",
    coop: "Кооператив",
    multi: "Мультиплеер"
};
const categoryLabels = {
    story: "Сюжетная игра",
    open: "Свободное исследование"
};
function setText(selector, value, fallback = "") {
    const element = document.querySelector(selector);
    element.textContent = value ?? fallback;
}
function renderChips(selector, values, labels = {}) {
    const container = document.querySelector(selector);
    container.replaceChildren();
    (Array.isArray(values) ? values : []).forEach((value) => {
        const chip = document.createElement("span");
        chip.className = "chip";
        chip.textContent = labels[value] ?? value;
        container.append(chip);
    });
    container.closest(".information-item").hidden =
        container.children.length === 0;
}
function setOptionalSection(selector, value) {
    const section = document.querySelector(selector);
    section.hidden = !String(value ?? "").trim();
}
function renderFeatures(values) {
    const container = document.querySelector("#game-features");
    container.replaceChildren();
    (Array.isArray(values) ? values : []).forEach((value, index) => {
        const item = document.createElement("li");
        item.className = "feature-item";
        const number = document.createElement("span");
        number.className = "feature-number";
        number.textContent = String(index + 1).padStart(2, "0");
        const text = document.createElement("p");
        text.className = "feature-text";
        text.textContent = value;
        item.append(number, text);
        container.append(item);
    });
    document.querySelector("#game-features-section").hidden =
        container.children.length === 0;
}
function showError(message) {
    loading.hidden = true;
    gamePage.hidden = true;
    errorSection.hidden = false;
    errorMessage.textContent = message;
}
async function loadGame() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug")?.trim();
    if (!slug) {
        showError("В адресе страницы не указана игра.");
        return;
    }
    try {
        const { data: game, error } = await supabaseClient
            .from("games")
            .select("*")
            .eq("slug", slug)
            .eq("published", true)
            .maybeSingle();
        if (error) {
            throw error;
        }
        if (!game) {
            showError("Игра не найдена или ещё не опубликована.");
            return;
        }
        document.title = `${game.title} — NEXUS`;
        const poster = document.querySelector("#game-poster");
        poster.src = game.image || "";
        poster.alt = game.alt || game.title;
        poster.hidden = !game.image;
        const heroBackground = document.querySelector("#hero-background");
        if (game.image) {
            heroBackground.style.backgroundImage =
                `url("${game.image.replace(/["\\\n\r]/g, "")}")`;
        }
        setText("#game-developer", game.universe);
        setText("#game-title", game.title);
        setText("#game-description", game.description);
        setText("#game-year", game.release_year);
        setText("#game-category", categoryLabels[game.category] ?? game.category);
        setText("#info-year", game.release_year, "Не указан");
        setText("#info-developer", game.universe, "Не указан");
        renderChips("#game-genres", game.genres, genreLabels);
        renderChips("#game-modes", game.modes, modeLabels);
        renderChips("#game-platforms", game.platforms);
        setText("#game-plot", game.plot_summary);
        setText("#game-gameplay", game.gameplay);
        renderFeatures(game.features);
        setText("#game-minimum", game.pc_min_requirements);
        setText("#game-recommended", game.pc_recommended_requirements);
        setOptionalSection("#game-story-section", game.plot_summary);
        setOptionalSection("#game-gameplay-section", game.gameplay);
        document.querySelector("#minimum-card").hidden =
            !String(game.pc_min_requirements ?? "").trim();
        document.querySelector("#recommended-card").hidden =
            !String(game.pc_recommended_requirements ?? "").trim();
        setOptionalSection(
            "#game-requirements-section",
            game.pc_min_requirements || game.pc_recommended_requirements
        );
        loading.hidden = true;
        errorSection.hidden = true;
        gamePage.hidden = false;
    } catch (error) {
        console.error("Ошибка загрузки страницы игры:", error);
        showError("Не удалось загрузить игру. Попробуй обновить страницу.");
    }
}
loadGame();