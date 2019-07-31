import React from 'react'
import amex from 'assets/icons/cards/amex.svg'
import mastercard from 'assets/icons/cards/mastercard.svg'
import visa from 'assets/icons/cards/visa.svg'
import styles from './styles.scss'

const CARDS = [
  { name: 'mastercard', image: mastercard },
  { name: 'visa', image: visa },
  { name: 'amex', image: amex }
]

function CardIcons({ selected = false }) {
  return (
    <div
      className={
        selected && selected !== 'unknown' ? styles.cardTypeSelected : undefined
      }>
      <ul className={styles.list}>
        {CARDS.map(({ name, image }) => (
          <li key={name}>
            <img
              className={selected === name ? styles.selected : undefined}
              src={image}
              alt={name}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CardIcons
