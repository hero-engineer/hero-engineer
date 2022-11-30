import { CSSProperties, ReactNode, useMemo, useState } from 'react'

import IsComponentRefreshingContext, { IsComponentRefreshingContextType } from '../../contexts/IsComponentRefreshingContext'
import HierarchyContext, { HierarchyContextType } from '../../contexts/HierarchyContext'
import EditionContext, { EditionContextType } from '../../contexts/EditionContext'
import DragAndDropContext, { DragAndDropContextType, DragAndDropType } from '../../contexts/DragAndDropContext'
import ContextualInformationContext, { ContextualInformationContextType, ContextualInformationStateType } from '../../contexts/ContextualInformationContext'
import CssClassesContext, { CssClassesContextType } from '../../contexts/CssClassesContext'

import { HierarchyItemType } from '../../types'
import usePersistedState from '../../hooks/usePersistedState'

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

  const [hierarchyId, setHierarchyId] = usePersistedState('hierarchy-id', '')
  const [componentDelta, setComponentDelta] = usePersistedState('component-delta', 0)
  const [isEdited, setIsEdited] = useState(false)
  const editionContextValue = useMemo<EditionContextType>(() => ({ hierarchyId, setHierarchyId, componentDelta, setComponentDelta, isEdited, setIsEdited }), [hierarchyId, setHierarchyId, componentDelta, setComponentDelta, isEdited, setIsEdited])

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
  const [selectedClassName, setSelectedClassName] = usePersistedState('selected-class-name', '')
  const [style, setStyle] = useState<CSSProperties>({})
  const cssClassesContextValue = useMemo<CssClassesContextType>(() => ({ className, setClassName, selectedClassName, setSelectedClassName, style, setStyle }), [className, selectedClassName, setSelectedClassName, style])

  return (
    <IsComponentRefreshingContext.Provider value={isComponnentRefreshingContextValue}>
      <HierarchyContext.Provider value={hierarchyContextValue}>
        <EditionContext.Provider value={editionContextValue}>
          <DragAndDropContext.Provider value={dragAndDropContextValue}>
            <ContextualInformationContext.Provider value={contextualInformationContextValue}>
              <CssClassesContext.Provider value={cssClassesContextValue}>
                {children}
              </CssClassesContext.Provider>
            </ContextualInformationContext.Provider>
          </DragAndDropContext.Provider>
        </EditionContext.Provider>
      </HierarchyContext.Provider>
    </IsComponentRefreshingContext.Provider>
  )
}

export default ComponentProviders
