import React, { useEffect, useState, Fragment } from "react";
import StreamerMain from "./StreamerMain";
import { connect } from "react-redux";
import Headerbar from "../Headerbar/Headerbar";
import ApplicationBar from "../Utility/ApplicationBar";
import { io, Socket } from "socket.io-client";
import DefaultEventsMap from "socket.io-client";
import { useAppSelector } from "../../app/hooks";
import { selectUsername } from "../../redux/tokenSlice";
import Box from "@mui/material/Box";
import { motion } from "framer-motion";

interface StreamerProps {
  token: string;
  loaded: boolean;
  loggedIn: boolean;
}

const StreamerWrapper = ({ token, loaded, loggedIn }: StreamerProps) => {
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
      type: "stream",
    });

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <Fragment>
      <ApplicationBar title={"Stream Video"} />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Box sx={{ paddingTop: 5, flexGrow: 1 }}>
          {socket ? <StreamerMain socket={socket} /> : null}
        </Box>
      </motion.div>
    </Fragment>
  );
};

const mapStateToProps = (state: any) => ({
  token: state.token.value,
  loggedIn: state.token.loggedIn,
  loaded: state.token.loaded,
});

export default connect(mapStateToProps)(StreamerWrapper);
