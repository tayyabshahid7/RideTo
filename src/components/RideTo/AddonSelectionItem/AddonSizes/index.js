import React from 'react'
import classnames from 'classnames'

import styles from './AddonSizes.scss'

const AddonSizes = ({ sizes, selected, onClick }) => {
  return (
    <div className={styles.addonSizes}>
      {sizes.map(size => (
        <div
          key={size.code}
          title={size.name}
          onClick={() => size.quantity && onClick(size)}
          className={classnames(
            styles.size,
            size.quantity === 0 && styles.disabled,
            selected === size && styles.selected
          )}>
          {size.code}
        </div>
      ))}
    </div>
  )
}

export default AddonSizes
