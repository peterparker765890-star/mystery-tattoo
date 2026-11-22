/* =========================================================
   THE MYSTERY TATTOO
   CINEMATIC HORROR EXPERIENCE
   Designed & Developed by Sabarish P
   ========================================================= */

(() => {
    "use strict";

    /* -----------------------------------------------------
       1. ELEMENTS
    ----------------------------------------------------- */

    const snowCanvas = document.getElementById("snow");
    const flash = document.getElementById("flash");
    const snake = document.getElementById("snake");
    const redEyes = document.getElementById("red-eyes");
    const progressBar = document.getElementById("progressBar");

    const snowToggle = document.getElementById("snowToggle");
    const soundToggle = document.getElementById("soundToggle");

    const body = document.body;

    /* -----------------------------------------------------
       2. CINEMATIC EFFECT STYLES
       Injected automatically. No extra CSS file needed.
    ----------------------------------------------------- */

    const cinematicCSS = document.createElement("style");

    cinematicCSS.textContent = `
        .cinema-overlay {
            position: fixed;
            inset: 0;
            z-index: 9998;
            pointer-events: none;
            opacity: 0;
            overflow: hidden;
            transition: opacity 1s ease;
        }

        .cinema-overlay.active {
            opacity: 1;
        }

        .cinema-message {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            text-align: center;
            color: #e8c98a;
            font-family: Georgia, serif;
            font-size: clamp(22px, 5vw, 46px);
            letter-spacing: 5px;
            text-shadow: 0 0 20px #b00000;
            opacity: 0;
            animation: cinemaText 3.5s ease forwards;
        }

        @keyframes cinemaText {
            0% { opacity: 0; letter-spacing: 12px; }
            25% { opacity: 1; letter-spacing: 5px; }
            75% { opacity: 1; }
            100% { opacity: 0; }
        }

        .tattoo-glow {
            position: fixed;
            inset: 0;
            z-index: 9997;
            pointer-events: none;
            background: radial-gradient(
                circle,
                rgba(160,0,0,.3),
                transparent 65%
            );
            animation: tattooPulse 2.5s ease-in-out;
        }

        @keyframes tattooPulse {
            0%, 100% { opacity: 0; }
            35% { opacity: 1; }
            70% { opacity: .5; }
        }

        .death-overlay {
            position: fixed;
            inset: 0;
            z-index: 9996;
            pointer-events: none;
            opacity: 0;
            background: radial-gradient(
                circle,
                transparent 10%,
                rgba(0,0,0,.92) 100%
            );
        }

        .death-overlay.active {
            animation: deathFade 3.5s ease forwards;
        }

        @keyframes deathFade {
            0% { opacity: 0; }
            35% { opacity: .95; }
            70% { opacity: .8; }
            100% { opacity: 0; }
        }

        .impact-shake {
            animation: impactShake .55s ease;
        }

        @keyframes impactShake {
            0%,100% { transform: translateX(0); }
            15% { transform: translateX(-8px); }
            30% { transform: translateX(8px); }
            45% { transform: translateX(-5px); }
            60% { transform: translateX(5px); }
            75% { transform: translateX(-2px); }
        }

        .mist-layer {
            position: fixed;
            inset: -20%;
            z-index: 9995;
            pointer-events: none;
            opacity: 0;
            background:
                radial-gradient(ellipse at 20% 60%, rgba(0,0,0,.95), transparent 55%),
                radial-gradient(ellipse at 80% 40%, rgba(15,0,0,.9), transparent 60%),
                radial-gradient(ellipse at 50% 80%, rgba(0,0,0,.9), transparent 60%);
            filter: blur(20px);
        }

        .mist-layer.active {
            animation: witchMist 7s ease forwards;
        }

        @keyframes witchMist {
            0% { opacity: 0; transform: translateX(-8%); }
            25% { opacity: .95; }
            65% { opacity: .9; transform: translateX(8%); }
            100% { opacity: 0; transform: translateX(15%); }
        }

        .witch-eyes {
            position: fixed;
            z-index: 10000;
            left: 50%;
            top: 43%;
            transform: translate(-50%, -50%);
            width: 180px;
            height: 60px;
            pointer-events: none;
            opacity: 0;
        }

        .witch-eyes::before,
        .witch-eyes::after {
            content: "";
            position: absolute;
            top: 15px;
            width: 42px;
            height: 15px;
            border-radius: 50%;
            background: #ff1010;
            box-shadow: 0 0 12px #ff0000, 0 0 35px #ff0000;
        }

        .witch-eyes::before { left: 25px; }
        .witch-eyes::after { right: 25px; }

        .witch-eyes.active {
            animation: witchEyes 5s ease forwards;
        }

        @keyframes witchEyes {
            0%, 15% { opacity: 0; }
            30%, 75% { opacity: 1; }
            100% { opacity: 0; }
        }

        .angel-overlay {
            position: fixed;
            inset: 0;
            z-index: 9994;
            pointer-events: none;
            opacity: 0;
            overflow: hidden;
            background: radial-gradient(
                ellipse at center,
                rgba(255,255,235,.95),
                rgba(255,220,140,.35) 35%,
                transparent 75%
            );
        }

        .angel-overlay.active {
            animation: angelLight 7s ease forwards;
        }

        @keyframes angelLight {
            0% { opacity: 0; }
            15% { opacity: 1; }
            35% { opacity: .95; }
            75% { opacity: .7; }
            100% { opacity: 0; }
        }

        .angel-silhouette {
            position: absolute;
            left: 50%;
            top: 50%;
            width: 100px;
            height: 190px;
            transform: translate(-50%, -50%);
            opacity: 0;
            filter: drop-shadow(0 0 30px white);
        }

        .angel-overlay.active .angel-silhouette {
            animation: angelAppear 6s ease forwards;
        }

        .angel-body {
            position: absolute;
            left: 39px;
            top: 45px;
            width: 22px;
            height: 105px;
            border-radius: 50% 50% 25% 25%;
            background: linear-gradient(90deg, #fff, #ffe5a0, #fff);
            box-shadow: 0 0 35px white;
        }

        .angel-head {
            position: absolute;
            left: 37px;
            top: 15px;
            width: 26px;
            height: 26px;
            border-radius: 50%;
            background: white;
            box-shadow: 0 0 25px white;
        }

        .angel-wing {
            position: absolute;
            top: 45px;
            width: 110px;
            height: 95px;
            background: linear-gradient(135deg, #fff, #ffe8a7);
            opacity: .95;
            filter: drop-shadow(0 0 15px white);
        }

        .angel-wing.left {
            right: 65px;
            border-radius: 100% 0 100% 0;
            transform: rotate(20deg);
            clip-path: polygon(100% 0, 0 10%, 15% 30%, 0 45%, 25% 55%, 15% 75%, 100% 100%);
        }

        .angel-wing.right {
            left: 65px;
            border-radius: 0 100% 0 100%;
            transform: rotate(-20deg);
            clip-path: polygon(0 0, 100% 10%, 85% 30%, 100% 45%, 75% 55%, 85% 75%, 0 100%);
        }

        @keyframes angelAppear {
            0% { opacity: 0; transform: translate(-50%, -35%) scale(.6); }
            25% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
            65% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -60%) scale(1.2); }
        }

        .battle-overlay {
            position: fixed;
            inset: 0;
            z-index: 9993;
            pointer-events: none;
            opacity: 0;
            overflow: hidden;
        }

        .battle-overlay.active {
            animation: battleFade 9s ease forwards;
        }

        @keyframes battleFade {
            0% { opacity: 0; }
            10%, 75% { opacity: 1; }
            100% { opacity: 0; }
        }

        .battle-light {
            position: absolute;
            top: 0;
            width: 55%;
            height: 100%;
            filter: blur(15px);
        }

        .battle-light.good {
            left: 0;
            background: radial-gradient(ellipse at 20% 50%, rgba(255,240,170,.8), transparent 70%);
        }

        .battle-light.evil {
            right: 0;
            background: radial-gradient(ellipse at 80% 50%, rgba(150,0,0,.8), transparent 70%);
        }

        .battle-divider {
            position: absolute;
            left: 50%;
            top: 0;
            height: 100%;
            width: 3px;
            background: white;
            box-shadow: 0 0 25px white, 0 0 60px gold;
            animation: battleFlash 1.1s infinite alternate;
        }

        @keyframes battleFlash {
            from { opacity: .2; transform: scaleY(.3); }
            to { opacity: 1; transform: scaleY(1); }
        }

        .ash-particle {
            position: fixed;
            z-index: 10001;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            pointer-events: none;
            background: #c9bca1;
            box-shadow: 0 0 10px #fff;
            animation: ashFall 3s ease-out forwards;
        }

        @keyframes ashFall {
            from { opacity: 1; transform: translateY(0) scale(1); }
            to { opacity: 0; transform: translateY(180px) translateX(var(--drift)) scale(.2); }
        }

        .fire-glow {
            position: fixed;
            inset: 0;
            z-index: 9992;
            pointer-events: none;
            opacity: 0;
            background: radial-gradient(
                ellipse at bottom,
                rgba(255,70,0,.65),
                rgba(130,0,0,.25) 45%,
                transparent 75%
            );
        }

        .fire-glow.active {
            animation: fireGlow 4s ease forwards;
        }

        @keyframes fireGlow {
            0% { opacity: 0; }
            20%, 60% { opacity: 1; }
            100% { opacity: 0; }
        }

        .collapse-effect {
            position: fixed;
            inset: 0;
            z-index: 9991;
            pointer-events: none;
            opacity: 0;
            background: rgba(0,0,0,.9);
        }

        .collapse-effect.active {
            animation: collapse 3s ease forwards;
        }

        @keyframes collapse {
            0% { opacity: 0; }
            20% { opacity: .8; }
            35% { opacity: .35; }
            55% { opacity: .9; }
            100% { opacity: 0; }
        }

        .storm-overlay {
            position: fixed;
            inset: 0;
            z-index: 9990;
            pointer-events: none;
            opacity: 0;
            background: rgba(80,90,110,.18);
        }

        .storm-overlay.active {
            animation: stormAtmosphere 5s ease forwards;
        }

        @keyframes stormAtmosphere {
            0% { opacity: 0; }
            25%, 65% { opacity: 1; }
            100% { opacity: 0; }
        }

        @media (max-width: 600px) {
            .angel-silhouette {
                transform: translate(-50%, -50%) scale(.75);
            }
            .cinema-message {
                letter-spacing: 2px;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            .impact-shake {
                animation: none !important;
            }
        }
    `;

    document.head.appendChild(cinematicCSS);


    /* -----------------------------------------------------
       3. OVERLAY CREATION
    ----------------------------------------------------- */

    function createOverlay(className) {
        const element = document.createElement("div");
        element.className = className;
        document.body.appendChild(element);
        return element;
    }

    const mist = createOverlay("mist-layer");
    const witchEyes = createOverlay("witch-eyes");
    const angel = createOverlay("angel-overlay");
    const battle = createOverlay("battle-overlay");
    const fireGlow = createOverlay("fire-glow");
    const collapse = createOverlay("collapse-effect");
    const storm = createOverlay("storm-overlay");

    angel.innerHTML = `
        <div class="angel-silhouette">
            <div class="angel-head"></div>
            <div class="angel-wing left"></div>
            <div class="angel-wing right"></div>
            <div class="angel-body"></div>
        </div>
    `;

    battle.innerHTML = `
        <div class="battle-light good"></div>
        <div class="battle-light evil"></div>
        <div class="battle-divider"></div>
    `;


    /* -----------------------------------------------------
       4. SNOWFALL SYSTEM
    ----------------------------------------------------- */

    let snowEnabled = true;
    let snowIntensity = 0.45;
    let currentMode = "calm";

    let snowflakes = [];
    let animationFrame = null;

    const ctx = snowCanvas ? snowCanvas.getContext("2d") : null;

    function resizeSnow() {
        if (!snowCanvas || !ctx) return;

        snowCanvas.width = window.innerWidth;
        snowCanvas.height = window.innerHeight;

        createSnowflakes();
    }

    function createSnowflakes() {
        if (!snowCanvas) return;

        const amount = Math.floor(
            Math.min(window.innerWidth * snowIntensity / 2.2, 180)
        );

        snowflakes = [];

        for (let i = 0; i < amount; i++) {
            snowflakes.push({
                x: Math.random() * snowCanvas.width,
                y: Math.random() * snowCanvas.height,
                radius: Math.random() * 2.5 + 0.5,
                speed: Math.random() * 1.5 + 0.4,
                drift: Math.random() * 1.2 - 0.6,
                opacity: Math.random() * 0.7 + 0.2
            });
        }
    }

    function drawSnow() {
        if (!ctx || !snowCanvas || !snowEnabled) return;

        ctx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);

        snowflakes.forEach(flake => {
            ctx.beginPath();
            ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);

            ctx.fillStyle = `rgba(255,255,255,${flake.opacity})`;
            ctx.fill();

            const wind = currentMode === "storm" ? 4 : 1;

            flake.y += flake.speed * (currentMode === "storm" ? 2.2 : 1);
            flake.x += flake.drift * wind;

            if (currentMode === "storm") {
                flake.x += 1.5;
            }

            if (flake.y > snowCanvas.height) {
                flake.y = -5;
                flake.x = Math.random() * snowCanvas.width;
            }

            if (flake.x > snowCanvas.width + 5) flake.x = -5;
            if (flake.x < -5) flake.x = snowCanvas.width + 5;
        });

        animationFrame = requestAnimationFrame(drawSnow);
    }

    function startSnow() {
        if (!snowCanvas || !ctx || !snowEnabled) return;

        cancelAnimationFrame(animationFrame);
        drawSnow();
    }

    function setSnowIntensity(value) {
        snowIntensity = value;
        createSnowflakes();
    }

    if (snowCanvas && ctx) {
        resizeSnow();
        startSnow();
        window.addEventListener("resize", resizeSnow);
    }

    if (snowToggle) {
        snowToggle.addEventListener("click", () => {
            snowEnabled = !snowEnabled;
            snowToggle.textContent = snowEnabled ? "❄ Snow: ON" : "❄ Snow: OFF";

            if (snowCanvas) {
                snowCanvas.style.display = snowEnabled ? "block" : "none";
            }

            if (snowEnabled) {
                startSnow();
            } else {
                cancelAnimationFrame(animationFrame);
            }
        });
    }


    /* -----------------------------------------------------
       5. OPTIONAL SOUND SYSTEM
       Sound is OFF by default.
    ----------------------------------------------------- */

    let soundEnabled = false;
    let audioContext = null;

    function playThunder() {
        if (!soundEnabled) return;

        try {
            audioContext ??= new (
                window.AudioContext || window.webkitAudioContext
            )();

            if (audioContext.state === "suspended") {
                audioContext.resume();
            }

            const duration = 1.5;
            const buffer = audioContext.createBuffer(
                1,
                audioContext.sampleRate * duration,
                audioContext.sampleRate
            );

            const data = buffer.getChannelData(0);

            for (let i = 0; i < data.length; i++) {
                data[i] = (Math.random() * 2 - 1) *
                    (1 - i / data.length);
            }

            const source = audioContext.createBufferSource();
            const filter = audioContext.createBiquadFilter();
            const gain = audioContext.createGain();

            filter.type = "lowpass";
            filter.frequency.value = 180;

            gain.gain.setValueAtTime(.001, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(
                .25,
                audioContext.currentTime + .08
            );
            gain.gain.exponentialRampToValueAtTime(
                .001,
                audioContext.currentTime + duration
            );

            source.buffer = buffer;

            source.connect(filter);
            filter.connect(gain);
            gain.connect(audioContext.destination);

            source.start();
        } catch (error) {
            console.warn("Audio effect unavailable:", error);
        }
    }

    if (soundToggle) {
        soundToggle.addEventListener("click", async () => {
            soundEnabled = !soundEnabled;

            soundToggle.textContent = soundEnabled
                ? "🔊 Sound: ON"
                : "🔇 Sound: OFF";

            if (soundEnabled && audioContext?.state === "suspended") {
                await audioContext.resume();
            }
        });
    }


    /* -----------------------------------------------------
       6. GENERAL CINEMATIC UTILITIES
    ----------------------------------------------------- */

    function temporaryClass(element, className, duration = 3000) {
        if (!element) return;

        element.classList.remove(className);
        void element.offsetWidth;
        element.classList.add(className);

        setTimeout(() => {
            element.classList.remove(className);
        }, duration);
    }

    function showMessage(message, duration = 3500) {
        const overlay = createOverlay("cinema-overlay");

        const text = document.createElement("div");
        text.className = "cinema-message";
        text.textContent = message;

        overlay.appendChild(text);

        requestAnimationFrame(() => {
            overlay.classList.add("active");
        });

        setTimeout(() => overlay.remove(), duration);
    }

    function screenShake() {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }

        body.classList.remove("impact-shake");
        void body.offsetWidth;
        body.classList.add("impact-shake");

        setTimeout(() => {
            body.classList.remove("impact-shake");
        }, 650);
    }

    function darkness(duration = 3000) {
        const overlay = createOverlay("death-overlay active");

        setTimeout(() => overlay.remove(), duration + 300);
    }

    function createAsh() {
        for (let i = 0; i < 45; i++) {
            const particle = document.createElement("div");
            particle.className = "ash-particle";

            particle.style.left = Math.random() * 100 + "vw";
            particle.style.top = (35 + Math.random() * 35) + "vh";
            particle.style.setProperty(
                "--drift",
                (Math.random() * 180 - 90) + "px"
            );

            document.body.appendChild(particle);

            setTimeout(() => particle.remove(), 3200);
        }
    }


    /* -----------------------------------------------------
       7. INDIVIDUAL STORY EFFECTS
    ----------------------------------------------------- */

    function tattooEffect() {
        const glow = createOverlay("tattoo-glow");

        showMessage("A MARK THAT CANNOT BE ERASED", 3200);

        setTimeout(() => glow.remove(), 2800);
    }

    function snakeEffect() {
        if (snake) {
            temporaryClass(snake, "active", 4000);
        } else {
            showMessage("SOMETHING MOVES IN THE DARK", 2500);
        }
    }

    function snakeDeathEffect() {
        screenShake();
        darkness(3000);
        showMessage("THE FIRST SOUL IS CLAIMED", 3000);
    }

    function carImpactEffect() {
        screenShake();

        if (flash) {
            temporaryClass(flash, "active", 700);
        }

        darkness(2200);
        showMessage("THE SECOND DEATH", 2500);
    }

    function arrowEffect() {
        screenShake();

        if (flash) {
            temporaryClass(flash, "active", 500);
        }

        darkness(2500);
        showMessage("THE ARROW FINDS ITS TARGET", 2800);
    }

    function fireEffect() {
        temporaryClass(fireGlow, "active", 4200);
        showMessage("THE FLAMES AWAKEN", 2800);
    }

    function fireDeathEffect() {
        temporaryClass(fireGlow, "active", 3500);
        darkness(3000);
        showMessage("THE THIRD SOUL DISAPPEARS", 2800);
    }

    function churchStormEffect() {
        currentMode = "storm";
        setSnowIntensity(1.1);

        temporaryClass(storm, "active", 5000);

        if (flash) {
            temporaryClass(flash, "active", 1000);
        }

        playThunder();

        setTimeout(() => {
            if (currentMode === "storm") {
                setSnowIntensity(0.9);
            }
        }, 3000);
    }

    function witchEffect() {
        temporaryClass(mist, "active", 7200);
        temporaryClass(witchEyes, "active", 5200);

        showMessage("SHE HAS RETURNED", 3800);
    }

    function witchAttackEffect() {
        screenShake();
        darkness(2500);
        temporaryClass(mist, "active", 4500);
        temporaryClass(witchEyes, "active", 4000);

        showMessage("THE DARKNESS STRIKES", 2800);
    }

    function angelEntranceEffect() {
        temporaryClass(angel, "active", 7200);

        showMessage("LIGHT FROM HEAVEN", 4200);

        if (flash) {
            temporaryClass(flash, "active", 900);
        }
    }

    function heavenHellBattleEffect() {
        currentMode = "hell";
        setSnowIntensity(0.15);

        temporaryClass(battle, "active", 9500);

        showMessage("HEAVEN VS HELL", 4500);

        if (flash) {
            temporaryClass(flash, "active", 1000);
        }

        setTimeout(() => {
            if (currentMode === "hell") {
                currentMode = "heaven";
                setSnowIntensity(0.65);
            }
        }, 6500);
    }

    function witchDestructionEffect() {
        temporaryClass(angel, "active", 4500);
        createAsh();

        if (flash) {
            temporaryClass(flash, "active", 1000);
        }

        showMessage("THE DARKNESS IS DESTROYED", 4200);

        setTimeout(() => {
            mist.classList.remove("active");
            witchEyes.classList.remove("active");
        }, 2000);
    }

    function churchCollapseEffect() {
        screenShake();
        temporaryClass(collapse, "active", 3200);

        if (flash) {
            temporaryClass(flash, "active", 700);
        }

        showMessage("THE CHURCH FALLS SILENT", 3500);
    }


    /* -----------------------------------------------------
       8. SCENE EFFECT ROUTER
    ----------------------------------------------------- */

    const effectHandlers = {
        tattoo: tattooEffect,
        snake: snakeEffect,
        "snake-death": snakeDeathEffect,
        "car-impact": carImpactEffect,
        arrow: arrowEffect,
        fire: fireEffect,
        "fire-death": fireDeathEffect,
        "church-storm": churchStormEffect,
        witch: witchEffect,
        "witch-attack": witchAttackEffect,
        "angel-entrance": angelEntranceEffect,
        "heaven-hell-battle": heavenHellBattleEffect,
        "witch-destruction": witchDestructionEffect,
        "church-collapse": churchCollapseEffect
    };

    const triggeredMarkers = new WeakSet();

    const sceneMarkers = document.querySelectorAll(".scene-marker[data-effect]");

    const sceneObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const marker = entry.target;

            if (triggeredMarkers.has(marker)) return;

            triggeredMarkers.add(marker);

            const effectName = marker.dataset.effect;
            const handler = effectHandlers[effectName];

            if (handler) {
                handler();
            }
        });
    }, {
        root: null,
        threshold: 0,
        rootMargin: "-15% 0px -15% 0px"
    });

    sceneMarkers.forEach(marker => sceneObserver.observe(marker));


    /* -----------------------------------------------------
       9. STORY ATMOSPHERE
    ----------------------------------------------------- */

    const storySections = document.querySelectorAll(
        "#reader section, #reader .chapter, #reader article"
    );

    const atmosphereObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const mode = entry.target.dataset.mode;

            if (!mode) return;

            currentMode = mode;

            body.classList.remove(
                "mode-calm",
                "mode-dark",
                "mode-storm",
                "mode-hell",
                "mode-heaven"
            );

            body.classList.add("mode-" + mode);

            switch (mode) {
                case "calm":
                    setSnowIntensity(.35);
                    break;

                case "dark":
                    setSnowIntensity(.55);
                    break;

                case "storm":
                    setSnowIntensity(1.1);
                    break;

                case "hell":
                    setSnowIntensity(.1);
                    break;

                case "heaven":
                    setSnowIntensity(.65);
                    break;

                default:
                    setSnowIntensity(.45);
            }
        });
    }, {
        threshold: .25
    });

    storySections.forEach(section => {
        atmosphereObserver.observe(section);
    });


    /* -----------------------------------------------------
       10. LIGHTNING EFFECT
    ----------------------------------------------------- */

    function lightning() {
        if (!flash) return;

        temporaryClass(flash, "active", 450);
    }

    let stormLightningTimer = null;

    function startStormLightning() {
        clearInterval(stormLightningTimer);

        stormLightningTimer = setInterval(() => {
            if (currentMode !== "storm") {
                clearInterval(stormLightningTimer);
                return;
            }

            if (Math.random() > .65) {
                lightning();
                playThunder();
            }
        }, 2500);
    }

    const stormMarker = document.querySelector(
        '.scene-marker[data-effect="church-storm"]'
    );

    if (stormMarker) {
        const lightningObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startStormLightning();
                }
            });
        }, { threshold: 0 });

        lightningObserver.observe(stormMarker);
    }


    /* -----------------------------------------------------
       11. READING PROGRESS
    ----------------------------------------------------- */

    function updateProgress() {
        if (!progressBar) return;

        const scrollTop =
            window.scrollY || document.documentElement.scrollTop;

        const scrollHeight =
            document.documentElement.scrollHeight - window.innerHeight;

        const percentage = scrollHeight > 0
            ? (scrollTop / scrollHeight) * 100
            : 0;

        progressBar.style.width = percentage + "%";
    }

    window.addEventListener("scroll", updateProgress, {
        passive: true
    });

    updateProgress();


    /* -----------------------------------------------------
       12. FINAL RED-EYES REVEAL
    ----------------------------------------------------- */

    const ending = document.getElementById("ending");
    let endingTriggered = false;

    if (ending && redEyes) {
        const endingObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting || endingTriggered) return;

                endingTriggered = true;

                // Let the reader experience the ending's silence first.
                setTimeout(() => {
                    body.classList.add("final-darkness");

                    redEyes.classList.add("active");

                    setTimeout(() => {
                        redEyes.classList.remove("active");
                    }, 4500);

                    setTimeout(() => {
                        body.classList.remove("final-darkness");
                    }, 5200);

                }, 3500);
            });
        }, {
            threshold: .45
        });

        endingObserver.observe(ending);
    }


    /* -----------------------------------------------------
       13. CLEANUP AND INITIALIZATION
    ----------------------------------------------------- */

    window.addEventListener("beforeunload", () => {
        cancelAnimationFrame(animationFrame);
        clearInterval(stormLightningTimer);
    });

    console.log(
        "%cTHE MYSTERY TATTOO",
        "color:#d4af70;font-size:22px;font-weight:bold;"
    );

    console.log(
        "%cA cinematic supernatural reading experience.",
        "color:#aaa;font-size:12px;"
    );

})();