import React from 'react'
import { Button, Row, Col, Form } from 'reactstrap'
import styles from './styles.scss'
import InputTextGroup2 from 'components/Forms/InputTextGroup2'
import Loading from 'components/Loading'

class EmailSettingsForm extends React.Component {
  constructor(props) {
    super(props)
    const settings = {
      email_text: ''
    }
    Object.assign(settings, this.props.settings ? this.props.settings : {})

    this.state = {
      settings: settings
    }
  }

  handleChangeRawEvent(event) {
    let name = event.target.name
    let { settings } = this.state
    settings[name] = event.target.value
    this.setState({ settings })
  }

  handleCancel(event) {
    event.preventDefault()
    const { handleCancel } = this.props
    handleCancel()
  }

  handleSave(event) {
    event.preventDefault()
    const { onSubmit } = this.props
    const { settings } = this.state
    onSubmit(settings)
  }

  render() {
    let { saving } = this.props
    const { email_text } = this.state.settings
    return (
      <div className={styles.container}>
        <Loading loading={saving}>
          <div className={styles.helpText}>
            <p>
              These are the place holders available that will translate directly
              for any details that you need to add for the confirmation emails
            </p>
            <p>
              Notice that they have to match the examples exactly, otherwise the
              email's text will be inconsistent
            </p>
            <ul>
              <li>
                <b>[[rider_name]]</b> - The rider's first name
              </li>
              <li>
                <b>[[selected_training]]</b> - The selected training (CBT
                Training, Renewal, etc)
              </li>
              <li>
                <b>[[training_details]]</b> - Details about the training booked
                Example: <i>CBT Training - Tue Mar 5 2019 - 09:00 AM</i>
              </li>
              <li>
                <b>[[location]]</b> - The location of the training
              </li>
              <li>
                <b>[[bike_hire]]</b> - Type of bike selected (Automatic, Manual,
                Own Bike)
              </li>
              <li>
                <b>[[school_name]]</b> - The training school name (Your training
                school name) this
              </li>
              <li>
                <b>[[school_phone]]</b> - The school phone number for contacting
                the school if any enquiry
              </li>
            </ul>
          </div>
          <Form onSubmit={this.handleSave.bind(this)}>
            <Row>
              <Col>
                <InputTextGroup2
                  name="email_text"
                  value={email_text}
                  label="Email Text:"
                  className="form-group"
                  type="textarea"
                  rows="20"
                  onChange={this.handleChangeRawEvent.bind(this)}
                />
              </Col>
            </Row>
            <Row>
              <Col className="mt-3 text-right">
                <Button type="submit" color="primary">
                  Save
                </Button>
              </Col>
            </Row>
          </Form>
        </Loading>
      </div>
    )
  }
}

export default EmailSettingsForm
