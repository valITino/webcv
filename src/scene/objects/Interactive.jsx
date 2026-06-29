import { useState } from 'react'
import { useStore } from '../../store/useStore.js'

// Wraps a clickable object: manages hover (tooltip + cursor) and click.
// `children` may be a function of `hovered` to drive hover scaling.
export default function Interactive({ kind, onClick, children, ...props }) {
  const setHovered = useStore((s) => s.setHovered)
  const [hovered, setHover] = useState(false)

  return (
    <group
      {...props}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHover(true)
        setHovered({ kind })
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        setHover(false)
        setHovered(null)
      }}
      onClick={(e) => {
        e.stopPropagation()
        onClick && onClick(e)
      }}
    >
      {typeof children === 'function' ? children(hovered) : children}
    </group>
  )
}
