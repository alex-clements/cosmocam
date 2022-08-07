import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectApplicationBarMounted,
  setApplicationBarMounted,
} from "../../redux/appSlice";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const darkTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1e2f40",
    },
  },
});

interface ApplicationBarProps {
  title: string;
  backButtonEnabled?: boolean;
}

const ApplicationBar = ({
  title,
  backButtonEnabled = true,
}: ApplicationBarProps) => {
  const navigate = useNavigate();
  const applicationBarMounted = useAppSelector(selectApplicationBarMounted);
  const dispatch = useAppDispatch();

  const handleClick = () => {
    navigate("/dashboard");
  };

  const initialAnimateProps = {
    opacity: applicationBarMounted ? 1 : 0,
  };

  useEffect(() => {
    if (!applicationBarMounted) {
      setTimeout(() => dispatch(setApplicationBarMounted(true)), 200);
    }
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ flexGrow: 1, marginBottom: "10px" }}>
        <motion.div
          initial={initialAnimateProps}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <AppBar position="static">
            <Toolbar variant="dense">
              {backButtonEnabled && (
                <Button
                  sx={{ float: "left" }}
                  onClick={handleClick}
                  color="inherit"
                  variant="text"
                >
                  <ArrowBackIcon />
                </Button>
              )}
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" color="inherit" component="div">
                  {title}
                </Typography>
              </Box>
              {backButtonEnabled && <div style={{ width: "64px" }}></div>}
            </Toolbar>
          </AppBar>
        </motion.div>
      </Box>
    </ThemeProvider>
  );
};

export default ApplicationBar;
