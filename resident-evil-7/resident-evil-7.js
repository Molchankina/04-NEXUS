const menuToggle = document.querySelector("#menu-toggle");
const mainNav = document.querySelector("#main-nav");
if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
        const isOpen =
            menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute(
            "aria-expanded",
            String(!isOpen)
        );
        mainNav.classList.toggle("is-open", !isOpen);
        document.body.classList.toggle("menu-open", !isOpen);
    });
    mainNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            menuToggle.setAttribute("aria-expanded", "false");
            mainNav.classList.remove("is-open");
            document.body.classList.remove("menu-open");
        });
    });
}
document.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => {
        image.classList.add("image-missing");
        image.alt = "Изображение можно добавить в папку images";
    });
});
const memoryScene = document.getElementById("memoryScene");
const memoryRoomImage = document.getElementById("memoryRoomImage");
const memoryCassette = document.getElementById("memoryCassette");
const memoryVideo = document.getElementById("memoryVideo");
const memoryHint = document.getElementById("memoryHint");
const memoryFinished = document.getElementById("memoryFinished");
const memoryNoteButton = document.getElementById("memoryNoteButton");
const memoryNoteOverlay = document.getElementById("memoryNoteOverlay");
const memoryNoteClose = document.getElementById("memoryNoteClose");
let memoryStarted = false;
if (memoryScene && memoryRoomImage && memoryCassette && memoryVideo) {
    memoryCassette.addEventListener("click", async () => {
        if (memoryStarted) return;
        memoryStarted = true;
        memoryCassette.classList.add("is-inserted");
        memoryHint?.classList.add("is-hidden");
        memoryRoomImage.src = "images/re7-room-static.jpg";
        setTimeout(async () => {
            memoryRoomImage.src = "images/re7-room-video.jpg";
            memoryRoomImage.src = "images/re7-room-video.jpg";
            memoryVideo.classList.add("is-playing");
            try {
                await memoryVideo.play();
            } catch (error) {
                console.error("Не удалось воспроизвести VHS-запись:", error);
                memoryHint.textContent = "НЕ УДАЛОСЬ ЗАПУСТИТЬ ЗАПИСЬ";
                memoryHint.classList.remove("is-hidden");
            }
        }, 1400);
    });
    memoryVideo.addEventListener("ended", () => {
        memoryVideo.classList.remove("is-playing");
        memoryFinished.hidden = false;
    });
    memoryNoteButton?.addEventListener("click", () => {
        memoryNoteOverlay.hidden = false;
    });
    memoryNoteClose?.addEventListener("click", () => {
        memoryNoteOverlay.hidden = true;
    });
    memoryNoteOverlay?.addEventListener("click", (event) => {
        if (event.target === memoryNoteOverlay) {
            memoryNoteOverlay.hidden = true;
        }
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && memoryNoteOverlay) {
            memoryNoteOverlay.hidden = true;
        }
    });
}