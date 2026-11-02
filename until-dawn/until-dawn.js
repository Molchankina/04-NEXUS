document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menu-toggle");
    const mainNav = document.getElementById("main-nav");
    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", () => {
            mainNav.classList.toggle("is-open");
        });
        mainNav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                mainNav.classList.remove("is-open");
            });
        });
    }
    const story = {
        start: {
            type: "scene",
            location: "THE LODGE",
            eyebrow: "CHAPTER 01 / THE FIRST SIGN",
            title: "Звук за дверью",
            description: "Ты остаёшься один в комнате. За дверью раздаётся тяжёлый скрип, а затем три медленных удара. В доме больше никого не должно быть.",
            choices: [
                {
                    label: "Открыть дверь",
                    detail: "Проверить, кто находится в коридоре.",
                    target: "tracks"
                },
                {
                    label: "Спрятаться в шкафу",
                    detail: "Затаиться и дождаться, пока шум прекратится.",
                    target: "keys"
                },
                {
                    label: "Разбить окно и выбраться",
                    detail: "Покинуть комнату через окно.",
                    target: "forest"
                }
            ]
        },
        tracks: {
            type: "scene",
            location: "THE HALLWAY",
            eyebrow: "CHAPTER 02 / THE FOOTPRINTS",
            title: "Следы на полу",
            description: "За дверью никого нет. На полу тянется цепочка мокрых следов. Они заканчиваются у лестницы, ведущей вниз.",
            choices: [
                {
                    label: "Спуститься по следам",
                    detail: "Узнать, куда они ведут.",
                    target: "station"
                },
                {
                    label: "Осмотреть соседнюю комнату",
                    detail: "Проверить, откуда могли появиться следы.",
                    target: "attic"
                }
            ]
        },
        keys: {
            type: "scene",
            location: "THE BEDROOM",
            eyebrow: "CHAPTER 02 / THE SILENCE",
            title: "Чужое присутствие",
            description: "Ты прячешься в шкафу. Дверь комнаты медленно открывается. Незнакомец оставляет на полу связку старых ключей и уходит.",
            choices: [
                {
                    label: "Забрать ключи и спуститься",
                    detail: "Попробовать открыть запертую дверь внизу.",
                    target: "basement"
                },
                {
                    label: "Выйти в коридор",
                    detail: "Проверить, куда направился незнакомец.",
                    target: "kitchen"
                }
            ]
        },
        forest: {
            type: "scene",
            location: "THE FROZEN FOREST",
            eyebrow: "CHAPTER 02 / THE COLD",
            title: "За пределами дома",
            description: "Ты выбираешься наружу. Метель почти полностью скрывает дорогу. Вдалеке видны два источника света.",
            choices: [
                {
                    label: "Направиться к старой хижине",
                    detail: "Найти укрытие от метели.",
                    target: "cabin"
                },
                {
                    label: "Пойти к свету на холме",
                    detail: "Попробовать выяснить, кто там находится.",
                    target: "tower"
                }
            ]
        },
        station: {
            type: "scene",
            location: "THE OLD STATION",
            eyebrow: "CHAPTER 03 / THE SIGNAL",
            title: "Заброшенная станция",
            description: "Ты находишь старую станцию. Внутри работает аварийный свет, хотя здание выглядит давно покинутым. На стене висит карта гор.",
            choices: [
                {
                    label: "Изучить карту и документы",
                    detail: "Попытаться разобраться в происходящем.",
                    target: "ending_truth"
                },
                {
                    label: "Включить радиопередатчик",
                    detail: "Попробовать связаться с внешним миром.",
                    target: "radio"
                }
            ]
        },
        attic: {
            type: "scene",
            location: "THE ATTIC",
            eyebrow: "CHAPTER 03 / THE RECORDING",
            title: "Запись из прошлого",
            description: "На чердаке ты находишь старый диктофон. Запись обрывается на фразе: «Если свет погаснет, ни в коем случае не открывайте дверь».",
            choices: [
                {
                    label: "Продолжить поиски",
                    detail: "Проверить, что находится за дальней дверью.",
                    target: "corridor"
                },
                {
                    label: "Вернуться к следам",
                    detail: "Проверить лестницу, которую ты оставил позади.",
                    target: "station"
                }
            ]
        },
        basement: {
            type: "scene",
            location: "THE BASEMENT",
            eyebrow: "CHAPTER 03 / BELOW",
            title: "Под домом",
            description: "Ключ подходит к двери под лестницей. За ней обнаруживается техническое помещение. Где-то за стеной слышно равномерное гудение.",
            choices: [
                {
                    label: "Запустить генератор",
                    detail: "Попробовать восстановить электричество.",
                    target: "generator"
                },
                {
                    label: "Исследовать тёмный проход",
                    detail: "Узнать, куда ведёт коридор за оборудованием.",
                    target: "tunnel"
                }
            ]
        },
        kitchen: {
            type: "scene",
            location: "THE KITCHEN",
            eyebrow: "CHAPTER 03 / THE MESSAGE",
            title: "Последнее сообщение",
            description: "На кухне лежит включённая рация. Сквозь помехи слышен человеческий голос, который повторяет координаты.",
            choices: [
                {
                    label: "Ответить по рации",
                    detail: "Сообщить, что ты находишься в доме.",
                    target: "radio"
                },
                {
                    label: "Проверить соседний коридор",
                    detail: "Найти источник радиосигнала.",
                    target: "corridor"
                }
            ]
        },
        cabin: {
            type: "scene",
            location: "THE HUNTER'S CABIN",
            eyebrow: "CHAPTER 03 / THE SHELTER",
            title: "Хижина в лесу",
            description: "Ты находишь небольшую хижину. Внутри тепло, горит лампа. На столе лежит записка с предупреждением не выходить после полуночи.",
            choices: [
                {
                    label: "Остаться до рассвета",
                    detail: "Запереть дверь и переждать метель.",
                    target: "ending_safe"
                },
                {
                    label: "Осмотреть хижину",
                    detail: "Проверить, кто оставил записку.",
                    target: "station"
                }
            ]
        },
        tower: {
            type: "scene",
            location: "THE WATCHTOWER",
            eyebrow: "CHAPTER 03 / ABOVE THE TREES",
            title: "Сигнальная башня",
            description: "На вершине холма стоит старая наблюдательная башня. На площадке сохранился сигнальный прожектор, направленный в сторону долины.",
            choices: [
                {
                    label: "Включить прожектор",
                    detail: "Подать сигнал тем, кто может находиться внизу.",
                    target: "ending_rescue"
                },
                {
                    label: "Спуститься в долину",
                    detail: "Попробовать добраться до дороги.",
                    target: "station"
                }
            ]
        },
        corridor: {
            type: "scene",
            location: "THE SERVICE CORRIDOR",
            eyebrow: "CHAPTER 04 / THE OTHER SIDE",
            title: "За стеной",
            description: "Коридор оказывается гораздо длиннее, чем казалось. На стенах видны старые отметки, а впереди слышен звук работающего механизма.",
            choices: [
                {
                    label: "Идти на звук",
                    detail: "Найти источник шума.",
                    target: "generator"
                },
                {
                    label: "Вернуться назад",
                    detail: "Не рисковать в незнакомом месте.",
                    target: "ending_safe"
                }
            ]
        },
        generator: {
            type: "scene",
            location: "THE GENERATOR ROOM",
            eyebrow: "CHAPTER 05 / THE POWER",
            title: "Свет возвращается",
            description: "Генератор запускается с громким металлическим ударом. В нескольких окнах загорается свет. Но вместе с ним оживает система, которую лучше было не трогать.",
            choices: [
                {
                    label: "Подать сигнал наружу",
                    detail: "Использовать восстановленное питание.",
                    target: "ending_rescue"
                },
                {
                    label: "Отключить систему",
                    detail: "Попробовать остановить неизвестный механизм.",
                    target: "ending_dark"
                }
            ]
        },
        tunnel: {
            type: "scene",
            location: "THE UNDERGROUND TUNNEL",
            eyebrow: "CHAPTER 05 / THE DARK",
            title: "Подземный проход",
            description: "Проход ведёт глубоко под гору. На стене кто-то оставил отметки, похожие на карту. Впереди слышится шум воды.",
            choices: [
                {
                    label: "Продолжить путь",
                    detail: "Узнать, куда ведёт тоннель.",
                    target: "ending_truth"
                },
                {
                    label: "Вернуться к лестнице",
                    detail: "Попытаться выбраться наружу.",
                    target: "ending_dark"
                }
            ]
        },
        radio: {
            type: "scene",
            location: "THE RADIO ROOM",
            eyebrow: "CHAPTER 04 / THE RESPONSE",
            title: "Кто-то отвечает",
            description: "Сначала слышны только помехи. Затем незнакомый голос произносит твоё имя. Ты никогда не сообщал его по рации.",
            choices: [
                {
                    label: "Назвать своё местоположение",
                    detail: "Попросить прислать помощь.",
                    target: "ending_rescue"
                },
                {
                    label: "Отключить рацию",
                    detail: "Не доверять неизвестному собеседнику.",
                    target: "ending_safe"
                }
            ]
        },
        ending_safe: {
            type: "ending",
            title: "Тишина до рассвета",
            subtitle: "THE QUIET ENDING",
            description: "Ты находишь укрытие и решаешь больше не испытывать судьбу. Ночь проходит в ожидании. Когда первые лучи солнца касаются снега, дом наконец становится тихим.",
            result: "Ты выжил благодаря осторожности. Но ответы остались где-то в темноте."
        },
        ending_truth: {
            type: "ending",
            title: "То, что скрывала гора",
            subtitle: "THE TRUTH ENDING",
            description: "Ты добираешься до места, где сходятся следы, записи и старые документы. Постепенно становится понятно, что происходило в горах. Но знание правды не всегда приносит облегчение.",
            result: "Ты нашёл ответы. Теперь ты знаешь, почему эта ночь никогда не должна была повториться."
        },
        ending_rescue: {
            type: "ending",
            title: "Сигнал услышан",
            subtitle: "THE RESCUE ENDING",
            description: "Твой сигнал достигает внешнего мира. Спустя некоторое время над долиной появляется свет поисковой группы. Ты наконец видишь возможность выбраться из этих гор.",
            result: "Ты сумел привлечь помощь. Рассвет встречает тебя уже не в одиночестве."
        },
        ending_dark: {
            type: "ending",
            title: "Гора не отпускает",
            subtitle: "THE DARK ENDING",
            description: "Ты оказываешься в глубине заброшенного комплекса. Свет гаснет, а привычные ориентиры исчезают. Последнее, что ты слышишь, — звук закрывающейся двери.",
            result: "Ты не нашёл выхода. Некоторые тайны так и остались погребены под снегом."
        }

    };
    const sceneCounter = document.getElementById("scene-counter");
    const sceneLocation = document.getElementById("scene-location");
    const sceneEyebrow = document.getElementById("scene-eyebrow");
    const sceneTitle = document.getElementById("scene-title");
    const sceneDescription = document.getElementById("scene-description");
    const choiceList = document.getElementById("choice-list");
    const feedback = document.getElementById("decision-feedback");
    const feedbackText = document.getElementById("feedback-text");
    const nextButton = document.getElementById("next-scene");
    const tree = document.getElementById("decision-tree");
    const treeCount = document.getElementById("tree-count");
    const treeProgress = document.getElementById("tree-progress-fill");
    const restartButton = document.getElementById("restart-story");
    const endingRestart = document.getElementById("ending-restart");
    const ending = document.getElementById("story-ending");
    const endingDescription = document.getElementById("ending-description");
    const endingHistory = document.getElementById("ending-history");
    const sceneImage = document.getElementById("scene-image");
    const decisionLayout = document.querySelector(".decision-layout");
    if (!sceneCounter || !choiceList || !tree) return;
    let currentNode = "start";
    let selectedChoice = null;
    let pendingTarget = null;
    let history = [];
    let visitedNodes = ["start"];
    function renderScene() {
        const scene = story[currentNode];
        if (!scene || scene.type === "ending") return;
        selectedChoice = null;
        pendingTarget = null;
        sceneCounter.textContent =
            `CHAPTER ${String(history.length + 1).padStart(2, "0")}`;
        sceneLocation.textContent = scene.location;
        sceneEyebrow.textContent = scene.eyebrow;
        sceneTitle.textContent = scene.title;
        sceneDescription.textContent = scene.description;
        choiceList.innerHTML = "";
        scene.choices.forEach((choice, index) => {
            const button = document.createElement("button");
            button.className = "choice-button";
            button.type = "button";
            const number = document.createElement("span");
            number.className = "choice-number";
            number.textContent = `OPTION 0${index + 1}`;
            const label = document.createElement("span");
            label.className = "choice-label";
            label.textContent = choice.label;
            const detail = document.createElement("span");
            detail.className = "choice-detail";
            detail.textContent = choice.detail;
            button.append(number, label, detail);
            button.addEventListener("click", () => {
                selectChoice(index);
            });
            choiceList.appendChild(button);
        });
        feedback.classList.remove("is-visible");
        feedbackText.textContent = "";
        renderTree();
        sceneImage.animate(
            [
                { opacity: .4, transform: "scale(1.025)" },
                { opacity: 1, transform: "scale(1)" }
            ],
            {
                duration: 650,
                easing: "ease-out"
            }
        );
    }
    function selectChoice(index) {
        if (selectedChoice !== null) return;
        const scene = story[currentNode];
        const choice = scene.choices[index];
        const destination = story[choice.target];
        selectedChoice = index;
        pendingTarget = choice.target;
        const buttons = choiceList.querySelectorAll(".choice-button");
        buttons.forEach((button, buttonIndex) => {
            button.disabled = true;
            if (buttonIndex === index) {
                button.classList.add("selected");
            }
        });
        history.push({
            from: currentNode,
            scene: scene.title,
            choice: choice.label,
            target: choice.target,
            destination: destination.title || destination.location
        });
        if (!visitedNodes.includes(choice.target)) {
            visitedNodes.push(choice.target);
        }
        feedbackText.textContent =
            destination.type === "ending"
                ? `Твой выбор ведёт к финалу: «${destination.title}».`
                : `Твой выбор открывает новую локацию: ${destination.location}.`;
        feedback.classList.add("is-visible");
        nextButton.textContent =
            destination.type === "ending"
                ? "УЗНАТЬ СВОЮ СУДЬБУ →"
                : "ПЕРЕЙТИ К СЛЕДУЮЩЕЙ СЦЕНЕ →";
        renderTree();
    }
    function renderTree() {
        tree.innerHTML = "";
        if (history.length === 0) {
            tree.innerHTML = `
                <div class="tree-empty">
                    <span class="tree-empty-icon">✳</span>
                    <p>Твоя история ещё не началась.</p>
                    <span>Первое решение создаст первую ветвь.</span>
                </div>
            `;
        }
        history.forEach((item, index) => {
            const scene = story[item.from];
            const node = document.createElement("div");
            node.className = "tree-node";
            const label = document.createElement("span");
            label.className = "tree-node-label";
            label.textContent = `CHAPTER ${String(index + 1).padStart(2, "0")}`;
            const title = document.createElement("strong");
            title.textContent = item.scene;
            const selected = document.createElement("small");
            selected.textContent = `Твой выбор: ${item.choice}`;
            const destination = document.createElement("small");
            destination.textContent = `Следующая сцена: ${item.destination}`;
            node.append(label, title, selected, destination);
            const branches = document.createElement("div");
            branches.className = "tree-branches";
            scene.choices.forEach(choice => {
                const branch = document.createElement("div");
                branch.className = "tree-branch";
                if (choice.label === item.choice) {
                    branch.classList.add("selected");
                }
                branch.textContent = choice.label;
                branches.appendChild(branch);
            });
            tree.append(node, branches);
        });
        treeCount.textContent = `${history.length} решений`;
        treeProgress.style.width =
            `${Math.min(history.length / 6, 1) * 100}%`;
    }
    function nextScene() {
        if (selectedChoice === null || !pendingTarget) return;
        currentNode = pendingTarget;
        const destination = story[currentNode];
        if (destination.type === "ending") {
            showEnding(destination);
            return;
        }
        renderScene();
        document.querySelector(".decision-stage").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
    function showEnding(finalScene) {
        decisionLayout.style.display = "none";
        ending.hidden = false;
        const title = ending.querySelector("h3");
        const eyebrow = ending.querySelector(".eyebrow");
        eyebrow.textContent = finalScene.subtitle;
        title.textContent = finalScene.title;
        endingDescription.textContent =
            `${finalScene.description} ${finalScene.result}`;
        endingHistory.innerHTML = "";
        history.forEach((item, index) => {
            const line = document.createElement("p");
            line.textContent =
                `${String(index + 1).padStart(2, "0")} — ${item.scene}: ${item.choice}`;
            endingHistory.appendChild(line);
        });
        ending.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }
    function restartStory() {
        currentNode = "start";
        selectedChoice = null;
        pendingTarget = null;
        history = [];
        visitedNodes = ["start"];
        ending.hidden = true;
        decisionLayout.style.display = "";
        renderScene();
        document.getElementById("butterfly").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
    nextButton.addEventListener("click", nextScene);
    restartButton.addEventListener("click", restartStory);
    endingRestart.addEventListener("click", restartStory);
    renderScene();
});