import React, { useEffect, useState, Fragment } from "react";
import StreamerMain from "./StreamerMain";
import { connect } from "react-redux";
import Headerbar from "../Headerbar/Headerbar";
import ApplicationBar from "../Utility/ApplicationBar";
import { io, Socket } from "socket.io-client";
import DefaultEventsMap from "socket.io-client";

interface StreamerProps {
  token: string;
  loaded: boolean;
  loggedIn: boolean;
}

const StreamerWrapper = ({ token, loaded, loggedIn }: StreamerProps) => {
  const [socket, setSocket] =
    useState<Socket<typeof DefaultEventsMap, typeof DefaultEventsMap>>();

  useEffect(() => {
    const newSocket = io(`/`, {
      transports: ["websocket"],
    });
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <Fragment>
      <Headerbar loggedIn={loggedIn} />
      <ApplicationBar title={"Stream Video"} />
      {socket ? <StreamerMain socket={socket} /> : null}
    </Fragment>
  );
};

const mapStateToProps = (state: any) => ({
  token: state.token.value,
  loggedIn: state.token.loggedIn,
  loaded: state.token.loaded,
});

export default connect(mapStateToProps)(StreamerWrapper);
