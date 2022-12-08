import { CSSProperties, ReactNode, useMemo, useState } from 'react'
import { HierarchyItemType } from '~types'

import IsComponentRefreshingContext, { IsComponentRefreshingContextType } from '~contexts/IsComponentRefreshingContext'
import HierarchyContext, { HierarchyContextType } from '~contexts/HierarchyContext'
import EditionContext, { EditionContextType } from '~contexts/EditionContext'
import DragAndDropContext, { DragAndDropContextType, DragAndDropType } from '~contexts/DragAndDropContext'
import CssClassesContext, { CssClassesContextType } from '~contexts/CssClassesContext'
import EditionOverlayContext, { EditionOverlayContextType } from '~contexts/EditionOverlayContext'

import usePersistedState from '~hooks/usePersistedState'

type ComponentProvidersPropsType = {
  children: ReactNode
}

// The providers for the component scene
function ProviderComponent({ children }: ComponentProvidersPropsType) {
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

  const [elementRegistry, setElementRegistry] = useState<Record<string, HTMLElement | null>>({})
  const editionOverlayContextValue = useMemo<EditionOverlayContextType>(() => ({ elementRegistry, setElementRegistry }), [elementRegistry])

  const [className, setClassName] = usePersistedState('class-name', '')
  const [selectedClassName, setSelectedClassName] = usePersistedState('selected-class-name', '')
  const [style, setStyle] = useState<CSSProperties>({})
  const cssClassesContextValue = useMemo<CssClassesContextType>(() => ({ className, setClassName, selectedClassName, setSelectedClassName, style, setStyle }), [className, setClassName, selectedClassName, setSelectedClassName, style])

  return (
    <IsComponentRefreshingContext.Provider value={isComponnentRefreshingContextValue}>
      <HierarchyContext.Provider value={hierarchyContextValue}>
        <EditionContext.Provider value={editionContextValue}>
          <DragAndDropContext.Provider value={dragAndDropContextValue}>
            <EditionOverlayContext.Provider value={editionOverlayContextValue}>
              <CssClassesContext.Provider value={cssClassesContextValue}>
                {children}
              </CssClassesContext.Provider>
            </EditionOverlayContext.Provider>
          </DragAndDropContext.Provider>
        </EditionContext.Provider>
      </HierarchyContext.Provider>
    </IsComponentRefreshingContext.Provider>
  )
}

export default ProviderComponent
