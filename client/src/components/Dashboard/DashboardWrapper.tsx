import React, { useState, Fragment, useEffect } from "react";
import { connect } from "react-redux";
import Headerbar from "../Headerbar/Headerbar";
import Dashboard from "./Dashboard";
import ApplicationBar from "../Utility/ApplicationBar";

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
      <ApplicationBar backButtonEnabled={false} title={"Dashboard"} />
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
