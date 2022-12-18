import { AtRule, Document, Root, Rule } from 'postcss'

function traverse(root: Root, onWalk: (rule: Rule, media: string, root: Root | Document) => void) {
  root.walkRules(rule => {
    const media = rule.parent?.type === 'atrule' ? (rule.parent as AtRule).params : ''

    onWalk(rule, media, root)
  })
}

export default traverse
