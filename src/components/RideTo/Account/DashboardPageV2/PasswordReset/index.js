import React, { useState } from 'react'
import Modal from 'react-modal'
import styles from './styles.scss'
import Input from 'components/RideTo/Input'
import Button from 'components/RideTo/Button'
import ButtonArrowWhite from 'assets/images/rideto/ButtonArrowWhite.svg'

Modal.setAppElement('#rideto-account-page')

function PasswordReset({ isVisible }) {
  const [password, setPassword] = useState('')

  const handleInputChange = event => {
    setPassword(event.target.value)
  }

  return (
    <Modal
      isOpen={isVisible}
      className={styles.modal}
      overlayClassName={styles.overlay}>
      <h2 className={styles.title}>Welcome to your journey on two wheels</h2>
      <form>
        <Input
          type="password"
          label="Password"
          placeholder=""
          name="password"
          value={password}
          className={styles.input}
          onChange={handleInputChange}
        />
        <Button type="submit" modern className={styles.cta}>
          <span>Continue to dashboard</span>
          <img src={ButtonArrowWhite} alt="" />
        </Button>
      </form>
    </Modal>
  )
}

export default PasswordReset
