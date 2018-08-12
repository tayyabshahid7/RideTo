import React from 'react'

import LabelField from 'pages/Widget/components/LabelField'

class CustomerDetailsForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      details: {}
    }

    this.handleChangeDetails = this.handleChangeDetails.bind(this)
  }

  handleChangeDetails({ target }) {
    const { name, value } = target
    console.log(target)
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
        <LabelField label="First Name" name="first_name">
          <input
            id="first_name"
            type="text"
            value={details.first_name}
            onChange={this.handleChangeDetails}
          />
        </LabelField>

        <LabelField label="Surname" name="last_name">
          <input
            id="last_name"
            type="text"
            value={details.last_name}
            onChange={this.handleChangeDetails}
          />
        </LabelField>

        <LabelField label="Date of Birth" name="user_birthdate">
          <input
            id="user_birthdate"
            type="text"
            placeholder="DD/MM/YYYY"
            value={details.user_birthdate}
            onChange={this.handleChangeDetails}
          />
        </LabelField>

        <LabelField label="Phone" name="phone">
          <input
            id="phone"
            type="text"
            value={details.phone}
            onChange={this.handleChangeDetails}
          />
        </LabelField>

        <LabelField label="Email" name="email">
          <input
            id="email"
            type="email"
            value={details.email}
            onChange={this.handleChangeDetails}
          />
        </LabelField>

        <LabelField label="Current Licence" name="current_licence">
          <input
            id="current_licence"
            value={details.current_licence}
            onChange={this.handleChangeDetails}
          />
        </LabelField>

        <LabelField label="Riding Experience" name="riding_experience">
          <input
            id="riding_experience"
            value={details.riding_experience}
            onChange={this.handleChangeDetails}
          />
        </LabelField>
      </div>
    )
  }
}

export default CustomerDetailsForm
