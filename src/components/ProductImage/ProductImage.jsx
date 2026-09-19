import { useState } from 'react'

/**
 * Imagem de produto com placeholder elegante.
 * Se o arquivo não existir / falhar, mostra um bloco neutro em vez de imagem quebrada.
 */
export default function ProductImage({ src, alt = '', className = '', ...props }) {
  const [failed, setFailed] = useState(false)

  if (failed || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-mist ${className}`}
      >
        <span className="text-[9px] uppercase tracking-label text-muted">sem imagem</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      draggable={false}
      onError={() => setFailed(true)}
      className={className}
      {...props}
    />
  )
}
