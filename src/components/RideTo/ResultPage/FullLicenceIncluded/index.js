import React from 'react'
import content from './content'
import styles from './styles.scss'
import { Container, Row, Col } from 'reactstrap'

function FullLicenceIncluded() {
  const { title, items } = content

  return (
    <div className={styles.container}>
      <Container>
        <Row>
          <Col>
            <h2 className={styles.title}>{title}</h2>
            <ul className={styles.itemsList}>
              {items.map(({ icon, title, text }, i) => (
                <div key={i} className={styles.item}>
                  <img src={icon} alt="" />
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </ul>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default FullLicenceIncluded
