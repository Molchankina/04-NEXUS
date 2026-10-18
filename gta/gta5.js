document.addEventListener("DOMContentLoaded", () => {
    function scrollToInfo(element) {
        if (!element) return;
        if (window.matchMedia("(max-width: 600px)").matches) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "start"
            }); 
        }
    }
    const tabButtons = document.querySelectorAll("[data-tab]");
    const tabPanels = document.querySelectorAll("[data-panel]");
    const openMenuButton = document.querySelector("[data-open-menu]");
    const menuSection = document.querySelector("#game-menu");
    function openTab(tabName) {
        const targetPanel = document.querySelector(
            `[data-panel="${tabName}"]`
        );
        if (!targetPanel) return;
        tabPanels.forEach((panel) => {
            const isActive = panel.dataset.panel === tabName;
            panel.classList.toggle("is-active", isActive);
            panel.hidden = !isActive;
        });
        tabButtons.forEach((button) => {
            const isActive = button.dataset.tab === tabName;
            button.classList.toggle("is-active", isActive);
            if (button.matches("button")) {
                button.setAttribute("aria-selected", String(isActive));
            }
        });
    }
    tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (button.tagName === "A") return;
            openTab(button.dataset.tab);
        });
    });
    openMenuButton?.addEventListener("click", () => {
        menuSection?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
        openTab("characters");
    });
    const keyboardTabs = Array.from(
        document.querySelectorAll(".game-tab[data-tab]")
    );
    keyboardTabs.forEach((button, index) => {
        button.addEventListener("keydown", (event) => {
            if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
                return;
            }
            event.preventDefault();
            let nextIndex = index;
            if (event.key === "ArrowRight") {
                nextIndex = (index + 1) % keyboardTabs.length;
            }
            if (event.key === "ArrowLeft") {
                nextIndex = (index - 1 + keyboardTabs.length) % keyboardTabs.length;
            }
            if (event.key === "Home") {
                nextIndex = 0;
            }
            if (event.key === "End") {
                nextIndex = keyboardTabs.length - 1;
            }
            const nextButton = keyboardTabs[nextIndex];
            nextButton.focus();
            openTab(nextButton.dataset.tab);
        });
    });
    const characters = {
        michael: {
            name: "МАЙКЛ ДЕ САНТА",
            role: "THE MASTERmind / СТРАТЕГ",
            description:
                "Бывший профессиональный грабитель, который попытался оставить преступное прошлое позади. Комфортная жизнь в Лос-Сантосе не принесла ему покоя, а старые связи снова втягивают его в опасные дела.",
            tags: ["ОПЫТ", "ОГРАБЛЕНИЯ", "СЕМЬЯ"],
            color: "var(--michael)"
        },
        trevor: {
            name: "ТРЕВОР ФИЛИПС",
            role: "THE WILDCARD / ХАОС",
            description:
                "Непредсказуемый пилот и преступник, живущий по собственным правилам. Его вспыльчивость и готовность идти до конца делают любую ситуацию опасной — и для врагов, и для союзников.",
            tags: ["ХАОС", "АВИАЦИЯ", "РИСК"],
            color: "var(--trevor)"
        },
        franklin: {
            name: "ФРАНКЛИН КЛИНТОН",
            role: "THE PRODIGY / АМБИЦИИ",
            description:
                "Молодой и целеустремлённый житель Южного Лос-Сантоса. Он хочет выбраться из привычной среды и добиться большего, а встреча с Майклом открывает перед ним новый путь.",
            tags: ["ВОЖДЕНИЕ", "АМБИЦИИ", "РОСТ"],
            color: "var(--franklin)"
        }
    };
    const characterCards = document.querySelectorAll("[data-character]");
    const dossier = document.querySelector("#character-dossier");
    const dossierNumber = document.querySelector("#dossier-number");
    const dossierName = document.querySelector("#dossier-name");
    const dossierRole = document.querySelector("#dossier-role");
    const dossierDescription = document.querySelector("#dossier-description");
    const dossierTags = document.querySelector("#dossier-tags");
    const dossierClose = document.querySelector(".dossier-close");
    function closeDossier() {
        if (dossier) dossier.hidden = true;
        characterCards.forEach((card) => {
            card.classList.remove("is-selected");
            card.setAttribute("aria-pressed", "false");
        });
    }
    function openDossier(characterId, card) {
        const character = characters[characterId];
        if (!character || !dossier) return;
        const alreadySelected = card.classList.contains("is-selected");
        closeDossier();
        if (alreadySelected) return;
        card.classList.add("is-selected");
        card.setAttribute("aria-pressed", "true");
        dossier.style.setProperty("--dossier-color", character.color);
        dossierNumber.textContent = character.number;
        dossierName.textContent = character.name;
        dossierRole.textContent = character.role;
        dossierDescription.textContent = character.description;
        dossierTags.replaceChildren();
        character.tags.forEach((tag) => {
            const tagElement = document.createElement("span");
            tagElement.textContent = tag;
            dossierTags.append(tagElement);
        });
        dossier.hidden = false;
        scrollToInfo(dossier);
    }
    characterCards.forEach((card) => {
        card.addEventListener("click", () => {
            openDossier(card.dataset.character, card);
        });
    });
    dossierClose?.addEventListener("click", closeDossier);
    const locations = {
        vinewood: {
            type: "DISTRICT / VINEWOOD",
            name: "VINEWOOD",
            image: "images/vinewood.jpg",
            description:
                "Знаменитый район на холмах с роскошными домами, панорамными видами и атмосферой голливудской жизни. Здесь особенно заметен контраст между богатством и остальным городом.",
            owner: "МАЙКЛ",
            character: "michael"
        },
        forum: {
            type: "DISTRICT / STRAWBERRY",
            name: "STRAWBERRY",
            image: "images/strawberry.jpg",
            description:
                "Южная часть города с оживлёнными улицами и знакомыми Франклину районами. Здесь чувствуется совсем другой ритм жизни, чем в богатых кварталах на севере.",
            owner: "ФРАНКЛИН",
            character: "franklin"
        },
        sandy: {
            type: "REGION / DESERT",
            name: "SANDY SHORES",
            image: "images/Sandy Shores.jpg",
            description:
                "Пыльный посёлок у пустыни, где жизнь течёт по собственным правилам. Это подходящее место для Тревора — вдали от прилизанного и предсказуемого городского мира.",
            owner: "ТРЕВОР",
            character: "trevor"
        },
        studio: {
            type: "LOCATION / ROCKFORD HILLS",
            name: "PONSONBYS",
            image: "images/ponsonbys.jpg",
            description:
                "Майкл туда заглядывает, чтобы соответствовать статусу — это подчёркивает его желание выглядеть как часть элиты Лос‑Сантоса.",
            owner: "МАЙКЛ",
            character: "michael"
        },
        customs: {
            type: "LOCATION / VEHICLES",
            name: "Premium Deluxe Motorsport",
            image: "images/premium Deluxe Motorsport.jpg",
            description:
                "Здесь завязывается сотрудничество, которое задаёт вектор дальнейших событий. Место становится отправной точкой для череды решений, серьёзно влияющих на путь героя.",
            owner: "ФРАНКЛИН",
            character: "franklin"
        },
        airfield: {
            type: "LOCATION / AIRFIELD",
            name: "Sandy Shores Airfield",
            image: "images/Sandy-shores-airfield.jpg",
            description:
                "Удалённая взлётная полоса в пустынном регионе. Она отражает тягу Тревора к авиации и его жизнь вдали от привычных городских правил.",
            owner: "ТРЕВОР",
            character: "trevor"
        }
    };
    const mapMarkers = document.querySelectorAll(".map-marker");
    const legendButtons = document.querySelectorAll("[data-filter]");
    const locationCode = document.querySelector("#location-code");
    const locationType = document.querySelector("#location-type");
    const locationName = document.querySelector("#location-name");
    const locationDescription = document.querySelector("#location-description");
    const locationOwner = document.querySelector("#location-owner");
    const locationImage = document.querySelector("#location-image")
    let activeLocation = null;
    let activeFilter = "all";
    function selectLocation(locationId, marker) {
        const location = locations[locationId];
        if (!location) return;
        activeLocation = locationId;
        mapMarkers.forEach((item) => {
            item.classList.toggle("is-selected", item === marker);
        });
        locationCode.textContent = location.code;
        locationType.textContent = location.type;
        locationName.textContent = location.name;
        locationDescription.textContent = location.description;
        locationOwner.textContent = location.owner;
        if (locationImage && location.image){
            locationImage.style.backgroundImage =
                `url("${location.image}")`;
            locationImage.hidden = false;
        }
        locationOwner.style.color =
            `var(--${location.character})`;
        scrollToInfo(document.querySelector("#location-card"));
    }
    mapMarkers.forEach((marker) => {
        marker.addEventListener("click", () => {
            selectLocation(marker.dataset.location, marker);
        });
    });
    function filterLocations(characterId) {
        activeFilter = characterId;
        legendButtons.forEach((button) => {
            button.classList.toggle(
                "is-active",
                button.dataset.filter === characterId
            );
        });
        mapMarkers.forEach((marker) => {
            const matches =
                characterId === "all" ||
                marker.dataset.character === characterId;
            marker.classList.toggle("is-filtered", !matches);
        });
        const selectedMarker = Array.from(mapMarkers).find(
            (marker) => marker.dataset.location === activeLocation
        );
        if (
            selectedMarker &&
            characterId !== "all" &&
            selectedMarker.dataset.character !== characterId
        ) {
            mapMarkers.forEach((marker) => {
                marker.classList.remove("is-selected");
            });
            activeLocation = null;
            locationCode.textContent = "LS / MAP";
            locationType.textContent = "LOCATION DATABASE";
            locationName.textContent = "ВЫБЕРИ ЛОКАЦИЮ";
            locationImage.hidden = true;
            locationImage.style.backgroundImage = "none";
            locationDescription.textContent =
                "Выбери подходящую цветную отметку на карте, чтобы открыть описание места.";
            locationOwner.textContent = "—";
            locationOwner.style.color = "";
        }
    }
    legendButtons.forEach((button) => {
        button.addEventListener("click", () => {
            filterLocations(button.dataset.filter);
        });
    });
    openTab("characters");
});