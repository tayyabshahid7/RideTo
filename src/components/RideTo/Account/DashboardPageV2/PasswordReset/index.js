import React, { useState, useRef, useEffect } from 'react'
import Modal from 'react-modal'
import styles from './styles.scss'
import Input from 'components/RideTo/Input'
import Button from 'components/RideTo/Button'
import ButtonArrowWhite from 'assets/images/rideto/ButtonArrowWhite.svg'
import zxcvbn from 'zxcvbn'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import { fetchIsPasswordSet, updateUserPassword } from 'services/dashboard'

Modal.setAppElement('#rideto-account-page')

function PasswordReset({ isAuthenticated }) {
  const [isPasswordSet, setIsPasswordSet] = useState(true)
  const modalRef = useRef(null)
  const [password, setPassword] = useState('')
  const checkedPassword = zxcvbn(password)
  const { warning } = checkedPassword.feedback
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchIsMyPasswordSet() {
      const response = await fetchIsPasswordSet()
      const { has_password_set } = response

      setIsPasswordSet(has_password_set)
    }

    if (isAuthenticated) {
      fetchIsMyPasswordSet()
    }
  }, [isAuthenticated])

  const handleInputChange = event => {
    const value = event.target.value.trim()

    setPassword(value)
  }

  const afterOpenModal = () => {
    disableBodyScroll(modalRef.current)
  }

  const handleSubmit = async event => {
    event.preventDefault()

    try {
      await updateUserPassword(password)
      setIsPasswordSet(true)
      setError('')
      clearAllBodyScrollLocks()
    } catch (error) {
      setError(error)
    }
  }

  return (
    <Modal
      isOpen={!isPasswordSet}
      className={styles.modal}
      overlayClassName={styles.overlay}
      onAfterOpen={afterOpenModal}>
      <div className={styles.inner} ref={modalRef}>
        <h2 className={styles.title}>Welcome to your journey on two wheels</h2>
        <form onSubmit={handleSubmit}>
          <Input
            type="password"
            label="Password"
            placeholder=""
            name="password"
            value={password}
            className={styles.input}
            onChange={handleInputChange}
            required
            minLength="8"
          />
          {warning && <div className={styles.warning}>{warning}</div>}
          <Button type="submit" modern className={styles.cta}>
            <span>Continue to dashboard</span>
            <img src={ButtonArrowWhite} alt="" />
          </Button>
          {error && <div className={styles.error}>{error}</div>}
        </form>
      </div>
    </Modal>
  )
}

export default PasswordReset
