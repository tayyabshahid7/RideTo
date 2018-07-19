import React, {Component} from 'react'
import styles from './styles.scss'
import Table from 'scenes/Dashboard/components/Table'

class Notifications extends Component {
  
  render() {
    return (
      <div className={styles.container}>
        <h1>NOTIFICACIONS - {this.props.schoolName} </h1>
        <h2>Pending Orders</h2>
        <hr/>
              <Table orders={this.props.pendingOrders.results}/>
        <hr/>
      </div>
    )
  }
}

export default Notifications