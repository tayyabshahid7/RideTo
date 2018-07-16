import React, {Component} from 'react'
import styles from './styles.scss'
import Table from 'scenes/Dashboard/components/Table'

class Notifications extends Component {
  
  render() {
    return (
      <div className={styles.container}>
        <h1>NOTIFICACIONS</h1>
        <h2>Pending Orders</h2>
        <hr/>
        {
          this.props.pendingOrders && this.props.pendingOrders.results.length > 0 ?
              <Table orders={this.props.pendingOrders.results}/>
          :
            <div className={styles.noResults}>You're all update on orders</div>
        }
        <hr/>
      </div>
    )
  }
}

export default Notifications