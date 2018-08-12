import React from 'react'

import styles from './AcceptTerms.scss'

const AcceptTerms = ({ accepted, onChange }) => {
  return (
    <div className={styles.acceptTerms}>
      <input
        type="checkbox"
        id="accept_terms"
        value={accepted}
        onChange={() => onChange(!accepted)}
      />
      <label htmlFor="accept_terms">
        I can confirm that I have read and agreed to the terms and conditions.
      </label>
    </div>
  )
}

export default AcceptTerms
