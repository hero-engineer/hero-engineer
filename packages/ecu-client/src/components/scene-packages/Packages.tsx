import { useMemo } from 'react'
import { Div, H1, Spinner } from 'honorable'

import { refetchKeys } from '~constants'

import { PackagesQuery, PackagesQueryDataType, PackagesUpdatesQuery, PackagesUpdatesQueryDataType } from '~queries'

import useQuery from '~hooks/useQuery'
import useRefetch from '~hooks/useRefetch'

import PackagesTable from '~components/scene-packages/PackagesTable'
import AddPackageButton from '~components/scene-packages/AddPackageButton'

// Packages scene
function Packages() {
  const [packagesQueryResult, refetchPackagesQuery] = useQuery<PackagesQueryDataType>({
    query: PackagesQuery,
  })
  const [packagesUpdatesQueryResult, refetchPackagesUpdatesQuery] = useQuery<PackagesUpdatesQueryDataType>({
    query: PackagesUpdatesQuery,
  })

  const isFetching = useMemo(() => packagesQueryResult.fetching || packagesUpdatesQueryResult.fetching, [packagesQueryResult.fetching, packagesUpdatesQueryResult.fetching])
  const packages = useMemo(() => packagesQueryResult.data?.packages ?? [], [packagesQueryResult.data])
  const packagesUpdates = useMemo(() => packagesUpdatesQueryResult.data?.packagesUpdates ?? [], [packagesUpdatesQueryResult.data])
  const dependencies = useMemo(() => packages.filter(pkg => pkg.type === 'dependencies'), [packages])
  const devDependencies = useMemo(() => packages.filter(pkg => pkg.type === 'devDependencies'), [packages])

  useRefetch(
    {
      key: refetchKeys.packages,
      refetch: refetchPackagesQuery,
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
        <H1>Packages</H1>
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
