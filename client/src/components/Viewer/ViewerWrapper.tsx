import React, { useState, useEffect, Fragment } from "react";
import Viewer from "./Viewer";
import { connect } from "react-redux";
import Headerbar from "../Headerbar/Headerbar";
import ApplicationBar from "../Utility/ApplicationBar";
import { io, Socket } from "socket.io-client";
import DefaultEventsMap from "socket.io-client";
import { useAppSelector } from "../../app/hooks";
import { selectUsername } from "../TokenManager/tokenSlice";

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
      <Headerbar loggedIn={loggedIn} />
      <ApplicationBar title={"View Streams"} />
      {socket ? <Viewer socket={socket} /> : null}
    </Fragment>
  );
};

const mapStateToProps = (state: any) => ({
  token: state.token.value,
  loaded: state.token.loaded,
  loggedIn: state.token.loggedIn,
});

export default connect(mapStateToProps)(ViewerWrapper);
