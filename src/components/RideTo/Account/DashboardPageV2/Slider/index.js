import React from 'react'
import Slick from 'react-slick'
import styles from './styles.scss'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { NextArrow, PrevArrow } from './Arrows'
import { useMediaQuery } from 'react-responsive'

function Slider({ gear }) {
  const isDesktop = useMediaQuery({ minWidth: 1025 })
  const settings = {
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    slidesToShow: isDesktop ? 3 : 1
  }

  return (
    <div className={styles.container}>
      <Slick {...settings}>
        {gear.map(({ name, link, image }) => (
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
