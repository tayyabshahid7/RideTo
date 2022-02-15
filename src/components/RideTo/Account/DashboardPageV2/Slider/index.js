import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import { NextArrow, PrevArrow } from './Arrows'

import React from 'react'
import Slick from 'react-slick'
import classnames from 'classnames'
import styles from './styles.scss'
import { useMediaQuery } from 'react-responsive'

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
          {gear.map(({ name, link, image, description }) => (
            <a
              id={`gear-slide-item-${name}`}
              key={name}
              href={link}
              target="_blank"
              rel="noopener noreferrer">
              <div
                className={classnames(
                  styles.slide,
                  description && styles.descSlide
                )}>
                <img src={image} alt="" />
                <h4 className={styles.title}>
                  {constant !== 'STEP_BIKE' && 'Shop'} {name}
                </h4>
                {description && (
                  <p className={styles.description}>
                    {description} <span>Learn More</span>
                  </p>
                )}
              </div>
            </a>
          ))}
        </Slick>
      )}
    </div>
  )
}

export default Slider
