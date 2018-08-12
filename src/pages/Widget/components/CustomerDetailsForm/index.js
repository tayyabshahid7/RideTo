import React from 'react'

import TextField from 'pages/Widget/components/TextField'

class CustomerDetailsForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      details: {}
    }

    this.handleChangeDetails = this.handleChangeDetails.bind(this)
  }

  handleChangeDetails(name, value) {
    const details = {
      ...this.state.details,
      [name]: value
    }
    this.setState({ details })
  }

  render() {
    const { details } = this.state

    return (
      <div>
        <TextField
          label="First Name"
          name="first_name"
          value={details.first_name}
          onChange={this.handleChangeDetails}
        />

        <TextField
          label="Surname"
          name="last_name"
          value={details.last_name}
          onChange={this.handleChangeDetails}
        />

        <TextField
          label="Date of Birth"
          name="user_birthdate"
          placeholder="DD/MM/YYYY"
          value={details.user_birthdate}
          onChange={this.handleChangeDetails}
        />

        <TextField
          label="Phone Number"
          name="phone"
          type="phone"
          value={details.phone}
          onChange={this.handleChangeDetails}
        />

        <TextField
          label="Email"
          name="email"
          type="email"
          value={details.email}
          onChange={this.handleChangeDetails}
        />

        <TextField
          label="Current Licence"
          name="current_licence"
          value={details.current_licence}
          onChange={this.handleChangeDetails}
        />

        <TextField
          label="Riding Experience"
          name="riding_experience"
          value={details.riding_experience}
          onChange={this.handleChangeDetails}
        />
      </div>
    )
  }
}

export default CustomerDetailsForm
