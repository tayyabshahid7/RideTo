import React from 'react'

import { BrowserRouter, Route } from 'react-router-dom'
import SignupPage from 'components/RideTo/Account/SignupPage'
import LandingPage from 'components/RideTo/Account/LandingPage'
import LoginPage from 'components/RideTo/Account/LoginPage'
import DashboardPage from 'components/RideTo/Account/DashboardPage'

const Account = () => {
  return (
    <BrowserRouter>
      <div style={{ background: '#f9f9f9', overflow: 'hidden' }}>
        <Route path="/account" component={LandingPage} exact />
        <Route path="/account/signup" component={SignupPage} />
        <Route path="/account/login" component={LoginPage} />
        <Route path="/account/dashboard/:orderId?" component={DashboardPage} />
      </div>
    </BrowserRouter>
  )
}

export default Account
