import React from 'react'
import Slick from 'react-slick'
import styles from './styles.scss'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { NextArrow, PrevArrow } from './Arrows'
import { useMediaQuery } from 'react-responsive'
import { isExternalLink } from 'utils/helper'

function Slider({ gear, constant }) {
  const isDesktop = useMediaQuery({ minWidth: 1025 })
  const settings = {
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    slidesToShow: isDesktop ? Math.min(gear.length, 3) : 1
  }

  return (
    <div className={styles.container}>
      {gear.length > 0 && (
        <Slick {...settings}>
          {gear.map(({ name, link, image }) => (
            <a
              key={name}
              href={link}
              target={isExternalLink(link) ? '_blank' : undefined}>
              <div className={styles.slide}>
                <img src={image} alt="" />
                <h4 className={styles.title}>
                  {constant !== 'STEP_BIKE' && 'Shop'} {name}
                </h4>
              </div>
            </a>
          ))}
        </Slick>
      )}
    </div>
  )
}

export default Slider
