import React from 'react'
import { Button, Row, Col, Form } from 'reactstrap'
import styles from './styles.scss'
import InputTextGroup2 from 'components/Forms/InputTextGroup2'
import Loading from 'components/Loading'

class WidgetSettingsForm extends React.Component {
  constructor(props) {
    super(props)
    const settings = {
      widget_color: '',
      button_color: '',
      calendar_color: '',
      intro: '',
      requirements: '',
      cancellation: '',
      terms: ''
    }
    Object.assign(settings, this.props.settings ? this.props.settings : {})

    this.state = {
      settings: settings
    }
  }

  componentDidUpdate(prevProps) {
    const { saving, error } = this.props
    if (prevProps.saving && !saving) {
      if (error) {
        alert('Failed to update booking widget settings')
      } else {
        alert('Booking widget settings have been successfully updated')
      }
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
    const {
      widget_color,
      button_color,
      calendar_color,
      intro,
      requirements,
      cancellation,
      terms
    } = this.state.settings
    return (
      <div className={styles.container}>
        <Loading loading={saving}>
          <Form onSubmit={this.handleSave.bind(this)}>
            <InputTextGroup2
              name="widget_color"
              value={widget_color}
              label="Widget color:"
              className="form-group"
              type="text"
              onChange={this.handleChangeRawEvent.bind(this)}
              required
            />
            <InputTextGroup2
              name="button_color"
              value={button_color}
              label="Button color:"
              className="form-group"
              type="text"
              onChange={this.handleChangeRawEvent.bind(this)}
            />
            <InputTextGroup2
              name="calendar_color"
              value={calendar_color}
              label="Calendar color:"
              className="form-group"
              type="text"
              onChange={this.handleChangeRawEvent.bind(this)}
            />
            <InputTextGroup2
              name="intro"
              value={intro}
              label="Intro:"
              type="textarea"
              onChange={this.handleChangeRawEvent.bind(this)}
            />
            <Row>
              <Col>
                <InputTextGroup2
                  name="requirements"
                  value={requirements}
                  label="Requirements:"
                  type="textarea"
                  onChange={this.handleChangeRawEvent.bind(this)}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <InputTextGroup2
                  name="cancellation"
                  value={cancellation}
                  label="Cancellation:"
                  type="textarea"
                  onChange={this.handleChangeRawEvent.bind(this)}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <InputTextGroup2
                  name="terms"
                  value={terms}
                  label="Terms:"
                  className="form-group"
                  type="text"
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

export default WidgetSettingsForm
