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
const totalGames = document.querySelector("#total-games");
const publishedGames = document.querySelector("#published-games");
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
    renderGames(data);
}
function renderGames(games) {
    adminGamesList.innerHTML = "";
    if (games.length === 0) {
        showMessage(gamesListMessage, "Игр пока нет.");
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
    document.querySelector("#game-category").value = game.category ?? "";
    document.querySelector("#game-image").value = game.image ?? "";
    document.querySelector("#game-alt").value = game.alt ?? "";
    document.querySelector("#game-url").value = game.url ?? "";
    document.querySelector("#game-story").value =
        game.story ? "story" : "open";
    setCheckboxes("#game-modes", game.modes);
    setCheckboxes("#game-genres", game.genres);
    document.querySelector("#game-camera").value = game.camera ?? "";
    setCheckboxes("#game-moods", game.moods);
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
        category: document.querySelector("#game-category").value,
        image: document.querySelector("#game-image").value.trim(),
        alt: document.querySelector("#game-alt").value.trim(),
        url: document.querySelector("#game-url").value.trim(),
        story: document.querySelector("#game-story").value === "story",
        modes: getSelectedValues("#game-modes"),
        genres: getSelectedValues("#game-genres"),
        camera: document.querySelector("#game-camera").value,
        moods: splitList("#game-moods"),
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
    event.preventDefault();
    const gameId = document.querySelector("#game-id").value;
    const gameData = getGameFormData();
    showMessage(gameFormMessage, "Сохраняем игру…");
    const request = gameId
        ? supabaseClient.from("games").update(gameData).eq("id", gameId)
        : supabaseClient.from("games").insert(gameData);
    const { error } = await request;
    if (error) {
        showMessage(
            gameFormMessage,
            "Не удалось сохранить игру. Проверь обязательные поля и права доступа.",
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
loadPageSuggestions();
checkSession();