import classnames from 'classnames'
import React from 'react'
import { BikeHirePricing } from './BikeHirePricing'
import styles from './styles.scss'

function Bikes(props) {
  return (
    <div className={classnames(styles.box, styles.boxVertical)}>
      <BikeHirePricing schools={props.schools} />
    </div>
  )
}

export default Bikes
