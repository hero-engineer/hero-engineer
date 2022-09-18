import componentHierarchy from './fakeComponentHierarchy2'

const observerConfiguration = { attributes: true, childList: true, subtree: true }

const state = {}

function ecu(domElement: HTMLElement) {
  const observer = new MutationObserver(mutations => handleDomMutaton(domElement, mutations))

  observer.observe(domElement, observerConfiguration)

  window.addEventListener('click', handleClick)
}

// TODO debounce
function handleDomMutaton(domElement: HTMLElement, mutations: MutationRecord[]) {
  console.log('handleDomMutaton')

  if (mutations.some(m => m.type === 'attributes' && m.attributeName.startsWith('ecu'))) {
    return
  }

  traverseDomAndMarkIndexes(domElement)
  traverseDomAndMarkHierarchy(domElement, componentHierarchy)
}

function traverseDomAndMarkIndexes(domElement: Element, index = '0') {
  domElement.setAttribute('ecu-index', index)

  if (domElement.hasChildNodes()) {
    for (let i = 0; i < domElement.children.length; i++) {
      traverseDomAndMarkIndexes(domElement.children[i], `${index}.${i}`)
    }
  }
}

function traverseDomAndMarkHierarchy(domElement: Element, hierarchyRoot: any) {
  const { name, domPattern, children = [] } = hierarchyRoot

  // let continue = true
  // let currentDomPattern = domPattern
  // while (continue) {

  // }

}

function traverseAndApplyMetaAttribute(domElements: Element[], hierarchy: any[], previousMeta: string) {
  // split hierachy into array of [single, many, many, single, many, etc...]
  // Resolve extremities singles first
  // Got [many, ..., many] array

  let workloads = splitHierarchyIntoWorkloads(hierarchy)

  while (workloads.length) {
    [domElements, workloads] = executeSingleWorkloadExtremities(domElements, workloads, previousMeta)
    ;[domElements, workloads] = executeManyWorkloadExtremities(domElements, workloads, previousMeta)
  }

}

function executeSingleWorkloadExtremities(domElements: Element[], workloads: any[], previousMeta: string) {
  while (workloads.length) {
    if (workloads[0].many) break

    const domElement = domElements.shift()
    const workload = workloads.shift()

    if (!matchDomToNode(domElement, workload, previousMeta)) {
      domElements.unshift(domElement)
      workloads.unshift(workload)

      return [domElements, workloads]
    }
  }

  while (workloads.length) {
    if (workloads[workloads.length - 1].many) break

    const domElement = domElements.shift()
    const workload = workloads.shift()

    if (!matchDomToNode(domElement, workload, previousMeta)) {
      domElements.unshift(domElement)
      workloads.unshift(workload)

      return [domElements, workloads]
    }
  }

  return [domElements, workloads]
}

function executeManyWorkloadExtremities(domElements: Element[], workloads: any[], previousMeta: string) {
  const l = workloads.length

  for (let i = 0; i < l; i++) {
    if (workloads[i].single) break

    let matchedDom = true
    let matchedWorkload = false
    const workload = workloads.shift()

    while (domElements.length) {
      const domElement = domElements.shift()

      if (!matchDomToNode(domElement, workload, previousMeta)) {
        matchedDom = false
        domElements.unshift(domElement)
        break
      }
      else {
        matchedWorkload = true
      }
    }

    if (!matchedDom) {
      if (!matchedWorkload) {
        workloads.unshift(workload)
      }

      return [domElements, workloads]
    }
  }

}

function splitHierarchyIntoWorkloads(hierarchy: any[]) {
  const workloads: any[] = []
  const currentWorkload: any = []

  for (let i = 0; i < hierarchy.length; i++) {
    if (i > 0) {
      if (hierarchy[i].many !== hierarchy[i - 1].many) {
        workloads.push([...currentWorkload])
        currentWorkload.length = 0
      }
    }

    currentWorkload.push(hierarchy[i])
  }

  workloads.push([...currentWorkload])

  return workloads
}

function matchDomToNode(domElement: Element, node: any, previousMeta: string) {
  const { tag, meta, text } = node

  if (domElement.nodeType === domElement.ELEMENT_NODE) {
    if (domElement.tagName !== tag) return false

    const nextMeta = previousMeta + meta ? `.${meta}` : ''

    domElement.setAttribute('ecu-meta', nextMeta)

    return true
  }

  if (domElement.nodeType === domElement.TEXT_NODE) {
    if (text === true) return true
    if (text === domElement.textContent) return true

    return false
  }

  return false
}

function handleClick(event: MouseEvent) {
  const target = event.target as HTMLElement

  if (!target.hasAttribute('ecu')) return

  const index = target.getAttribute('ecu')

  console.log('index', index)
}

export default ecu
