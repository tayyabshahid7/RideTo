import React, { Component } from 'react'
import { Button } from 'components/ConnectForm'
import styles from 'pages/Customers/components/OrderForm/OrderForm.scss'

class Email extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email: {
        to: this.props.customer.rideto_email,
        sender: this.props.user.suppliers.find(
          ({ id }) => id === this.props.schoolId
        ).email,
        subject: '',
        body: ''
      },
      isChanged: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.clearForm = this.clearForm.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange({ target, target: { name, value } }) {
    this.setState({
      isChanged: true,
      email: {
        ...this.state.email,
        [name]: value
      }
    })

    if (name === 'body') {
      target.style.height = ''
      target.style.height = `${target.scrollHeight}px`
    }
  }

  clearForm() {
    this.setState({
      email: {
        ...this.state.email,
        subject: '',
        body: ''
      }
    })
  }

  async handleSubmit(e) {
    const { onSendEmail } = this.props
    const { email } = this.state

    e.preventDefault()

    const response = await onSendEmail(email)

    if (response) {
      this.clearForm()
    }
  }

  render() {
    const { isChanged, email } = this.state
    const { to, sender, subject, body } = email

    return (
      <form className={styles.panel} onSubmit={this.handleSubmit}>
        <div className={styles.emailRow}>
          <label>
            <span>To:</span>
            <input
              required
              name="to"
              type="email"
              value={to}
              onChange={this.handleChange}
              placeholder="Add recipient"
              disabled
            />
          </label>
        </div>
        <div className={styles.emailRow}>
          <label>
            <span>From:</span>
            <input
              required
              name="sender"
              type="email"
              value={sender}
              onChange={this.handleChange}
              placeholder="Add sender"
              disabled
            />
          </label>
        </div>
        <div className={styles.emailRow}>
          <label>
            <span>Subject:</span>
            <input
              required
              name="subject"
              value={subject}
              onChange={this.handleChange}
              placeholder="Add a subject"
            />
          </label>
        </div>
        <div>
          <textarea
            required
            name="body"
            className={styles.emailTextarea}
            onChange={this.handleChange}
            placeholder="Type your awesome message here..."
            value={body}
          />
        </div>
        <div>
          <Button type="submit" disabled={!isChanged}>
            Send
          </Button>
          <Button color="white" onClick={this.clearForm}>
            Cancel
          </Button>
        </div>
      </form>
    )
  }
}

export default Email
