import { dropdownLine } from 'assets/icons'
import CloseDark from 'assets/images/rideto/CloseDark.svg'
import classnames from 'classnames'
import Checkbox from 'components/Checkbox'
import RideToButton from 'components/RideTo/Button'
import * as _ from 'lodash'
import React, { useContext, useEffect, useState } from 'react'
import Select, { components } from 'react-select'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import { FilterProvider } from '../../../../FilterStateProvider'

import styles from './styles.scss'

const options = [
  { value: 'distance', label: 'Distance' },
  { value: 'price', label: 'Price' },
  { value: 'date', label: 'Date' },
  { value: 'rating', label: 'Rating' }
]

export function SortAndFilterModal({
  isOpen,
  onClose,
  courses,
  handleUpdateOption
}) {
  const [filters, setFilters] = useState([])
  const [sort, setSort] = useState(options[0])

  const {
    handleFilterTotalUsed,
    handleCheckBoxSelection,
    selectedFilters
  } = useContext(FilterProvider)

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
              name: 'Free Parking',
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

  function handleSearchClick() {
    const { available, unavailable } = courses

    const filtered = available.filter(el => {
      return selectedFilters.every(f => {
        return el[f] === true
      })
    })

    let newAvailable
    let newUnavailable
    let newFiltered

    const sortId = sort ? sort.value : null
    switch (sortId) {
      default:
        newAvailable = _.sortBy(available, 'distance_miles')
        newUnavailable = _.sortBy(unavailable, 'distance_miles')
        newFiltered = _.sortBy(filtered, 'distance_miles')

        break
      case 'price':
        newAvailable = available.sort((a, b) => {
          if (a.price === b.price) {
            return a.distance_miles - b.distance_miles
          }
          return a.price > b.price ? 1 : -1
        })

        newUnavailable = unavailable.sort((a, b) => {
          if (a.price === b.price) {
            return a.distance_miles - b.distance_miles
          }
          return a.price > b.price ? 1 : -1
        })

        newFiltered = unavailable.sort((a, b) => {
          if (a.price === b.price) {
            return a.distance_miles - b.distance_miles
          }
          return a.price > b.price ? 1 : -1
        })

        break

      case 'date':
        newAvailable = available.sort((a, b) => {
          if (a.next_date_available === b.next_date_available) {
            return a.distance_miles - b.distance_miles
          }
          return a.next_date_available > b.next_date_available ? 1 : -1
        })

        newUnavailable = unavailable.sort((a, b) => {
          if (a.next_date_available === b.next_date_available) {
            return a.distance_miles - b.distance_miles
          }
          return a.next_date_available > b.next_date_available ? 1 : -1
        })

        newFiltered = unavailable.sort((a, b) => {
          if (a.next_date_available === b.next_date_available) {
            return a.distance_miles - b.distance_miles
          }
          return a.next_date_available > b.next_date_available ? 1 : -1
        })

        break

      case 'rating':
        newAvailable = available.sort((a, b) => {
          if (a.rating === b.rating) {
            return a.distance_miles - b.distance_miles
          }
          return a.rating > b.rating ? -1 : 1
        })
        newUnavailable = unavailable.sort((a, b) => {
          if (a.rating === b.rating) {
            return a.distance_miles - b.distance_miles
          }
          return a.rating > b.rating ? -1 : 1
        })
        newFiltered = filtered.sort((a, b) => {
          if (a.rating === b.rating) {
            return a.distance_miles - b.distance_miles
          }
          return a.rating > b.rating ? -1 : 1
        })
        break
    }

    onClose()
    handleFilterTotalUsed(selectedFilters.length)
    handleUpdateOption({
      courses: {
        available: newAvailable,
        unavailable: newUnavailable,
        filtered: newFiltered
      }
    })
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
            {filters.map(filters => (
              <div key={filters.title} className={styles.checkboxWrapper}>
                <span className={styles.subtitle}>{filters.title}</span>
                {filters.items &&
                  filters.items.map(item => (
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
            className={styles.searchButton}
            onClick={handleSearchClick}>
            Search
          </RideToButton>
        </div>
      </ModalBody>
    </Modal>
  )
}
