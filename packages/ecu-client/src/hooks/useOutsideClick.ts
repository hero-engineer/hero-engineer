import { useEffect, useState } from 'react'

function useOutsideClick(el: HTMLElement | null, handler: (event: MouseEvent | TouchEvent) => void, preventFirstFire = false) {
  const [firstFire, setFirstFire] = useState(true)

  useEffect(() => {
    if (!el) return

    function handleClick(event: MouseEvent | TouchEvent) {
      if (!el && preventFirstFire && !firstFire) {
        setFirstFire(true)

        return
      }
      if (!el || el.contains(event.target as Node)) return
      if (firstFire && preventFirstFire) {
        setFirstFire(false)

        return
      }

      handler(event)
    }

    document.addEventListener('click', handleClick)
    document.addEventListener('touchstart', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('touchstart', handleClick)
    }
  }, [el, handler, firstFire, preventFirstFire])
}

export default useOutsideClick
