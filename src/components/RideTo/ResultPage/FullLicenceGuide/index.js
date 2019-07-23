import React, { useState } from 'react'
import { Container, Row, Col } from 'reactstrap'
import styles from './styles.scss'
import WideForm from 'components/RideTo/GettingStarted/Ready'
import ButtonArrowWhiteDown from 'assets/images/rideto/ButtonArrowWhiteDown.svg'
import { post } from 'services/api'

function FullLicenceGuide() {
  const [value, setValue] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async event => {
    event.preventDefault()

    if (!value.trim()) {
      return
    }

    setError('')

    try {
      await post('contact-email/', { email: value })
      setSent(true)
    } catch ({ message }) {
      setError(message)
    }
  }

  const handleOnChange = event => {
    setValue(event.target.value)
  }

  return (
    <div className={styles.background}>
      <Container>
        <Row>
          <Col>
            <WideForm
              error={error}
              sent={sent}
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
              value={value}
              onChange={handleOnChange}
            />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default FullLicenceGuide
