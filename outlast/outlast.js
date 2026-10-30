(() => {
  const page = document.querySelector("#outlast-page");
  const toggle = document.querySelector("#night-toggle");
  if (!page || !toggle) {
    return;
  }
  const toggleLabel = toggle.querySelector(".toggle-label");
  const hudStatus = document.querySelector(".hud-bottom-right");
  const batteryLevel = document.querySelector(".battery i");
  function toggleNightVision() {
    const enabled = page.classList.toggle("night-mode");
    toggle.setAttribute("aria-pressed", String(enabled));
    if (toggleLabel) {
      toggleLabel.textContent = enabled
        ? "ВЫКЛЮЧИТЬ НОЧНОЕ ВИДЕНИЕ"
        : "ВКЛЮЧИТЬ НОЧНОЕ ВИДЕНИЕ";
    }
    if (hudStatus) {
      hudStatus.innerHTML = enabled
        ? "NIGHT VISION <b>●</b>"
        : "NIGHT VISION <b>○</b>";
    }
  }
  toggle.addEventListener("click", toggleNightVision);
  if (batteryLevel) {
    batteryLevel.style.width = "72%";
  }
})();