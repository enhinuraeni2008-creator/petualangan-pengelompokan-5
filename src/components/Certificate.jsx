import { useRef } from 'react'
import { Download, RotateCcw, Star } from 'lucide-react'
import { sfx } from '../lib/sounds'

export default function Certificate({ studentName, totalStars, totalScore, onRestart }) {
  const canvasRef = useRef(null)

  function drawCertificate() {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const W = 1200
    const H = 850
    canvas.width = W
    canvas.height = H

    // Latar
    const grad = ctx.createLinearGradient(0, 0, W, H)
    grad.addColorStop(0, '#CDEFFF')
    grad.addColorStop(1, '#FBF9F3')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)

    // Bingkai
    ctx.strokeStyle = '#3FA9E0'
    ctx.lineWidth = 14
    ctx.strokeRect(30, 30, W - 60, H - 60)
    ctx.strokeStyle = '#FFC93C'
    ctx.lineWidth = 5
    ctx.strokeRect(52, 52, W - 104, H - 104)

    ctx.textAlign = 'center'

    // Judul
    ctx.fillStyle = '#2B3A55'
    ctx.font = '700 34px Nunito, sans-serif'
    ctx.fillText('SERTIFIKAT KELULUSAN', W / 2, 150)

    ctx.font = '800 56px "Baloo 2", cursive'
    ctx.fillStyle = '#3FA9E0'
    ctx.fillText('Petualangan Pengelompokan 5', W / 2, 220)

    ctx.font = '600 26px Nunito, sans-serif'
    ctx.fillStyle = '#2B3A55'
    ctx.fillText('Diberikan dengan bangga kepada', W / 2, 300)

    ctx.font = '800 72px "Baloo 2", cursive'
    ctx.fillStyle = '#E24C3D'
    ctx.fillText(studentName || 'Siswa Hebat', W / 2, 400)

    ctx.font = '600 26px Nunito, sans-serif'
    ctx.fillStyle = '#2B3A55'
    ctx.fillText('atas keberhasilan menyelesaikan 4 Level permainan berhitung', W / 2, 460)
    ctx.fillText(`dengan total skor ${totalScore} dan ${totalStars} bintang`, W / 2, 495)

    // Bintang
    const starCount = Math.min(totalStars, 12)
    const starSize = 34
    const totalWidth = starCount * (starSize + 10)
    let sx = W / 2 - totalWidth / 2 + starSize / 2
    for (let i = 0; i < starCount; i++) {
      drawStar(ctx, sx, 560, starSize / 2, '#FFC93C', '#F2A900')
      sx += starSize + 10
    }

    // Tanggal & emoji
    ctx.font = '600 20px Nunito, sans-serif'
    ctx.fillStyle = '#2B3A55AA'
    const tanggal = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    ctx.fillText(tanggal, W / 2, 660)

    ctx.font = '80px serif'
    ctx.fillText('🧱🏆🎉', W / 2, 760)

    const link = document.createElement('a')
    link.download = `Sertifikat_${(studentName || 'Siswa').replace(/\s+/g, '_')}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    sfx.star()
  }

  function drawStar(ctx, cx, cy, r, fill, stroke) {
    ctx.beginPath()
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI / 5) * i - Math.PI / 2
      const radius = i % 2 === 0 ? r : r / 2.3
      const x = cx + radius * Math.cos(angle)
      const y = cy + radius * Math.sin(angle)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.fillStyle = fill
    ctx.fill()
    ctx.lineWidth = 2
    ctx.strokeStyle = stroke
    ctx.stroke()
  }

  return (
    <div className="min-h-screen px-4 py-10 flex flex-col items-center justify-center gap-6">
      <canvas ref={canvasRef} className="hidden" />

      <div className="w-full max-w-lg bg-white rounded-blob shadow-pop border-8 border-sun p-8 text-center relative overflow-hidden animate-pop">
        <div className="absolute inset-3 border-2 border-sky-light rounded-[1.6rem] pointer-events-none" />
        <p className="uppercase tracking-wide text-ink/50 font-bold text-xs mb-1">Sertifikat Kelulusan</p>
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-sky-deep mb-4">
          Petualangan Pengelompokan 5
        </h2>
        <p className="text-ink/60 font-semibold">Diberikan dengan bangga kepada</p>
        <p className="font-display font-extrabold text-3xl sm:text-4xl text-coral-dark my-3">
          {studentName || 'Siswa Hebat'}
        </p>
        <p className="text-ink/60 font-semibold text-sm px-2">
          atas keberhasilan menyelesaikan 4 Level permainan berhitung dengan total skor{' '}
          <span className="font-extrabold text-ink">{totalScore}</span>
        </p>

        <div className="flex justify-center gap-1 my-5">
          {Array.from({ length: Math.min(totalStars, 12) }).map((_, i) => (
            <Star key={i} className="fill-sun text-sun-dark animate-pop" size={26} style={{ animationDelay: `${i * 60}ms` }} />
          ))}
        </div>

        <p className="text-4xl">🧱🏆🎉</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-lg">
        <button
          onClick={drawCertificate}
          className="btn-pop flex-1 flex items-center justify-center gap-2 bg-sky-deep text-white font-display font-bold text-lg py-3.5 rounded-2xl shadow-pop"
        >
          <Download size={20} /> Unduh Sertifikat
        </button>
        <button
          onClick={onRestart}
          className="btn-pop flex-1 flex items-center justify-center gap-2 bg-cloud border-2 border-sky-light text-ink/70 font-display font-bold text-lg py-3.5 rounded-2xl"
        >
          <RotateCcw size={20} /> Main Lagi
        </button>
      </div>
    </div>
  )
}
