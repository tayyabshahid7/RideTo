import React, { Fragment } from 'react'
import classnames from 'classnames'

import styles from './AddonSizes.scss'

const AddonSizes = ({ sizes, selected, onClick, sizeRequired }) => {
  const error = sizeRequired && !selected

  return (
    <Fragment>
      <div className={styles.addonSizes}>
        {sizes.map(size => (
          <div
            key={size.code}
            title={size.name}
            onClick={() => size.quantity && onClick(size)}
            className={classnames(
              styles.size,
              size.quantity === 0 && styles.disabled,
              selected === size && styles.selected,
              error && styles.required
            )}>
            {size.code}
          </div>
        ))}
      </div>
      {error && <div class={styles.error}>Please select a size</div>}
    </Fragment>
  )
}

export default AddonSizes
