import React, { Component } from 'react'
import styles from '../styles.scss'

class Sort extends Component {
  constructor(props) {
    super(props)

    this.handleRadioClick()
  }

  handleRadioClick(event, option) {
    const { updateSort } = this.props

    if (event && event.target.checked) {
      updateSort(option)
    }
  }

  render() {
    const { sortOptions, sortSelected } = this.props

    return (
      <div>
        {sortOptions.map(option => {
          const { name, id } = option

          return (
            <div key={id} className={styles.sortItem}>
              <label className={styles.sortLabel}>
                <input
                  className={styles.boxInput}
                  name="sort"
                  type="radio"
                  checked={id === sortSelected.id}
                  onChange={event => {
                    this.handleRadioClick(event, option)
                  }}
                />{' '}
                {name}
              </label>
            </div>
          )
        })}
      </div>
    )
  }
}
export default Sort
