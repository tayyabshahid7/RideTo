import React from 'react'
import { Container, Row } from 'reactstrap'
import { Link } from 'react-router-dom'

import styles from './DetailContainer.scss'

import DetailFormContainer from 'pages/Customers/DetailFormContainer'
import OrderListContainer from 'pages/Customers/OrderListContainer'

class CustomerDetailContainer extends React.Component {
  render() {
    const { match, history } = this.props
    const { id } = match.params

    return (
      <div className={styles.wrapper}>
        <Container>
          <div className={styles.header}>
            <Link to="/customers" className={styles.backLink}>
              {'< '}Customers
            </Link>
          </div>
          <Row className={styles.grey}>
            <DetailFormContainer id={id} history={history} />
            <OrderListContainer id={id} />
          </Row>
        </Container>
      </div>
    )
  }
}

export default CustomerDetailContainer
