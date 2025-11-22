"use client"
import { useState, useMemo } from "react"

interface Props {
  src?: string | null
  alt?: string
  className?: string
  title?: string
}

function svgDataUrl(title = "Image", w = 800, h = 450) {
  const safe = (title || "").replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>` +
    `<defs><linearGradient id='g' x1='0' x2='1'><stop offset='0%' stop-color='#f0fdf4'/><stop offset='100%' stop-color='#fef3c7'/></linearGradient></defs>` +
    `<rect width='100%' height='100%' fill='url(#g)'/>` +
    `<text x='50%' y='50%' font-family='Inter, Arial, Helvetica, sans-serif' font-size='22' fill='#111827' text-anchor='middle' dominant-baseline='middle'>${safe}</text>` +
    `</svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export default function OptimizedImage({ src, alt, className = "", title }: Props) {
  const [currentSrc, setCurrentSrc] = useState<string | undefined | null>(src || undefined)
  const placeholder = useMemo(() => svgDataUrl(title || alt || "Image"), [title, alt])

  const handleError = () => {
    if (currentSrc === placeholder) return
    setCurrentSrc(placeholder)
  }

  return (
    // width/height help browser reserve layout space; CSS keeps it responsive
    <img
      src={currentSrc || placeholder}
      alt={alt || title || "Image"}
      loading="lazy"
      decoding="async"
      width={800}
      height={450}
      onError={handleError}
      className={`${className} w-full h-full object-cover bg-gray-50`}
    />
  )
}
