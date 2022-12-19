// import { useCallback, useEffect, useState } from 'react'
// import { Div, H1 } from 'honorable'

// import { refetchKeys } from '~constants'

// // import { RootCssQuery, RootCssQueryDataType, UpdateRootCssMutation, UpdateRootCssMutationDataType } from '~queries'

// import useQuery from '~hooks/useQuery'
// import useRefetch from '~hooks/useRefetch'
// import useMutation from '~hooks/useMutation'
// import useThrottleAsynchronous from '~hooks/useThrottleAsynchronous'

// import CssFunctionEditor from '~components/css-inputs/CssFunctionEditor'

// // Design/root-css scene
// function DesignRootCss() {
//   const [rootCss, setRootCss] = useState('')

//   const [rootCssQueryResult, refetchRootCssQuery] = useQuery<RootCssQueryDataType>({
//     query: RootCssQuery,
//   })
//   const [, updateRootCss] = useMutation<UpdateRootCssMutationDataType>(UpdateRootCssMutation)

//   const throttledUpdateCss = useThrottleAsynchronous(updateRootCss, 1000)

//   useRefetch({
//     key: refetchKeys.rootCss,
//     refetch: refetchRootCssQuery,
//   })

//   const handleCssFunctionChange = useCallback(async (value: string) => {
//     setRootCss(value)

//     await throttledUpdateCss({
//       rootCss: value,
//     })
//   }, [throttledUpdateCss])

//   useEffect(() => {
//     if (!rootCssQueryResult.data?.rootCss) return

//     setRootCss(rootCssQueryResult.data.rootCss)
//   }, [rootCssQueryResult.data])

//   return (
//     <>
//       <H1 mb={2}>Root CSS</H1>
//       <Div
//         xflex="y2s"
//         gap={2}
//         pb={6}
//       >
//         <CssFunctionEditor
//           value={rootCss}
//           onChange={handleCssFunctionChange}
//         />
//       </Div>
//     </>
//   )
// }

// export default DesignRootCss

export default () => null
