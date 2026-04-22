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
function playBark() {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)()
        }
        // Two quick "ruffs"
        playRuff(audioCtx, 0)
        playRuff(audioCtx, 0.18)
    } catch (e) {
        // Audio unavailable; silent fallback
    }
}

function playRuff(ctx, delay) {
    const t0 = ctx.currentTime + delay
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(260, t0)
    osc.frequency.exponentialRampToValueAtTime(140, t0 + 0.09)
    gain.gain.setValueAtTime(0.0001, t0)
    gain.gain.exponentialRampToValueAtTime(0.25, t0 + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.12)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t0)
    osc.stop(t0 + 0.14)
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
