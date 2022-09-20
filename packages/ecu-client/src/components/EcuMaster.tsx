function EcuMaster({ children }: any) {

  return (
    <>
      <Overlay />
      {children}
    </>
  )
}

function Overlay() {
  function handleCreateComponentClick() {

  }

  return (
    <button
      onClick={handleCreateComponentClick}
      type="button"
    >
      Create component
    </button>
  )
}

export default EcuMaster
