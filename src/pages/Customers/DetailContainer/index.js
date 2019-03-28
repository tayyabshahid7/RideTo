import React from 'react'
import { Container, Row } from 'reactstrap'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { selectors } from 'store/customer'

import styles from './DetailContainer.scss'

import DetailFormContainer from 'pages/Customers/DetailFormContainer'
import OrderListContainer from 'pages/Customers/OrderListContainer'

class CustomerDetailContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      notepad: '',
      notepadChanged: false
    }

    this.handleNotepadChange = this.handleNotepadChange.bind(this)
  }

  componentDidUpdate(prevProps) {
    const { customer } = this.props

    if (customer !== prevProps.customer && !customer) {
      this.setState({
        notepad: '',
        notepadChanged: false
      })
      return
    }

    if (customer !== prevProps.customer) {
      this.setState({
        notepad: customer.notes
      })
    }
  }

  handleNotepadChange(value, changed = true) {
    this.setState({
      notepad: value,
      notepadChanged: changed
    })
  }

  render() {
    const { match, history } = this.props
    const { id } = match.params
    const { notepad, notepadChanged } = this.state

    return (
      <div className={styles.wrapper}>
        <Container>
          <div className={styles.header}>
            <Link to="/customers" className={styles.backLink}>
              {'< '}Customers
            </Link>
          </div>
          <Row className={styles.grey}>
            <DetailFormContainer
              id={id}
              history={history}
              notepad={notepad}
              notepadChanged={notepadChanged}
              handleNotepadChange={this.handleNotepadChange}
            />
            <OrderListContainer
              id={id}
              notepad={notepad}
              handleNotepadChange={this.handleNotepadChange}
            />
          </Row>
        </Container>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  const { match } = props
  const { id } = match.params
  const { customer } = state

  return {
    customer: selectors.getItem(customer, id)
  }
}

export default connect(mapStateToProps)(CustomerDetailContainer)
