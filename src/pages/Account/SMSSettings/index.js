import React from 'react'
import styles from './styles.scss'
import { Row, Col } from 'reactstrap'
import classnames from 'classnames'
import { Button } from 'components/ConnectForm'

function SMSSettings() {
  return (
    <Row className={styles.container}>
      <Col>
        <div className={classnames(styles.box, styles.boxVertical)}>
          <div>
            <div>
              <h3 className={styles.title}>SMS credits</h3>
              <div className={styles.credits}>
                <div className={styles.intro}>
                  <p>
                    SMS credits are required to send SMS to customers. Here you
                    can check your credits and purchase more
                  </p>
                </div>
                <div className={styles.title}>
                  <span style={{ color: 'var(--primary-color)' }}>
                    Current credits:
                  </span>{' '}
                  120 SMS
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className={styles.title}>Purchase SMS credits</h3>
            <div className={styles.buttonRow}>
              <Button large>Add £200</Button>
              <Button large>Add £100</Button>
              <Button large>Add £400</Button>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  )
}

export default SMSSettings
