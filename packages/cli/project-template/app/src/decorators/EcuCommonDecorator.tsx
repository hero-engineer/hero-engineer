/* --
 * DO NOT DELETE THIS FILE
 * EcuCommonDecorator.tsx is used to decorate any Ecu component
 * Its primary role is to inject the index.css into the Ecu iframe
-- */
import { ReactNode, useEffect, useState } from 'react'

import indexCss from '../index.css?inline'

type EcuCommonDecoratorPropsType = {
  head?: HTMLHeadElement
  children: ReactNode
}

function EcuCommonDecorator({ children, head }: EcuCommonDecoratorPropsType) {
  const [styleElement, setStyleElement] = useState<HTMLStyleElement | null>(null)

  useEffect(() => {
    if (!head) return

    if (styleElement) {
      head.removeChild(styleElement)
    }

    const style = document.createElement('style')

    style.innerHTML = indexCss

    head.appendChild(style)

    setStyleElement(style)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [head])

  return children
}

export default EcuCommonDecorator
