import { useMemo, useState } from 'react'
import { Button, Div, H1, Q, Spinner } from 'honorable'

import useQuery from '../../hooks/useQuery'

import AddPackageModal from '../core/AddPackageModal'
import PackagesTable from '../core/PackagesTable'
import { PackagesQuery, PackagesQueryDataType, PackagesUpdatesQuery, PackagesUpdatesQueryDataType } from '../../queries'

// Packages scene
function Packages() {
  const [isAddPackageModalOpen, setIsAddPackageModalOpen] = useState(false)

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
        gap={0.5}
        mt={2}
      >
        <Button onClick={() => setIsAddPackageModalOpen(true)}>
          Add package
        </Button>
      </Div>
      <Div mt={2}>
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
      </Div>
      <AddPackageModal
        open={isAddPackageModalOpen}
        onClose={() => setIsAddPackageModalOpen(false)}
      />
    </>
  )
}

export default Packages
