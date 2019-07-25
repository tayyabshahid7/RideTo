import React from 'react'
import styles from './styles.scss'
import ButtonArrowWhite from 'assets/images/rideto/ButtonArrowWhite.svg'
import RideToButton from 'components/RideTo/Button'
import classnames from 'classnames'

function Ready({
  type = 'text',
  className,
  titleClassName,
  inputClassName,
  titleText = 'Ready to get started?',
  placeholderText = 'Enter a place or postcode',
  buttonText = 'Learn to ride',
  onSubmit,
  name = 'postcode',
  buttonClassName,
  buttonIcon = false,
  onChange,
  value,
  sent = false,
  error
}) {
  return (
    <div className={classnames(styles.container, className)}>
      <h2 className={classnames(styles.title, titleClassName)}>{titleText}</h2>
      {!sent ? (
        <form
          onSubmit={onSubmit}
          className={styles.form}
          action="/course-type-selection"
          method="get">
          <input
            type={type}
            name={name}
            className={classnames(styles.input, inputClassName)}
            placeholder={placeholderText}
            onChange={onChange}
            value={value}
            required
          />
          <RideToButton
            className={classnames(styles.button, buttonClassName)}
            type="submit"
            title={buttonText}>
            <span>{buttonText}</span>
            <img src={buttonIcon || ButtonArrowWhite} alt="Submit" />
          </RideToButton>
        </form>
      ) : (
        <div className={styles.sentMessage}>
          Thank you! Your download will arrive shortly.
        </div>
      )}
      {!sent && error && <div className={styles.error}>{error}</div>}
    </div>
  )
}

export default Ready
