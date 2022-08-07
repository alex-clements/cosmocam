import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import axios from "axios";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { setToken, setLoggedIn, setUsername } from "../../redux/tokenSlice";
import { useAppDispatch } from "../../app/hooks";
import { motion } from "framer-motion";

const CssTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "white",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "white",
    color: "white",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "white",
      color: "white",
    },
    "&:hover fieldset": {
      borderColor: "white",
      color: "white",
    },
    "&.Mui-focused fieldset": {
      borderColor: "white",
      color: "white",
    },
  },
});

const AccountForm = () => {
  const [username, setUsernameState] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [visible, setVisible] = useState<boolean>(true);
  let navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleKeyDown = (e: any) => {
    if (e.code == "Enter") handleSubmit();
  };

  const handleSubmit = async () => {
    let config = {
      headers: {
        auth: "empty",
      },
    };

    const { data } = await axios.post(
      "/createAccount",
      {
        username: username,
        password: password,
      },
      config
    );

    if (data.status == "ok") {
      dispatch(setToken(data.token));
      dispatch(setLoggedIn(true));
      dispatch(setUsername(username));
      setVisible(false);
      setTimeout(() => navigate("/dashboard", { replace: false }), 300);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: visible ? 1 : 0 }}>
      <Stack sx={{ color: "white" }} spacing={2}>
        <CssTextField
          id="outlined-basic"
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsernameState(e.target.value)}
          onKeyDown={handleKeyDown}
          color="primary"
          sx={{ input: { color: "white" } }}
          InputLabelProps={{
            style: { color: "white" },
          }}
        />
        <CssTextField
          id="outlined-password-input"
          variant="outlined"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{ input: { color: "white" } }}
          InputLabelProps={{
            style: { color: "white" },
          }}
        />
        <CssTextField
          id="outlined-password-input"
          variant="outlined"
          label="Confirm Password"
          type="password"
          autoComplete="current-password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{ input: { color: "white" } }}
          InputLabelProps={{
            style: { color: "white" },
          }}
        />
        <Button onClick={handleSubmit} variant="contained">
          Create Account
        </Button>
      </Stack>
    </motion.div>
  );
};

export default AccountForm;
