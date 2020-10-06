import React from 'react'
import styles from './style.scss'
import { Button } from 'components/ConnectForm'
import { connect } from 'react-redux'
import { isAdmin } from 'services/auth'

const OrdersPanelSpaceItem = ({ onAdd, isAdmin }) => {
  return (
    <div className={styles.container}>
      <span className={styles.info}>Available</span>
      {isAdmin && (
        <Button color="primary" onClick={onAdd} className={styles.button}>
          Book
        </Button>
      )}
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    isAdmin: isAdmin(state.auth.user)
  }
}

export default connect(mapStateToProps)(OrdersPanelSpaceItem)
