import { IconList, IconMap, IconSortAndFilter } from 'assets/icons'
import React, { useContext, useState } from 'react'
import { FilterProvider } from '../../FilterStateProvider'
import { SortAndFilterModal } from './components/SortAndFilterModal'

import styles from './styles.scss'

function SortAndFilter({
  handleMapButton,
  isMobileMapVisible,
  handleUpdateOption,
  courses,
  sortByModal
}) {
  const { totalFiltersUsed } = useContext(FilterProvider)
  const [modal, setModal] = useState(false)

  const handleSortAndFilter = () => {
    setModal(!modal)
  }

  function handleOnCloseModal() {
    setModal(false)
  }

  const showTotalFilters = totalFiltersUsed
    ? `Sort & Filter (${totalFiltersUsed})`
    : `Sort & Filter`

  return (
    <>
      {modal && (
        <SortAndFilterModal
          onClose={handleOnCloseModal}
          isOpen={modal}
          handleUpdateOption={handleUpdateOption}
          courses={courses}
          sortByModal={sortByModal}
        />
      )}
      <div className={styles.container}>
        <div className={styles.wrapper} onClick={handleSortAndFilter}>
          <IconSortAndFilter />
          <span>{showTotalFilters}</span>
        </div>
        <div className={styles.wrapper} onClick={handleMapButton}>
          {!!isMobileMapVisible ? (
            <>
              <IconList />
              <span>List</span>
            </>
          ) : (
            <>
              <IconMap />
              <span>Map</span>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default SortAndFilter
