import React, { Fragment, Component } from 'react'
import styles from './styles.scss'
import { Row, Col, Modal, ModalBody } from 'reactstrap'
import classnames from 'classnames'
import { Button } from 'components/ConnectForm'
import CheckoutForm from 'components/Calendar/OrdersPanel/AddOrderItem/CheckoutForm'
import { injectStripe } from 'react-stripe-elements'
import Loading from 'components/Loading'

class SMSSettings extends Component {
  constructor(props) {
    super(props)

    this.state = {
      cardName: '',
      selectedValue: null,
      cardNumberComplete: false,
      cardDateComplete: false,
      cardCVCComplete: false,
      cardPostCodeComplete: false
    }

    this.handleSave = this.handleSave.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleCardNameChange = this.handleCardNameChange.bind(this)
    this.handleStripeElementChange = this.handleStripeElementChange.bind(this)
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

  render() {
    const { credit_unit, loading } = this.props
    const {
      selectedValue,
      cardName,
      cardNumberComplete,
      cardDateComplete,
      cardCVCComplete,
      cardPostCodeComplete
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
          </Col>
        </Row>
        <Modal isOpen={!!selectedValue} fade={false}>
          <ModalBody>
            <Loading loading={loading}>
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
