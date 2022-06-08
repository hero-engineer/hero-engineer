// @ts-ignore
import Reconciler, { HostConfig } from 'react-reconciler'
import emptyObject from 'fbjs/lib/emptyObject'
import { DefaultEventPriority } from 'react-reconciler/constants'

import isUnitlessNumber from './utils/css'
import markIndexes from './markIndexes'

function setStyles(domElement: HTMLElement, styles: object) {
  Object.keys(styles).forEach(name => {
    const rawValue = styles[name]
    const isEmpty = rawValue === null || typeof rawValue === 'boolean' || rawValue === ''

    // Unset the style to its default values using an empty string
    if (isEmpty) domElement.style[name] = ''
    else {
      const value =
        typeof rawValue === 'number' && !isUnitlessNumber(name) ? `${rawValue}px` : rawValue

      domElement.style[name] = value
    }
  })
}

function shallowDiff(oldObj: object, newObj: object) {
  // Return a diff between the new and the old object
  const uniqueProps = new Set([...Object.keys(oldObj), ...Object.keys(newObj)])
  const changedProps = Array.from(uniqueProps).filter(
    propName => oldObj[propName] !== newObj[propName]
  )

  return changedProps
}

function isEventName(propName: string) {
  return propName.startsWith('on') && window[propName.toLowerCase()]
}

type Type = string;
type Props = Record<string, any>;
type Container = HTMLElement;
type Instance = HTMLElement;
type TextInstance = Text;

type SuspenseInstance = any;
type HydratableInstance = any;
type PublicInstance = any;
type HostContext = any;
type UpdatePayload = any;
type _ChildSet = any;
type TimeoutHandle = any;
type NoTimeout = number;

const hostConfig: HostConfig<
  Type,
  Props,
  Container,
  Instance,
  TextInstance,
  SuspenseInstance,
  HydratableInstance,
  PublicInstance,
  HostContext,
  UpdatePayload,
  _ChildSet,
  TimeoutHandle,
  NoTimeout
> = {

// const hostConfig = {

  isPrimaryRenderer: true,

  supportsMutation: true,
  supportsHydration: true,
  supportsPersistence: false,
  // @ts-expect-error
  supportsMicrotask: true,

  now: Date.now,

  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  noTimeout: -1,

  getRootHostContext(nextRootInstance) {
    return {}
  },
  getChildHostContext(parentContext, fiberType, rootInstance) {
    // const context = { type: fiberType }

    return parentContext
  },
  shouldSetTextContent(type, nextProps) {
    return false
  },
  createTextInstance(
    newText,
    rootContainerInstance,
    currentHostContext,
    workInProgress
  ) {
    return document.createTextNode(newText)
  },
  createInstance(
    type,
    newProps,
    rootContainerInstance,
    currentHostContext,
    workInProgress
  ) {
    const element = document.createElement(type)
    element.className = newProps.className || ''
    // @ts-expect-error
    element.style = newProps.style

    if (newProps.onClick) {
      element.addEventListener('click', newProps.onClick)
    }

    return element
  },
  appendInitialChild(parent, child) {
    parent.appendChild(child)
  },
  finalizeInitialChildren(
    instance,
    type,
    newProps,
    rootContainerInstance,
    currentHostContext
  ) {
    instance.setAttribute('ecu', '-1')

    return newProps.autofocus
  },
  prepareForCommit(rootContainerInstance) {
    // rootContainerInstance.set = 'Ecu'

    return null
  },
  resetAfterCommit(rootContainerInstance) {
    rootContainerInstance.setAttribute('ecu', '-1')
    markIndexes(rootContainerInstance)
  },
  commitMount(domElement, type, newProps, fiberNode) {
    domElement.focus()
  },
  appendChildToContainer(parent, child) {
    parent.appendChild(child)
  },
  prepareUpdate(
    instance,
    type,
    oldProps,
    newProps,
    rootContainerInstance,
    currentHostContext
  ) {
     // return nothing.
  },
  commitUpdate(
    instance,
    updatePayload,
    type,
    oldProps,
    newProps,
    finishedWork
  ) {
     // return nothing.
  },
  commitTextUpdate(textInstance, oldText, newText) {
    textInstance.nodeValue = newText
  },
  appendChild(parentInstance, child) {
    parentInstance.appendChild(child)
  },
  insertBefore(parentInstance, child, beforeChild) {
    parentInstance.insertBefore(child, beforeChild)
  },
  removeChild(parentInstance, child) {
    parentInstance.removeChild(child)
  },
  insertInContainerBefore(container, child, beforeChild) {
    container.insertBefore(child, beforeChild)
  },
  removeChildFromContainer(container, child) {
    container.removeChild(child)
  },
  resetTextContent(domElement) {
    domElement.textContent = ''
  },
  getPublicInstance(instance) {
    return instance
  },
  preparePortalMount() {},
  getCurrentEventPriority() {
    return DefaultEventPriority
  },
  warnsIfNotActing() {},
  getInstanceFromNode() {},
  beforeActiveInstanceBlur() {},
  afterActiveInstanceBlur() {},
  prepareScopeUpdate() {},
  getInstanceFromScope() {},
  detachDeletedInstance() {},
  hideInstance(instance) {
  },
  hideTextInstance(textInstance) {
  },
  unhideInstance(instance, props) {
  },
  unhideTextInstance(textInstance, text) {
  },
  clearContainer(container) {
    container.innerHTML = ''
  },
}

export default Reconciler(hostConfig)
