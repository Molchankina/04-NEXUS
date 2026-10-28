const supabaseClient = window.supabase;
const loginSection = document.querySelector("#login-section");
const dashboardSection = document.querySelector("#dashboard-section");
const loginForm = document.querySelector("#login-form");
const loginEmail = document.querySelector("#login-email");
const loginPassword = document.querySelector("#login-password");
const loginMessage = document.querySelector("#login-message");
const logoutButton = document.querySelector("#logout-button");
const gameForm = document.querySelector("#game-form");
const gameFormMessage = document.querySelector("#game-form-message");
const gamesListMessage = document.querySelector("#games-list-message");
const adminGamesList = document.querySelector("#admin-games-list");
const adminGameSearch = document.querySelector("#admin-game-search");
const adminSearchClear = document.querySelector("#admin-search-clear");
const adminSearchCount = document.querySelector("#admin-search-count");
let allAdminGames = [];
const totalGames = document.querySelector("#total-games");
const publishedGames = document.querySelector("#published-games");
const importFileInput = document.querySelector("#games-import-file");
const importPreview = document.querySelector("#games-import-preview");
const importButton = document.querySelector("#import-games-button");
const clearImportButton = document.querySelector("#clear-import-button");
const importMessage = document.querySelector("#games-import-message");
let pendingImportGames = [];
let importFileErrors = [];
function showMessage(element, message, isError = false) {
    element.textContent = message;
    element.classList.toggle("is-error", isError);
}
function showLogin() {
    loginSection.hidden = false;
    dashboardSection.hidden = true;
}
function showDashboard() {
    loginSection.hidden = true;
    dashboardSection.hidden = false;
}
async function checkSession() {
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) {
        showMessage(loginMessage, "Не удалось проверить авторизацию.", true);
        showLogin();
        return;
    }
    if (data.session) {
        showDashboard();
        await loadGames();
    } else {
        showLogin();
    }
}
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    showMessage(loginMessage, "Выполняется вход…");
    const { error } = await supabaseClient.auth.signInWithPassword({
        email: loginEmail.value.trim(),
        password: loginPassword.value
    });
    if (error) {
        showMessage(
            loginMessage,
            "Не удалось войти. Проверь email и пароль.",
            true
        );
        return;
    }
    loginForm.reset();
    showDashboard();
    await loadGames();
});
logoutButton.addEventListener("click", async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
        showMessage(loginMessage, "Не удалось выйти из аккаунта.", true);
        return;
    }
    adminGamesList.innerHTML = "";
    gameForm.reset();
    showLogin();
});
async function loadGames() {
    showMessage(gamesListMessage, "Загружаем игры…");
    const { data, error } = await supabaseClient
        .from("games")
        .select("*")
        .order("id", { ascending: true });
    if (error) {
        showMessage(
            gamesListMessage,
            "Не удалось загрузить игры. Проверь настройки доступа в Supabase.",
            true
        );
        return;
    }
    totalGames.textContent = data.length;
    publishedGames.textContent = data.filter(
        (game) => game.published
    ).length;
    allAdminGames = data;
    filterAdminGames();
}
function normalizeImportedGame(game, index, fileSlugs) {
    const errors = [];
    const requiredFields = [
        "title",
        "slug",
        "universe",
        "category",
        "image",
        "alt",
        "url"
    ];
    if (!game || typeof game !== "object" || Array.isArray(game)) {
        return {
            game: null,
            errors: [`Запись ${index + 1}: ожидался объект игры.`]
        };
    }
    requiredFields.forEach((field) => {
        if (
            typeof game[field] !== "string" ||
            !game[field].trim()
        ) {
            errors.push(`Не заполнено поле ${field}.`);
        }
    });
    if (
        typeof game.slug === "string" &&
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(game.slug.trim())
    ) {
        errors.push("slug должен содержать латиницу, цифры и дефисы.");
    }
    if (
        typeof game.slug === "string" &&
        allAdminGames.some(
            (existing) => existing.slug === game.slug.trim()
        )
    ) {
        errors.push("Игра с таким slug уже есть в базе.");
    }
    if (typeof game.slug === "string") {
        const slug = game.slug.trim();
        if (fileSlugs.has(slug)) {
            errors.push("Этот slug повторяется в загружаемом файле.");
        }
        fileSlugs.add(slug);
    }
    const arrayFields = [
        "modes",
        "genres",
        "platforms",
        "moods",
        "tags",
        "features"
    ];
    arrayFields.forEach((field) => {
        if (
            game[field] !== undefined &&
            !Array.isArray(game[field])
        ) {
            errors.push(`${field} должен быть массивом.`);
        }
    });
    if (
        game.release_year !== undefined &&
        game.release_year !== null &&
        (
            !Number.isInteger(Number(game.release_year)) ||
            Number(game.release_year) < 1970 ||
            Number(game.release_year) > 2100
        )
    ) {
        errors.push("Проверь год выхода игры.");
    }
    if (
        game.camera !== undefined &&
        !["first", "third"].includes(game.camera)
    ) {
        errors.push('camera должен быть "first" или "third".');
    }
    const normalized = {
        title: game.title?.trim(),
        slug: game.slug?.trim(),
        universe: game.universe?.trim(),
        release_year:
            game.release_year === undefined ||
            game.release_year === null ||
            game.release_year === ""
                ? null
                : Number(game.release_year),
        plot_summary: game.plot_summary ?? "",
        gameplay: game.gameplay ?? "",
        features: game.features ?? [],
        pc_min_requirements: game.pc_min_requirements ?? "",
        pc_recommended_requirements:
            game.pc_recommended_requirements ?? "",
        category: game.category?.trim(),
        image: game.image?.trim(),
        background_image: game.background_image ?? "",
        alt: game.alt?.trim(),
        description: game.description ?? "",
        url: game.url?.trim(),
        story: game.story === true || game.story === "story",
        modes: game.modes ?? [],
        genres: game.genres ?? [],
        platforms: game.platforms ?? [],
        camera: game.camera ?? "third",
        moods: game.moods ?? [],
        tags: game.tags ?? [],
        published: game.published !== false
    };
    return {
        game: errors.length === 0 ? normalized : null,
        errors
    };
}
function renderImportPreview(records) {
    importPreview.replaceChildren();
    const summary = document.createElement("p");
    const validCount = records.filter((record) => record.game).length;
    const invalidCount = records.length - validCount;
    summary.textContent =
        `Всего записей: ${records.length}. ` +
        `Готово к импорту: ${validCount}. ` +
        `С ошибками: ${invalidCount}.`;
    importPreview.append(summary);
    const list = document.createElement("ul");
    records.forEach((record, index) => {
        const item = document.createElement("li");
        const title = record.game?.title || `Запись ${index + 1}`;
        item.textContent = record.errors.length
            ? `✗ ${title}: ${record.errors.join(" ")}`
            : `✓ ${title}`;
        list.append(item);
    });
    importPreview.append(list);
    importButton.disabled = validCount === 0;
}
importFileInput.addEventListener("change", async () => {
    pendingImportGames = [];
    importFileErrors = [];
    importButton.disabled = true;
    showMessage(importMessage, "");
    const file = importFileInput.files[0];
    if (!file) {
        importPreview.replaceChildren();
        importPreview.textContent = "Файл не выбран.";
        return;
    }
    try {
        const content = await file.text();
        const parsed = JSON.parse(content);
        const games = Array.isArray(parsed) ? parsed : parsed.games;
        if (!Array.isArray(games) || games.length === 0) {
            throw new Error(
                "В файле должен быть непустой массив игр."
            );
        }
        const fileSlugs = new Set();
        const records = games.map((game, index) =>
            normalizeImportedGame(game, index, fileSlugs)
        );
        pendingImportGames = records
            .filter((record) => record.game)
            .map((record) => record.game);
        importFileErrors = records.filter(
            (record) => record.errors.length > 0
        );
        renderImportPreview(records);
    } catch (error) {
        pendingImportGames = [];
        importButton.disabled = true;
        importPreview.textContent =
            `Не удалось прочитать файл: ${error.message}`;
        showMessage(importMessage, "Проверь формат JSON.", true);
    }
});
importButton.addEventListener("click", async () => {
    if (pendingImportGames.length === 0) return;
    const skippedCount = importFileErrors.length;
    const confirmed = window.confirm(
        `Добавить игр: ${pendingImportGames.length}.\n` +
        `Пропустить записей с ошибками: ${skippedCount}.\n\n` +
        "Существующие игры изменены не будут. Продолжить?"
    );
    if (!confirmed) return;
    importButton.disabled = true;
    showMessage(importMessage, "Добавляем игры…");
    const { error } = await supabaseClient
        .from("games")
        .insert(pendingImportGames);
    if (error) {
        console.error("Ошибка массового импорта:", error);
        showMessage(
            importMessage,
            `Импорт не выполнен: ${error.message}`,
            true
        );
        importButton.disabled = false;
        return;
    }
    const importedCount = pendingImportGames.length;
    pendingImportGames = [];
    importFileErrors = [];
    importFileInput.value = "";
    importPreview.textContent = "Импорт завершён.";
    showMessage(
        importMessage,
        `Успешно добавлено игр: ${importedCount}.`
    );
    await loadGames();
});
clearImportButton.addEventListener("click", () => {
    pendingImportGames = [];
    importFileErrors = [];
    importFileInput.value = "";
    importButton.disabled = true;
    importPreview.textContent = "Сначала выбери JSON-файл.";
    showMessage(importMessage, "");
});
function renderGames(games) {
    adminGamesList.innerHTML = "";
    if (games.length === 0) {
        showMessage(
            gamesListMessage,
            adminGameSearch.value.trim()
                ? "По вашему запросу ничего не найдено."
                : "Игр пока нет."
        );
        return;
    }
    showMessage(gamesListMessage, "");
    games.forEach((game) => {
        const item = document.createElement("article");
        item.className = "admin-game-item";
        const info = document.createElement("div");
        info.className = "admin-game-item-info";
        const title = document.createElement("h3");
        title.textContent = game.title;
        const details = document.createElement("p");
        details.textContent =
            `${game.slug} · ${game.published ? "Опубликована" : "Черновик"}`;
        info.append(title, details);
        const actions = document.createElement("div");
        actions.className = "admin-game-item-actions";
        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "admin-small-button";
        editButton.textContent = "Редактировать";
        editButton.addEventListener("click", () => editGame(game));
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "admin-small-button";
        deleteButton.textContent = "Удалить";
        deleteButton.addEventListener("click", () => deleteGame(game));
        actions.append(editButton, deleteButton);
        item.append(info, actions);
        adminGamesList.append(item);
    });
}
function setCheckboxes(selector, selectedValues) {
    const container = document.querySelector(selector);
    const values = Array.isArray(selectedValues)
        ? selectedValues
        : [];
    container.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
        checkbox.checked = values.includes(checkbox.value);
    });
}
function editGame(game) {
    document.querySelector("#game-id").value = game.id;
    document.querySelector("#game-title").value = game.title ?? "";
    document.querySelector("#game-slug").value = game.slug ?? "";
    document.querySelector("#game-universe").value = game.universe ?? "";
    document.querySelector("#game-release-year").value =
        game.release_year ?? "";
    document.querySelector("#game-plot-summary").value =
        game.plot_summary ?? "";
    document.querySelector("#game-gameplay").value =
        game.gameplay ?? "";
    document.querySelector("#features").value =
        Array.isArray(game.features) ? game.features.join("\n") : "";
    document.querySelector("#game-pc-min").value =
        game.pc_min_requirements ?? "";
    document.querySelector("#game-pc-recommended").value =
        game.pc_recommended_requirements ?? "";
    document.querySelector("#game-category").value = game.category ?? "";
    document.querySelector("#game-image").value = game.image ?? "";
    document.querySelector("#game-background-image").value =
        game.background_image ?? "";
    document.querySelector("#game-alt").value = game.alt ?? "";
    document.querySelector("#game-description").value =
        game.description ?? "";
    document.querySelector("#game-url").value = game.url ?? "";
    document.querySelector("#game-story").value =
        game.story ? "story" : "open";
    setCheckboxes("#game-modes", game.modes);
    setCheckboxes("#game-genres", game.genres);
    setCheckboxes("#game-platforms", game.platforms);
    document.querySelector("#game-camera").value = game.camera ?? "";
    const legacyMoodMap = {
        dark: "dark-fantasy",
        emotional: "dramatic",
        calm: "contemplative",
        energetic: "adrenaline"
    };
    const currentMoods = (Array.isArray(game.moods) ? game.moods : [])
        .map((mood) => legacyMoodMap[mood] ?? mood);
    setCheckboxes("#game-moods", currentMoods);
    setCheckboxes("#game-tags", game.tags);
    document.querySelector("#game-published").checked =
        Boolean(game.published);
    document.querySelector("#save-game-button").textContent =
        "Сохранить изменения";
    document.querySelector("#cancel-edit-button").hidden = false;
    showMessage(gameFormMessage, "Редактирование: " + game.title);
    gameForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}
function getGameFormData() {
    const getSelectedValues = (selector) =>
        Array.from(
            document.querySelector(selector)
                .querySelectorAll('input[type="checkbox"]:checked')
        ).map((checkbox) => checkbox.value);
    return {
        title: document.querySelector("#game-title").value.trim(),
        slug: document.querySelector("#game-slug").value.trim(),
        universe: document.querySelector("#game-universe").value.trim(),
        release_year: document.querySelector("#game-release-year").value
            ? Number(document.querySelector("#game-release-year").value)
            : null,
        plot_summary: document.querySelector("#game-plot-summary").value.trim(),
        gameplay: document.querySelector("#game-gameplay").value.trim(),
        features: document.querySelector("#features").value
            .split("\n")
            .map(feature => feature.trim())
            .filter(feature => feature.length > 0),
        pc_min_requirements: document.querySelector("#game-pc-min").value.trim(),
        pc_recommended_requirements:
            document.querySelector("#game-pc-recommended").value.trim(),
        category: document.querySelector("#game-category").value,
        image: document.querySelector("#game-image").value.trim(),
        background_image: document
            .querySelector("#game-background-image")
            .value.trim(),
        alt: document.querySelector("#game-alt").value.trim(),
        description: document.querySelector("#game-description").value.trim(),
        url: document.querySelector("#game-url").value.trim(),
        story: document.querySelector("#game-story").value === "story",
        modes: getSelectedValues("#game-modes"),
        genres: getSelectedValues("#game-genres"),
        platforms: getSelectedValues("#game-platforms"),
        camera: document.querySelector("#game-camera").value,
        moods: getSelectedValues("#game-moods"),
        tags: getSelectedValues("#game-tags"),
        published: document.querySelector("#game-published").checked
    };
}
function resetGameForm() {
    gameForm.reset();
    document.querySelector("#game-id").value = "";
    document.querySelector("#save-game-button").textContent = "Добавить игру";
    document.querySelector("#cancel-edit-button").hidden = true;
    showMessage(gameFormMessage, "");
}
gameForm.addEventListener("submit", async (event) => {
    console.log("Форма сохранения запущена");
    event.preventDefault();
    const gameId = document.querySelector("#game-id").value;
    const gameData = getGameFormData();
    showMessage(gameFormMessage, "Сохраняем игру…");
    const request = gameId
        ? supabaseClient.from("games").update(gameData).eq("id", gameId)
        : supabaseClient.from("games").insert(gameData);
    const { error } = await request;
    if (error) {
        console.error("Ошибка сохранения игры:", error);
        showMessage(
            gameFormMessage,
            `Ошибка сохранения: ${error.message}`,
            true
        );
        return;
    }
    showMessage(
        gameFormMessage,
        gameId ? "Изменения сохранены." : "Игра добавлена."
    );
    resetGameForm();
    await loadGames();
});
async function deleteGame(game) {
    const confirmed = window.confirm(
        `Удалить игру «${game.title}»? Это действие нельзя отменить.`
    );
    if (!confirmed) return;
    const { error } = await supabaseClient
        .from("games")
        .delete()
        .eq("id", game.id);
    if (error) {
        showMessage(
            gamesListMessage,
            "Не удалось удалить игру. Проверь права доступа в Supabase.",
            true
        );
        return;
    }
    showMessage(gamesListMessage, "Игра удалена.");
    await loadGames();
}
document
    .querySelector("#cancel-edit-button")
    .addEventListener("click", resetGameForm);
async function loadPageSuggestions() {
    const urlInput = document.querySelector("#game-url");
    const datalist = document.querySelector("#game-url-suggestions");
    try {
        const response = await fetch(
            "https://api.github.com/repos/Molchankina/04-NEXUS/git/trees/main?recursive=1"
        );
        if (!response.ok) {
            throw new Error("Не удалось получить список страниц");
        }
        const data = await response.json();
        const pages = data.tree
            .filter((file) =>
                file.type === "blob" &&
                file.path.endsWith(".html") &&
                !["index.html", "catalog.html", "admin.html"].includes(file.path)
            )
            .map((file) => file.path)
            .sort();
        datalist.replaceChildren();
        pages.forEach((page) => {
            const option = document.createElement("option");
            option.value = page;
            datalist.append(option);
        });
        urlInput.placeholder = pages.length
            ? "Начни вводить название страницы"
            : "Например, stray/stray.html";
    } catch (error) {
        console.error("Ошибка загрузки страниц GitHub:", error);
        urlInput.placeholder = "Введи путь к HTML-странице вручную";
    }
}
function filterAdminGames() {
    const query = adminGameSearch.value
        .trim()
        .toLocaleLowerCase("ru");
    const filteredGames = allAdminGames.filter((game) => {
        const title = (game.title ?? "").toLocaleLowerCase("ru");
        const slug = (game.slug ?? "").toLocaleLowerCase("ru");
        const developer = (game.universe ?? "").toLocaleLowerCase("ru");
        return (
            title.includes(query) ||
            slug.includes(query) ||
            developer.includes(query)
        );
    });
    adminSearchClear.hidden = query.length === 0;
    adminSearchCount.textContent = query
        ? `Найдено игр: ${filteredGames.length} из ${allAdminGames.length}`
        : `Всего игр в списке: ${allAdminGames.length}`;
    renderGames(filteredGames);
}
adminGameSearch.addEventListener("input", filterAdminGames);
adminSearchClear.addEventListener("click", () => {
    adminGameSearch.value = "";
    filterAdminGames();
    adminGameSearch.focus();
});
loadPageSuggestions();
checkSession();