/* --
 * DO NOT DELETE THIS FILE
 * HeroEngineerDecorator.tsx is used to decorate any Hero Engineer component
 * Its primary role is to inject the CSS into the Hero Engineer iframe
-- */
import { ReactNode, useEffect, useState } from 'react'

import normalizeCss from 'normalize.css'

import indexCss from '../index.css?inline'

type HeroEngineerCommonDecoratorPropsType = {
  head?: HTMLHeadElement
  children: ReactNode
}

function HeroEngineerDecorator({ children, head }: HeroEngineerCommonDecoratorPropsType) {
  const [styleElement, setStyleElement] = useState<HTMLStyleElement | null>(null)

  useEffect(() => {
    if (!head) return

    if (styleElement) {
      head.removeChild(styleElement)
    }

    const style = document.createElement('style')

    style.innerHTML = `${normalizeCss}\n${indexCss}`

    head.appendChild(style)

    setStyleElement(style)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [head])

  return children
}

export default HeroEngineerDecorator
