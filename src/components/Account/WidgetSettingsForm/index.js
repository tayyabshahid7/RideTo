import {
  Button,
  ConnectCheckbox,
  ConnectTextArea
} from 'components/ConnectForm'
import { Col, Form, Row } from 'reactstrap'
import React, { Fragment } from 'react'

import Checkbox from 'components/Checkbox'
import { ConnectSelect } from 'components/ConnectForm'
import Loading from 'components/Loading'
import WidgetPromoCodes from './WidgetPromoCodes'
import classnames from 'classnames'
import range from 'lodash/range'
import styles from './styles.scss'

const TIMES = [
  ...range(8, 24).map(hour => {
    const time = `${hour.toString().padStart(2, '0')}:00`

    return {
      id: `${time}:00`,
      name: time
    }
  }),
  {
    id: '23:59:59',
    name: '23:59'
  }
]

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
      terms: '',
      last_time_book: '18:00:00',
      disabled_widget_cuttoff_time: '',
      enable_third_party_optin: false,
      request_previous_cbt_date: false
    }
    Object.assign(settings, this.props.settings ? this.props.settings : {})

    this.state = {
      settings: settings,
      introEditable: false,
      requirementsEditable: false,
      cancellationEditable: false,
      termsEditable: false,
      isChanged: false
    }

    this.introEl = React.createRef()
    this.requirementsEl = React.createRef()
    this.cancellationEl = React.createRef()
    this.termsEl = React.createRef()
  }

  handleChangeRawEvent({ target }) {
    const { name, type, checked, value: targetValue } = target
    const value = type === 'checkbox' ? checked : targetValue
    const { settings } = this.state
    this.setState({ settings: { ...settings, [name]: value }, isChanged: true })
  }

  handleCancel(event) {
    event.preventDefault()
    this.setState({
      settings: this.props.settings,
      introEditable: false,
      requirementsEditable: false,
      cancellationEditable: false,
      termsEditable: false,
      isChanged: false
    })
  }

  handleColourChange = event => {
    const value = event.target.value
    const { settings } = this.state

    this.setState({
      isChanged: true,
      settings: {
        ...settings,
        widget_color: value,
        button_color: value,
        calendar_color: value
      }
    })
  }

  handleEditClick = el => {
    this.setState(
      {
        [`${el}Editable`]: true
      },
      () => {
        if (!this[`${el}El`].current) {
          return
        }

        const {
          current: {
            el: { current }
          }
        } = this[`${el}El`]

        current.focus()
      }
    )
  }

  handleSave = event => {
    event.preventDefault()
    const { onSubmit } = this.props
    const { settings } = this.state
    onSubmit(settings)
    this.setState({
      isChanged: false,
      introEditable: false,
      requirementsEditable: false,
      cancellationEditable: false,
      termsEditable: false
    })
  }

  handleSaveClick = el => {
    const { onSubmit } = this.props
    const { settings } = this.state

    onSubmit(settings)
    this.setState({
      [`${el}Editable`]: false,
      isChanged: false
    })
  }

  render() {
    let { saving } = this.props
    const {
      introEditable,
      requirementsEditable,
      cancellationEditable,
      termsEditable,
      isChanged
    } = this.state
    const {
      widget_color,
      intro,
      requirements,
      cancellation,
      terms,
      last_time_book,
      disabled_widget_cuttoff_time,
      enable_third_party_optin,
      request_previous_cbt_date
    } = this.state.settings
    return (
      <div className={styles.container}>
        <Loading loading={saving}>
          <div className={classnames(styles.box, styles.boxVertical)}>
            <div>
              <h3 className={styles.title}>Promo Codes</h3>
              <WidgetPromoCodes />
            </div>
          </div>
          <Form onSubmit={this.handleSave.bind(this)}>
            <div className={styles.box}>
              <div className={styles.leftCol}>
                <h3 className={styles.title}>Widget Brand Colour</h3>
                <p>
                  Select a hex code which represents your brand, this will
                  change the buttons and overall look and feel
                </p>
              </div>
              <div className={styles.rightCol}>
                <div className="text-right">
                  <input
                    name="widgetColor"
                    onChange={this.handleColourChange}
                    className={styles.color}
                    type="color"
                    value={widget_color}
                  />
                </div>
                <Fragment>
                  <div className="mt-3 text-right">
                    <Button disabled={!isChanged} type="submit" color="primary">
                      Save
                    </Button>
                    <Button
                      disabled={!isChanged}
                      color="white"
                      onClick={this.handleCancel}>
                      Cancel
                    </Button>
                  </div>
                </Fragment>
              </div>
            </div>
            <div className={styles.box}>
              <div className={styles.leftCol}>
                <h3 className={styles.title}>3rd Party Opt-In</h3>
                <p>
                  Turn on or off whether you ask customers for their permission
                  to share their data with your partners
                </p>
              </div>
              <div className={styles.rightCol}>
                <ConnectCheckbox
                  label="Active"
                  name="enable_third_party_optin"
                  type="checkbox"
                  checked={enable_third_party_optin}
                  onChange={this.handleChangeRawEvent.bind(this)}
                />
                <Fragment>
                  <div className="mt-3 text-right">
                    <Button disabled={!isChanged} type="submit" color="primary">
                      Save
                    </Button>
                    <Button
                      disabled={!isChanged}
                      color="white"
                      onClick={this.handleCancel}>
                      Cancel
                    </Button>
                  </div>
                </Fragment>
              </div>
            </div>
            <div className={styles.box}>
              <div className={styles.leftCol}>
                <h3 className={styles.title}>CBT Renewal Field</h3>
                <p>
                  You can select whether you require customers to submit the
                  date of their previous CBT by turning this feature on/off
                  here.
                </p>
              </div>
              <div className={styles.rightCol}>
                <ConnectCheckbox
                  label="Active"
                  name="request_previous_cbt_date"
                  type="checkbox"
                  checked={request_previous_cbt_date}
                  onChange={this.handleChangeRawEvent.bind(this)}
                />
                <Fragment>
                  <div className="mt-3 text-right">
                    <Button disabled={!isChanged} type="submit" color="primary">
                      Save
                    </Button>
                    <Button
                      disabled={!isChanged}
                      color="white"
                      onClick={this.handleCancel}>
                      Cancel
                    </Button>
                  </div>
                </Fragment>
              </div>
            </div>
            <div className={classnames(styles.box, styles.boxVertical)}>
              <div>
                <h3 className={styles.title}>Widget Information</h3>
                <p>
                  Write the copy that you wish to display in the widget for
                  customers
                </p>
              </div>
              <Row>
                <Col>
                  <ConnectTextArea
                    ref={this.introEl}
                    noBorder
                    autoHeight
                    name="intro"
                    value={intro}
                    label="Introduction"
                    type="textarea"
                    onChange={this.handleChangeRawEvent.bind(this)}
                    disabled={!introEditable}
                  />
                </Col>
                <Col xs="2">
                  <div className={styles.editButton}>
                    <Button
                      name="introLink"
                      color="link"
                      onClick={() => {
                        this.handleEditClick('intro')
                      }}>
                      Edit
                    </Button>
                    {introEditable && (
                      <Button
                        color="link"
                        onClick={() => {
                          this.handleSaveClick('intro')
                        }}>
                        Save
                      </Button>
                    )}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <ConnectTextArea
                    ref={this.requirementsEl}
                    noBorder
                    autoHeight
                    name="requirements"
                    value={requirements}
                    label="Requirements"
                    type="textarea"
                    onChange={this.handleChangeRawEvent.bind(this)}
                    disabled={!requirementsEditable}
                  />
                </Col>
                <Col xs="2">
                  <div className={styles.editButton}>
                    <Button
                      color="link"
                      onClick={() => {
                        this.handleEditClick('requirements')
                      }}>
                      Edit
                    </Button>
                    {requirementsEditable && (
                      <Button
                        color="link"
                        onClick={() => {
                          this.handleSaveClick('requirements')
                        }}>
                        Save
                      </Button>
                    )}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <ConnectTextArea
                    ref={this.cancellationEl}
                    noBorder
                    autoHeight
                    name="cancellation"
                    value={cancellation}
                    label="Cancellation"
                    type="textarea"
                    onChange={this.handleChangeRawEvent.bind(this)}
                    disabled={!cancellationEditable}
                  />
                </Col>
                <Col xs="2">
                  <div className={styles.editButton}>
                    <Button
                      color="link"
                      onClick={() => {
                        this.handleEditClick('cancellation')
                      }}>
                      Edit
                    </Button>
                    {cancellationEditable && (
                      <Button
                        color="link"
                        onClick={() => {
                          this.handleSaveClick('cancellation')
                        }}>
                        Save
                      </Button>
                    )}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <ConnectTextArea
                    ref={this.termsEl}
                    noBorder
                    autoHeight
                    name="terms"
                    value={terms}
                    label="Terms Of Booking"
                    className="form-group"
                    type="text"
                    onChange={this.handleChangeRawEvent.bind(this)}
                    disabled={!termsEditable}
                  />
                </Col>
                <Col xs="2">
                  <div className={styles.editButton}>
                    <Button
                      color="link"
                      onClick={() => {
                        this.handleEditClick('terms')
                      }}>
                      Edit
                    </Button>
                    {termsEditable && (
                      <Button
                        color="link"
                        onClick={() => {
                          this.handleSaveClick('terms')
                        }}>
                        Save
                      </Button>
                    )}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col className="mt-3 text-right">
                  <Button disabled={!isChanged} type="submit" color="primary">
                    Save
                  </Button>
                  <Button
                    disabled={!isChanged}
                    color="white"
                    onClick={this.handleCancel}>
                    Cancel
                  </Button>
                </Col>
              </Row>
            </div>
            <div className={classnames(styles.box, styles.boxVertical)}>
              <div>
                <h3 className={styles.title}>Widget Booking Settings</h3>
                <p>
                  Set the cut off time for customers to be able to book courses
                  the next day. E.g. 22:00Hrs the night before. Disable this
                  feature to set widget cut off time to 2 hours before course
                  start time.
                </p>
              </div>
              <Row>
                <Col xs="12" sm="3">
                  <ConnectSelect
                    basic
                    name="last_time_book"
                    value={last_time_book}
                    label=""
                    valueArray={TIMES}
                    noSelectOption
                    onChange={this.handleChangeRawEvent.bind(this)}
                    disabled={disabled_widget_cuttoff_time}
                    raw
                    required
                  />
                </Col>
                <Col xs="12" sm="6">
                  <Checkbox
                    name="disabled_widget_cuttoff_time"
                    checked={disabled_widget_cuttoff_time}
                    onChange={this.handleChangeRawEvent.bind(this)}>
                    Disable widget cut off time
                  </Checkbox>
                </Col>
              </Row>
              <Row>
                <Col className="mt-3 text-right">
                  <Button disabled={!isChanged} type="submit" color="primary">
                    Save
                  </Button>
                  <Button
                    disabled={!isChanged}
                    color="white"
                    onClick={this.handleCancel}>
                    Cancel
                  </Button>
                </Col>
              </Row>
            </div>
          </Form>
        </Loading>
      </div>
    )
  }
}

export default WidgetSettingsForm
