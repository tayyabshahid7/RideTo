import React, { useEffect } from 'react'
import styles from './styles.scss'
import ButtonArrowWhite from 'assets/images/rideto/ButtonArrowWhite.svg'
import Input from 'components/RideTo/Input'
import Button from 'components/RideTo/Button'
import classnames from 'classnames'
import { loadTypeformScript } from 'utils/helper'
import kebabCase from 'lodash/kebabCase'

const linkIsTypeform = href => {
  return href && href.includes('rideto.typeform.com')
}

function Form({ form }) {
  const { action, label, buttonText, icon, href, params = {}, text } = form
  const isTypeform = linkIsTypeform(href)

  useEffect(() => {
    if (isTypeform) {
      loadTypeformScript()
    }
  }, [isTypeform])

  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        <img src={icon} alt="Icon" width="74" />
      </div>
      {text && <div>{text}</div>}
      {action && label ? (
        <form action={action}>
          {Object.entries(params).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value} />
          ))}
          <Input
            className={styles.input}
            label={label}
            name={label.toLowerCase()}
          />
          <Button
            type="submit"
            modern
            className={styles.button}
            id={`dashboard-cta-${kebabCase(buttonText)}`}>
            <span>{buttonText}</span>
            <img src={ButtonArrowWhite} alt="" />
          </Button>
        </form>
      ) : href ? (
        <Button
          id={`dashboard-cta-${kebabCase(buttonText)}`}
          target="_blank"
          href={href}
          rel="noopener noreferrer"
          modern
          className={classnames(
            styles.button,
            styles.linkButton,
            isTypeform && 'typeform-share'
          )}>
          <span>{buttonText}</span>
          <img src={ButtonArrowWhite} alt="" />
        </Button>
      ) : null}
    </div>
  )
}

export default Form
