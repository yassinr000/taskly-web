import { useEffect, useRef } from 'react'

// Appelle `callback` tout de suite, puis toutes les `delay` millisecondes.
export default function usePolling(callback, delay = 30000) {
  const saved = useRef(callback)

  useEffect(() => {
    saved.current = callback
  })

  useEffect(() => {
    saved.current()
    const id = setInterval(() => saved.current(), delay)
    return () => clearInterval(id)
  }, [delay])
}
