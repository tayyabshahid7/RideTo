import React from 'react'

import styles from './AcceptTerms.scss'
import Checkbox from 'components/Checkbox'

const AcceptTerms = ({ accepted, widget, onChange, error }) => {
  const style = {
    color: widget.button_color
  }

  return (
    <div className={styles.acceptTerms}>
      <Checkbox
        checked={Boolean(accepted)}
        error={error}
        size="large"
        onChange={() => onChange(!accepted)}>
        <div>
          I can confirm that I have read and agreed to the{' '}
          <a style={style} href={widget.terms} target="_blank">
            terms and conditions.
          </a>
        </div>
      </Checkbox>
    </div>
  )
}

export default AcceptTerms
