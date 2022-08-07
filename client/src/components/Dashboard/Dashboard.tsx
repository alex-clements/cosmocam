import React, { Fragment, useState } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { motion } from "framer-motion";
import { useAppSelector } from "../../app/hooks";
import { selectUsername } from "../../redux/tokenSlice";
import Typography from "@mui/material/Typography";

const Dashboard = () => {
  const [visible, setVisible] = useState<boolean>(true);
  const username = useAppSelector(selectUsername);

  const navigate = useNavigate();

  const goToStream = () => {
    setVisible(false);
    setTimeout(() => navigate("/source"), 200);
  };

  const goToReceive = () => {
    setVisible(false);
    setTimeout(() => navigate("/recipient"), 200);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      animate={{ opacity: visible ? 1 : 0 }}
    >
      <Box sx={{ paddingTop: 5, flexGrow: 1 }}>
        <Typography
          variant="h6"
          color="white"
          component="div"
          sx={{ marginBottom: 3 }}
        >
          Welcome, {username}!
        </Typography>
        <Grid container spacing={2}>
          <Grid item md={4} xs={1}></Grid>
          <Grid item md={4} xs={10}>
            <Stack sx={{ color: "white" }} spacing={2}>
              <Button onClick={goToStream} variant="contained">
                Stream Video
              </Button>
              <Button onClick={goToReceive} variant="contained">
                View Camera Feeds
              </Button>
            </Stack>
          </Grid>
          <Grid item md={4} xs={1}></Grid>
        </Grid>
      </Box>
    </motion.div>
  );
};

export default Dashboard;
