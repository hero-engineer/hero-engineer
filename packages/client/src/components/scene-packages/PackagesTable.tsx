import { FormEvent, useCallback, useEffect, useState } from 'react'
import { Button, Div, Form, Input } from 'honorable'
import { CiEdit } from 'react-icons/ci'
import { SlTrash } from 'react-icons/sl'
import { VscRunAbove } from 'react-icons/vsc'

import { PackageType } from '~types'

import { refetchKeys } from '~constants'

import { InstallOrUpdatePackageMutation, InstallOrUpdatePackageMutationDataType } from '~queries'

import useMutation from '~hooks/useMutation'
import useRefetch from '~hooks/useRefetch'

type PackagesTablePropsType = {
  packages: PackageType[]
  updatedPackages: PackageType[]
}

function PackagesTable({ packages, updatedPackages }: PackagesTablePropsType) {
  return (
    <Div
      xflex="y2s"
      backgroundColor="background-light"
      borderRadius="large"
      elevation={2}
      pb={0.5}
    >
      <Div
        display="grid"
        gridTemplateColumns="1fr 2fr 1fr"
        fontWeight={500}
        py={1}
      >
        <Div px={1}>
          Name
        </Div>
        <Div px={1}>
          Version
        </Div>
        <Div px={1}>
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

  const [, updateOrInstallPackage] = useMutation<InstallOrUpdatePackageMutationDataType>(InstallOrUpdatePackageMutation)

  const refetch = useRefetch()

  const mutate = useCallback(async (nextVersion: string) => {
    if (nextVersion === pkg.version) return

    setIsLoading(true)
    setIsEditing(false)

    await updateOrInstallPackage({
      name: pkg.name,
      version: nextVersion,
      shouldDelete: !nextVersion,
      type: pkg.type,
    })

    setIsLoading(false)

    refetch(refetchKeys.packages)
    refetch(refetchKeys.packagesUpdates)
  }, [pkg, updateOrInstallPackage, refetch])

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
      display="grid"
      gridTemplateColumns="1fr 2fr 1fr"
      py={0.5}
    >
      <Div px={1}>
        {pkg.name}
      </Div>
      <Div px={1}>
        {isEditing ? (
          <Form onSubmit={handleSubmit}>
            <Input
              bare
              autoFocus
              value={value}
              onChange={event => setValue(event.target.value)}
            />
          </Form>
        ) : pkg.version}
      </Div>
      <Div
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
          loading={isLoading}
        >
          <SlTrash />
        </Button>
        {updatedPackage && updatedPackage.version !== pkg.version && (
          <Button
            secondary
            spinnerColor="primary"
            onClick={handleUpdate}
            loading={isLoading}
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
