import React from 'react'

import { BrowserRouter, Route } from 'react-router-dom'
import SignupPage from 'components/RideTo/Account/SignupPage'
import LandingPage from 'components/RideTo/Account/LandingPage'
import LoginPage from 'components/RideTo/Account/LoginPage'

const Account = () => {
  return (
    <BrowserRouter>
      <div>
        <Route path="/account" component={LandingPage} exact />
        <Route path="/account/signup" component={SignupPage} />
        <Route path="/account/login" component={LoginPage} />
      </div>
    </BrowserRouter>
  )
}

export default Account
