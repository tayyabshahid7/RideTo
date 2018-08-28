import React from 'react'

import styles from './AcceptCheckbox.scss'
import Checkbox from 'components/Checkbox'

const AcceptCheckbox = ({ children, accepted, onChange, error }) => {
  return (
    <div className={styles.acceptTerms}>
      <Checkbox
        checked={Boolean(accepted)}
        error={error}
        extraClass="WidgetCheckbox"
        size="large"
        onChange={() => onChange(!accepted)}>
        {children}
      </Checkbox>
    </div>
  )
}

export default AcceptCheckbox
