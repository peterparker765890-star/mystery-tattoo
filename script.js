/* =========================================================
   THE MYSTERY TATTOO
   CINEMATIC PSYCHOLOGICAL HORROR ENGINE
   VERSION 2.0
   DESIGNED & DEVELOPED BY SABARISH P
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";

    /* =====================================================
       1. ELEMENT REFERENCES
       ===================================================== */

    const soundButton = document.getElementById("soundToggle");
    const snowButton = document.getElementById("snowToggle");

    const canvas = document.getElementById("snow");
    const flash = document.getElementById("flash");
    const snake = document.getElementById("snake");
    const eyes = document.getElementById("red-eyes");

    const progressBar = document.getElementById("progressBar");

    const finalTrigger = document.querySelector(
        ".final-eyes-trigger"
    );

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* =====================================================
       2. GLOBAL SETTINGS
       ===================================================== */

    const SETTINGS = {
        thunderVolume: 0.55,
        rainVolume: 0.035,

        lightningMinimum: 10000,
        lightningMaximum: 18000,

        thunderDelayMinimum: 650,
        thunderDelayMaximum: 1100,

        eyeRevealDelay: 1800
    };


    /* =====================================================
       3. AUDIO ENGINE
       ===================================================== */

    let audioContext = null;
    let masterGain = null;

    let soundEnabled = false;

    let rainSource = null;
    let rainGain = null;

    const activeSources = new Set();

    function initializeAudio() {

        if (audioContext) {
            return audioContext.resume();
        }

        const AudioContextClass =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContextClass) {
            throw new Error("Web Audio is not supported.");
        }

        audioContext = new AudioContextClass();

        masterGain = audioContext.createGain();

        masterGain.gain.value = 0;

        masterGain.connect(audioContext.destination);

        return audioContext.resume();
    }


    function registerSource(source) {

        activeSources.add(source);

        source.addEventListener("ended", () => {
            activeSources.delete(source);
        }, { once: true });

        return source;
    }


    function restoreAudioVolume() {

        if (!audioContext || !masterGain) return;

        const now = audioContext.currentTime;

        masterGain.gain.cancelScheduledValues(now);

        masterGain.gain.setTargetAtTime(
            0.65,
            now,
            0.15
        );
    }


    function muteAudioImmediately() {

        if (!audioContext || !masterGain) return;

        const now = audioContext.currentTime;

        masterGain.gain.cancelScheduledValues(now);

        masterGain.gain.setValueAtTime(0, now);

        activeSources.forEach(source => {

            try {
                source.stop();
            } catch (error) {
                // Already stopped.
            }

        });

        activeSources.clear();

        rainSource = null;
        rainGain = null;
    }


    /* =====================================================
       4. AUDIO NOISE GENERATOR
       ===================================================== */

    function createNoiseBuffer(duration) {

        const sampleRate = audioContext.sampleRate;

        const buffer = audioContext.createBuffer(
            1,
            Math.ceil(sampleRate * duration),
            sampleRate
        );

        const data = buffer.getChannelData(0);

        for (let i = 0; i < data.length; i++) {

            data[i] = Math.random() * 2 - 1;

        }

        return buffer;
    }


    /* =====================================================
       5. CINEMATIC THUNDER
       ===================================================== */

    function playThunder() {

        if (!soundEnabled || !audioContext) return;

        const now = audioContext.currentTime;

        /* Main low-frequency thunder */

        const rumble = audioContext.createBufferSource();

        rumble.buffer = createNoiseBuffer(8);

        const rumbleFilter =
            audioContext.createBiquadFilter();

        rumbleFilter.type = "lowpass";
        rumbleFilter.frequency.value = 110;
        rumbleFilter.Q.value = 0.65;

        const rumbleGain = audioContext.createGain();

        rumbleGain.gain.setValueAtTime(0.001, now);

        rumbleGain.gain.linearRampToValueAtTime(
            SETTINGS.thunderVolume,
            now + 0.9
        );

        rumbleGain.gain.exponentialRampToValueAtTime(
            0.001,
            now + 8
        );

        rumble.connect(rumbleFilter);

        rumbleFilter.connect(rumbleGain);

        rumbleGain.connect(masterGain);

        registerSource(rumble);

        rumble.start(now);


        /* Secondary distant rolling thunder */

        const distant = audioContext.createBufferSource();

        distant.buffer = createNoiseBuffer(6);

        const distantFilter =
            audioContext.createBiquadFilter();

        distantFilter.type = "lowpass";
        distantFilter.frequency.value = 65;

        const distantGain = audioContext.createGain();

        distantGain.gain.setValueAtTime(0.001, now + 0.5);

        distantGain.gain.linearRampToValueAtTime(
            0.2,
            now + 2.2
        );

        distantGain.gain.exponentialRampToValueAtTime(
            0.001,
            now + 6
        );

        distant.connect(distantFilter);

        distantFilter.connect(distantGain);

        distantGain.connect(masterGain);

        registerSource(distant);

        distant.start(now + 0.5);
    }


    /* =====================================================
       6. RAIN AMBIENCE
       ===================================================== */

    function startRainAmbience() {

        if (!soundEnabled || !audioContext) return;

        if (rainSource) return;

        rainSource = audioContext.createBufferSource();

        rainSource.buffer = createNoiseBuffer(5);

        rainSource.loop = true;

        const filter =
            audioContext.createBiquadFilter();

        filter.type = "lowpass";
        filter.frequency.value = 850;

        rainGain = audioContext.createGain();

        rainGain.gain.value = SETTINGS.rainVolume;

        rainSource.connect(filter);

        filter.connect(rainGain);

        rainGain.connect(masterGain);

        registerSource(rainSource);

        rainSource.start();
    }


    /* =====================================================
       7. SOUND CONFIRMATION
       ===================================================== */

    function playConfirmation() {

        if (!soundEnabled || !audioContext) return;

        const oscillator =
            audioContext.createOscillator();

        const gain = audioContext.createGain();

        oscillator.type = "sine";

        oscillator.frequency.value = 440;

        const now = audioContext.currentTime;

        gain.gain.setValueAtTime(0.001, now);

        gain.gain.linearRampToValueAtTime(
            0.04,
            now + 0.04
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            now + 0.22
        );

        oscillator.connect(gain);

        gain.connect(masterGain);

        registerSource(oscillator);

        oscillator.start(now);

        oscillator.stop(now + 0.25);
    }


    /* =====================================================
       8. SOUND BUTTON
       ===================================================== */

    if (soundButton) {

        soundButton.textContent = "SOUND: OFF";

        soundButton.setAttribute(
            "aria-pressed",
            "false"
        );

        soundButton.addEventListener(
            "click",
            async () => {

                if (!soundEnabled) {

                    try {

                        await initializeAudio();

                        soundEnabled = true;

                        restoreAudioVolume();

                        soundButton.textContent =
                            "SOUND: ON";

                        soundButton.setAttribute(
                            "aria-pressed",
                            "true"
                        );

                        playConfirmation();

                        setTimeout(() => {

                            if (soundEnabled) {
                                startRainAmbience();
                            }

                        }, 300);

                    } catch (error) {

                        soundEnabled = false;

                        soundButton.textContent =
                            "SOUND UNAVAILABLE";

                        console.error(
                            "Audio initialization failed:",
                            error
                        );
                    }

                } else {

                    soundEnabled = false;

                    muteAudioImmediately();

                    soundButton.textContent =
                        "SOUND: OFF";

                    soundButton.setAttribute(
                        "aria-pressed",
                        "false"
                    );
                }

            }
        );
    }


    /* =====================================================
       9. LIGHTNING EFFECT
       ===================================================== */

    let lightningInProgress = false;

    function triggerLightning() {

        if (!flash || lightningInProgress) return;

        lightningInProgress = true;

        flash.classList.remove("active");

        void flash.offsetWidth;

        flash.classList.add("active");

        setTimeout(() => {

            flash.classList.remove("active");

            lightningInProgress = false;

        }, 850);
    }


    /* =====================================================
       10. LIGHTNING + DELAYED THUNDER
       ===================================================== */

    function triggerLightningAndThunder() {

        triggerLightning();

        if (!soundEnabled) return;

        const delay =
            SETTINGS.thunderDelayMinimum +
            Math.random() *
            (
                SETTINGS.thunderDelayMaximum -
                SETTINGS.thunderDelayMinimum
            );

        setTimeout(() => {

            if (soundEnabled) {
                playThunder();
            }

        }, delay);
    }


    /* =====================================================
       11. STORM SYSTEM
       ===================================================== */

    let stormTimer = null;

    function randomStormDelay() {

        return SETTINGS.lightningMinimum +
            Math.random() *
            (
                SETTINGS.lightningMaximum -
                SETTINGS.lightningMinimum
            );
    }


    function scheduleStormLightning() {

        if (!document.body.classList.contains("mode-storm")) {
            return;
        }

        stormTimer = setTimeout(() => {

            if (
                document.body.classList.contains("mode-storm")
            ) {

                if (Math.random() > 0.4) {
                    triggerLightningAndThunder();
                }

                scheduleStormLightning();
            }

        }, randomStormDelay());
    }


    function startStorm() {

        document.body.classList.add("mode-storm");

        if (reducedMotion || stormTimer) return;

        scheduleStormLightning();
    }


    function stopStorm() {

        document.body.classList.remove("mode-storm");

        if (stormTimer) {

            clearTimeout(stormTimer);

            stormTimer = null;
        }
    }


    /* =====================================================
       12. SCENE EFFECT SYSTEM
       ===================================================== */

    function triggerScene(effect) {

        switch (effect) {

            case "tattoo":

                document.body.classList.add(
                    "tattoo-reveal"
                );

                break;


            case "snake":

                if (snake) {

                    snake.classList.remove("active");

                    void snake.offsetWidth;

                    snake.classList.add("active");
                }

                break;


            case "snake-death":

                triggerLightning();

                break;


            case "car-impact":

                triggerLightning();

                break;


            case "arrow":

                triggerLightning();

                break;


            case "fire":

                document.body.classList.add("mode-hell");

                break;


            case "fire-death":

                document.body.classList.remove("mode-hell");

                break;


            case "church-storm":

                startStorm();

                triggerLightningAndThunder();

                break;


            case "witch":

                document.body.classList.add("mode-hell");

                break;


            case "witch-attack":

                triggerLightningAndThunder();

                break;


            case "angel-entrance":

                document.body.classList.remove("mode-hell");

                document.body.classList.add("mode-heaven");

                break;


            case "heaven-hell-battle":

                triggerLightningAndThunder();

                break;


            case "witch-destruction":

                document.body.classList.remove("mode-hell");

                triggerLightningAndThunder();

                break;


            case "church-collapse":

                triggerLightningAndThunder();

                break;
        }
    }


    /* =====================================================
       13. SCENE MARKER OBSERVER
       ===================================================== */

    const sceneMarkers = document.querySelectorAll(
        ".scene-marker[data-effect]"
    );

    const sceneObserver = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    const effect =
                        entry.target.dataset.effect;

                    triggerScene(effect);
                }

            });

        },
        {
            threshold: 0.2
        }
    );

    sceneMarkers.forEach(marker => {

        sceneObserver.observe(marker);

    });


    /* =====================================================
       14. FINAL EYES REVEAL
       ===================================================== */

    let eyesRevealed = false;

    if (finalTrigger && eyes) {

        const eyesObserver = new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting &&
                        !eyesRevealed
                    ) {

                        eyesRevealed = true;

                        setTimeout(() => {

                            document.body.classList.add(
                                "final-darkness"
                            );

                            setTimeout(() => {

                                eyes.classList.add("active");

                            }, SETTINGS.eyeRevealDelay);

                        }, 1500);
                    }

                });

            },
            {
                threshold: 0.4
            }
        );

        eyesObserver.observe(finalTrigger);
    }


    /* =====================================================
       15. SNOW ANIMATION
       ===================================================== */

    let snowEnabled = true;

    let snowflakes = [];

    const ctx = canvas
        ? canvas.getContext("2d")
        : null;


    function resizeSnow() {

        if (!canvas || !ctx) return;

        const ratio = Math.min(
            window.devicePixelRatio || 1,
            2
        );

        canvas.width = window.innerWidth * ratio;

        canvas.height = window.innerHeight * ratio;

        canvas.style.width = window.innerWidth + "px";

        canvas.style.height = window.innerHeight + "px";

        ctx.setTransform(
            ratio,
            0,
            0,
            ratio,
            0,
            0
        );

        snowflakes = [];

        const count = Math.min(
            65,
            Math.floor(window.innerWidth / 8)
        );

        for (let i = 0; i < count; i++) {

            snowflakes.push({

                x: Math.random() * window.innerWidth,

                y: Math.random() * window.innerHeight,

                radius: Math.random() * 1.8 + 0.5,

                speed: Math.random() * 0.65 + 0.2,

                drift: Math.random() * 0.5 - 0.25,

                opacity: Math.random() * 0.45 + 0.15
            });
        }
    }


    function animateSnow() {

        if (!canvas || !ctx) return;

        ctx.clearRect(
            0,
            0,
            window.innerWidth,
            window.innerHeight
        );

        if (snowEnabled) {

            snowflakes.forEach(flake => {

                ctx.beginPath();

                ctx.arc(
                    flake.x,
                    flake.y,
                    flake.radius,
                    0,
                    Math.PI * 2
                );

                ctx.fillStyle =
                    `rgba(225,225,225,${flake.opacity})`;

                ctx.fill();

                flake.y += flake.speed;

                flake.x += flake.drift;

                if (flake.y > window.innerHeight) {

                    flake.y = -5;

                    flake.x =
                        Math.random() * window.innerWidth;
                }

                if (flake.x > window.innerWidth) {
                    flake.x = 0;
                }

                if (flake.x < 0) {
                    flake.x = window.innerWidth;
                }

            });
        }

        requestAnimationFrame(animateSnow);
    }


    if (canvas && ctx) {

        resizeSnow();

        animateSnow();

        window.addEventListener(
            "resize",
            resizeSnow
        );
    }


    /* =====================================================
       16. SNOW TOGGLE
       ===================================================== */

    if (snowButton) {

        snowButton.textContent = "SNOW: ON";

        snowButton.setAttribute(
            "aria-pressed",
            "true"
        );

        snowButton.addEventListener("click", () => {

            snowEnabled = !snowEnabled;

            snowButton.textContent = snowEnabled
                ? "SNOW: ON"
                : "SNOW: OFF";

            snowButton.setAttribute(
                "aria-pressed",
                String(snowEnabled)
            );
        });
    }


    /* =====================================================
       17. READING PROGRESS
       ===================================================== */

    function updateProgress() {

        if (!progressBar) return;

        const scrollTop =
            window.scrollY ||
            document.documentElement.scrollTop;

        const scrollHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;

        const progress = scrollHeight > 0
            ? (scrollTop / scrollHeight) * 100
            : 0;

        progressBar.style.width =
            Math.min(
                100,
                Math.max(0, progress)
            ) + "%";
    }


    window.addEventListener(
        "scroll",
        updateProgress,
        { passive: true }
    );

    window.addEventListener(
        "resize",
        updateProgress
    );

    updateProgress();


    /* =====================================================
       18. PAGE CLEANUP
       ===================================================== */

    window.addEventListener("pagehide", () => {

        stopStorm();

        soundEnabled = false;

        muteAudioImmediately();

    });


    /* =====================================================
       19. INITIALIZATION
       ===================================================== */

    console.log(
        "%cTHE MYSTERY TATTOO",
        "color:#c6a45c;font-size:20px;font-weight:bold;"
    );

    console.log(
        "%cCinematic Horror Engine Loaded",
        "color:#999;font-size:12px;"
    );

});