import React from 'react'
import styles from './style.scss'
import { Button } from 'reactstrap'
import { connect } from 'react-redux'
import { isAdmin } from 'services/auth'

const OrdersPanelSpaceItem = ({ onAdd, onRemove, isAdmin }) => {
  return (
    <div className={styles.container}>
      <span className={styles.info}>Available</span>
      {isAdmin && (
        <Button
          color="primary"
          onClick={onAdd}
          className={`mr-1 btn-padding-md ${styles.button}`}
          size="sm">
          Add order
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
