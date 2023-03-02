import { dropdownLine } from 'assets/icons'
import CloseDark from 'assets/images/rideto/CloseDark.svg'
import classnames from 'classnames'
import Checkbox from 'components/Checkbox'
import RideToButton from 'components/RideTo/Button'
import React, { useContext, useEffect, useState } from 'react'
import Select, { components } from 'react-select'
import { Modal, ModalBody, ModalHeader, Spinner } from 'reactstrap'
import { FilterProvider } from '../../../../FilterStateProvider'

import styles from './styles.scss'

export function SortAndFilterModal({
  isOpen,
  onClose,
  courses,
  handleUpdateOption,
  sortByModal
}) {
  const {
    handleCheckBoxSelection,
    selectedFilters,
    handleFilter,
    options
  } = useContext(FilterProvider)

  const [filters, setFilters] = useState([])
  const [sort, setSort] = useState(options[0])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (courses) {
      const { available } = courses

      // Equipment Provided
      const helmetHireCount = available.reduce(
        (n, course) => n + (course.helmet_hire === true),
        0
      )

      const jacketGlovesCount = available.reduce(
        (n, course) => n + (course.gloves_jacket_included === true),
        0
      )
      const bikeHireIncludedCount = available.reduce(
        (n, course) => n + (course.bike_hire === true),
        0
      )

      // Site Facilities
      const onSiteCoffeeCount = available.reduce(
        (n, course) => n + (course.on_site_cafe === true),
        0
      )

      const onSiteParkingCount = available.reduce(
        (n, course) => n + (course.on_site_parking === true),
        0
      )

      const indoorClassroomCount = available.reduce(
        (n, course) => n + (course.indoor_classroom === true),
        0
      )

      // Booking options
      const instantBookCount = available.reduce(
        (n, course) => n + (course.instant_book === true),
        0
      )

      if (helmetHireCount || jacketGlovesCount || bikeHireIncludedCount) {
        const equipmentProvidedObj = {
          title: 'Equipment Provided',
          items: [
            { id: 'helmet_hire', name: 'Helmet', count: helmetHireCount },
            {
              id: 'gloves_jacket_included',
              name: 'Jacket & Gloves',
              count: jacketGlovesCount
            },
            { id: 'bike_hire', name: 'Bike Hire', count: bikeHireIncludedCount }
          ]
        }

        setFilters(previousState => [...previousState, equipmentProvidedObj])
      }

      if (onSiteCoffeeCount || onSiteParkingCount || indoorClassroomCount) {
        const siteFacilitiesObj = {
          title: 'Site Facilities',
          items: [
            { id: 'on_site_cafe', name: 'Cafe', count: onSiteCoffeeCount },
            {
              id: 'on_site_parking',
              name: 'Parking',
              count: onSiteParkingCount
            },
            {
              id: 'indoor_classroom',
              name: 'Indoor Classroom',
              count: indoorClassroomCount
            }
          ]
        }

        setFilters(previousState => [...previousState, siteFacilitiesObj])
      }

      if (instantBookCount) {
        const bookingOptionsObj = {
          title: 'Booking options',
          items: [
            {
              id: 'instant_book',
              name: 'Instant book',
              count: instantBookCount
            }
          ]
        }

        setFilters(previousState => [...previousState, bookingOptionsObj])
      }
    }
  }, [courses])

  function handleSelectSortBySelect(e) {
    setSort(e)
  }

  useEffect(() => {
    const objIndex = options.findIndex(sort => sort.value === sortByModal)

    if (objIndex) {
      setSort(options[objIndex])
    } else {
      setSort(options[0])
    }
  }, [])

  function handleSearchClick() {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      handleFilter(courses, handleUpdateOption, sort)
      onClose()
    }, 1000)
  }

  const CloseButtonIcon = (
    <button onClick={onClose} className={styles.buttonClose}>
      <img src={CloseDark} alt="close-modal" />
    </button>
  )

  const Control = ({ children, ...props }) => {
    return (
      <components.Control {...props} className={styles.selectControl}>
        {children}
      </components.Control>
    )
  }

  const DropdownIndicator = props => {
    return (
      <components.DropdownIndicator
        {...props}
        className={styles.selectDropDownIndicator}>
        <img src={dropdownLine} alt="" />
      </components.DropdownIndicator>
    )
  }

  const SingleValue = props => {
    return (
      <components.SingleValue {...props}>
        {props.children}
      </components.SingleValue>
    )
  }

  const Option = props => {
    return <components.Option {...props}>{props.children}</components.Option>
  }

  const indicatorSeparatorStyle = {
    display: 'none'
  }

  const IndicatorSeparator = ({ innerProps }) => {
    return <span style={indicatorSeparatorStyle} {...innerProps} />
  }
  return (
    <Modal
      isOpen={isOpen}
      backdrop="static"
      className={styles.modal}
      contentClassName={classnames(styles.modalContent, styles.spaceTitle)}>
      <ModalHeader
        className={styles.modalHeader}
        toggle={onClose}
        close={CloseButtonIcon}>
        Sort & Filter
      </ModalHeader>
      <ModalBody className={styles.modalBody}>
        <div className={styles.space}>
          <span className={styles.title}>Sort By</span>
          <Select
            defaultValue={sort}
            options={options}
            menuPlacement="auto"
            isSearchable={false}
            components={{
              Control,
              DropdownIndicator,
              IndicatorSeparator,
              SingleValue,
              Option
            }}
            onChange={handleSelectSortBySelect}
            className={styles.select}
          />
        </div>
        <div className={styles.space}>
          <span className={styles.title}>Filter By</span>
          <div className={styles.filterWrapper}>
            {filters.map((filter, index) => (
              <div key={index} className={styles.checkboxWrapper}>
                <span className={styles.subtitle}>{filter.title}</span>
                {filter.items &&
                  filter.items.map(item => (
                    <div key={item.name} className={styles.itemWrapper}>
                      <Checkbox
                        id={item.id}
                        name={item.name}
                        extraClass={styles.checkbox}
                        size="smallBlack"
                        onChange={handleCheckBoxSelection}
                        checked={selectedFilters.indexOf(item.id) > -1}>
                        <span className={styles.item}>{item.name}</span>
                      </Checkbox>
                      <span className={styles.itemCount}>{item.count}</span>
                    </div>
                  ))}
              </div>
            ))}
          </div>

          <RideToButton
            className={classnames(
              styles.searchButton,
              isLoading && styles.disableButton
            )}
            onClick={handleSearchClick}
            disable={true}>
            {isLoading && <Spinner size={'md'} />}
            {!isLoading && <span>Search</span>}
          </RideToButton>
        </div>
      </ModalBody>
    </Modal>
  )
}
