import { useContext, useMemo } from 'react'
import { Div, H1, Spinner } from 'honorable'

import { PackageType } from '~types'

import { refetchKeys } from '~constants'

import { FileQuery, FileQueryDataType, PackagesUpdatesQuery, PackagesUpdatesQueryDataType } from '~queries'

import EnvContext from '~contexts/EnvContext'

import useQuery from '~hooks/useQuery'
import useRefetch from '~hooks/useRefetch'

import PackagesTable from '~components/scene-packages/PackagesTable'
import AddPackageButton from '~components/scene-packages/AddPackageButton'

// Packages scene
function Packages() {
  const env = useContext(EnvContext)

  const [fileQueryResult, refetchFileQuery] = useQuery<FileQueryDataType>({
    query: FileQuery,
    variables: {
      filePath: `${env.VITE_CWD}/package.json`,
    },
  })

  const [packagesUpdatesQueryResult, refetchPackagesUpdatesQuery] = useQuery<PackagesUpdatesQueryDataType>({
    query: PackagesUpdatesQuery,
  })

  const { dependencies, devDependencies } = useMemo<{ dependencies: PackageType[], devDependencies: PackageType[] }>(() => {
    if (!fileQueryResult.data) return { dependencies: [], devDependencies: [] }

    try {
      const { dependencies, devDependencies } = JSON.parse(fileQueryResult.data.file)

      return {
        dependencies: Object.entries(dependencies).map(([name, version]) => ({
          name,
          version: version as string,
          type: 'dependencies' as const,
        })),
        devDependencies: Object.entries(devDependencies).map(([name, version]) => ({
          name,
          version: version as string,
          type: 'devDependencies' as const,
        })),
      }
    }
    catch (error) {
      console.error(error)

      return { dependencies: [], devDependencies: [] }
    }
  }, [fileQueryResult.data])
  const packagesUpdates = useMemo(() => packagesUpdatesQueryResult.data?.packagesUpdates ?? [], [packagesUpdatesQueryResult.data])
  const isFetching = useMemo(() => fileQueryResult.fetching || packagesUpdatesQueryResult.fetching, [fileQueryResult.fetching, packagesUpdatesQueryResult.fetching])

  useRefetch(
    {
      key: refetchKeys.packages,
      refetch: refetchFileQuery,
    },
    {
      key: refetchKeys.packagesUpdates,
      refetch: refetchPackagesUpdatesQuery,
    }
  )

  return (
    <>
      <Div
        xflex="x4"
        gap={1}
      >
        <H1>
          Packages
        </H1>
        {isFetching && <Spinner />}
      </Div>
      <Div
        xflex="x4"
        mt={1}
      >
        <AddPackageButton />
      </Div>
      <Div mt={1.5}>
        {!!dependencies.length && (
          <>
            <Div
              fontWeight={500}
              mb={0.5}
            >
              Dependencies
            </Div>
            <PackagesTable
              packages={dependencies}
              updatedPackages={packagesUpdates}
            />
          </>
        )}
        {!!devDependencies.length && (
          <>
            <Div
              fontWeight={500}
              mt={2}
              mb={0.5}
            >
              Dev dependencies
            </Div>
            <PackagesTable
              packages={devDependencies}
              updatedPackages={packagesUpdates}
            />
          </>
        )}
      </Div>
    </>
  )
}

export default Packages
