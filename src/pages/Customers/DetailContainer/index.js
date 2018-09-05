import React from 'react'
import { Row } from 'reactstrap'

import styles from './DetailContainer.scss'
import commonStyles from 'pages/styles.scss'

import DetailFormContainer from 'pages/Customers/DetailFormContainer'
import OrderListContainer from 'pages/Customers/OrderListContainer'

class CustomerDetailContainer extends React.Component {
  render() {
    const { match, history } = this.props
    const { id } = match.params

    return (
      <div className={commonStyles.mainContent}>
        <h1 className={styles.heading}>Customer Information</h1>

        <Row className={styles.grey}>
          <DetailFormContainer id={id} history={history} />
          <OrderListContainer id={id} />
        </Row>
      </div>
    )
  }
}

export default CustomerDetailContainer
