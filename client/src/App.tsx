import React, { useEffect } from "react";
import "./App.css";
import StreamerWrapper from "./components/Streamer/StreamerWrapper";
import LoginWrapper from "./components/Login/LoginWrapper";
import ViewerWrapper from "./components/Viewer/ViewerWrapper";
import DashboardWrapper from "./components/Dashboard/DashboardWrapper";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Headerbar from "./components/Headerbar/Headerbar";
import Protected from "./components/Utility/Protected";
import { useAppDispatch } from "./app/hooks";
import {
  setLoggedIn,
  setToken,
  setUsername,
  setLoaded,
} from "./redux/tokenSlice";
import { connect } from "react-redux";
import { useTokenValidation } from "./components/Utility/hooks";
import AccountFormWrapper from "./components/AccountForm/AccountFormWrapper";

interface AppProps {
  loggedIn: boolean;
}

function App({ loggedIn }: AppProps) {
  const dispatch = useAppDispatch();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const { isLoading, tokenData } = useTokenValidation(token, username);

  useEffect(() => {
    if (!isLoading) {
      dispatch(setLoggedIn(tokenData));
      dispatch(setToken(token ? token : ""));
      dispatch(setUsername(username ? username : ""));
      dispatch(setLoaded(true));
    }
  }, [isLoading]);

  return (
    <div className="App">
      <BrowserRouter>
        <Headerbar loggedIn={loggedIn} />
        <Routes>
          <Route path="/" element={<LoginWrapper />} />
          <Route path="/create_account" element={<AccountFormWrapper />} />
          <Route
            path="/dashboard"
            element={
              <Protected title={"Dashboard"} backButton={false}>
                <DashboardWrapper />
              </Protected>
            }
          />
          <Route
            path="/source"
            element={
              <Protected title={"Stream Video"} backButton={true}>
                <StreamerWrapper />
              </Protected>
            }
          />
          <Route
            path="/recipient"
            element={
              <Protected title={"View Camera Feeds"} backButton={true}>
                <ViewerWrapper />
              </Protected>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

const mapStateToProps = (state: any) => ({
  token: state.token.value,
  loaded: state.token.loaded,
  loggedIn: state.token.loggedIn,
});

export default connect(mapStateToProps)(App);
