import React from "react";
// import { Route, Switch } from 'react-router-dom'
import { Switch, Route, Redirect } from "react-router";
import NavigationBar from "../../components/NavigationBar";
import Dashboard from "../Dashboard/container";
import Orders from "../Orders/container";
import Footer from "../../components/Footer";
import styles from "./styles.scss";

const MainLayout = ({ history }) => {
  return (
    <div className={styles.container}>
      <NavigationBar history={history} />
      <div className={styles.bodyContainer}>
        <Switch>
          <Route path="/orders" component={Orders} />
          <Route exact path="/" component={Dashboard} />
        </Switch>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
