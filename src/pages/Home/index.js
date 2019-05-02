import React from 'react'
import { Link } from 'react-router-dom'
import styles from './styles.scss'
import { ConnectLogoFullWhite } from 'assets/icons/'
import prepaid from 'assets/images/Pre-paid lessons.svg'
import fillFree from 'assets/images/Fill free space.svg'
import provenResults from 'assets/images/Proven results.svg'
import bmf from 'assets/images/bmf.png'
import classnames from 'classnames'

function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.container}>
          <nav>
            <ul className={styles.navList}>
              <li>
                <a href="/home">
                  <h1>
                    <ConnectLogoFullWhite className={styles.logo} />
                  </h1>
                </a>
              </li>
              <li>
                <Link to="/login">
                  <span>Sign in</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className={styles.content}>
        <header>
          <section className={styles.intro}>
            <div className={styles.container}>
              <h1>
                The free online booking system for the motorcycle industry
              </h1>
              <h2>Modern and fast, everything today's riders expect</h2>
              <div className={styles.ctas}>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://rideto.typeform.com/to/jGpVsq"
                  className={styles.button}>
                  Learn more
                </a>
              </div>
            </div>
          </section>
        </header>
        <section className={styles.whatDo}>
          <div className={styles.container}>
            <h2>What can Connect do for your business?</h2>
            <div className={styles.whatDoRow}>
              <div>
                <img src={prepaid} alt="Prepaid" />
                <h3>Online Booking</h3>
                <p>
                  In today’s digital world, customers expect to buy everything
                  online. Our clients see an average increase of 25% in sales by
                  offering online booking.
                </p>
              </div>

              <div>
                <img src={fillFree} alt="Fill Free" />
                <h3>Online Calendar</h3>
                <p>
                  Avoid doubt and double bookings. Keeping your diary in a
                  purpose built calendar means you control what happens,
                  anywhere, anytime.
                </p>
              </div>

              <div>
                <img src={provenResults} alt="Proven Results" />
                <h3>Business Management</h3>
                <p>
                  Manage your resources effortlessly. Keeping financial,
                  customer and staff data in one secure place, to know exactly
                  how your business is performing.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className={styles.footer}>
        <section className={styles.seeHow}>
          <div className={styles.container}>
            <h2>See how Connect can power your business</h2>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://rideto.typeform.com/to/jGpVsq"
              className={classnames(styles.button, styles.buttonLarge)}>
              Start now
            </a>
          </div>
        </section>
        <section className={styles.footerBottom}>
          <div className={styles.container}>
            <img
              src={bmf}
              alt="British Motocyclists Federation"
              className={styles.bmf}
            />
            <p className={styles.copyright}>
              © 2019 RideTo Ltd, Registered Company Number: 10454345, Registered
              Office: Dunsden Green, Reading, Oxfordshire RG4 9QD
            </p>
          </div>
        </section>
      </footer>
    </div>
  )
}

export default Home
