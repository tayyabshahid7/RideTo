import React from 'react'
import { Link } from 'react-router-dom'
import styles from './styles.scss'
import { IconLongArrowRight } from 'assets/icons/'
import classnames from 'classnames'

import { Button } from 'components/ConnectForm'
import Logo from 'components/common/Logo'

function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.pageTop}>
        <header className={styles.header}>
          <Logo />
          <Link to="/login" className={styles.signin}>
            <Button type="button" color="white">
              Sign In
            </Button>
          </Link>
        </header>
        <div className={styles.main}>
          <h1>The free online booking system for the motorcycle industry</h1>
          <h2>Modern and fast, everything today's riders expect</h2>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://rideto.typeform.com/to/jGpVsq">
            <Button color="primary" type="button">
              Learn more
              <IconLongArrowRight />
            </Button>
          </a>
        </div>
      </div>
      <section className={styles.content}>
        <div className={styles.whatDoRow}>
          <div>
            <div className={styles.rowHeader}>
              <div className={styles.icon}>
                <i className="fa fa-gbp"></i>
              </div>
              <h3>Online Booking</h3>
            </div>
            <p>
              In today’s digital world, customers expect to buy everything
              online. Our clients see an average increase of 25% in sales by
              offering online booking.
            </p>
          </div>

          <div>
            <div className={styles.rowHeader}>
              <div className={classnames(styles.icon, styles.iconYellow)}>
                <i className="fa fa-calendar-o"></i>
              </div>
              <h3>Online Calendar</h3>
            </div>
            <p>
              Avoid doubt and double bookings. Keeping your diary in a purpose
              built calendar means you control what happens, anywhere, anytime.
            </p>
          </div>

          <div>
            <div className={styles.rowHeader}>
              <div className={classnames(styles.icon, styles.iconRed)}>
                <i className="fa fa-briefcase"></i>
              </div>
              <h3>Business Management</h3>
            </div>
            <p>
              Manage your resources effortlessly. Keeping financial, customer
              and staff data in one secure place, to know exactly how your
              business is performing.
            </p>
          </div>
        </div>
        <section className={styles.seeHow}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://rideto.typeform.com/to/jGpVsq"
            className={classnames(styles.button)}>
            See how Connect can power your business
            <IconLongArrowRight />
          </a>
        </section>
        <p className={styles.copyright}>
          © 2020 RideTo Ltd, Registered Company Number: 10454345, Registered
          Office: Dunsden Green, Reading, Oxfordshire RG4 9QD
        </p>
      </section>
    </div>
  )
}

export default Home
