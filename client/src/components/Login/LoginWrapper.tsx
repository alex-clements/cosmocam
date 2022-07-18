import React, { Fragment, useEffect } from "react";
import Box from "@mui/material/Box";
import LoginForm from "./LoginForm";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { connect } from "react-redux";
import Headerbar from "../Headerbar/Headerbar";
import { useNavigate } from "react-router-dom";

interface LoginWrapperProps {
  token: string;
  username: string;
  loaded: boolean;
  loggedIn: boolean;
}

const LoginWrapper = ({
  token,
  username,
  loaded,
  loggedIn,
}: LoginWrapperProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn) {
      navigate("/dashboard");
    }
  }, [loaded]);

  return (
    <Fragment>
      <Headerbar loggedIn={loggedIn} />
      <Box sx={{ paddingTop: 5, flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item md={4} xs={1}></Grid>
          <Grid item md={4} xs={10}>
            <LoginForm />
          </Grid>
          <Grid item md={4} xs={1}></Grid>
        </Grid>
      </Box>
    </Fragment>
  );
};

const mapStateToProps = (state: any) => ({
  token: state.token.value,
  loaded: state.token.loaded,
  loggedIn: state.token.loggedIn,
  username: state.token.username,
});

export default connect(mapStateToProps)(LoginWrapper);
