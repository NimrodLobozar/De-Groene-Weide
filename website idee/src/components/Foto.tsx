import { useApp } from '../store/App'

/**
 * Een foto uit het beheer, of het placeholder-vak uit het prototype als er nog
 * geen foto voor deze plek is geüpload.
 */
export function Foto({
  sleutel,
  label,
  className = '',
  gras = false,
}: {
  sleutel: string
  label: string
  className?: string
  gras?: boolean
}) {
  const { foto } = useApp()
  const vers = foto[sleutel]

  if (!vers) {
    return (
      <div className={`fotovak ${gras ? 'fotovak--gras' : ''} ${className}`.trim()}>
        <span>{label}</span>
      </div>
    )
  }

  return (
    <img
      className={`foto ${className}`.trim()}
      src={`/api/media/${encodeURIComponent(sleutel)}?v=${encodeURIComponent(vers)}`}
      alt={label}
      loading="lazy"
    />
  )
}
