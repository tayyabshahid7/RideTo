import React from 'react'

import styles from './AcceptTerms.scss'
import Checkbox from 'components/Checkbox'

const AcceptTerms = ({ accepted, onChange, error }) => {
  return (
    <div className={styles.acceptTerms}>
      <Checkbox
        checked={Boolean(accepted)}
        error={error}
        size="large"
        onChange={() => onChange(!accepted)}>
        I can confirm that I have read and agreed to the terms and conditions.
      </Checkbox>
    </div>
  )
}

export default AcceptTerms
