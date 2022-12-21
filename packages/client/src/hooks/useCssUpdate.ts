import { useCallback, useRef } from 'react'

import { BreakpointType, CssAttributeType, NormalizedCssAttributesType } from '~types'

type UpdateCssType = (
  selectedClassName: string,
  classNames: string[],
  updatedAttributes: CssAttributeType[],
  selectedCurrentBreakpointAttributes: NormalizedCssAttributesType,
  breakpoint: BreakpointType,
) => Promise<void>

function hashAttributes(attributes: CssAttributeType[]) {
  return attributes.map(a => `${a.cssName}${a.value}${a.isImportant}`).join('')
}

function useUpdateCss(updateCss: UpdateCssType, delay = 1000) {
  const lastHash = useRef<string>('')
  const updatesRef = useRef<Record<string, NodeJS.Timeout>>({})

  const registerCssUpdate = useCallback((
    selectedClassName: string,
    classNames: string[],
    updatedAttributes: CssAttributeType[],
    selectedCurrentBreakpointAttributes: NormalizedCssAttributesType,
    breakpoint: BreakpointType,
  ) => {
    const shortHash = `${selectedClassName}${classNames.join('')}${breakpoint.media}`
    const hash = `${shortHash}${hashAttributes(updatedAttributes)}${hashAttributes(Object.values(selectedCurrentBreakpointAttributes))}`

    if (hash === lastHash.current) return

    lastHash.current = hash

    if (updatesRef.current[shortHash]) {
      clearTimeout(updatesRef.current[shortHash])
    }

    updatesRef.current[shortHash] = setTimeout(() => {
      updateCss(selectedClassName, classNames, updatedAttributes, selectedCurrentBreakpointAttributes, breakpoint)
    }, delay)
  }, [delay, updateCss])

  return registerCssUpdate
}

export default useUpdateCss
