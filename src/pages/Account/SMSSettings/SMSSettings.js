import React, { Fragment, Component } from 'react'
import styles from './styles.scss'
import { Row, Col, Modal, ModalBody } from 'reactstrap'
import classnames from 'classnames'
import { Button, ConnectTextArea } from 'components/ConnectForm'
import CheckoutForm from 'components/Calendar/OrdersPanel/AddOrderItem/CheckoutForm'
import { injectStripe } from 'react-stripe-elements'
import Loading from 'components/Loading'

class SMSSettings extends Component {
  constructor(props) {
    super(props)

    this.defaultSettings = {
      cbt_booking_confirmation: '',
      full_licence_booking_confirmation: '',
      post_cbt_feedback: '',
      ...this.props.settings
    }

    this.state = {
      cardName: '',
      selectedValue: null,
      cardNumberComplete: false,
      cardDateComplete: false,
      cardCVCComplete: false,
      cardPostCodeComplete: false,
      settings: this.defaultSettings,
      cbt_booking_confirmationEditable: false,
      full_licence_booking_confirmationEditable: false,
      post_cbt_feedbackEditable: false
    }

    this.cbt_booking_confirmationEl = React.createRef()
    this.full_licence_booking_confirmationEl = React.createRef()
    this.post_cbt_feedbackEl = React.createRef()

    this.handleSave = this.handleSave.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleCardNameChange = this.handleCardNameChange.bind(this)
    this.handleStripeElementChange = this.handleStripeElementChange.bind(this)
    this.handleEditClick = this.handleEditClick.bind(this)
    this.handleSaveClick = this.handleSaveClick.bind(this)
  }

  componentDidMount() {
    const { schoolId, fetchCredits } = this.props

    fetchCredits({ schoolId })
  }

  handleCardNameChange({ target: { value } }) {
    this.setState({
      cardName: value
    })
  }

  handleStripeElementChange(el, name) {
    this.setState({ [`card${name}Complete`]: !el.empty && el.complete })
  }

  handleChangeRawEvent(event) {
    const { name, value } = event.target
    const { settings } = this.state
    this.setState({ settings: { ...settings, [name]: value } })
  }

  handleCancel() {
    this.setState({
      cardName: '',
      selectedValue: null,
      cardNumberComplete: false,
      cardDateComplete: false,
      cardCVCComplete: false,
      cardPostCodeComplete: false
    })
  }

  async handleSave(event) {
    const { stripe, purchaseCredits, schoolId } = this.props
    const { cardName, selectedValue } = this.state

    event.preventDefault()

    if (!stripe) {
      console.log("Stripe.js hasn't loaded yet.")
    } else {
      const { token } = await stripe.createToken({ name: cardName })

      const paymentResponse = await purchaseCredits(schoolId, {
        token: token.id,
        sms_credit: String(selectedValue * 100)
      })

      if (paymentResponse) {
        this.handleCancel()
      }
    }
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

  handleSaveClick(el) {
    const { updateWidgetSettings } = this.props
    const { settings } = this.state
    updateWidgetSettings(settings)
    this.setState({
      [`${el}Editable`]: false
    })
  }

  render() {
    const { credit_unit, smsLoading, saving } = this.props
    const {
      selectedValue,
      cardName,
      cardNumberComplete,
      cardDateComplete,
      cardCVCComplete,
      cardPostCodeComplete,
      settings: {
        cbt_booking_confirmation,
        full_licence_booking_confirmation,
        post_cbt_feedback
      },
      cbt_booking_confirmationEditable,
      full_licence_booking_confirmationEditable,
      post_cbt_feedbackEditable
    } = this.state

    return (
      <Fragment>
        <Row className={styles.container}>
          <Col>
            <div className={classnames(styles.box, styles.boxVertical)}>
              <div>
                <div>
                  <h3 className={styles.title}>SMS credits</h3>
                  <div className={styles.credits}>
                    <div className={styles.intro}>
                      <p>
                        SMS credits are required to send SMS to customers. Here
                        you can check your credits and purchase more
                      </p>
                    </div>
                    <div className={styles.title}>
                      <span style={{ color: 'var(--primary-color)' }}>
                        Current credits:
                      </span>{' '}
                      {Math.trunc(credit_unit)} SMS
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className={styles.title}>Purchase SMS credits</h3>
                <div className={styles.buttonRow}>
                  {[200, 100, 40].map(value => (
                    <Button
                      key={value}
                      large
                      onClick={() => {
                        this.setState({
                          selectedValue: value
                        })
                      }}>
                      Add £{value}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <Loading loading={saving}>
              <div className={classnames(styles.box, styles.boxVertical)}>
                <h3 className={styles.title}>SMS templates</h3>
                <p className={styles.intro}>
                  Write the copy that you wish to display in your SMS
                  communication to customers
                </p>
                <div>
                  <Row>
                    <Col>
                      <ConnectTextArea
                        ref={this.cbt_booking_confirmationEl}
                        noBorder
                        autoHeight
                        name="cbt_booking_confirmation"
                        value={cbt_booking_confirmation}
                        label="CBT booking confirmation"
                        type="textarea"
                        onChange={this.handleChangeRawEvent.bind(this)}
                        disabled={!cbt_booking_confirmationEditable}
                      />
                    </Col>
                    <Col xs="2">
                      <div className={styles.editButton}>
                        <Button
                          color="link"
                          onClick={() => {
                            this.handleEditClick('cbt_booking_confirmation')
                          }}>
                          Edit
                        </Button>
                        {cbt_booking_confirmationEditable && (
                          <Button
                            color="link"
                            onClick={() => {
                              this.handleSaveClick('cbt_booking_confirmation')
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
                        ref={this.full_licence_booking_confirmationEl}
                        noBorder
                        autoHeight
                        name="full_licence_booking_confirmation"
                        value={full_licence_booking_confirmation}
                        label="Full licence booking confirmation"
                        type="textarea"
                        onChange={this.handleChangeRawEvent.bind(this)}
                        disabled={!full_licence_booking_confirmationEditable}
                      />
                    </Col>
                    <Col xs="2">
                      <div className={styles.editButton}>
                        <Button
                          color="link"
                          onClick={() => {
                            this.handleEditClick(
                              'full_licence_booking_confirmation'
                            )
                          }}>
                          Edit
                        </Button>
                        {full_licence_booking_confirmationEditable && (
                          <Button
                            color="link"
                            onClick={() => {
                              this.handleSaveClick(
                                'full_licence_booking_confirmation'
                              )
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
                        ref={this.post_cbt_feedbackEl}
                        noBorder
                        autoHeight
                        name="post_cbt_feedback"
                        value={post_cbt_feedback}
                        label="Post CBT feedback"
                        type="textarea"
                        onChange={this.handleChangeRawEvent.bind(this)}
                        disabled={!post_cbt_feedbackEditable}
                      />
                    </Col>
                    <Col xs="2">
                      <div className={styles.editButton}>
                        <Button
                          color="link"
                          onClick={() => {
                            this.handleEditClick('post_cbt_feedback')
                          }}>
                          Edit
                        </Button>
                        {post_cbt_feedbackEditable && (
                          <Button
                            color="link"
                            onClick={() => {
                              this.handleSaveClick('post_cbt_feedback')
                            }}>
                            Save
                          </Button>
                        )}
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </Loading>
          </Col>
        </Row>

        <Modal isOpen={!!selectedValue} fade={false}>
          <ModalBody>
            <Loading loading={smsLoading}>
              <form onSubmit={this.handleSave}>
                <CheckoutForm
                  price={selectedValue * 100}
                  cardName={cardName}
                  handleCardNameChange={this.handleCardNameChange}
                  handleStripeElementChange={this.handleStripeElementChange}
                  singlePage={true}
                />
                <Row>
                  <Col className="mt-3 text-right">
                    <Button
                      type="submit"
                      color="primary"
                      disabled={
                        !cardName ||
                        !cardNumberComplete ||
                        !cardDateComplete ||
                        !cardCVCComplete ||
                        !cardPostCodeComplete
                      }>
                      Take Payment
                    </Button>
                    <Button color="white" onClick={this.handleCancel}>
                      Cancel
                    </Button>
                  </Col>
                </Row>
              </form>
            </Loading>
          </ModalBody>
        </Modal>
      </Fragment>
    )
  }
}

export default injectStripe(SMSSettings)
