import React from 'react'
import { Input, Button, InputGroup, InputGroupAddon } from 'reactstrap'

import styles from './SearchField.scss'

class SearchField extends React.Component {
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
    const { placeholder, onSearch } = this.props
    const { value } = this.state

    return (
      <div className={styles.searchField}>
        <InputGroup>
          <Input
            type="text"
            value={value}
            placeholder={placeholder}
            onChange={this.handleChangeValue}
            onKeyPress={this.handleKeyPress}
          />
          <InputGroupAddon addonType="prepend">
            <Button
              color="primary"
              onClick={() => onSearch(value)}
              className="btn-padding-md">
              Search
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </div>
    )
  }
}

export default SearchField
