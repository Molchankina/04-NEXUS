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
});
