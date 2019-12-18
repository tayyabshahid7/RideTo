import React, { Fragment } from 'react'
import { Row, Col, Form } from 'reactstrap'
import styles from './styles.scss'
import {
  ConnectTextArea,
  Button,
  ConnectCheckbox
} from 'components/ConnectForm'
import Loading from 'components/Loading'
import classnames from 'classnames'
import WidgetPromoCodes from './WidgetPromoCodes'
import { ConnectSelect } from 'components/ConnectForm'
import range from 'lodash/range'

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
      enable_third_party_optin: false
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

    this.color = React.createRef()
    this.introEl = React.createRef()
    this.requirementsEl = React.createRef()
    this.cancellationEl = React.createRef()
    this.termsEl = React.createRef()

    this.handleCancel = this.handleCancel.bind(this)
    this.handleColourChange = this.handleColourChange.bind(this)
    this.handleEditClick = this.handleEditClick.bind(this)
    this.handleSaveClick = this.handleSaveClick.bind(this)
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
    this.color.current.value = this.props.settings.widget_color
  }

  handleColourChange() {
    const { value } = this.color.current
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

  handleEditClick(el) {
    this.setState(
      {
        [`${el}Editable`]: true
      },
      () => {
        const {
          current: {
            el: { current }
          }
        } = this[`${el}El`]

        current.focus()
      }
    )
  }

  handleSave(event) {
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

  handleSaveClick(el) {
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
      enable_third_party_optin
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
                    onChange={this.handleColourChange}
                    className={styles.color}
                    type="color"
                    ref={this.color}
                    defaultValue={widget_color}
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
                  the next day. E.g. 22:00Hrs the night before.
                </p>
              </div>
              <Row>
                <Col sm="3">
                  <ConnectSelect
                    basic
                    name="last_time_book"
                    value={last_time_book}
                    label=""
                    valueArray={TIMES}
                    noSelectOption
                    onChange={this.handleChangeRawEvent.bind(this)}
                    raw
                    required
                  />
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
