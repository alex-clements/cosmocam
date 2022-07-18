import React, { Fragment } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { connect } from "react-redux";
import Headerbar from "../Headerbar/Headerbar";

const Dashboard = () => {
  const navigate = useNavigate();

  const goToStream = () => {
    navigate("/source");
  };

  const goToReceive = () => {
    navigate("/recipient");
  };

  return (
    <Fragment>
      <Box sx={{ paddingTop: 5, flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item md={4} xs={1}></Grid>
          <Grid item md={4} xs={10}>
            <Stack sx={{ color: "white" }} spacing={2}>
              <Button onClick={goToStream} variant="contained">
                Stream
              </Button>
              <Button onClick={goToReceive} variant="contained">
                View Streams
              </Button>
            </Stack>
          </Grid>
          <Grid item md={4} xs={1}></Grid>
        </Grid>
      </Box>
    </Fragment>
  );
};

export default Dashboard;
