import React from 'react'
import { Row, Col } from 'reactstrap'
import styles from './styles.scss'
import EmailSettingsForm from 'components/Account/EmailSettingsForm'

class EmailSettings extends React.Component {
  handleSave(data) {
    const { updateWidgetSettings } = this.props
    updateWidgetSettings(data)
  }

  render() {
    const { saving, error, settings } = this.props
    return (
      <Row className={styles.container}>
        <Col>
          <EmailSettingsForm
            onSubmit={this.handleSave.bind(this)}
            settings={settings}
            saving={saving}
            error={error}
          />
        </Col>
      </Row>
    )
  }
}

export default EmailSettings
