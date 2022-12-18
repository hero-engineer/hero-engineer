import { Dispatch, MouseEvent, SetStateAction, createContext } from 'react'

export type ContextualInformationStateType = {
  isEdited: boolean
  isComponentRoot: boolean
  rightClickEvent: MouseEvent | null
  element: HTMLElement | null,
  dropElement: HTMLElement | null,
}

export type ContextualInformationContextType = {
  contextualInformationState: ContextualInformationStateType
  setContextualInformationState: Dispatch<SetStateAction<ContextualInformationStateType>>
}

export default createContext<ContextualInformationContextType>({
  contextualInformationState: {
    isEdited: false,
    isComponentRoot: false,
    rightClickEvent: null,
    element: null,
    dropElement: null,
  },
  setContextualInformationState: () => {},
})
