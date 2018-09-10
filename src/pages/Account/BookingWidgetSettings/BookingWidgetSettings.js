import React from 'react'
import { Row, Col } from 'reactstrap'
import styles from './styles.scss'
import WidgetSettingsForm from 'components/Account/WidgetSettingsForm'

class BookingWidgetSettings extends React.Component {
  // componentDidUpdate(prevProps) {
  //   const { settingsSaving, settingsError } = this.props
  //   if (prevProps.settingsSaving && !settingsSaving) {
  //     if (settingsError) {
  //       alert('Failed to save settings')
  //     } else {
  //       alert('Settings have been successfully updated')
  //     }
  //   }
  // }

  handleSave(data) {
    const { updateWidgetSettings } = this.props
    updateWidgetSettings(data)
  }

  render() {
    const { saving, error, settings } = this.props
    return (
      <Row className={styles.container}>
        <Col>
          <WidgetSettingsForm
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

export default BookingWidgetSettings
