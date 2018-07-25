import React, { Component } from "react";
import { connect } from "react-redux";
import { getPendingOrders } from "../../../actions/dashboard";

import Notifications from "../components/Notifications";
import PaginationLinks from "../../../components/PaginationLinks";
import PendingOrdersTable from "../components/PendingOrdersTable";
import Loading from "../../../components/Loading";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.handleChangePage = this.handleChangePage.bind(this);
  }

  componentDidMount() {
    this.props.getPendingOrders(this.props.schoolId, this.props.page);
  }

  handleChangePage(page) {
    this.props.getPendingOrders(this.props.schoolId, page);
  }

  render() {
    return (
      <div className="page dashboard-page">
        <Notifications schoolName={this.props.schoolName} />
        <Loading loading={this.props.loading}>
          {this.props.pendingOrders &&
          this.props.pendingOrders.results.length > 0 ? (
            <div className="main">
              <PendingOrdersTable orders={this.props.pendingOrders.results} />
              <PaginationLinks
                currentPage={this.props.page}
                count={this.props.pendingOrders.count}
                pageSize={20}
                rowName={"orders"}
                onPageChange={this.handleChangePage}
              />
            </div>
          ) : (
            <div className="noResults">ʘ‿ʘ Everything up to date!</div>
          )}
        </Loading>
      </div>
    );
  }
}

export default connect(
  state => ({
    schoolId: state.auth.schoolId,
    schoolName: state.auth.schoolName,
    pendingOrders: state.dashboard.pendingOrders,
    page: state.dashboard.page,
    loading: state.dashboard.loading
  }),
  dispatch => ({
    getPendingOrders: (schoolId, page) =>
      dispatch(getPendingOrders(schoolId, page))
  })
)(Dashboard);
