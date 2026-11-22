/* ==========================================
   THE HARBOUR
   THE MYSTERY TATTOO
   CINEMATIC HORROR ENGINE
========================================== */


/* ==========================================
   1. CINEMATIC SNOWFALL
========================================== */

const canvas = document.getElementById("snow");
const ctx = canvas.getContext("2d");

let snowflakes = [];
let snowEnabled = true;

function resizeSnow() {

    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;

    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    ctx.setTransform(
        devicePixelRatio,
        0,
        0,
        devicePixelRatio,
        0,
        0
    );

    snowflakes = [];

    const count = Math.min(
        180,
        Math.floor(window.innerWidth / 5)
    );

    for (let i = 0; i < count; i++) {

        snowflakes.push({

            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,

            radius: Math.random() * 2.5 + 0.5,

            speed: Math.random() * 0.9 + 0.3,

            drift: Math.random() * 0.8 - 0.4,

            opacity: Math.random() * 0.65 + 0.2,

            phase: Math.random() * Math.PI * 2

        });

    }

}

function drawSnow() {

    ctx.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
    );

    if (snowEnabled) {

        snowflakes.forEach(flake => {

            flake.phase += 0.01;

            flake.x +=
                flake.drift +
                Math.sin(flake.phase) * 0.25;

            flake.y += flake.speed;

            if (flake.y > window.innerHeight + 5) {

                flake.y = -5;

                flake.x =
                    Math.random() * window.innerWidth;

            }

            if (flake.x > window.innerWidth + 5) {
                flake.x = -5;
            }

            if (flake.x < -5) {
                flake.x = window.innerWidth + 5;
            }

            ctx.beginPath();

            ctx.arc(
                flake.x,
                flake.y,
                flake.radius,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                `rgba(255,255,255,${flake.opacity})`;

            ctx.shadowBlur = flake.radius * 5;

            ctx.shadowColor = "white";

            ctx.fill();

        });

    }

    ctx.shadowBlur = 0;

    requestAnimationFrame(drawSnow);

}

resizeSnow();

drawSnow();

window.addEventListener("resize", resizeSnow);


/* ==========================================
   2. SNOW CONTROL
========================================== */

const snowButton = document.getElementById("snowBtn");

if (snowButton) {

    snowButton.addEventListener("click", function () {

        snowEnabled = !snowEnabled;

        this.textContent =
            snowEnabled ? "SNOW: ON" : "SNOW: OFF";

        this.classList.toggle(
            "active",
            snowEnabled
        );

    });

}


/* ==========================================
   3. CINEMATIC CHAPTER REVEAL
========================================== */

const chapterObserver = new IntersectionObserver(

    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

            }

        });

    },

    {
        threshold: 0.08
    }

);

document.querySelectorAll(".chapter").forEach(chapter => {

    chapterObserver.observe(chapter);

});


/* ==========================================
   4. HORROR AUDIO ENGINE
========================================== */

let audioContext = null;

let masterGain = null;

let soundEnabled = false;

let ambientTimer = null;


function initializeAudio() {

    if (audioContext) return;

    audioContext = new (
        window.AudioContext ||
        window.webkitAudioContext
    )();

    masterGain = audioContext.createGain();

    masterGain.gain.value = 0.32;

    masterGain.connect(
        audioContext.destination
    );

}


/* ==========================================
   5. ATMOSPHERIC WIND
========================================== */

function playWind() {

    if (!soundEnabled) return;

    const duration = 4;

    const buffer = audioContext.createBuffer(
        1,
        audioContext.sampleRate * duration,
        audioContext.sampleRate
    );

    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {

        data[i] = (Math.random() * 2 - 1) * 0.5;

    }

    const source = audioContext.createBufferSource();

    const filter = audioContext.createBiquadFilter();

    const gain = audioContext.createGain();

    source.buffer = buffer;

    filter.type = "lowpass";

    filter.frequency.value = 280;

    gain.gain.setValueAtTime(
        0.0001,
        audioContext.currentTime
    );

    gain.gain.linearRampToValueAtTime(
        0.13,
        audioContext.currentTime + 1
    );

    gain.gain.linearRampToValueAtTime(
        0.0001,
        audioContext.currentTime + duration
    );

    source.connect(filter);

    filter.connect(gain);

    gain.connect(masterGain);

    source.start();

}


/* ==========================================
   6. DEEP THUNDER
========================================== */

function playThunder() {

    if (!soundEnabled) return;

    const duration = 3.5;

    const buffer = audioContext.createBuffer(
        1,
        audioContext.sampleRate * duration,
        audioContext.sampleRate
    );

    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {

        const envelope = Math.pow(
            1 - i / data.length,
            2
        );

        data[i] =
            (Math.random() * 2 - 1) * envelope;

    }

    const source = audioContext.createBufferSource();

    const filter = audioContext.createBiquadFilter();

    const gain = audioContext.createGain();

    source.buffer = buffer;

    filter.type = "lowpass";

    filter.frequency.value = 180;

    gain.gain.setValueAtTime(
        0.65,
        audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + duration
    );

    source.connect(filter);

    filter.connect(gain);

    gain.connect(masterGain);

    source.start();

    setTimeout(() => {

        if (soundEnabled) {

            playThunderRumble();

        }

    }, 700);

}


function playThunderRumble() {

    if (!soundEnabled) return;

    const oscillator = audioContext.createOscillator();

    const gain = audioContext.createGain();

    oscillator.type = "sine";

    oscillator.frequency.setValueAtTime(
        55,
        audioContext.currentTime
    );

    oscillator.frequency.exponentialRampToValueAtTime(
        28,
        audioContext.currentTime + 2
    );

    gain.gain.setValueAtTime(
        0.001,
        audioContext.currentTime
    );

    gain.gain.linearRampToValueAtTime(
        0.25,
        audioContext.currentTime + 0.2
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 2.5
    );

    oscillator.connect(gain);

    gain.connect(masterGain);

    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + 2.5
    );

}


/* ==========================================
   7. CINEMATIC IMPACT
========================================== */

function playImpact() {

    if (!soundEnabled) return;

    const now = audioContext.currentTime;

    const oscillator = audioContext.createOscillator();

    const gain = audioContext.createGain();

    oscillator.type = "sawtooth";

    oscillator.frequency.setValueAtTime(
        120,
        now
    );

    oscillator.frequency.exponentialRampToValueAtTime(
        25,
        now + 0.45
    );

    gain.gain.setValueAtTime(0.001, now);

    gain.gain.linearRampToValueAtTime(
        0.9,
        now + 0.015
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        now + 0.8
    );

    oscillator.connect(gain);

    gain.connect(masterGain);

    oscillator.start();

    oscillator.stop(now + 0.8);

}


/* ==========================================
   8. HORROR STINGER
========================================== */

function playStinger() {

    if (!soundEnabled) return;

    const now = audioContext.currentTime;

    const oscillator = audioContext.createOscillator();

    const gain = audioContext.createGain();

    oscillator.type = "triangle";

    oscillator.frequency.setValueAtTime(
        950,
        now
    );

    oscillator.frequency.exponentialRampToValueAtTime(
        75,
        now + 1.1
    );

    gain.gain.setValueAtTime(0.001, now);

    gain.gain.linearRampToValueAtTime(
        0.55,
        now + 0.025
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        now + 1.2
    );

    oscillator.connect(gain);

    gain.connect(masterGain);

    oscillator.start();

    oscillator.stop(now + 1.2);

}


/* ==========================================
   9. AMBIENT SOUND MANAGEMENT
========================================== */

function startAmbient() {

    stopAmbient();

    playWind();

    ambientTimer = setInterval(() => {

        if (!soundEnabled) return;

        playWind();

        if (Math.random() > 0.65) {

            setTimeout(() => {

                if (soundEnabled) {

                    playThunder();

                }

            }, Math.random() * 1200);

        }

    }, 6500);

}


function stopAmbient() {

    if (ambientTimer) {

        clearInterval(ambientTimer);

        ambientTimer = null;

    }

}


/* ==========================================
   10. SOUND BUTTON
========================================== */

const soundButton = document.getElementById("soundBtn");

if (soundButton) {

    soundButton.addEventListener("click", async function () {

        initializeAudio();

        if (audioContext.state === "suspended") {

            await audioContext.resume();

        }

        soundEnabled = !soundEnabled;

        this.textContent =
            soundEnabled ? "SOUND: ON" : "SOUND: OFF";

        this.classList.toggle(
            "active",
            soundEnabled
        );

        if (soundEnabled) {

            startAmbient();

        } else {

            stopAmbient();

        }

    });

}


/* ==========================================
   11. CINEMATIC FLASH
========================================== */

function triggerFlash() {

    const flash = document.getElementById("flash");

    if (!flash) return;

    flash.classList.remove("trigger");

    void flash.offsetWidth;

    flash.classList.add("trigger");

}


/* ==========================================
   12. STORY JUMP-SCARE SEQUENCES
========================================== */

const scareScenes = [

    {
        id: "chapter2",
        sound: playStinger
    },

    {
        id: "chapter3",
        sound: playImpact
    },

    {
        id: "chapter4",
        sound: playStinger
    },

    {
        id: "chapter6",
        sound: playImpact
    },

    {
        id: "chapter7",
        sound: playThunder,
        flash: true
    },

    {
        id: "chapter8",
        sound: playStinger,
        flash: true
    }

];


const playedScares = new Set();


const scareObserver = new IntersectionObserver(

    entries => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            if (!soundEnabled) return;

            const scene = scareScenes.find(
                item => item.id === entry.target.id
            );

            if (!scene) return;

            if (playedScares.has(scene.id)) return;

            playedScares.add(scene.id);

            scene.sound();

            if (scene.flash) {

                triggerFlash();

            }

        });

    },

    {
        threshold: 0.65
    }

);


scareScenes.forEach(scene => {

    const element = document.getElementById(
        scene.id
    );

    if (element) {

        scareObserver.observe(element);

    }

});


/* ==========================================
   13. PAGE VISIBILITY AUDIO MANAGEMENT
========================================== */

document.addEventListener(
    "visibilitychange",
    () => {

        if (!audioContext) return;

        if (document.hidden) {

            audioContext.suspend();

        } else if (soundEnabled) {

            audioContext.resume();

        }

    }
);


/* ==========================================
   14. CLEAN INITIALIZATION
========================================== */

console.log(
    "THE HARBOUR | THE MYSTERY TATTOO"
);

console.log(
    "Cinematic horror experience initialized."
);