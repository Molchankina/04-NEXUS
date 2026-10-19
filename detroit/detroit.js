document.addEventListener("DOMContentLoaded", () => {
    const activationScreen = document.querySelector("#activation-screen");
    const diodeTrigger = document.querySelector("#diode-trigger");
    const activationHint = document.querySelector("#activation-hint");
    const systemPrompt = document.querySelector("#system-prompt");
    const loadingInterface = document.querySelector("#loading-interface");
    const loadingStatus = document.querySelector("#loading-status");
    const loadingPercent = document.querySelector("#loading-percent");
    const loadingFill = document.querySelector("#loading-fill");
    const loadingTrack = document.querySelector("#loading-track");
    const systemContent = document.querySelector("#system-content");
    if (!activationScreen || !diodeTrigger || !systemContent) return;
    const statusMessages = [
        { at: 0, text: "ИНИЦИАЛИЗАЦИЯ СИСТЕМЫ" },
        { at: 22, text: "ПОДКЛЮЧЕНИЕ К NEXUS" },
        { at: 48, text: "ЗАГРУЗКА БАЗЫ ДАННЫХ" },
        { at: 73, text: "СИНХРОНИЗАЦИЯ ИНТЕРФЕЙСА" },
        { at: 92, text: "ЗАВЕРШЕНИЕ АКТИВАЦИИ" }
    ];
    let started = false;
    function startActivation() {
        if (started) return;
        started = true;
        activationScreen.classList.add("is-loading");
        activationHint.textContent = "";
        systemPrompt.textContent = "СИСТЕМА ЗАПУСКАЕТСЯ";
        loadingInterface.setAttribute("aria-hidden", "false");
        systemContent.setAttribute("aria-hidden", "false");
        document.body.classList.add("system-booting");
        const duration = 6200;
        const startTime = performance.now();
        let previousStatus = "";
        function updateProgress(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const percent = Math.round(progress * 100);
            loadingPercent.textContent = `${percent}%`;
            loadingFill.style.width = `${percent}%`;
            loadingTrack.setAttribute("aria-valuenow", String(percent));
            const currentStatus = [...statusMessages]
                .reverse()
                .find((item) => percent >= item.at);
            if (currentStatus && currentStatus.text !== previousStatus) {
                loadingStatus.textContent = currentStatus.text;
                previousStatus = currentStatus.text;
            }
            if (progress < 1) {
                requestAnimationFrame(updateProgress);
                return;
            }
            loadingStatus.textContent = "СИСТЕМА АКТИВИРОВАНА";
            loadingPercent.textContent = "100%";
            activationScreen.classList.add("is-complete");
            document.body.classList.add("system-ready");
            activationScreen.setAttribute("aria-hidden", "true");
        }
        requestAnimationFrame(updateProgress);
    }
    diodeTrigger.addEventListener("click", startActivation);
    diodeTrigger.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            startActivation();
        }
    });
    const dossierDialog = document.querySelector("#dossier-dialog");
    const characterCards = document.querySelectorAll(".character-card");
    const confirmStage = document.querySelector("#dossier-confirm");
    const loadingStage = document.querySelector("#dossier-loading");
    const resultStage = document.querySelector("#dossier-result");
    const yesButton = document.querySelector("#dossier-yes");
    const noButton = document.querySelector("#dossier-no");
    const closeDossierButton = document.querySelector("#dossier-close");
    const progressFill = document.querySelector("#dossier-progress-fill");
    const progressPercent = document.querySelector("#dossier-progress-percent");
    const progressTrack = document.querySelector("#dossier-progress-track");
    const loadingName = document.querySelector("#dossier-loading-name");
    const loadingStatusText = document.querySelector("#dossier-loading-status");
    const statusText = document.querySelector("#dossier-status-text");
    const statusLight = document.querySelector("#dossier-status-light");
    const dossierCounter = document.querySelector("#dossier-counter");
    const dossierName = document.querySelector("#dossier-name");
    const dossierModel = document.querySelector("#dossier-model");
    const dossierRole = document.querySelector("#dossier-role");
    const dossierDescription = document.querySelector("#dossier-description");
    const dossierTraits = document.querySelector("#dossier-traits");
    const dossierSystemNote = document.querySelector("#dossier-system-note");
    const dossierData = {
        connor: {
            name: "КОННОР",
            model: "MODEL RK800",
            role: "АНДРОИД-ИНВЕСТИГАТОР / CYBERLIFE",
            description:
                "Специализированная модель, созданная для помощи в расследованиях с участием андроидов. Анализирует улики, сопоставляет данные и реконструирует события.",
            traits:
                "Логическое мышление · Точность · Анализ поведения · Работа с доказательствами",
            systemNote:
                "Модель ориентирована на выполнение задач и поддержку следственных операций."
        },
        kara: {
            name: "КАРА",
            model: "MODEL AX400",
            role: "ДОМАШНИЙ АНДРОИД / CYBERLIFE",
            description:
                "Модель для ведения домашнего хозяйства, общения и повседневной помощи человеку. Её система рассчитана на выполнение бытовых задач и взаимодействие с окружающими.",
            traits:
                "Забота · Адаптация · Внимательность · Повседневная помощь",
            systemNote:
                "Модель предназначена для домашнего использования и взаимодействия с людьми."
        },
        markus: {
            name: "МАРКУС",
            model: "MODEL RK200",
            role: "ЛИЧНЫЙ ПОМОЩНИК / CYBERLIFE",
            description:
                "Продвинутая модель, способная помогать в повседневных делах и заниматься творчеством. Отличается высокой точностью движений и адаптацией к поставленным задачам.",
            traits:
                "Творчество · Обучение · Точность движений · Адаптивность",
            systemNote:
                "Модель сочетает практические функции с возможностями творческой деятельности."
        }
    };
    let selectedCharacter = null;
    const decodedDossiers = new Set();
    function showDossierStage(stage) {
        confirmStage.hidden = stage !== "confirm";
        loadingStage.hidden = stage !== "loading";
        resultStage.hidden = stage !== "result";
    }
    function updateDossierStatus() {
        const count = decodedDossiers.size;
        dossierCounter.textContent = `${count} / 3`;
        statusLight.classList.toggle("status-light--locked", count === 0);
        if (count === 0) {
            statusText.textContent = "ДОСЬЕ ЗАШИФРОВАНЫ";
        } else if (count < 3) {
            statusText.textContent = "ЧАСТЬ ДОСЬЕ РАСШИФРОВАНА";
        } else {
            statusText.textContent = "ДОСЬЕ РАСШИФРОВАНЫ";
        }
    }
    function openDossierConfirmation(characterId) {
        if (!dossierData[characterId]) return;
        selectedCharacter = characterId;
        showDossierStage("confirm");
        dossierDialog.showModal();
    }
    function activateDossier() {
        const dossier = dossierData[selectedCharacter];
        if (!dossier) return;
        showDossierStage("loading");
        loadingName.textContent = `ФАЙЛ: ${dossier.model}`;
        loadingStatusText.textContent = "ПРОВЕРКА ДОСТУПА";
        progressFill.style.width = "0%";
        progressPercent.textContent = "0%";
        progressTrack.setAttribute("aria-valuenow", "0");
        const duration = 3200;
        const startTime = performance.now();
        function updateDossierProgress(now) {
            if (!dossierDialog.open || loadingStage.hidden) return;
            const progress = Math.min((now - startTime) / duration, 1);
            const percent = Math.round(progress * 100);
            progressFill.style.width = `${percent}%`;
            progressPercent.textContent = `${percent}%`;
            progressTrack.setAttribute("aria-valuenow", String(percent));
            if (percent < 35) {
                loadingStatusText.textContent = "ПРОВЕРКА ДОСТУПА";
            } else if (percent < 70) {
                loadingStatusText.textContent = "РАСШИФРОВКА ДАННЫХ";
            } else if (percent < 100) {
                loadingStatusText.textContent = "СИНХРОНИЗАЦИЯ ФАЙЛА";
            }
            if (progress < 1) {
                requestAnimationFrame(updateDossierProgress);
                return;
            }
            loadingStatusText.textContent = "ДОСТУП РАЗРЕШЁН";
            dossierName.textContent = dossier.name;
            dossierModel.textContent = dossier.model;
            dossierRole.textContent = dossier.role;
            dossierDescription.textContent = dossier.description;
            dossierTraits.textContent = dossier.traits;
            dossierSystemNote.textContent = dossier.systemNote;
            decodedDossiers.add(selectedCharacter);
            updateDossierStatus();
            showDossierStage("result");
        }
        requestAnimationFrame(updateDossierProgress);
    }
    characterCards.forEach((card) => {
        card.addEventListener("click", () => {
            openDossierConfirmation(card.dataset.character);
        });
        card.addEventListener("keydown", (event) => {
            if (event.target !== card) return;
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openDossierConfirmation(card.dataset.character);
            }
        });
    });
    yesButton.addEventListener("click", activateDossier);
    noButton.addEventListener("click", () => {
        dossierDialog.close();
    });
    closeDossierButton.addEventListener("click", () => {
        dossierDialog.close();
    });
    dossierDialog.addEventListener("close", () => {
        selectedCharacter = null;
        showDossierStage("confirm");
    });
    updateDossierStatus();
});
