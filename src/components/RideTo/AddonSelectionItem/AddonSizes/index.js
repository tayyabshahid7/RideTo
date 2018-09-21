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
          onClick={() => onClick(size)}
          className={classnames(
            styles.size,
            selected === size && styles.selected
          )}>
          {size.code}
        </div>
      ))}
    </div>
  )
}

export default AddonSizes
