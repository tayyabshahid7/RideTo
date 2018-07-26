import React, { Component } from "react";
import { connect } from "react-redux";
import { getPendingOrders } from "../../../actions/dashboard";

import Notifications from "../components/Notifications";
import PaginationLinks from "../../../components/PaginationLinks";
// import PendingOrdersTable from "../components/PendingOrdersTable";
import Loading from "../../../components/Loading";
import FilteredTable from "../../../components/FilteredTable";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleSorting = this.handleSorting.bind(this);
  }

  componentDidMount() {
    this.props.getPendingOrders(this.props.schoolId, this.props.page);
  }

  handleChangePage(page) {
    this.props.getPendingOrders(this.props.schoolId, page);
  }

  handleSorting(sorting) {
    // console.log(sorting);
    this.props.getPendingOrders(this.props.schoolId, this.props.page, sorting);
  }

  render() {
    return (
      <div className="page dashboard-page">
        <Notifications schoolName={this.props.schoolName} />
        <Loading loading={this.props.loading}>
          {this.props.pendingOrders &&
          this.props.pendingOrders.results.length > 0 ? (
            <div className="main">
              <FilteredTable
                orders={this.props.pendingOrders.results}
                sortingChange={this.handleSorting}
              />
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
    getPendingOrders: (schoolId, page, sorting = null) =>
      dispatch(getPendingOrders(schoolId, page, sorting))
  })
)(Dashboard);
