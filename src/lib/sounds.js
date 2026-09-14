// Semua efek suara dibuat langsung oleh browser lewat Web Audio API.
// Tidak ada file .mp3/.wav yang perlu di-hosting -> hemat kuota Storage Supabase.

let ctx = null
function getCtx() {
  if (!ctx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    ctx = new AudioContext()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function tone({ freq, duration = 0.18, type = 'sine', gain = 0.2, delay = 0, glideTo = null }) {
  const audioCtx = getCtx()
  const osc = audioCtx.createOscillator()
  const amp = audioCtx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay)
  if (glideTo) {
    osc.frequency.linearRampToValueAtTime(glideTo, audioCtx.currentTime + delay + duration)
  }
  amp.gain.setValueAtTime(0, audioCtx.currentTime + delay)
  amp.gain.linearRampToValueAtTime(gain, audioCtx.currentTime + delay + 0.02)
  amp.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + duration)
  osc.connect(amp)
  amp.connect(audioCtx.destination)
  osc.start(audioCtx.currentTime + delay)
  osc.stop(audioCtx.currentTime + delay + duration + 0.05)
}

export const sfx = {
  click() {
    tone({ freq: 520, duration: 0.06, type: 'square', gain: 0.08 })
  },
  correct() {
    tone({ freq: 523.25, duration: 0.12, type: 'sine', gain: 0.22 })
    tone({ freq: 659.25, duration: 0.12, type: 'sine', gain: 0.22, delay: 0.1 })
    tone({ freq: 783.99, duration: 0.22, type: 'sine', gain: 0.22, delay: 0.2 })
  },
  incorrect() {
    tone({ freq: 220, duration: 0.28, type: 'sawtooth', gain: 0.15, glideTo: 160 })
  },
  levelUp() {
    ;[523.25, 587.33, 659.25, 783.99, 1046.5].forEach((f, i) =>
      tone({ freq: f, duration: 0.2, type: 'triangle', gain: 0.18, delay: i * 0.09 })
    )
  },
  star() {
    tone({ freq: 987.77, duration: 0.15, type: 'sine', gain: 0.2 })
    tone({ freq: 1318.5, duration: 0.25, type: 'sine', gain: 0.2, delay: 0.08 })
  },
  drop() {
    tone({ freq: 300, duration: 0.1, type: 'triangle', gain: 0.15, glideTo: 180 })
  },
  whoosh() {
    tone({ freq: 900, duration: 0.2, type: 'sine', gain: 0.1, glideTo: 300 })
  },
}
