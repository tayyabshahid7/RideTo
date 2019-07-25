import React from 'react'
import content from './content'
import styles from './styles.scss'
import { Container, Row, Col } from 'reactstrap'
import CourseTypeDetails from 'components/RideTo/CourseTypeDetails'

function FullLicenceIncluded() {
  const { title, faqs } = content

  return (
    <div className={styles.container}>
      <Container>
        <Row>
          <Col>
            <h2 className={styles.title}>{title}</h2>
            <div>
              {!!Object.keys(faqs).length && (
                <CourseTypeDetails
                  courseType={{ details: faqs }}
                  minimal
                  useKeysAsTitle
                  fullLicenceFaqs
                />
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default FullLicenceIncluded
