import React, { useState, useEffect, Fragment } from "react";
import Viewer from "./Viewer";
import { connect } from "react-redux";
import Headerbar from "../Headerbar/Headerbar";
import ApplicationBar from "../Utility/ApplicationBar";
import { io, Socket } from "socket.io-client";
import DefaultEventsMap from "socket.io-client";
import { useAppSelector } from "../../app/hooks";
import { selectUsername } from "../../redux/tokenSlice";
import { motion } from "framer-motion";
import Box from "@mui/material/Box";

interface ViewerWrapperProps {
  token: string;
  loaded: boolean;
  loggedIn: boolean;
}

const ViewerWrapper = ({ token, loaded, loggedIn }: ViewerWrapperProps) => {
  const [socket, setSocket] =
    useState<Socket<typeof DefaultEventsMap, typeof DefaultEventsMap>>();
  const username = useAppSelector(selectUsername);

  useEffect(() => {
    const newSocket = io(`/`, {
      transports: ["websocket"],
    });
    setSocket(newSocket);
    newSocket.emit("socket_connection", {
      user: username,
      socket_id: newSocket.id,
      type: "view",
    });

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <Fragment>
      <ApplicationBar title={"View Camera Feeds"} />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Box sx={{ paddingTop: 5, flexGrow: 1 }}>
          {socket ? <Viewer socket={socket} /> : null}
        </Box>
      </motion.div>
    </Fragment>
  );
};

const mapStateToProps = (state: any) => ({
  token: state.token.value,
  loaded: state.token.loaded,
  loggedIn: state.token.loggedIn,
});

export default connect(mapStateToProps)(ViewerWrapper);
