import React from 'react'
import { Row, Col } from 'reactstrap'
import styles from './styles.scss'
import classnames from 'classnames'
import { ConnectInput, Button } from 'components/ConnectForm'

class AccountPassword extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      newPassword: '',
      oldPassword: '',
      confirmPassword: '',
      showForm: false
    }
  }

  componentDidUpdate(prevProps) {
    const { saving, error, showNotification } = this.props
    if (prevProps.saving && !saving) {
      if (!error) {
        this.setState({
          newPassword: '',
          oldPassword: '',
          confirmPassword: ''
        })
        showNotification('Success', 'Password has been updated', 'success')
      } else {
        showNotification('Error', error, 'danger')
      }
    }
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleFormSubmit = event => {
    event.preventDefault()
    const { updatePassword, showNotification } = this.props
    const { newPassword, oldPassword, confirmPassword } = this.state
    if (newPassword !== confirmPassword) {
      showNotification('Error', 'Password does not match', 'danger')
      return
    }
    updatePassword({ new_password: newPassword, old_password: oldPassword })
  }

  toggleForm = () => {
    this.setState({
      showForm: !this.state.showForm,
      newPassword: '',
      oldPassword: '',
      confirmPassword: ''
    })
  }

  render() {
    const { newPassword, oldPassword, confirmPassword, showForm } = this.state

    return (
      <React.Fragment>
        <div className={classnames(styles.box, styles.boxVertical)}>
          <div className={styles.topRow}>
            <div className={styles.leftCol}>
              <h3 className={styles.title}>Admin Settings</h3>
              <p>If you need to change your password you can do so here</p>
            </div>
            <div className={styles.rightCol}>
              <Button
                id="togglePasswordForm"
                onClick={this.toggleForm}
                color={showForm ? 'white' : 'primary'}>
                {showForm ? 'Cancel' : 'Update Password'}
              </Button>
            </div>
          </div>

          {showForm && (
            <Row className={styles.container}>
              <Col>
                <h3 className={styles.title}>Update Password</h3>
                <form
                  className={styles.passwordResetForm}
                  onSubmit={this.handleFormSubmit}>
                  <Row>
                    <Col>
                      <ConnectInput
                        name="oldPassword"
                        value={oldPassword}
                        label="Old Password"
                        className="form-group"
                        type="password"
                        onChange={this.handleChange}
                        required
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <ConnectInput
                        name="newPassword"
                        value={newPassword}
                        label="New Password"
                        className="form-group"
                        type="password"
                        onChange={this.handleChange}
                        required
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <ConnectInput
                        name="confirmPassword"
                        value={confirmPassword}
                        label="Confirm Password"
                        className="form-group"
                        type="password"
                        onChange={this.handleChange}
                        required
                      />
                    </Col>
                  </Row>
                  <Button color="primary" type="submit">
                    Save
                  </Button>
                </form>
              </Col>
            </Row>
          )}
        </div>
      </React.Fragment>
    )
  }
}

export default AccountPassword
