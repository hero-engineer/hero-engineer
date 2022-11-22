import { Button, Div } from 'honorable'
import { SlTrash } from 'react-icons/sl'
import { CiEdit } from 'react-icons/ci'

import { PackageType } from '../../types'

type PackagesTablePropsType = {
  packages: PackageType[]
  updatedPackages: PackageType[]
}

function PackagesTable({ packages, updatedPackages }: PackagesTablePropsType) {
  return (
    <Div
      xflex="y2s"
      borderRadius="large"
      elevation={2}
      pb={0.5}
    >
      <Div
        xflex="x4"
        fontWeight={500}
        py={1}
      >
        <Div
          width="25%"
          px={1}
        >
          Name
        </Div>
        <Div
          width="50%"
          px={1}
        >
          Version
        </Div>
        <Div
          width="25%"
          px={1}
        >
          Actions
        </Div>
      </Div>
      {packages.map(pkg => {
        const updatedPackage = updatedPackages.find(x => x.name === pkg.name)

        return (
          <Div
            key={pkg.name}
            xflex="x4"
            py={0.5}
          >
            <Div
              width="25%"
              px={1}
            >
              {pkg.name}
            </Div>
            <Div
              width="50%"
              px={1}
            >
              {pkg.version}
            </Div>
            <Div
              width="25%"
              xflex="x1s"
              gap={0.5}
              px={1}
            >
              <Button>
                <CiEdit />
              </Button>
              <Button danger>
                <SlTrash />
              </Button>
              {updatedPackage && (
                <Button secondary>
                  Update to
                  {' '}
                  {updatedPackage.version}
                </Button>
              )}
            </Div>
          </Div>
        )
      })}
    </Div>
  )
}

export default PackagesTable
