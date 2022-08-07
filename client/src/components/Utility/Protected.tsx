import React, { useEffect, Fragment } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import { useAppDispatch } from "../../app/hooks";
import { setLoggedOut } from "../../redux/tokenSlice";
import { useTokenValidation } from "../Utility/hooks";
import ApplicationBar from "../Utility/ApplicationBar";

interface ProtectedProps {
  token: string;
  loaded: boolean;
  username: string;
  children: JSX.Element;
  title: string;
  backButton: boolean;
}

const Protected = ({
  token,
  loaded,
  username,
  children,
  title,
  backButton,
}: ProtectedProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { isLoading, tokenData: loggedInStatus } = useTokenValidation(
    token,
    username,
    location.pathname
  );

  useEffect(() => {
    if (loaded && !isLoading && !loggedInStatus) {
      dispatch(setLoggedOut());
    }
  }, [loggedInStatus]);

  return loaded && !isLoading ? (
    loggedInStatus ? (
      children
    ) : (
      <Navigate to="/" replace={false} />
    )
  ) : (
    <Fragment>
      <ApplicationBar title={title} backButtonEnabled={backButton} />
      <CircularProgress />
    </Fragment>
  );
};

const mapStateToProps = (state: any) => ({
  token: state.token.value,
  loaded: state.token.loaded,
  username: state.token.username,
});

export default connect(mapStateToProps)(Protected);
