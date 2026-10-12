const slider = document.querySelector(".games-slider");
const cards = [...document.querySelectorAll(".game-card")];
const prevButton = document.querySelector("#sliderPrev");
const nextButton = document.querySelector("#sliderNext");

let activeIndex = 0;
let touchStartX = 0;

function renderCarousel() {
const step = Math.min(slider.clientWidth * 0.29, 285);

cards.forEach((card, index) => {
const total = cards.length;

// Находим кратчайшее расстояние по кругу.
let offset = (index - activeIndex + total) % total;

if (offset > total / 2) {
offset -= total;
}

const distance = Math.abs(offset);
const isActive = offset === 0;
const isVisible = distance <= 2;

const scale = isActive
? 1
: distance === 1
? 0.82
: 0.64;

const opacity = isActive
? 1
: distance === 1
? 0.85
: 0.48;

card.classList.toggle("is-active", isActive);
card.classList.toggle("is-side", !isActive);
card.classList.toggle("is-hidden", !isVisible);

card.style.zIndex = String(10 - distance);
card.style.opacity = isVisible ? opacity : 0;
card.style.transform =
`translateX(-50%) translateX(${offset * step}px) scale(${scale})`;

card.setAttribute("aria-current", isActive ? "true" : "false");
card.setAttribute("tabindex", isVisible ? "0" : "-1");
});

const currentNumber = String(activeIndex + 1).padStart(2, "0");
const totalNumber = String(cards.length).padStart(2, "0");

const counter = document.querySelector(".slider-footer > span:first-child");

if (counter) {
counter.textContent = `${currentNumber} — ${totalNumber} / WORLDS`;
}

const progress = document.querySelector(".slider-progress");

if (progress) {
progress.style.width = `${100 / cards.length}%`;
progress.style.left = `${(activeIndex / cards.length) * 100}%`;
}
}

function nextGame() {
activeIndex = (activeIndex + 1) % cards.length;
renderCarousel();
}

function prevGame() {
activeIndex = (activeIndex - 1 + cards.length) % cards.length;
renderCarousel();
}

nextButton.addEventListener("click", nextGame);
prevButton.addEventListener("click", prevGame);

slider.addEventListener("touchstart", (event) => {
touchStartX = event.changedTouches[0].clientX;
}, { passive: true });

slider.addEventListener("touchend", (event) => {
const touchEndX = event.changedTouches[0].clientX;
const difference = touchEndX - touchStartX;

if (Math.abs(difference) < 40) return;

if (difference < 0) {
nextGame();
} else {
prevGame();
}
}, { passive: true });

cards.forEach((card, index) => {
    card.addEventListener("click", (event) => {
        if (index === activeIndex) {
            return
        }
        event.preventDefault();
        activeIndex = index;
        renderCarousel()
    })
})
document.addEventListener("keydown", (event) => {
if (event.key === "ArrowRight") nextGame();
if (event.key === "ArrowLeft") prevGame();
});

window.addEventListener("resize", renderCarousel);

renderCarousel();