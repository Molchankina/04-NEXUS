document.addEventListener("DOMContentLoaded", () => {
    const revealElements = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
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
    } else {
        revealElements.forEach((element) => {
            element.classList.add("is-visible");
        });
    }
    const menuToggle = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".navigation");
    const navigationLinks = document.querySelectorAll(".navigation a");
    function closeMenu() {
        if (!menuToggle || !navigation) return;
        navigation.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Открыть меню");
    }
    if (menuToggle && navigation) {
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
    }
    const b12 = document.querySelector("#b12-follower");
    if (!b12) {
        console.warn(
            "B-12: не найден элемент #b12-follower. Проверь HTML."
        );
        return;
    }
    const companionSection = document.querySelector("#companion");
    const isMobile = window.matchMedia(
        "(max-width: 900px), (pointer: coarse)"
    ).matches;
    if (companionSection && "IntersectionObserver" in window) {
        const companionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    b12.classList.toggle(
                        "is-charged",
                        entry.isIntersecting
                    );
                });
            },
            {
                threshold: 0.2,
            }
        );
        companionObserver.observe(companionSection);
    }
    if (isMobile) {
        return;
    }
    let targetX = window.innerWidth - 90;
    let targetY = window.innerHeight - 90;
    let currentX = targetX;
    let currentY = targetY;
    function moveB12(event) {
        if (event.pointerType !== "mouse") return;
        const halfWidth = b12.offsetWidth / 2;
        const halfHeight = b12.offsetHeight / 2;
        targetX = event.clientX + 65;
        targetY = event.clientY + 35;
        targetX = Math.max(
            halfWidth + 8,
            Math.min(window.innerWidth - halfWidth - 8, targetX)
        );
        targetY = Math.max(
            halfHeight + 8,
            Math.min(window.innerHeight - halfHeight - 8, targetY)
        );
        b12.classList.add("is-following");
    }
    function animateB12() {
        const smoothness = 0.055;
        currentX += (targetX - currentX) * smoothness;
        currentY += (targetY - currentY) * smoothness;
        b12.style.setProperty("--b12-x", '${currentX}px');
        b12.style.setProperty("--b12-y", '${currentY}px');
        requestAnimationFrame(animateB12);
    }
    window.addEventListener("pointermove", moveB12);
    window.addEventListener("resize", () => {
        targetX = Math.min(targetX, window.innerWidth - 60);
        targetY = Math.min(targetY, window.innerHeight - 60);
    });
    animateB12();
});