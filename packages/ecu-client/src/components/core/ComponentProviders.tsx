import { CSSProperties, ReactNode, useMemo, useState } from 'react'

import IsComponentRefreshingContext, { IsComponentRefreshingContextType } from '../../contexts/IsComponentRefreshingContext'
import HierarchyContext, { HierarchyContextType } from '../../contexts/HierarchyContext'
import DragAndDropContext, { DragAndDropContextType, DragAndDropType } from '../../contexts/DragAndDropContext'
import ContextualInformationContext, { ContextualInformationContextType, ContextualInformationStateType } from '../../contexts/ContextualInformationContext'
import CssClassesContext, { CssClassesContextType } from '../../contexts/CssClassesContext'

import { HierarchyItemType } from '../../types'

type ComponentProvidersPropsType = {
  children: ReactNode
}

// The providers for the component scene
function ComponentProviders({ children }: ComponentProvidersPropsType) {
  const [isComponentRefreshing, setIsComponentRefreshing] = useState(false)
  const isComponnentRefreshingContextValue = useMemo<IsComponentRefreshingContextType>(() => ({ isComponentRefreshing, setIsComponentRefreshing }), [isComponentRefreshing])

  const [hierarchy, setHierarchy] = useState<HierarchyItemType[]>([])
  const [totalHierarchy, setTotalHierarchy] = useState<HierarchyItemType| null>(null)
  const hierarchyContextValue = useMemo<HierarchyContextType>(() => ({ hierarchy, setHierarchy, totalHierarchy, setTotalHierarchy }), [hierarchy, totalHierarchy])

  const [dragAndDrop, setDragAndDrop] = useState<DragAndDropType>({
    sourceHierarchyId: '',
    targetHierarchyId: '',
    sourceComponentDelta: 0,
    targetComponentDelta: 0,
  })
  const dragAndDropContextValue = useMemo<DragAndDropContextType>(() => ({ dragAndDrop, setDragAndDrop }), [dragAndDrop])

  const [contextualInformationState, setContextualInformationState] = useState<ContextualInformationStateType>({
    isEdited: false,
    isComponentRoot: false,
    rightClickEvent: null,
    element: null,
    dropElement: null,
  })
  const contextualInformationContextValue = useMemo<ContextualInformationContextType>(() => ({ contextualInformationState, setContextualInformationState }), [contextualInformationState])

  const [className, setClassName] = useState('')
  const [updatedStyles, setUpdatedStyles] = useState<CSSProperties>({})
  const cssClassesContextValue = useMemo<CssClassesContextType>(() => ({ className, setClassName, style: updatedStyles, setStyle: setUpdatedStyles }), [className, updatedStyles])

  // Do not remove yet
  console.log('render')

  return (
    <IsComponentRefreshingContext.Provider value={isComponnentRefreshingContextValue}>
      <HierarchyContext.Provider value={hierarchyContextValue}>
        <DragAndDropContext.Provider value={dragAndDropContextValue}>
          <ContextualInformationContext.Provider value={contextualInformationContextValue}>
            <CssClassesContext.Provider value={cssClassesContextValue}>
              {children}
            </CssClassesContext.Provider>
          </ContextualInformationContext.Provider>
        </DragAndDropContext.Provider>
      </HierarchyContext.Provider>
    </IsComponentRefreshingContext.Provider>
  )
}

export default ComponentProviders
