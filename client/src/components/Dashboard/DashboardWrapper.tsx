import React, { useState, Fragment, useEffect } from "react";
import { connect } from "react-redux";
import Headerbar from "../Headerbar/Headerbar";
import Dashboard from "./Dashboard";

interface DashboardWrapperProps {
  token: string;
  loaded: boolean;
  loggedIn: boolean;
}

const DashboardWrapper = ({
  token,
  loaded,
  loggedIn,
}: DashboardWrapperProps) => {
  return (
    <Fragment>
      <Headerbar loggedIn={loggedIn} />
      <Dashboard />
    </Fragment>
  );
};

const mapStateToProps = (state: any) => ({
  token: state.token.value,
  loaded: state.token.loaded,
  loggedIn: state.token.loggedIn,
});

export default connect(mapStateToProps)(DashboardWrapper);
