import React from 'react'
import styles from './styles.scss'
import ButtonArrowWhite from 'assets/images/rideto/ButtonArrowWhite.svg'
import Input from 'components/RideTo/Input'
import Button from 'components/RideTo/Button'
import classnames from 'classnames'

function Form({ form }) {
  const { action, label, buttonText, icon, href } = form

  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        <img
          src={`https://via.placeholder.com/62x62/?=${icon}`}
          alt="Icon"
          width="62"
          height="62"
        />
      </div>
      {action && label ? (
        <form action={action}>
          <Input className={styles.input} label={label} />
          <Button type="submit" modern className={styles.button}>
            <span>{buttonText}</span>
            <img src={ButtonArrowWhite} alt="" />
          </Button>
        </form>
      ) : href ? (
        <Button
          href={href}
          modern
          className={classnames(styles.button, styles.linkButton)}>
          <span>{buttonText}</span>
          <img src={ButtonArrowWhite} alt="" />
        </Button>
      ) : null}
    </div>
  )
}

export default Form
