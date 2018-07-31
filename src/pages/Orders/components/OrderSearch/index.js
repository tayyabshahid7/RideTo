import React from 'react'

import styles from './OrderSearch.scss'

class OrderSearch extends React.Component {
  constructor(props) {
    super(props)

    this.state = { value: '' }
    this.handleChangeValue = this.handleChangeValue.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  handleChangeValue({ target }) {
    this.setState({ value: target.value })
  }

  handleKeyPress({ key }) {
    if (key === 'Enter') {
      this.props.onSearch(this.state.value)
    }
  }

  render() {
    const { onSearch } = this.props
    const { value } = this.state

    return (
      <div className={styles.orderSearch}>
        <input
          type="text"
          value={value}
          onChange={this.handleChangeValue}
          onKeyPress={this.handleKeyPress}
        />
        <button onClick={() => onSearch(value)}>Search</button>
      </div>
    )
  }
}

export default OrderSearch
