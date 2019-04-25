import React from 'react'
import { Link } from 'react-router-dom'
import styles from './styles.scss'
import { ConnectLogoFullWhite } from 'assets/icons/'

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
              <h2>Modern and fast, everything today’s riders expect</h2>
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
      </main>
    </div>
  )
}

export default Home
