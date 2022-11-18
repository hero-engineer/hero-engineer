import { RefObject, useEffect, useState } from 'react'

function useOutsideClick(ref: RefObject<HTMLElement>, handler: (event: MouseEvent | TouchEvent) => void, preventFirstFire = false) {
  const [firstFire, setFirstFire] = useState(true)

  useEffect(() => {
    function handleClick(event: MouseEvent | TouchEvent) {
      console.log('firstFire', firstFire)

      if (!ref.current && preventFirstFire) {
        console.log('reset')
        setFirstFire(true)

        return
      }
      if (!ref.current || ref.current.contains(event.target as Node)) return

      if (preventFirstFire && firstFire) {
        console.log('prevented')
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
  // Do not add [ref, handler] here as may cause a bug where only the last useOutsideClick works
  // eslint-disable-next-line
  }, [ref.current, handler, preventFirstFire, firstFire])
}

export default useOutsideClick
