function Block({ color, label, delay = 0 }) {
  const palette = {
    yellow: { fill: '#FFC93C', stroke: '#F2A900', text: '#7A4E00' },
    red: { fill: '#FF6B5B', stroke: '#E24C3D', text: '#7A1C12' },
  }[color]

  return (
    <div
      className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center font-display font-bold text-lg sm:text-xl shadow-popSmall animate-pop shrink-0"
      style={{
        background: palette.fill,
        border: `3px solid ${palette.stroke}`,
        color: palette.text,
        animationDelay: `${delay}ms`,
      }}
    >
      {label}
    </div>
  )
}

function Hand({ raised, side = 'left' }) {
  // raised: jumlah jari terangkat, 0-5
  const fingers = [0, 1, 2, 3, 4]
  return (
    <div className="flex flex-col items-center gap-1" aria-label={`Tangan ${side} menunjukkan ${raised} jari`}>
      <div className="flex gap-1 items-end h-10 sm:h-12">
        {fingers.map((f) => (
          <div
            key={f}
            className={`w-2.5 sm:w-3 rounded-full transition-all duration-300 ${
              f < raised ? 'bg-sky-deep h-10 sm:h-12' : 'bg-sky-light/70 h-4'
            }`}
          />
        ))}
      </div>
      <div className="w-11 sm:w-14 h-6 sm:h-7 rounded-t-full bg-sky-deep" />
    </div>
  )
}

/**
 * Menampilkan representasi visual sebuah angka:
 * - Balok Kuning (bernilai 5) & Balok Merah (bernilai 1)
 * - Dua tangan dengan jari yang terangkat sesuai jumlah
 */
export default function BlockVisual({
  yellow = 0,
  red = 0,
  handLeft = 0,
  handRight = 0,
  showBlocks = true,
  showHands = true,
  size = 'default',
}) {
  return (
    <div className={`flex flex-col items-center gap-4 ${size === 'small' ? 'scale-90' : ''}`}>
      {showBlocks && (yellow > 0 || red > 0) && (
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-xs">
          {Array.from({ length: yellow }).map((_, i) => (
            <Block key={`y-${i}`} color="yellow" label="5" delay={i * 60} />
          ))}
          {Array.from({ length: red }).map((_, i) => (
            <Block key={`r-${i}`} color="red" label="1" delay={(yellow + i) * 60} />
          ))}
        </div>
      )}
      {showHands && (
        <div className="flex items-end gap-4 sm:gap-6">
          <Hand raised={handLeft} side="kiri" />
          <Hand raised={handRight} side="kanan" />
        </div>
      )}
    </div>
  )
}
