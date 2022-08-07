import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import { connect } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { setLoggedOut } from "../../redux/tokenSlice";
import { setApplicationBarMounted } from "../../redux/appSlice";
import { motion } from "framer-motion";

interface LogoutButtonProps {
  token: string;
  username: string;
  loaded: boolean;
}

const LogoutButton = ({ token, username, loaded }: LogoutButtonProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleClick = async () => {
    let config = {
      headers: {
        auth: token,
      },
    };
    const { data } = await axios.post("/logout", { user: username }, config);

    if (data.status == "ok") {
      dispatch(setLoggedOut());
      dispatch(setApplicationBarMounted(false));
    }
    navigate("/", { replace: true });
  };
  return (
    <motion.div>
      <Button onClick={handleClick} color="inherit" variant="text">
        log out
      </Button>
    </motion.div>
  );
};

const mapStateToProps = (state: any) => ({
  token: state.token.value,
  loaded: state.token.loaded,
  username: state.token.username,
});

export default connect(mapStateToProps)(LogoutButton);
