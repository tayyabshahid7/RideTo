import React from 'react'
import { Row, Col, Button } from 'reactstrap'
import InputTextGroup from 'components/Forms/InputTextGroup'
import styles from './styles.scss'

class AccountPassword extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      new_password: '',
      old_password: '',
      new_password_copy: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
  }

  componentDidUpdate(prevProps) {
    const { saving, error, showNotification } = this.props
    if (prevProps.saving && !saving) {
      if (!error) {
        this.setState({
          new_password: '',
          old_password: '',
          new_password_copy: ''
        })
        showNotification('Success', 'Password has been updated', 'success')
      } else {
        showNotification('Error', error, 'danger')
      }
    }
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleFormSubmit(event) {
    event.preventDefault()
    const { updatePassword, showNotification } = this.props
    const { new_password, old_password, new_password_copy } = this.state
    if (new_password !== new_password_copy) {
      showNotification('Error', 'Password does not match', 'danger')
      return
    }
    updatePassword({ new_password, old_password })
  }

  render() {
    const { new_password, old_password, new_password_copy } = this.state
    return (
      <Row className={styles.container}>
        <Col>
          <h3>Update Password</h3>
          <form
            className={styles.passwordResetForm}
            onSubmit={this.handleFormSubmit}>
            <Row>
              <Col>
                <InputTextGroup
                  name="old_password"
                  value={old_password}
                  label="Old Password"
                  className="form-group"
                  type="password"
                  onChange={this.handleChange.bind(this)}
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <InputTextGroup
                  name="new_password"
                  value={new_password}
                  label="New Password"
                  className="form-group"
                  type="password"
                  onChange={this.handleChange.bind(this)}
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <InputTextGroup
                  name="new_password_copy"
                  value={new_password_copy}
                  label="Confirm Password"
                  className="form-group"
                  type="password"
                  onChange={this.handleChange.bind(this)}
                  required
                />
              </Col>
            </Row>
            <Button color="primary" type="submit">
              Update Password
            </Button>
          </form>
        </Col>
      </Row>
    )
  }
}

export default AccountPassword
