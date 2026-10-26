(() => {
  "use strict";

  const hero = document.querySelector(".itt-hero");
  const game = document.querySelector("#itt-game");
  const canvas = document.querySelector("#itt-canvas");

  if (!hero || !game || !canvas) {
    console.warn("It Takes Two: не найден Hero или игровой блок.");
    return;
  }

  const ctx = canvas.getContext("2d");

  const overlay = document.querySelector("#itt-overlay");
  const messageTitle = document.querySelector("#itt-message-title");
  const messageText = document.querySelector("#itt-message-text");
  const startButton = document.querySelector("#itt-start");
  const backButton = document.querySelector("#itt-game-back");
  const levelTitle = document.querySelector("#itt-level-title");
  const levelCount = document.querySelector("#itt-level-count");
  const starCount = document.querySelector("#itt-star-count");

  const levels = [
    {
      name: "Знакомство",
      sky: ["#8bd4e5", "#e7f5ce"],
      ground: "#659d62",
      platforms: [[.25,.68,.15],[.48,.52,.14],[.71,.38,.14]],
      stars: [[.28,.59],[.52,.43],[.75,.29]]
    },
    {
      name: "Цветочный сад",
      sky: ["#a4e1e2", "#fff0bd"],
      ground: "#6cb56b",
      platforms: [[.18,.65,.14],[.40,.48,.13],[.62,.58,.13],[.80,.39,.11]],
      stars: [[.20,.56],[.66,.49],[.84,.30]]
    },
    {
      name: "Игрушечная мастерская",
      sky: ["#a8c8f2", "#f8d4a0"],
      ground: "#879657",
      platforms: [[.22,.55,.14],[.43,.70,.13],[.62,.45,.12],[.78,.57,.10]],
      stars: [[.24,.46],[.66,.36],[.82,.48]]
    },
    {
      name: "Мир наоборот",
      sky: ["#9ed9de", "#c9c8f4"],
      ground: "#718d67",
      platforms: [[.16,.45,.13],[.35,.62,.12],[.55,.42,.12],[.73,.58,.12]],
      stars: [[.18,.36],[.59,.33],[.77,.49]]
    },
    {
      name: "Вместе",
      sky: ["#7eb8e9", "#f7d6a4"],
      ground: "#67935c",
      platforms: [[.18,.60,.12],[.36,.43,.12],[.54,.58,.12],[.72,.40,.12]],
      stars: [[.20,.51],[.58,.49],[.76,.31]]
    }
  ];

  const state = {
    width: 900,
    height: 330,
    level: 0,
    active: false,
    lastTime: 0,
    frame: 0,
    collected: new Set(),
    keys: new Set(),
    touch: new Set()
  };

  const players = [
    {
      id: "may",
      x: 50, y: 0,
      w: 23, h: 36,
      vx: 0, vy: 0,
      speed: 215, jump: 470,
      color: "#f0d13d",
      hair: "#563729",
      grounded: false,
      spawn: 50
    },
    {
      id: "cody",
      x: 90, y: 0,
      w: 23, h: 36,
      vx: 0, vy: 0,
      speed: 215, jump: 470,
      color: "#7b9145",
      hair: "#a94f39",
      grounded: false,
      spawn: 90
    }
  ];

  const level = () => levels[state.level];
  const groundY = () => state.height * .82;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    state.width = Math.max(300, rect.width);
    state.height = Math.max(240, rect.height);

    canvas.width = Math.round(state.width * dpr);
    canvas.height = Math.round(state.height * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    draw();
  }

  function platforms() {
    return level().platforms.map(([x, y, w]) => ({
      x: x * state.width,
      y: y * state.height,
      w: w * state.width,
      h: 12
    }));
  }

  function starPositions() {
    return level().stars.map(([x, y]) => ({
      x: x * state.width,
      y: y * state.height
    }));
  }

  function updateLabels() {
    levelTitle.textContent =
      `Уровень ${state.level + 1} — ${level().name}`;

    levelCount.textContent = `${state.level + 1} / 5`;
    starCount.textContent = `★ ${state.collected.size} / 3`;
  }

  function resetLevel() {
    state.collected.clear();

    players.forEach((p, i) => {
      p.spawn = state.width * (i === 0 ? .06 : .11);
      p.x = p.spawn;
      p.y = groundY() - p.h;
      p.vx = 0;
      p.vy = 0;
      p.grounded = true;
    });

    updateLabels();
    draw();
  }

  function openGame() {
    hero.classList.add("itt-game-open");
    game.classList.add("is-visible");
    game.setAttribute("aria-hidden", "false");

    state.active = false;
    state.level = 0;

    resize();
    resetLevel();

    overlay.hidden = false;
    messageTitle.textContent = "Всё начинается вместе";
    messageText.textContent =
      "Соберите три звезды и приведите Мэй и Коди к порталу. " +
      "На компьютере используйте клавиатуру, на телефоне — кнопки.";
    startButton.textContent = "Начать игру";

    setTimeout(resize, 500);
  }

  function closeGame() {
    state.active = false;
    cancelAnimationFrame(state.frame);

    game.classList.remove("is-visible");
    game.setAttribute("aria-hidden", "true");
    hero.classList.remove("itt-game-open");

    state.keys.clear();
    state.touch.clear();
  }

  function startLevel() {
    overlay.hidden = true;
    state.active = true;
    state.lastTime = performance.now();

    resetLevel();
    cancelAnimationFrame(state.frame);
    state.frame = requestAnimationFrame(loop);
  }

  function finishLevel() {
    state.active = false;

    if (state.level === levels.length - 1) {
      messageTitle.textContent = "Вы справились вместе! ✨";
      messageText.textContent =
        "Все пять уровней пройдены! " +
        "Мэй и Коди доказали, что вместе можно преодолеть любые препятствия.";

      startButton.textContent = "Сыграть ещё раз";
      startButton.onclick = () => {
        state.level = 0;
        startButton.onclick = null;
        startLevel();
      };
    } else {
      state.level++;

      messageTitle.textContent = `Уровень ${state.level + 1} открыт!`;
      messageText.textContent =
        `${level().name}: соберите три звезды и приведите обоих героев к порталу.`;

      startButton.textContent = "Следующий уровень";
      startButton.onclick = () => {
        startButton.onclick = null;
        startLevel();
      };
    }

    updateLabels();
    overlay.hidden = false;
  }

  function drawStar(x, y, radius) {
    ctx.beginPath();

    for (let i = 0; i < 10; i++) {
      const angle = -Math.PI / 2 + i * Math.PI / 5;
      const r = i % 2 === 0 ? radius : radius * .45;

      const px = x + Math.cos(angle) * r;
      const py = y + Math.sin(angle) * r;

      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }

    ctx.closePath();
    ctx.fill();
  }

  function drawPlayer(p) {
    ctx.save();

    ctx.fillStyle = "rgba(35,45,55,.2)";
    ctx.beginPath();
    ctx.ellipse(
      p.x + p.w / 2,
      p.y + p.h + 2,
      12, 4, 0, 0, Math.PI * 2
    );
    ctx.fill();

    // Ноги
    ctx.fillStyle = "#493d35";
    ctx.fillRect(p.x + 4, p.y + p.h - 7, 5, 9);
    ctx.fillRect(p.x + 14, p.y + p.h - 7, 5, 9);

    // Тело
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.roundRect(p.x + 2, p.y + 12, p.w - 4, 19, 5);
    ctx.fill();

    // Голова и волосы
    ctx.fillStyle = p.hair;
    ctx.beginPath();
    ctx.arc(p.x + p.w / 2, p.y + 8, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#efc6a5";
    ctx.beginPath();
    ctx.arc(p.x + p.w / 2, p.y + 9, 7, 0, Math.PI * 2);
    ctx.fill();

    // Глаза
    ctx.fillStyle = "#29323d";
    ctx.fillRect(p.x + 7, p.y + 8, 2, 2);
    ctx.fillRect(p.x + 14, p.y + 8, 2, 2);

    ctx.restore();
  }

  function draw() {
    if (!ctx) return;

    const w = state.width;
    const h = state.height;
    const current = level();

    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, current.sky[0]);
    gradient.addColorStop(1, current.sky[1]);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    // Далёкие сказочные холмы
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = i % 2
        ? "rgba(255,255,255,.2)"
        : "rgba(61,120,108,.15)";

      ctx.beginPath();
      ctx.ellipse(
        i * w / 4,
        h * .76,
        w * .17,
        h * .17,
        0, Math.PI, 0
      );
      ctx.fill();
    }

    // Земля
    ctx.fillStyle = current.ground;
    ctx.fillRect(0, groundY(), w, h - groundY());

    // Платформы
    platforms().forEach((p, i) => {
      ctx.fillStyle = "#795b48";
      ctx.beginPath();
      ctx.roundRect(p.x, p.y, p.w, p.h, 5);
      ctx.fill();

      ctx.fillStyle = i % 2 ? "#f1d16a" : "#b7d87b";
      ctx.beginPath();
      ctx.roundRect(p.x, p.y - 5, p.w, 7, 5);
      ctx.fill();
    });

    // Звёзды
    starPositions().forEach((s, i) => {
      if (state.collected.has(i)) return;

      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(Math.sin(performance.now() / 400 + i) * .12);
      ctx.fillStyle = "#ffe34f";
      ctx.strokeStyle = "#fff9d4";
      ctx.lineWidth = 2;

      drawStar(0, 0, 12);
      ctx.stroke();
      ctx.restore();
    });

    // Портал
    const portalX = w * .92;
    const portalY = groundY() - 8;

    ctx.save();
    ctx.strokeStyle = "#fff7ce";
    ctx.lineWidth = 5;
    ctx.shadowColor = "#fff3a1";
    ctx.shadowBlur = 15;

    ctx.beginPath();
    ctx.ellipse(portalX, portalY, 13, 22, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    players.forEach(drawPlayer);
  }

  function activeAction(player, action) {
    const key = `${player}:${action}`;

    return state.keys.has(key) || state.touch.has(key);
  }

  function collide(p, oldY) {
    p.grounded = false;

    const surfaces = [
      { x: 0, y: groundY(), w: state.width, h: 100 },
      ...platforms()
    ];

    for (const surface of surfaces) {
      const overlapsX =
        p.x + p.w > surface.x &&
        p.x < surface.x + surface.w;

      const crossedTop =
        oldY + p.h <= surface.y + 3 &&
        p.y + p.h >= surface.y;

      if (overlapsX && p.vy >= 0 && crossedTop) {
        p.y = surface.y - p.h;
        p.vy = 0;
        p.grounded = true;
      }
    }
  }

  function update(dt) {
    const gravity = 1250;

    players.forEach(p => {
      const oldY = p.y;

      const left = activeAction(p.id, "left");
      const right = activeAction(p.id, "right");
      const jump = activeAction(p.id, "jump");

      p.vx = ((right ? 1 : 0) - (left ? 1 : 0)) * p.speed;

      p.x += p.vx * dt;
      p.x = Math.max(0, Math.min(state.width - p.w, p.x));

      if (jump && p.grounded) {
        p.vy = -p.jump;
        p.grounded = false;
      }

      p.vy = Math.min(850, p.vy + gravity * dt);
      p.y += p.vy * dt;

      collide(p, oldY);

      // Если герой упал — возвращаем его на землю
      if (p.y > state.height + 50) {
        p.x = p.spawn;
        p.y = groundY() - p.h;
        p.vy = 0;
      }
    });

    // Сбор звёзд
    starPositions().forEach((s, i) => {
      if (state.collected.has(i)) return;

      for (const p of players) {
        const px = p.x + p.w / 2;
        const py = p.y + p.h / 2;

        if (Math.hypot(px - s.x, py - s.y) < 24) {
          state.collected.add(i);
          break;
        }
      }
    });

    updateLabels();

    // Оба героя должны находиться рядом с порталом
    const portalX = state.width * .92;
    const portalY = groundY() - 8;

    const bothAtPortal = players.every(p => {
      const px = p.x + p.w / 2;
      const py = p.y + p.h / 2;

      return Math.hypot(px - portalX, py - portalY) < 40;
    });

    if (state.collected.size === 3 && bothAtPortal) {
      finishLevel();
    }
  }

  function loop(time) {
    if (!state.active) return;

    const dt = Math.min((time - state.lastTime) / 1000, .03);
    state.lastTime = time;

    update(dt);
    draw();

    if (state.active) {
      state.frame = requestAnimationFrame(loop);
    }
  }

  const keyboard = {
    KeyA: "may:left",
    KeyD: "may:right",
    KeyW: "may:jump",
    ArrowLeft: "cody:left",
    ArrowRight: "cody:right",
    ArrowUp: "cody:jump"
  };

  document.addEventListener("keydown", event => {
    if (keyboard[event.code] && state.active) {
      event.preventDefault();
      state.keys.add(keyboard[event.code]);
    }
  });

  document.addEventListener("keyup", event => {
    if (keyboard[event.code]) {
      state.keys.delete(keyboard[event.code]);
    }
  });

  // Сенсорные кнопки для двух игроков
  document.querySelectorAll("[data-player][data-action]").forEach(button => {
    const action = `${button.dataset.player}:${button.dataset.action}`;

    const press = event => {
      event.preventDefault();
      state.touch.add(action);
      button.classList.add("is-pressed");
    };

    const release = event => {
      event.preventDefault();
      state.touch.delete(action);
      button.classList.remove("is-pressed");
    };

    button.addEventListener("pointerdown", press);
    button.addEventListener("pointerup", release);
    button.addEventListener("pointercancel", release);
    button.addEventListener("lostpointercapture", release);
  });

  // Запуск по звезде или цветку
  document.querySelectorAll(
    ".itt-floating-star, .itt-floating-circle"
  ).forEach(button => {
    button.addEventListener("click", openGame);
  });

  startButton.addEventListener("click", () => {
    startButton.onclick = null;
    startLevel();
  });

  backButton.addEventListener("click", closeGame);
  window.addEventListener("resize", resize);

  resize();
})();