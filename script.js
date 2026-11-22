/* =========================================
   THE MYSTERY TATTOO
   CINEMATIC READING ENGINE
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================
       ELEMENTS
    ===================================== */

    const snowCanvas = document.getElementById("snow");
    const snowCtx = snowCanvas.getContext("2d");

    const snowToggle = document.getElementById("snowToggle");
    const soundToggle = document.getElementById("soundToggle");

    const progressBar = document.getElementById("progressBar");

    const flash = document.getElementById("flash");
    const snake = document.getElementById("snake");
    const redEyes = document.getElementById("red-eyes");

    let snowEnabled = true;
    let snowIntensity = 1;
    let particles = [];

    const triggeredEffects = new Set();

    /* =====================================
       SNOW CANVAS
    ===================================== */

    function resizeCanvas() {
        snowCanvas.width = window.innerWidth;
        snowCanvas.height = window.innerHeight;

        createSnow();
    }

    function createSnow() {
        particles = [];

        const count = Math.floor(
            (snowCanvas.width * snowCanvas.height) / 8500
        );

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * snowCanvas.width,
                y: Math.random() * snowCanvas.height,
                radius: Math.random() * 2.5 + 0.5,
                speed: Math.random() * 1.5 + 0.5,
                wind: Math.random() * 0.8 - 0.4,
                opacity: Math.random() * 0.65 + 0.2
            });
        }
    }

    function drawSnow() {

        snowCtx.clearRect(
            0,
            0,
            snowCanvas.width,
            snowCanvas.height
        );

        if (!snowEnabled) {
            requestAnimationFrame(drawSnow);
            return;
        }

        particles.forEach(particle => {

            snowCtx.beginPath();

            snowCtx.arc(
                particle.x,
                particle.y,
                particle.radius,
                0,
                Math.PI * 2
            );

            snowCtx.fillStyle =
                `rgba(255,255,255,${particle.opacity})`;

            snowCtx.fill();

            particle.y += particle.speed * snowIntensity;
            particle.x += particle.wind * snowIntensity;

            if (particle.y > snowCanvas.height) {
                particle.y = -5;
                particle.x = Math.random() * snowCanvas.width;
            }

            if (particle.x > snowCanvas.width) {
                particle.x = 0;
            }

            if (particle.x < 0) {
                particle.x = snowCanvas.width;
            }

        });

        requestAnimationFrame(drawSnow);
    }

    resizeCanvas();
    drawSnow();

    window.addEventListener("resize", resizeCanvas);


    /* =====================================
       SNOW CONTROL
    ===================================== */

    snowToggle.addEventListener("click", () => {

        snowEnabled = !snowEnabled;

        snowToggle.textContent = snowEnabled
            ? "❄ Snow: ON"
            : "❄ Snow: OFF";

    });


    /* =====================================
       SOUND CONTROL
       SYNTHETIC AMBIENT EFFECTS
    ===================================== */

    let audioContext = null;
    let soundEnabled = false;

    soundToggle.addEventListener("click", async () => {

        soundEnabled = !soundEnabled;

        soundToggle.textContent = soundEnabled
            ? "♫ Sound: ON"
            : "♫ Sound: OFF";

        if (soundEnabled) {

            try {
                const AudioContext =
                    window.AudioContext ||
                    window.webkitAudioContext;

                if (!AudioContext) {
                    soundEnabled = false;
                    soundToggle.textContent = "♫ Sound: OFF";
                    alert("Audio is not supported in this browser.");
                    return;
                }

                audioContext = audioContext || new AudioContext();

                if (audioContext.state === "suspended") {
                    await audioContext.resume();
                }

            } catch (error) {
                soundEnabled = false;
                soundToggle.textContent = "♫ Sound: OFF";
            }

        }

    });


    /* =====================================
       THUNDER SOUND
    ===================================== */

    function playThunder() {

        if (!soundEnabled || !audioContext) return;

        const duration = 1.5;

        const bufferSize =
            audioContext.sampleRate * duration;

        const buffer =
            audioContext.createBuffer(
                1,
                bufferSize,
                audioContext.sampleRate
            );

        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise =
            audioContext.createBufferSource();

        noise.buffer = buffer;

        const filter =
            audioContext.createBiquadFilter();

        filter.type = "lowpass";
        filter.frequency.value = 180;

        const gain =
            audioContext.createGain();

        gain.gain.setValueAtTime(
            0.001,
            audioContext.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.35,
            audioContext.currentTime + 0.12
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            audioContext.currentTime + duration
        );

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(audioContext.destination);

        noise.start();
        noise.stop(audioContext.currentTime + duration);

    }


    /* =====================================
       READING PROGRESS
    ===================================== */

    function updateProgress() {

        const scrollTop =
            window.scrollY;

        const totalHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;

        const progress =
            totalHeight > 0
                ? (scrollTop / totalHeight) * 100
                : 0;

        progressBar.style.width =
            `${Math.min(100, Math.max(0, progress))}%`;

    }

    window.addEventListener("scroll", updateProgress);
    updateProgress();


    /* =====================================
       ATMOSPHERE MODES
    ===================================== */

    const storySections =
        document.querySelectorAll(".story-section");

    const atmosphereObserver =
        new IntersectionObserver(entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                const mode =
                    entry.target.dataset.mode || "calm";

                document.body.classList.remove(
                    "mode-calm",
                    "mode-dark",
                    "mode-storm",
                    "mode-hell",
                    "mode-heaven"
                );

                document.body.classList.add(
                    `mode-${mode}`
                );

                switch (mode) {

                    case "calm":
                        snowIntensity = 0.8;
                        break;

                    case "dark":
                        snowIntensity = 1;
                        break;

                    case "storm":
                        snowIntensity = 3.5;
                        break;

                    case "hell":
                        snowIntensity = 2.8;
                        break;

                    case "heaven":
                        snowIntensity = 1.2;
                        break;

                    default:
                        snowIntensity = 1;

                }

            });

        }, {
            threshold: 0.25
        });

    storySections.forEach(section => {
        atmosphereObserver.observe(section);
    });


    /* =====================================
       FLASH EFFECT
    ===================================== */

    function triggerFlash() {

        flash.classList.remove("active");

        void flash.offsetWidth;

        flash.classList.add("active");

        setTimeout(() => {
            flash.classList.remove("active");
        }, 750);

    }


    /* =====================================
       SNAKE APPEARANCE
    ===================================== */

    function triggerSnake() {

        snake.classList.remove("active");

        void snake.offsetWidth;

        snake.classList.add("active");

        setTimeout(() => {
            snake.classList.remove("active");
        }, 1700);

    }


    /* =====================================
       DYNAMIC CINEMATIC OVERLAYS
    ===================================== */

    function createOverlay(id, content, background) {

        let overlay = document.getElementById(id);

        if (!overlay) {

            overlay = document.createElement("div");

            overlay.id = id;

            overlay.style.cssText = `
                position: fixed;
                inset: 0;
                z-index: 85;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                padding: 25px;
                opacity: 0;
                pointer-events: none;
                background: ${background};
                transition: opacity 1.2s ease;
            `;

            overlay.innerHTML = `
                <div style="
                    font-family: Cinzel, serif;
                    color: #f0d69a;
                    font-size: clamp(22px, 5vw, 46px);
                    letter-spacing: 4px;
                    text-shadow: 0 0 25px currentColor;
                ">
                    ${content}
                </div>
            `;

            document.body.appendChild(overlay);

        }

        overlay.style.opacity = "1";

        return overlay;

    }


    function removeOverlay(id, delay = 2500) {

        const overlay =
            document.getElementById(id);

        if (!overlay) return;

        setTimeout(() => {

            overlay.style.opacity = "0";

            setTimeout(() => {
                overlay.remove();
            }, 1300);

        }, delay);

    }


    /* =====================================
       WITCH APPEARANCE
    ===================================== */

    function triggerWitch() {

        const overlay = createOverlay(
            "witch-overlay",
            "SHE HAS RETURNED",
            "radial-gradient(circle, rgba(70,0,0,0.95), rgba(0,0,0,0.98))"
        );

        overlay.style.color = "#ff2020";

        setTimeout(() => {
            overlay.style.background =
                "radial-gradient(circle, rgba(120,0,0,0.45), #000 75%)";
        }, 500);

        removeOverlay("witch-overlay", 3000);

    }


    /* =====================================
       ANGEL ENTRANCE
    ===================================== */

    function triggerAngel() {

        const overlay = createOverlay(
            "angel-overlay",
            "LIGHT FROM HEAVEN",
            "radial-gradient(circle, rgba(255,235,180,0.95), rgba(120,100,60,0.5), #000)"
        );

        overlay.querySelector("div").style.color = "#fff5d8";

        overlay.querySelector("div").style.textShadow =
            "0 0 35px white, 0 0 80px gold";

        removeOverlay("angel-overlay", 3500);

    }


    /* =====================================
       HEAVEN AND HELL BATTLE
    ===================================== */

    function triggerBattle() {

        const overlay = createOverlay(
            "battle-overlay",
            "HEAVEN<br>VS<br>HELL",
            "linear-gradient(90deg, rgba(180,120,20,0.7), #050505 50%, rgba(120,0,0,0.8))"
        );

        overlay.querySelector("div").style.color = "#fff";

        triggerFlash();

        setTimeout(triggerFlash, 900);

        setTimeout(playThunder, 300);

        removeOverlay("battle-overlay", 3000);

    }


    /* =====================================
       WITCH DESTRUCTION
    ===================================== */

    function triggerWitchDestruction() {

        const overlay = createOverlay(
            "witch-destruction-overlay",
            "THE DARKNESS<br>IS DESTROYED",
            "radial-gradient(circle, rgba(255,190,80,0.8), rgba(0,0,0,0.98))"
        );

        triggerFlash();

        overlay.querySelector("div").style.color = "#fff2c7";

        removeOverlay(
            "witch-destruction-overlay",
            2500
        );

    }


    /* =====================================
       SCENE EFFECT ROUTER
    ===================================== */

    function runSceneEffect(effect) {

        switch (effect) {

            case "tattoo":
                triggerFlash();
                break;

            case "snake":
                triggerSnake();
                break;

            case "snake-death":
                triggerFlash();
                break;

            case "car-impact":
                triggerFlash();
                break;

            case "arrow":
                triggerFlash();
                break;

            case "fire":
                triggerFlash();
                break;

            case "church-storm":
                triggerFlash();
                playThunder();
                break;

            case "witch":
                triggerWitch();
                break;

            case "witch-attack":
                triggerFlash();
                playThunder();
                break;

            case "angel-entrance":
                triggerAngel();
                break;

            case "heaven-hell-battle":
                triggerBattle();
                break;

            case "witch-destruction":
                triggerWitchDestruction();
                break;

        }

    }


    /* =====================================
       SCENE MARKER OBSERVER
    ===================================== */

    const sceneMarkers =
        document.querySelectorAll(".scene-marker");

    const sceneObserver =
        new IntersectionObserver(entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                const effect =
                    entry.target.dataset.effect;

                if (!effect) return;

                if (triggeredEffects.has(effect)) return;

                triggeredEffects.add(effect);

                runSceneEffect(effect);

            });

        }, {
            threshold: 0.5
        });

    sceneMarkers.forEach(marker => {
        sceneObserver.observe(marker);
    });


    /* =====================================
       FINAL RED EYES
    ===================================== */

    const ending =
        document.getElementById("ending");

    let endingTriggered = false;

    if (ending) {

        const endingObserver =
            new IntersectionObserver(entries => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting &&
                        !endingTriggered
                    ) {

                        endingTriggered = true;

                        setTimeout(() => {

                            redEyes.classList.remove("active");

                            void redEyes.offsetWidth;

                            redEyes.classList.add("active");

                        }, 1800);

                    }

                });

            }, {
                threshold: 0.65
            });

        endingObserver.observe(ending);

    }


    /* =====================================
       FINAL INITIALIZATION
    ===================================== */

    console.log(
        "THE MYSTERY TATTOO — Reading Experience Loaded."
    );

});