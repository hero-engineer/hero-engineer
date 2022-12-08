import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import Editor, { Monaco } from '@monaco-editor/react'

import ThemeModeContext from '~contexts/ThemeModeContext'
import AstsContext from '~contexts/AstsContext'
import BottomTabsContext from '~contexts/BottomTabsContext'

type CodeEditorPropsType = {
  path: string
}

const extensionToLanguage: Record<string, string> = {
  ts: 'typescript',
  tsx: 'typescript',
  js: 'javascript',
  jsx: 'javascript',
  css: 'css',
}

function CodeEditor({ path }: CodeEditorPropsType) {
  const { themeMode } = useContext(ThemeModeContext)
  const { asts } = useContext(AstsContext)
  const { tabs, setTabs, setCurrentTabIndex } = useContext(BottomTabsContext)
  const editorRef = useRef<any>(null)
  const monacoRef = useRef<Monaco | null>(null)
  const [refresh, setRefresh] = useState(false)

  const getLanguage = useCallback((path: string) => extensionToLanguage[path.split('.').pop() ?? ''] ?? null, [])

  const handleResourceClick = useCallback((path: string) => {
    console.log('handleResourceClick')
    const nextTabs = [...tabs]

    if (!nextTabs.some(tab => tab.url === path)) {
      nextTabs.push({ url: path, label: path.split('/').pop() ?? '' })
    }

    setTabs(nextTabs)
    setCurrentTabIndex(nextTabs.findIndex(tab => tab.url === path))
  }, [tabs, setTabs, setCurrentTabIndex])

  const handleEditorMount = useCallback((editor: any, monaco: Monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.React,
      jsxFactory: 'React.createElement',
      jsxFragmentFactory: 'React.Fragment',
      reactNamespace: 'React',
      allowNonTsExtensions: true,
      allowJs: true,
      target: monaco.languages.typescript.ScriptTarget.Latest,
    })

    const editorService = editor._codeEditorService
    const openEditorBase = editorService.openCodeEditor.bind(editorService)

    console.log('foo')

    editorService.openCodeEditor = async (input: any, source: any) => {
      console.log('input', input)
      const result = await openEditorBase(input, source)

      console.log('result', result)
      handleResourceClick(input.resource.path)

      // Always return the base result
      return result
    }

    console.log('bar')

    setRefresh(x => !x)
  }, [handleResourceClick])

  useEffect(() => {
    const editor = editorRef.current
    const monaco = monacoRef.current

    console.log('effect')
    if (!(editor && monaco)) return

    const entries = Object.entries(asts)

    console.log('entries.length', entries.length)

    if (!entries.length) return

    entries.forEach(([entryPath, { code }]) => {
      const uri = monaco.Uri.parse(`file://${entryPath}`)
      const model = monaco.editor.getModel(uri) || monaco.editor.createModel(code, getLanguage(entryPath), uri)

      if (entryPath === path) editor.setModel(model)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, editorRef.current, monacoRef.current, asts, path, getLanguage])

  return (
    <Editor
      width="100%"
      height="100%"
      language={getLanguage(path)}
      theme={themeMode === 'light' ? 'vs' : 'vs-dark'}
      onMount={handleEditorMount}
      options={{
        tabSize: 2,
        minimap: {
          enabled: false,
        },

      }}
    />
  )
}

export default CodeEditor
