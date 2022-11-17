import { Dispatch, MouseEvent, SetStateAction, createContext } from 'react'

export type ContextualInformationStateType = {
  isEdited: boolean
  isComponentRoot: boolean
  rightClickEvent: MouseEvent | null
}

export type ContextualInformationContextType = {
  contextualInformationElement: HTMLElement | null
  setContextualInformationElement: Dispatch<SetStateAction<HTMLElement | null>>
  contextualInformationState: ContextualInformationStateType
  setContextualInformationState: Dispatch<SetStateAction<ContextualInformationStateType>>
}

export default createContext<ContextualInformationContextType>({
  contextualInformationElement: null,
  setContextualInformationElement: () => {},
  contextualInformationState: {
    isEdited: false,
    isComponentRoot: false,
    rightClickEvent: null,
  },
  setContextualInformationState: () => {},
})
