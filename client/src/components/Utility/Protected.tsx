import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { connect } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";

interface ProtectedProps {
  token: string;
  loggedIn: boolean;
  loaded: boolean;

  children: JSX.Element;
}

const Protected = ({ token, loggedIn, loaded, children }: ProtectedProps) => {
  if (loaded) {
    return loggedIn ? children : <Navigate to="/" replace={false} />;
  } else {
    return <CircularProgress />;
  }
};

const mapStateToProps = (state: any) => ({
  token: state.token.value,
  loggedIn: state.token.loggedIn,
  loaded: state.token.loaded,
});

export default connect(mapStateToProps)(Protected);
