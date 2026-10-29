const routeNotes = [
    {
        kicker: "FIELD NOTE / 01",
        title: "Город за стеной",
        text: "Карантинная зона обещает защиту, но жизнь внутри неё подчинена строгим правилам и постоянному дефициту. За стеной начинается территория, где придётся рассчитывать на собственные решения."
    },
    {
        kicker: "FIELD NOTE / 02",
        title: "Природа возвращает своё",
        text: "Там, где раньше проходили дороги и стояли дома, теперь растут деревья и трава. Окружение хранит следы прежней жизни — нужно лишь остановиться и внимательно посмотреть."
    },
    {
        kicker: "FIELD NOTE / 03",
        title: "Тишина не означает безопасность",
        text: "Пустое помещение может скрывать полезные припасы, следы недавнего присутствия или опасность. Перед тем как двигаться дальше, оцени выходы, укрытия и то, что слышно вокруг."
    },
    {
        kicker: "FIELD NOTE / 04",
        title: "Дальше — только вместе",
        text: "Путешествие проверяет не только выносливость, но и способность доверять другому человеку. Иногда поддержка напарника важнее найденного снаряжения."
    }
];

const inventoryData = {
    bandage: {
        title: "Бинты",
        description: "Чистая ткань для первой помощи. В полевых условиях медицинские запасы ценны, поэтому тратить их стоит обдуманно."
    },
    scissors: {
        title: "Ножницы",
        description: "Небольшой инструмент, который может пригодиться при работе с материалами. Перед использованием оцени состояние и безопасность найденных вещей."
    },
    rag: {
        title: "Кусок ткани",
        description: "Простой материал, который легко недооценить. В мире с ограниченными запасами даже небольшая вещь может оказаться полезной."
    },
    alcohol: {
        title: "Спирт",
        description: "Расходный материал из найденных запасов. В игровом инвентаре он нужен для некоторых рецептов; это описание относится только к механикам игры."
    }
};

const selectedItems = new Set();
const inspectedItems = new Set();

function setText(selector, value) {
    const element = document.querySelector(selector);
    if (element && value !== null && value !== undefined && String(value).trim()) {
        element.textContent = value;
    }
}

function renderChips(selector, values, labels = {}) {
    const container = document.querySelector(selector);
    if (!container || !Array.isArray(values) || values.length === 0) return;

    container.replaceChildren();
    values.forEach((value) => {
        const chip = document.createElement("span");
        chip.textContent = labels[value] || value;
        container.append(chip);
    });
}

function renderFeatures(features) {
    if (!Array.isArray(features) || features.length === 0) return;

    const container = document.querySelector("#game-features");
    if (!container) return;

    container.replaceChildren();
    features.forEach((feature, index) => {
        const row = document.createElement("article");
        row.className = "feature-row";

        const number = document.createElement("span");
        number.textContent = String(index + 1).padStart(2, "0");

        const title = document.createElement("h3");
        title.textContent = typeof feature === "string" ? feature : feature.title || "Особенность";

        const description = document.createElement("p");
        description.textContent = typeof feature === "string"
            ? "Особенность игрового мира и опыта прохождения."
            : feature.description || "";

        row.append(number, title, description);
        container.append(row);
    });
}

async function loadGameData() {
    const client = window.supabase;
    if (!client || typeof client.from !== "function") return;

    try {
        const params = new URLSearchParams(window.location.search);
        const slug = params.get("slug") || "tloe1";
        const { data: game, error } = await client
            .from("games")
            .select("*")
            .eq("slug", slug)
            .eq("published", true)
            .maybeSingle();

        if (error) throw error;
        if (!game) return; // Оставляем встроенный контент страницы как резервный вариант.

        document.title = `${game.title || "The Last of Us Part I"} — NEXUS`;
        setText("#game-developer", game.universe);
        setText("#game-year", game.release_year);
        setText("#info-year", game.release_year);
        setText("#info-developer", game.universe);
        setText("#game-description", game.description);
        setText("#game-plot", game.plot_summary);
        setText("#game-gameplay", game.gameplay);
        setText("#game-minimum", game.pc_min_requirements);
        setText("#game-recommended", game.pc_recommended_requirements);
        renderChips("#game-genres", game.genres);
        renderChips("#game-modes", game.modes);
        renderChips("#game-platforms", game.platforms);
        renderFeatures(game.features);

        const backgroundUrl = game.background_image || game.image;
        if (backgroundUrl) {
            document.querySelector("#hero-background").style.backgroundImage =
                `linear-gradient(90deg, rgba(13, 16, 13, .78), rgba(13, 16, 13, .12)), url("${backgroundUrl.replace(/["\\\n\r]/g, "")}")`;
        }
    } catch (error) {
        console.warn("Не удалось загрузить данные игры из Supabase. Используется встроенный текст страницы.", error);
    }
}

function initRouteInteractions() {
    const detail = document.querySelector("#route-detail");
    const closeButton = document.querySelector("#route-detail-close");

    document.querySelectorAll("[data-open-route]").forEach((button) => {
        button.addEventListener("click", () => {
            const index = Number(button.dataset.openRoute);
            const note = routeNotes[index];
            if (!note) return;

            setText("#route-detail-kicker", note.kicker);
            setText("#route-detail-title", note.title);
            setText("#route-detail-text", note.text);
            detail.hidden = false;
            detail.scrollIntoView({ behavior: "smooth", block: "center" });

            document.querySelectorAll("[data-open-route]").forEach((otherButton) => {
                otherButton.setAttribute("aria-expanded", String(otherButton === button));
            });
        });
    });

    closeButton.addEventListener("click", () => {
        detail.hidden = true;
        document.querySelectorAll("[data-open-route]").forEach((button) => {
            button.setAttribute("aria-expanded", "false");
        });
    });

    // Прорисовка линии маршрута по мере прокрутки.
    const routeSection = document.querySelector(".route-map");
    const routeLine = document.querySelector(".route-line-main");
    if (routeSection && routeLine && "IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    routeLine.classList.add("is-visible");
                }
            });
        }, { threshold: 0.05 });
        observer.observe(routeSection);
    } else if (routeLine) {
        routeLine.classList.add("is-visible");
    }

    // Точки маршрута подсвечиваются, когда соответствующий эпизод входит в экран.
    if ("IntersectionObserver" in window) {
        const stopObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) entry.target.classList.add("is-active");
            });
        }, { threshold: 0.25 });
        document.querySelectorAll(".route-stop").forEach((stop) => stopObserver.observe(stop));
    }
}

function initBackpack() {
    const buttons = [...document.querySelectorAll(".inventory-item")];
    const countLabel = document.querySelector("#inventory-count");
    const craftResult = document.querySelector("#craft-result");

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const itemId = button.dataset.item;
            const item = inventoryData[itemId];
            if (!item) return;

            inspectedItems.add(itemId);
            countLabel.textContent = `${inspectedItems.size} / ${buttons.length} изучено`;
            setText("#item-title", item.title);
            setText("#item-description", item.description);

            const isSelected = selectedItems.has(itemId);
            if (isSelected) {
                selectedItems.delete(itemId);
            } else {
                selectedItems.add(itemId);
            }
            button.classList.toggle("is-selected", selectedItems.has(itemId));
            button.setAttribute("aria-pressed", String(selectedItems.has(itemId)));
            craftResult.textContent = "";
        });
    });

    document.querySelector("#craft-button").addEventListener("click", () => {
        const hasBandage = selectedItems.has("bandage");
        const hasAlcohol = selectedItems.has("alcohol");

        if (hasBandage && hasAlcohol) {
            craftResult.textContent = "Комплект собран. В игровом инвентаре есть выбранные компоненты.";
            craftResult.classList.add("is-success");
        } else {
            craftResult.textContent = "Не хватает предметов. Выбери бинты и спирт, затем проверь комплект ещё раз.";
            craftResult.classList.remove("is-success");
        }
    });

    document.querySelector("#inventory-reset").addEventListener("click", () => {
        selectedItems.clear();
        inspectedItems.clear();
        buttons.forEach((button) => {
            button.classList.remove("is-selected");
            button.setAttribute("aria-pressed", "false");
        });
        countLabel.textContent = `0 / ${buttons.length} изучено`;
        setText("#item-title", "Выбери предмет");
        setText("#item-description", "Вещи в рюкзаке могут пригодиться позже. Нажми на любой предмет, чтобы прочитать полевую заметку.");
        craftResult.textContent = "";
        craftResult.classList.remove("is-success");
    });
}

function initScrollEffects() {
    const revealElements = document.querySelectorAll(
        ".section-heading, .story-image, .story-copy, .mechanic-card, .feature-row, .requirement-card, .backpack-visual, .inventory-panel"
    );

    if (!("IntersectionObserver" in window)) {
        revealElements.forEach((element) => element.classList.add("is-revealed"));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-revealed");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealElements.forEach((element) => {
        element.classList.add("reveal-on-scroll");
        observer.observe(element);
    });
}

loadGameData();
initRouteInteractions();
initBackpack();
initScrollEffects();
