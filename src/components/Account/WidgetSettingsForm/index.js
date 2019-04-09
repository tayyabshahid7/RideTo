import React from 'react'
import { Row, Col, Form } from 'reactstrap'
import styles from './styles.scss'
// import InputTextGroup2 from 'components/Forms/InputTextGroup2'
import { ConnectTextArea, Button } from 'components/ConnectForm'
import Loading from 'components/Loading'
import classnames from 'classnames'

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
  }

  handleChangeRawEvent(event) {
    const { name, value } = event.target
    const { settings } = this.state
    this.setState({ settings: { ...settings, [name]: value }, isChanged: true })
  }

  handleCancel(event) {
    event.preventDefault()
    // const { handleCancel } = this.props
    // handleCancel()
    this.setState({
      settings: this.props.settings,
      isChanged: false
    })
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
      terms
    } = this.state.settings
    return (
      <div className={styles.container}>
        <Loading loading={saving}>
          <Form onSubmit={this.handleSave.bind(this)}>
            <div className={styles.box}>
              <div className={styles.leftCol}>
                <h3 className={styles.title}>Widget brand colour</h3>
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
              </div>
            </div>
            <div className={classnames(styles.box, styles.boxVertical)}>
              <div>
                <h3 className={styles.title}>Widget information</h3>
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
                      <Button color="link" type="submit">
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
                      <Button color="link" type="submit">
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
                      <Button color="link" type="submit">
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
                    label="Terms of booking"
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
                      <Button color="link" type="submit">
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
          </Form>
        </Loading>
      </div>
    )
  }
}

export default WidgetSettingsForm
