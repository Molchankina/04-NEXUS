(() => {
  const hero = document.querySelector("#hero");
  const toggle = document.querySelector("#night-toggle");
  const toggleLabel = document.querySelector(".toggle-label");
  const page = document.querySelector("#outlast-page");
  if (!hero || !toggle || !page) return;
  window.addEventListener("load", () => {
    window.setTimeout(() => hero.classList.add("opened"), 650);
  });
  toggle.addEventListener("click", () => {
    const enabled = page.classList.toggle("night-mode");
    toggle.setAttribute("aria-pressed", String(enabled));
    toggleLabel.textContent = enabled
      ? "ВЫКЛЮЧИТЬ НОЧНОЕ ВИДЕНИЕ"
      : "ВКЛЮЧИТЬ НОЧНОЕ ВИДЕНИЕ";
    document.querySelector(".hud-bottom-right").innerHTML = enabled
      ? 'NIGHT VISION <b>●</b>'
      : 'NIGHT VISION <b>○</b>';
  });
  const batteryLevel = document.querySelector(".battery i");
  if (batteryLevel) {
    batteryLevel.style.width = "72%";
  }
})();