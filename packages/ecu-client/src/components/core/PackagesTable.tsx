import { FormEvent, useCallback, useEffect, useState } from 'react'
import { Button, Div, Form, InputBase } from 'honorable'
import { SlTrash } from 'react-icons/sl'
import { CiEdit } from 'react-icons/ci'
import { VscRunAbove } from 'react-icons/vsc'

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
      {packages.map(pkg => (
        <PackageTableRow
          key={pkg.name}
          updatedPackages={updatedPackages}
          pkg={pkg}
        />
      ))}
    </Div>
  )
}

type PackageTableRowPropsType = {
  pkg: PackageType
  updatedPackages: PackageType[]
}

function PackageTableRow({ pkg, updatedPackages }: PackageTableRowPropsType) {
  const [value, setValue] = useState(pkg.version)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const updatedPackage = updatedPackages.find(x => x.name === pkg.name)

  const mutate = useCallback(async (nextVersion: string) => {
    if (nextVersion === pkg.version) return

    setIsLoading(true)
    setIsEditing(false)

    setIsLoading(false)
  }, [pkg])

  const handleSubmit = useCallback((event: FormEvent) => {
    event.preventDefault()

    mutate(value)
  }, [mutate, value])

  const handleDelete = useCallback(() => {
    if (!window.confirm(`Are you sure you want to uninstall ${pkg.name} from your ${pkg.type === 'devDependencies' ? 'devD' : 'd'}ependencies?`)) return

    mutate('')
  }, [mutate, pkg])

  const handleUpdate = useCallback(() => {
    if (!updatedPackage) return

    mutate(updatedPackage.version)
  }, [mutate, updatedPackage])

  const toggleEditing = useCallback(() => {
    if (isEditing) {
      setIsEditing(false)
      mutate(value)
    }
    else {
      setIsEditing(true)
    }
  }, [isEditing, mutate, value])

  useEffect(() => {
    setValue(pkg.version)
  }, [pkg])

  return (
    <Div
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
        {isEditing ? (
          <Form onSubmit={handleSubmit}>
            <InputBase
              autoFocus
              value={value}
              onChange={event => setValue(event.target.value)}
            />
          </Form>
        ) : pkg.version}
      </Div>
      <Div
        width="25%"
        xflex="x1s"
        gap={0.5}
        px={1}
      >
        <Button
          onClick={toggleEditing}
          loading={isLoading}
        >
          {isEditing ? <VscRunAbove /> : <CiEdit />}
        </Button>
        <Button
          danger
          onClick={handleDelete}
        >
          <SlTrash />
        </Button>
        {updatedPackage && (
          <Button
            secondary
            onClick={handleUpdate}
          >
            Update to
            {' '}
            {updatedPackage.version}
          </Button>
        )}
      </Div>
    </Div>
  )
}

export default PackagesTable
