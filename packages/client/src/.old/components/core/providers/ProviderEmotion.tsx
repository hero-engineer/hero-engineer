import { ReactNode } from 'react'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import weakMemoize from '@emotion/weak-memoize'

type ProviderEmotionPropsType = {
  children: ReactNode
  head: HTMLHeadElement | null
}

// https://codesandbox.io/embed/rendering-emotion-iframe-into-iframe-body-bq63w
// https://github.com/emotion-js/emotion/issues/760#issuecomment-404353706
const memoizedCreateCacheWithContainer = weakMemoize((container: HTMLElement) => createCache({ container, key: 'ecu-iframe' }))

function ProviderEmotion({ children, head }: ProviderEmotionPropsType) {
  if (!head) {
    return null
  }

  return (
    <CacheProvider value={memoizedCreateCacheWithContainer(head)}>
      {children}
    </CacheProvider>
  )
}

export default ProviderEmotion
