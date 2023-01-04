/* --
 * DO NOT DELETE THIS FILE
 * HeroEngineerDecorator.tsx is used to decorate any Hero Engineer component
 * Its primary role is to inject the CSS into the Hero Engineer iframe
-- */
import { ReactNode, useEffect, useRef } from 'react'

import indexCss from '../index.css?inline'

type HeroEngineerCommonDecoratorPropsType = {
  head?: HTMLHeadElement
  children: ReactNode
}

const csss = [
  indexCss,
]

function HeroEngineerDecorator({ children, head }: HeroEngineerCommonDecoratorPropsType) {
  const styleElements = useRef<HTMLStyleElement[]>([])

  useEffect(() => {
    if (!head) return

    styleElements.current.forEach(styleElement => {
      head.removeChild(styleElement)
    })

    styleElements.current.length = 0

    csss.forEach(css => {
      const styleElement = document.createElement('style')

      styleElement.innerHTML = css

      head.appendChild(styleElement)

      styleElements.current.push(styleElement)
    })
  }, [head])

  return children
}

export default HeroEngineerDecorator
