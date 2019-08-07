import React from 'react'
import styles from './styles.scss'
import Left from 'assets/images/rideto/ArrowSlideLeftBlack.svg'
import Right from 'assets/images/rideto/ArrowSlideRightBlack.svg'
import classnames from 'classnames'

function BaseArrow({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={classnames(styles.button, styles[`button${label}`])}>
      <img src={icon} alt="" />
      <span className={styles.srOnly}>{label}</span>
    </button>
  )
}

export function NextArrow({ onClick }) {
  return <BaseArrow label="Next" icon={Right} onClick={onClick} />
}

export function PrevArrow({ onClick }) {
  return <BaseArrow label="Previous" icon={Left} onClick={onClick} />
}
