const dogQuotes = [
    {
        beau: "moM!! happi bArkday. u r mY fav hooman. 🦴",
        juno: "WOOOF! 🎾 i luv u sO much. more than treats. ok same as treats."
    },
    {
        beau: "i promis i did nOt chew ur slipper today. probly.",
        juno: "steve said we can't have cake. but WE WANT CAKE. 🍰"
    },
    {
        beau: "tail wag cOunt fr u today: ∞ 🐾",
        juno: "i did zoomies 4 times this mornin. 4 U. 💨"
    },
    {
        beau: "r u the birthday girl? u smell like pure joy.",
        juno: "pls throw ball. also happi burfday. 💕🎾"
    },
    {
        beau: "wen u scrtch behind my ear, i see god.",
        juno: "u = best mOm. beau agrees. we voted. 🗳️"
    },
    {
        beau: "ethan shared his snack. u wud b prOud. 🥨",
        juno: "i luv u more than the mailman is annoying. an thats a LOT."
    }
]

const balloonColors = [
    '#ff6b9d', '#ffd93d', '#6bcf7f', '#4d96ff',
    '#c074ff', '#ff6b6b', '#ff9e7d', '#ffc0cb'
]

let quoteIndex = 0
let barkTextIndex = 0
const barkTexts = ['BARK BARK! 🐾', 'WOOF WOOF! 🐶', 'ARF ARF!! 🦴', 'BORK BORK! 💕']

window.addEventListener('load', () => {
    launchConfetti()
    startBalloons()
})

function launchConfetti() {
    const colors = ['#ff69b4', '#ff1493', '#ff85a2', '#ffb3c1', '#ffd700', '#ff6347', '#fff', '#ffdf00']
    const duration = 6000
    const end = Date.now() + duration

    confetti({
        particleCount: 150,
        spread: 100,
        origin: { x: 0.5, y: 0.3 },
        colors
    })

    const interval = setInterval(() => {
        if (Date.now() > end) {
            clearInterval(interval)
            return
        }
        confetti({ particleCount: 40, angle: 60, spread: 55, origin: { x: 0, y: 0.6 }, colors })
        confetti({ particleCount: 40, angle: 120, spread: 55, origin: { x: 1, y: 0.6 }, colors })
    }, 300)
}

/* ——— Bark ——— */
function bark() {
    const pair = dogQuotes[quoteIndex % dogQuotes.length]
    quoteIndex++

    const beauBubble = document.getElementById('beau-bubble')
    const junoBubble = document.getElementById('juno-bubble')

    setBubble(beauBubble, pair.beau)
    setBubble(junoBubble, pair.juno)

    flashBarkText()
    playBark()
}

function setBubble(el, text) {
    el.classList.remove('waiting', 'wobble')
    // Re-trigger animation
    void el.offsetWidth
    el.textContent = text
    el.classList.add('wobble')
}

function flashBarkText() {
    const flash = document.getElementById('bark-flash')
    flash.textContent = barkTexts[barkTextIndex % barkTexts.length]
    barkTextIndex++
    flash.classList.remove('fire')
    void flash.offsetWidth
    flash.classList.add('fire')
}

let audioCtx = null
function ensureAudioCtx() {
    try {
        if (!audioCtx) {
            const AC = window.AudioContext || window.webkitAudioContext
            if (!AC) return null
            audioCtx = new AC()
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume()
        }
        return audioCtx
    } catch (e) {
        return null
    }
}

function playBark() {
    const ctx = ensureAudioCtx()
    if (!ctx) return
    playRuff(ctx, 0)
    playRuff(ctx, 0.22)
}

function playRuff(ctx, delay) {
    const t0 = ctx.currentTime + delay
    const dur = 0.22

    // Main growly tone
    const osc1 = ctx.createOscillator()
    osc1.type = 'sawtooth'
    osc1.frequency.setValueAtTime(520, t0)
    osc1.frequency.exponentialRampToValueAtTime(260, t0 + 0.09)
    osc1.frequency.exponentialRampToValueAtTime(180, t0 + dur)

    // Bright harmonic for "ruff" bite
    const osc2 = ctx.createOscillator()
    osc2.type = 'square'
    osc2.frequency.setValueAtTime(780, t0)
    osc2.frequency.exponentialRampToValueAtTime(380, t0 + 0.1)

    // Low-pass to soften and keep it warm
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(1800, t0)
    filter.frequency.exponentialRampToValueAtTime(800, t0 + dur)
    filter.Q.value = 4

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.0001, t0)
    gain.gain.exponentialRampToValueAtTime(0.6, t0 + 0.015)
    gain.gain.exponentialRampToValueAtTime(0.15, t0 + 0.1)
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)

    osc1.connect(filter)
    osc2.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    osc1.start(t0)
    osc2.start(t0)
    osc1.stop(t0 + dur + 0.02)
    osc2.stop(t0 + dur + 0.02)
}

/* ——— Balloons ——— */
function startBalloons() {
    // Seed a few so the page isn't empty
    for (let i = 0; i < 4; i++) {
        setTimeout(spawnBalloon, i * 700)
    }
    setInterval(() => {
        const layer = document.getElementById('balloons-layer')
        if (!layer) return
        if (layer.childElementCount < 10) spawnBalloon()
    }, 2200)
}

function spawnBalloon() {
    const layer = document.getElementById('balloons-layer')
    if (!layer) return

    const balloon = document.createElement('div')
    balloon.className = 'balloon'
    const color = balloonColors[Math.floor(Math.random() * balloonColors.length)]
    balloon.style.setProperty('--balloon-color', color)
    balloon.style.left = `${5 + Math.random() * 90}%`
    const duration = 14 + Math.random() * 10
    balloon.style.animationDuration = `${duration}s`
    balloon.style.animationDelay = `${Math.random() * -2}s`

    const pop = (e) => {
        if (e) e.preventDefault()
        popBalloon(balloon)
    }
    balloon.addEventListener('click', pop)

    balloon.addEventListener('animationend', () => {
        if (balloon.parentNode) balloon.parentNode.removeChild(balloon)
    })

    layer.appendChild(balloon)
}

function popBalloon(balloon) {
    if (balloon.dataset.popped) return
    balloon.dataset.popped = '1'

    const rect = balloon.getBoundingClientRect()
    const x = (rect.left + rect.width / 2) / window.innerWidth
    const y = (rect.top + rect.height / 2) / window.innerHeight

    if (typeof confetti === 'function') {
        confetti({
            particleCount: 30,
            spread: 60,
            startVelocity: 28,
            origin: { x, y },
            colors: ['#ff69b4', '#ffd700', '#ff6347', '#fff', '#ff85a2', '#c074ff']
        })
    }

    balloon.classList.add('popped')
    setTimeout(() => {
        if (balloon.parentNode) balloon.parentNode.removeChild(balloon)
    }, 380)
}
