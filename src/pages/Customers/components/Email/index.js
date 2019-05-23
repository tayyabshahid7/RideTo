import React, { Component } from 'react'
import styles from 'pages/Customers/components/OrderForm/OrderForm.scss'
import classnames from 'classnames'

class Email extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showMore: false
    }

    this.handleShowMore = this.handleShowMore.bind(this)
  }

  handleShowMore() {
    this.setState({
      showMore: !this.state.showMore
    })
  }

  render() {
    const { subject, email_date, body } = this.props.email
    const { showMore } = this.state

    return (
      <div className={styles.panel}>
        <div className={classnames(styles.header, styles.headerEmail)}>
          <h4 className={styles.title}>{subject}</h4>
          <div className={styles.date}>Sent {email_date}</div>
        </div>
        {showMore && <div className={styles.body}>{body}</div>}
        <div className={styles.showMore}>
          <button
            className={styles.showMoreButton}
            onClick={this.handleShowMore}>
            {showMore ? 'Hide' : 'Quick view'}
          </button>
        </div>
      </div>
    )
  }
}

export default Email
