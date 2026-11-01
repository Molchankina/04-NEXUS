document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".itt-menu-toggle");
    const navigation = document.querySelector(".itt-nav");
    const navigationLinks = document.querySelectorAll(".itt-nav a");
    if (!menuToggle || !navigation) return;
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
        if (window.innerWidth > 650) {
            closeMenu();
        }
    });
});