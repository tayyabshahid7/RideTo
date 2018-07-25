import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { getSchoolOrders, changePage } from "../../../actions/orders";
import ConfirmedOrders from "../components/ConfirmedOrders";
import PaginationLinks from "../../../components/PaginationLinks";

class Orders extends Component {
  constructor(props) {
    super(props);
    this.handleChangePage = this.handleChangePage.bind(this);
  }

  componentDidMount() {
    this.props.getSchoolOrders(this.props.schoolId, this.props.page);
  }

  handleChangePage(page) {
    this.props.getSchoolOrders(this.props.schoolId, page);
  }

  render() {
    return (
      <div className="page orders-page">
        {this.props.confirmedOrders &&
        this.props.confirmedOrders.results.length > 0 ? (
          <div className="ordersContainer">
            <h2>Orders - {this.props.schoolName}</h2>
            <ConfirmedOrders
              loading={this.props.loading}
              confirmedOrders={this.props.confirmedOrders}
            />
            <PaginationLinks
              currentPage={this.props.page}
              count={this.props.confirmedOrders.count}
              pageSize={20}
              rowName={"orders"}
              onPageChange={this.handleChangePage}
            />
          </div>
        ) : (
          <div className="noResults">
            No orders yet. No worries we have your back! ;)
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    schoolId: state.auth.schoolId,
    schoolName: state.auth.schoolName,
    confirmedOrders: state.orders.confirmedOrders,
    page: state.orders.page,
    loading: state.orders.loading
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getSchoolOrders,
      changePage
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Orders);
