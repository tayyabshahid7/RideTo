import React from 'react'
import styles from './styles.scss'
import { Container, Row, Col } from 'reactstrap'
import { getCourseTitle } from 'services/course'

function DesktopHeader({ courseType, postcode }) {
  return (
    <Container className={styles.container}>
      <Row>
        <Col>
          <h1 className={styles.title}>
            {getCourseTitle(courseType)} {postcode}
          </h1>
          <h2 className={styles.subtitle}>Book motorcycle training near you</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          <form>
            <input type="text" />
          </form>
          <forms>
            <select />
          </forms>
        </Col>
      </Row>
    </Container>
  )
}

export default DesktopHeader
