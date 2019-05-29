import React from 'react'
import classnames from 'classnames'
import containerStyles from '../styles.scss'
import summaryStyles from '../BikeSummary/styles.scss'
import componentStyles from './styles.scss'
import Circle from 'react-circle'

const styles = {
  ...containerStyles,
  ...summaryStyles,
  ...componentStyles
}

function BikeReview({ match, bikes }) {
  const { images, name, price, bookLink } = bikes.find(
    bike => bike.id === parseInt(match.params.id, 10)
  )

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.largeImage}>
            <img src={images[0]} alt="Large product" />
          </div>
          <div className={styles.keyInfo}>
            <div className={styles.keyInfoHeader}>
              <div>
                <h1 className={styles.title}>{name}</h1>
                <div className={styles.price}>
                  RRP £{(price / 100).toLocaleString()}
                </div>
              </div>
              <div className={styles.score}>
                <div>RideTo Score</div>
                <div className={styles.circle}>
                  <Circle
                    progress={(8 / 10) * 100}
                    roundedStrike={true}
                    progressColor="green"
                    animate={false}
                    responsive={true}
                    showPercentage={false}
                  />
                </div>
              </div>
            </div>
            <div className={styles.infoRow}>125cc - 9.25 bhp</div>
            <div className={styles.infoRow}>189 MPG - 235 miles range</div>
            <div className={styles.infoRow}>
              CBT Licence{' '}
              <a href="https://via.placeholder.com/588x440">Book Course</a>
            </div>
            <div className={styles.infoRow}>
              Insurance group: 12{' '}
              <a href="https://via.placeholder.com/588x440">Get Quote</a>
            </div>
            <a
              className={classnames(
                styles.button,
                styles.buttonPrimary,
                styles.buttonReview
              )}
              href={bookLink}>
              Book test ride
            </a>
          </div>
        </div>
        <div className={styles.main}>
          <div className={styles.content}>
            <h2 className={styles.title}>{name} Review</h2>
            <p>
              That's the lorem ipsum. And it's ipsum dolor sit amet blah blah
              blah lorem blah yeah. Yep
            </p>
            <div className={styles.goodBad}>
              <div>
                <div>
                  <h3>The good</h3>
                  <ul className={styles.good}>
                    <li>Lorem ipsum</li>
                    <li>Lorem ipsum</li>
                    <li>Lorem ipsum</li>
                  </ul>
                </div>
              </div>
              <div>
                <h3>The not so good</h3>
                <ul className={styles.bad}>
                  <li>Lorem ipsum</li>
                  <li>Lorem ipsum</li>
                  <li>Lorem ipsum</li>
                </ul>
              </div>
            </div>
            <h3>The ride</h3>
            <p>
              Because it’s so small you can just fly around town, hitting gaps
              in traffic that aren’t really on, before buzzing off into the
              distance. The suspension is ultra soft, as is the enormous seat,
              but on the rough roads of{' '}
              <a href="https://www.google.com">London</a>’s West End, it was my
              derrière’s best friend.
            </p>
            <p>
              The only downside to this soft ride is that there’s a max system
              weight of 105kg, which you could easily reach if you’ve got all
              your gear on and a bag full of swag.
            </p>
            <img src="https://via.placeholder.com/588x440" alt="Placeholder" />
            <blockquote>
              <p>
                "That’s the Monkey in a nutshell. And its reliable engine’s the
                same; the air-cooled, fuel-injected horizontal 125cc"
              </p>
              <footer>
                <cite>James Jameson</cite> carwow expert
              </footer>
            </blockquote>
          </div>
          <div className={styles.footerButtons}>
            <a
              className={classnames(
                styles.button,
                styles.buttonPrimary,
                styles.buttonReview
              )}
              href={bookLink}>
              Book test ride
            </a>
            <a
              className={classnames(
                styles.button,
                styles.buttonPrimary,
                styles.buttonReview
              )}
              href={bookLink}>
              Book CBT course
            </a>
            <a
              className={classnames(
                styles.button,
                styles.buttonPrimary,
                styles.buttonReview
              )}
              href={bookLink}>
              Insurance quote
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BikeReview
