import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";

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
}

const ApplicationBar = ({ title }: ApplicationBarProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/dashboard");
  };
  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar variant="dense">
            <Button
              sx={{ float: "left" }}
              onClick={handleClick}
              color="inherit"
              variant="text"
            >
              <ArrowBackIcon />
            </Button>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" color="inherit" component="div">
                {title}
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </ThemeProvider>
  );
};

export default ApplicationBar;
