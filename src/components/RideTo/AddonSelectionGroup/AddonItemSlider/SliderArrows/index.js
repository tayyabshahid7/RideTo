import React from 'react'
import styles from './styles.scss'
import Left from 'assets/images/rideto/ArrowSlideLeftBlack.svg'
import Right from 'assets/images/rideto/ArrowSlideRightBlack.svg'
import classnames from 'classnames'

function BaseArrow({ icon, label, onClick, className }) {
  return (
    <div
      onClick={onClick}
      className={classnames(
        className,
        styles.button,
        styles[`button${label}`]
      )}>
      <img src={icon} alt="" />
    </div>
  )
}

export function NextArrow({ onClick, className }) {
  return (
    <BaseArrow
      label="Next"
      icon={Right}
      onClick={onClick}
      className={className}
    />
  )
}

export function PrevArrow({ onClick, className }) {
  return (
    <BaseArrow
      label="Previous"
      icon={Left}
      onClick={onClick}
      className={className}
    />
  )
}
