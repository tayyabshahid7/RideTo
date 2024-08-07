import React from 'react'
import { useMediaQuery } from 'react-responsive'
import klarna from '../../../assets/icons/cards/klarnaPink.svg'
import styles from './styles.scss'

export default function KlarnaBanner() {
  const isMobile = useMediaQuery({ maxWidth: 768 })
  return (
    <a
      href="https://www.rideto.com/blog/motorcycle-cbt-on-finance"
      target="_blank"
      rel="noopener noreferrer">
      <div className={styles.container}>
        {!isMobile ? (
          <span>Split your purchase into 3 interest-free payments*</span>
        ) : (
          <span>Buy Now, Pay Later</span>
        )}

        <img src={klarna} alt="klarna logo" />
      </div>
    </a>
  )
}
