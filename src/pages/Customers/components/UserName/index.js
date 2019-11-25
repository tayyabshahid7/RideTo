import React, { Fragment } from 'react'
import moment from 'moment'
import styles from './styles.scss'
import classnames from 'classnames'
import { ConnectInput, Button } from 'components/ConnectForm'
import { Row, Col } from 'reactstrap'
import ConfirmModal from 'components/Modals/ConfirmModal'

const getLastUpdated = date => {
  return moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY')
}

function UserName({
  nameEditable,
  hasActions,
  customer,
  editable,
  showActions,
  showConfirmModal,
  handleActionsClick,
  handleNameClick,
  handleChangeCustomer,
  handleToggleModal,
  handleDeleteCustomer,
  isAdmin
}) {
  return (
    <div className={styles.panel}>
      <div className={classnames(!nameEditable && styles.userPanel)}>
        <div
          className={classnames(
            hasActions && styles.user,
            nameEditable && styles.editingUser
          )}>
          {nameEditable || !customer ? (
            <Fragment>
              <Row>
                <Col>
                  <ConnectInput
                    name="first_name"
                    value={editable.first_name || ''}
                    label="First Name"
                    type="text"
                    onChange={({ target: { value } }) => {
                      handleChangeCustomer({
                        ...editable,
                        first_name: value
                      })
                    }}
                  />
                </Col>
                <Col>
                  <ConnectInput
                    name="last_name"
                    value={editable.last_name || ''}
                    label="Last Name"
                    type="text"
                    onChange={({ target: { value } }) => {
                      handleChangeCustomer({
                        ...editable,
                        last_name: value
                      })
                    }}
                  />
                </Col>
              </Row>
              <div className={styles.customerInfo}>
                {editable.updated_at && (
                  <div className={styles.updatedAt}>
                    Last updated: {getLastUpdated(editable.updated_at)}
                  </div>
                )}
              </div>
            </Fragment>
          ) : (
            <div>
              <button
                className={classnames(
                  styles.title,
                  styles.name,
                  !isAdmin && styles.nameNoCursor
                )}
                onClick={handleNameClick}
                disabled={!isAdmin}>
                {editable.first_name} {editable.last_name}
              </button>
              <div className={styles.customerInfo}>
                {editable.updated_at && (
                  <div className={styles.updatedAt}>
                    Last updated: {getLastUpdated(editable.updated_at)}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {hasActions && isAdmin && (
          <Button
            color={showActions ? 'white' : 'primary'}
            onClick={handleActionsClick}>
            {showActions ? 'Close' : 'Actions'}
          </Button>
        )}
      </div>
      {showActions && (
        <div className={styles.actions}>
          {hasActions && (
            <React.Fragment>
              <Button color="danger" onClick={handleToggleModal}>
                Remove Customer
              </Button>

              <ConfirmModal
                onClose={handleToggleModal}
                showModal={showConfirmModal}
                onDelete={handleDeleteCustomer}
                message={`Are you sure to remove this customer?`}
              />
            </React.Fragment>
          )}
        </div>
      )}
    </div>
  )
}

export default UserName
