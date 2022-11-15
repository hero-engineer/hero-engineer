import { SetStateAction, useCallback, useMemo } from 'react'
import { createSearchParams, useSearchParams } from 'react-router-dom'

type SetterType = {
  componentDelta?: SetStateAction<number>
  hierarchyIds?: SetStateAction<string[]>
}

const hierarchyIdsKey = 'hierarchyIds'
const componentDeltaKey = 'componentDelta'

function useEditionSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams()

  const componentDeltaRawValue = searchParams.get(componentDeltaKey)
  const componentDelta = useMemo(() => parseInt(componentDeltaRawValue || '0'), [componentDeltaRawValue])
  const hierarchyIdsRawIds = (searchParams.get(hierarchyIdsKey) || '').split(',').filter(Boolean)
  const hierarchyIdsString = JSON.stringify(hierarchyIdsRawIds)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const hierarchyIds = useMemo(() => hierarchyIdsRawIds, [hierarchyIdsString])

  console.log('hierarchyIds', hierarchyIds)
  const setEditionSearchParams = useCallback((setter: SetterType) => {
    const componentDeltaValue = typeof setter.componentDelta === 'function' ? setter.componentDelta(componentDelta) : typeof setter.componentDelta === 'number' ? setter.componentDelta : componentDelta
    const hierarchyIdsValue = typeof setter.hierarchyIds === 'function' ? setter.hierarchyIds(hierarchyIds) : setter.hierarchyIds || hierarchyIds

    const nextSearchParams = createSearchParams(searchParams)

    nextSearchParams.set(componentDeltaKey, componentDeltaValue.toString())
    nextSearchParams.set(hierarchyIdsKey, hierarchyIdsValue.join(','))

    setSearchParams(nextSearchParams, { replace: true })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hierarchyIdsString, componentDelta])

  return { hierarchyIds, componentDelta, setEditionSearchParams }
}

export default useEditionSearchParams
