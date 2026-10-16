const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.12,
    }
);
revealElements.forEach((element) => {
    revealObserver.observe(element);
});
/* 2. МОБИЛЬНОЕ МЕНЮ */
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".navigation");
const navigationLinks = document.querySelectorAll(".navigation a");
function closeMenu() {
    navigation.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Открыть меню");
}
menuToggle.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Закрыть меню" : "Открыть меню"
    );
});
navigationLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
});
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
    }
});
window.addEventListener("resize", () => {
    if (window.innerWidth > 600) {
        closeMenu();
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const b12 = document.querySelector("#b12-follower");
    if (!b12) {
        console.warn("B-12: изображение или HTML-элемент не найден.");
        return;
    }
    /*
    УКАЖИ СВОИ СЕКЦИИ НИЖЕ.

    Город: #world
    История B-12: .companion-section

    Если у твоих секций другие названия,
    замени селекторы на реальные.
    */

    const followSections = [
        document.querySelector("#world"),
        document.querySelector(".companion-section")
    ].filter(Boolean);
    const citySection = document.querySelector("#world");
    const storySection = document.querySelector(".companion-section");
    const isMobile = window.matchMedia(
        "(max-width: 900px), (pointer: coarse)"
    ).matches;
    // На телефонах и планшетах дрон просто висит в углу.
    if (isMobile) {
        return;
    }
    let activeSections = new Set();
    let targetX = window.innerWidth - 90;
    let targetY = window.innerHeight - 90;
    // Положение дрона относительно курсора.
    window.addEventListener("pointermove", (event) => {
        targetX = event.clientX + 65;
        targetY = event.clientY + 35;
        // Не даём дрону выходить за границы экрана.
        const halfWidth = b12.offsetWidth / 2;
        const halfHeight = b12.offsetHeight / 2;
        targetX = Math.max(
            halfWidth + 8,
            Math.min(window.innerWidth - halfWidth - 8, targetX)
        );
        targetY = Math.max(
            halfHeight + 8,
            Math.min(window.innerHeight - halfHeight - 8, targetY)
        );
        if (b12.classList.contains("is-following")) {
            b12.style.setProperty("--b12-x", `${targetX}px`);
            b12.style.setProperty("--b12-y", `${targetY}px`);
        }
    });
    function updateB12() {
        const shouldFollow = activeSections.size > 0;
        b12.classList.toggle("is-following", shouldFollow);
        // Усиливаем свечение только в истории B-12.
        b12.classList.toggle(
            "is-charged",
            activeSections.has(storySection)
        );
        if (shouldFollow) {
            b12.style.setProperty("--b12-x", `${targetX}px`);
            b12.style.setProperty("--b12-y", `${targetY}px`);
        }
    }
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        activeSections.add(entry.target);
                    } else {
                        activeSections.delete(entry.target);
                    }
                });
                updateB12();
            },
            {
            threshold: 0.15
            }
        );
        followSections.forEach((section) => {
            observer.observe(section);
        });
    } else {
        console.warn("B-12: IntersectionObserver не поддерживается.");
    }
        // Если нужные секции не найдены, дрон останется в углу.
    updateB12();
    if (!citySection) {
        console.warn("B-12: не найдена секция #world.");
    }
    if (!storySection) {
        console.warn(
            "B-12: не найдена секция .companion-section."
        );
    }
});