import React from 'react'
import Slick from 'react-slick'
import styles from './styles.scss'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { NextArrow, PrevArrow } from './Arrows'

const GEAR = [
  {
    name: 'Bikes',
    link: '/',
    image: 'https://via.placeholder.com/120x62'
  },
  {
    name: 'Gloves',
    link: '/',
    image: 'https://via.placeholder.com/62x120'
  }
]

function Slider() {
  const settings = {
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />
  }

  return (
    <div className={styles.container}>
      <Slick {...settings}>
        {GEAR.map(({ name, link, image }) => (
          <a key={name} href={link}>
            <div className={styles.slide}>
              <img src={image} alt="" />
              <h4 className={styles.title}>Shop {name}</h4>
            </div>
          </a>
        ))}
      </Slick>
    </div>
  )
}

export default Slider
