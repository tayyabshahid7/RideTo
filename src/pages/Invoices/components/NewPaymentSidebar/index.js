import React from 'react'
import DateHeading from 'components/Calendar/DateHeading'
import InvoicesPaymentForm from '../InvoicesPaymentForm'
import styles from './styles.scss'

const NewPaymentSidebar = ({ history }) => {
  const handleBack = () => {
    history.push('/invoices')
  }

  return (
    <div className={styles.container}>
      <DateHeading
        title="James Beddows"
        subtitle="Direct #35210"
        onBack={handleBack}
      />
      <div className={styles.priceLine}></div>
      <InvoicesPaymentForm history={history} />
    </div>
  )
}

export default NewPaymentSidebar
