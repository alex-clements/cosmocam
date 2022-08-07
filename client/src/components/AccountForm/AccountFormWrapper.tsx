import React, { Fragment, useEffect } from "react";
import Box from "@mui/material/Box";
import AccountForm from "./AccountForm";
import Grid from "@mui/material/Grid";

const AccountFormWrapper = () => {
  return (
    <Fragment>
      <Box sx={{ paddingTop: 5, flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item md={4} xs={1}></Grid>
          <Grid item md={4} xs={10}>
            <AccountForm />
          </Grid>
          <Grid item md={4} xs={1}></Grid>
        </Grid>
      </Box>
    </Fragment>
  );
};

export default AccountFormWrapper;
