function formatHierarchyTrees(hierarchyTrees: any[]) {
  const retval: any[] = []

  hierarchyTrees.forEach(hierarchyTree => {
    delete hierarchyTree.hierarchyId
    delete hierarchyTree.componentAddress
    delete hierarchyTree.onComponentAddress
    delete hierarchyTree.index

    const toPush = [hierarchyTree.label]
    const children = formatHierarchyTrees(hierarchyTree.children)

    if (children.length) toPush.push(children)

    retval.push(toPush)
  })

  return retval
}

export default formatHierarchyTrees
