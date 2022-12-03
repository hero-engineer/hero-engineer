import { useEffect, useMemo } from 'react'
import Editor, { useMonaco } from '@monaco-editor/react'
import { Div } from 'honorable'

import { refetchKeys } from '../../constants'

import { ColorsQuery, ColorsQueryDataType, SpacingsQuery, SpacingsQueryDataType } from '../../queries'

import useQuery from '../../hooks/useQuery'
import useRefetch from '../../hooks/useRefetch'

type CssFunctionEditorPropsType = {
  value: string
  onChange: (value: string) => void
}

function CssFunctionEditor({ value, onChange }: CssFunctionEditorPropsType) {
  const monaco = useMonaco()

  const [colorsQueryResult, refetchColorsQuery] = useQuery<ColorsQueryDataType>({
    query: ColorsQuery,
  })
  const [spacingsQueryResult, refetchSpacingsQuery] = useQuery<SpacingsQueryDataType>({
    query: SpacingsQuery,
  })

  useRefetch(
    {
      key: refetchKeys.colors,
      refetch: refetchColorsQuery,
    },
    {
      key: refetchKeys.spacings,
      refetch: refetchSpacingsQuery,
    }
  )

  const colors = useMemo(() => colorsQueryResult.data?.colors ?? [], [colorsQueryResult.data])
  const spacings = useMemo(() => spacingsQueryResult.data?.spacings ?? [], [spacingsQueryResult.data])

  useEffect(() => {
    if (!monaco) return

    const suggestions: any[] = []

    colors.forEach(color => {
      suggestions.push({
        label: `@${color.name} (color)`,
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: `Add ${color.name} color variable`,
        insertText: `var(${color.variableName}) /* ${color.name} */`,
      })
    })

    spacings.forEach(spacing => {
      suggestions.push({
        label: `@${spacing.name} (spacing)`,
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: `Add ${spacing.name} spacing variable`,
        insertText: `var(${spacing.variableName}) /* ${spacing.name} */`,
      })
    })

    const { dispose } = monaco.languages.registerCompletionItemProvider('css', {
      provideCompletionItems: () => ({
        suggestions,
      }),
    })

    return () => {
      dispose()
    }
  }, [monaco, colors, spacings, value]) // HACK adding value here because of a monaco bug

  return (
    <Div
      xflex="y2s"
      gap={0.5}
    >
      <Div
        fontSize="0.85rem"
        color="text-light"
      >
        Type @ to insert a variable
      </Div>
      <Editor
        height="256px"
        language="css"
        theme="vs-dark"
        value={value}
        onChange={x => onChange(x ?? '')}
        options={{
          minimap: {
            enabled: false,
          },
        }}
      />
    </Div>
  )
}

export default CssFunctionEditor
