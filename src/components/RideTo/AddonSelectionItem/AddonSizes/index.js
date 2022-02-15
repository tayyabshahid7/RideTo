import React, { Fragment } from 'react'

import Select from 'components/RideTo/Select'
import styles from './AddonSizes.scss'

const AddonSizes = ({ sizes, selected, onClick, sizeRequired }) => {
  const error = sizeRequired && !selected

  const handleChange = event => {
    const size = sizes.find(({ code }) => code === event.target.value)

    if (size.quantity) {
      onClick(size)
    }
  }

  return (
    <Fragment>
      <Select
        className={styles.selectSize}
        value={selected ? selected.code : ''}
        onChange={handleChange}>
        <option value="" hidden disabled>
          Select Size
        </option>
        {sizes.map(size => (
          <option key={size.code} value={size.code} disabled={!size.quantity}>
            {size.code}
          </option>
        ))}
      </Select>
      {error && <div className={styles.error}>Please select a size</div>}
    </Fragment>
  )
}

export default AddonSizes
