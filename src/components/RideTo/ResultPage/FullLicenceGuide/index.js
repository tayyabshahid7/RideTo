import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import styles from './styles.scss'
import WideForm from 'components/RideTo/GettingStarted/Ready'
import ButtonArrowWhiteDown from 'assets/images/rideto/ButtonArrowWhiteDown.svg'

function FullLicenceGuide() {
  const handleSubmit = event => {
    // TODO. Hit an endpoint
    event.preventDefault()
  }

  return (
    <div className={styles.background}>
      <Container>
        <Row>
          <Col>
            <WideForm
              name="email"
              type="email"
              className={styles.form}
              titleClassName={styles.title}
              inputClassName={styles.input}
              titleText="Get the full licence guide"
              placeholderText="Email address"
              buttonText="Download guide"
              onSubmit={handleSubmit}
              buttonClassName={styles.button}
              buttonIcon={ButtonArrowWhiteDown}
            />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default FullLicenceGuide
