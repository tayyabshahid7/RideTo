import { dropdownLine } from 'assets/icons'
import CloseDark from 'assets/images/rideto/CloseDark.svg'
import classnames from 'classnames'
import RideToButton from 'components/RideTo/Button'
import React, { useEffect } from 'react'
import Select, { components } from 'react-select'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'

import styles from './styles.scss'

const options = [
  { value: 'distance', label: 'Distance' },
  { value: 'price', label: 'Price' },
  { value: 'price', label: 'Price' },
  { value: 'price', label: 'Price' }
]

// const coursesExample = [
//   {
//     title: 'Equipment Provided',
//     items: [
//       { name: 'Helmet', count: 9 },
//       { name: 'Jacket & Gloves', count: 9 },
//       { name: 'Bike Hire', count: 9 }
//     ]
//   },
//   {
//     title: 'Site Facilities',
//     items: [{ name: 'Cafe', count: 9 }, { name: 'Free Parking', count: 9 }]
//   },
//   { title: 'Booking options', items: [{ name: 'Instant book', count: 9 }] }
// ]

export function SortAndFilterModal({
  isOpen,
  onClose,
  courses,
  handleUpdateOption
}) {
  // const [filters, setFilters] = useState([])

  useEffect(() => {
    console.log(courses)
  }, [courses])

  // function handleCheckBoxSelection(e) {
  //   console.log(e.target)

  //   setFilters(prev => prev.filter(item => item !== e.target.name))

  //   console.log(filters)
  // }

  function handleSearchClick(event) {
    console.log(event)
    // handleUpdateOption()
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
            defaultValue={options[0]}
            options={options}
            menuPlacement="auto"
            components={{
              Control,
              DropdownIndicator,
              IndicatorSeparator,
              SingleValue,
              Option
            }}
            onChange={e => console.log(e.value)}
            className={styles.select}
          />
        </div>
        <div className={styles.space}>
          <span className={styles.title}>Filter By</span>
          <div className={styles.filterWrapper}>
            {/* {courses.map(filters => (
              <div key={filters.title} className={styles.checkboxWrapper}>
                <span className={styles.subtitle}>{filters.title}</span>
                {filters.items &&
                  filters.items.map(item => (
                    <div key={item.name} className={styles.itemWrapper}>
                      <Checkbox
                        id={item.name}
                        name={item.name}
                        extraClass={styles.checkbox}
                        size="smallBlack"
                        onChange={handleCheckBoxSelection}>
                        <span className={styles.item}>{item.name}</span>
                      </Checkbox>
                      <span className={styles.itemCount}>{item.count}</span>
                    </div>
                  ))}
              </div>
            ))} */}
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
