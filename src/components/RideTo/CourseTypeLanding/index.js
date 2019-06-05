import React from 'react'
import styles from './styles.scss'

function CourseTypeLanding() {
  return (
    <section>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.headerInner}>
            <div className={styles.headerInfo}>
              <h1>Full Motorcycle Licence Course</h1>
              <h2>
                A multi day course with 2 tests so you can:
                <br />
                - Remove L plates
                <br />
                - Carry passengers
                <br />- Ride on motorways
              </h2>
              <div>
                <span>10,500 courses sold</span>
              </div>
            </div>
            <div className={styles.bookInfo}>
              <img
                src="https://via.placeholder.com/350x200"
                alt="Placeholder"
              />
              <div className={styles.bookInfoText}>
                <h4>Book a local instructor</h4>
                <form className={styles.bookForm}>
                  <input placeholder="Your postcode" type="text" />
                  <button>Search</button>
                </form>
                <h5>We include as standard:</h5>
                <ul>
                  <li>Bike &amp; helmet hire</li>
                  <li>Test fees &amp; fuel</li>
                  <li>Online pre-training</li>
                  <li>Free cancellation</li>
                  <li>135 training locations UK wide</li>
                  <li>Dedicated support team</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className={styles.container}>
        <div className={styles.mainBody}>
          <div>
            <h2>What you'll learn</h2>
            <h3>How to ride the bike for your licence (A1, A2, A)</h3>
            <p>
              Eu exercitation aliquip id cupidatat nisi veniam dolor incididunt
              reprehenderit laboris officia.
            </p>
            <h3>Module 1 maneauvers</h3>
            <p>
              Minim sunt consectetur nisi do voluptate ea anim mollit do
              consectetur adipisicing pariatur voluptate do fugiat commodo
              fugiat fugiat. Magna id sed dolor deserunt et excepteur aute
              veniam.
            </p>
            <h3>Module 2 maneauvers</h3>
            <p>
              Quis ex quis officia est laboris ut ex in labore. Lorem ipsum duis
              dolor ullamco ut quis duis duis nulla sunt culpa ea sunt deserunt
              duis nostrud.
            </p>
            <h3>Module 2 road riding skills</h3>
            <p>
              Non et elit labore fugiat do reprehenderit cillum ad officia
              commodo. Aute duis ut officia labore dolore non adipisicing
              laboris amet reprehenderit consequat nisi cillum sunt aute. Enim
              aute consectetur proident velit sit quis dolor in do nisi occaecat
              sint cupidatat enim quis fugiat irure anim.
            </p>
          </div>
          <div className={styles.fastTrackAdvert} />
          <div>
            <h2>Requirements</h2>
            <p>
              Esse nostrud ut aute non dolor in tempor voluptate exercitation
              exercitation officia duis consectetur ad ea id ea enim.
            </p>
            <p>
              Lorem ipsum ut deserunt nulla in cillum et proident sit aliquip
              cupidatat in irure eiusmod nisi ea.
            </p>
            <p>
              Mollit eiusmod officia voluptate sint irure dolor commodo
              voluptate id excepteur consectetur sed ut incididunt nulla
              voluptate.
            </p>
            <p>
              Lorem ipsum quis proident in consectetur eiusmod anim laboris
              nulla sit laborum mollit anim eu.
            </p>
            <p>
              Aliquip consequat consectetur in nulla aliqua nisi magna deserunt
              commodo quis labore adipisicing.
            </p>
          </div>
          <div>
            <h2>What you can ride after</h2>
            <p>
              Ut laborum ut mollit magna incididunt est dolor voluptate dolor
              commodo officia excepteur magna do sit.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CourseTypeLanding
