import { IconMap, IconSortAndFilter } from 'assets/icons'
import React, { useState } from 'react'
import { SortAndFilterModal } from './components/SortAndFilterModal'

import styles from './styles.scss'

function SortAndFilter({
  handleMapButton,
  isMobileMapVisible,
  handleUpdateOption,
  courses
}) {
  const [modal, setModal] = useState(true)

  const handleSortAndFilter = () => {
    setModal(!modal)
  }

  function handleOnCloseModal() {
    setModal(false)
  }

  return (
    <>
      {modal && (
        <SortAndFilterModal
          onClose={handleOnCloseModal}
          isOpen={modal}
          handleUpdateOption={handleUpdateOption}
          courses={courses}
        />
      )}
      <div className={styles.container}>
        <div className={styles.wrapper} onClick={handleSortAndFilter}>
          <IconSortAndFilter />
          <span>Sort & Filter (3)</span>
        </div>
        <div className={styles.wrapper} onClick={handleMapButton}>
          <IconMap />
          {!!isMobileMapVisible ? <span>List</span> : <span>Map</span>}
        </div>
      </div>
    </>
  )
}

export default SortAndFilter
