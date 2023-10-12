import React, { lazy, Suspense, useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet";
// constants
import { LOCALSTORAGE, COMPANY } from "./constants/vars";
import { AUTH_TOKEN_ENDPOINT } from "./constants/endpoints";
// components
import Loader from "./components/Loader";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
// mui
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, Toolbar, SpeedDial, SpeedDialIcon, SpeedDialAction } from "@mui/material";
import { LightMode, DarkMode } from "@mui/icons-material";
import AppContext from "./contexts/AppContext";
// pages
const Home = lazy(() => import("./pages/Home"));
const Auth = lazy(() => import("./pages/Auth"));

const Dashboard = () => {
  const [mode, setMode] = useState("light");
  const [user, setUser] = useState({});
  const [open, setOpen] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem(LOCALSTORAGE)) || {};
    // set user
    const token = localData?.token;
    if (token) {
      try {
        axios
          .post(AUTH_TOKEN_ENDPOINT, { token })
          .then((res) => {
            const user = res.data.user || {};
            setUser(user);
          })
          .catch((err) => {
            setUser(null);
          });
      } catch (err) {
        setUser(null);
      }
    } else setUser(null);
    // set mode
    if (localData.mode) setMode(localData.mode);
  }, []);

  const handleMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    // save to localstorage
    localStorage.setItem(LOCALSTORAGE, JSON.stringify({ ...JSON.parse(localStorage.getItem(LOCALSTORAGE)), mode: newMode }));
  };

  const theme = createTheme({ palette: { mode } });

  console.log(user);

  return (
    <ThemeProvider theme={theme}>
      <AppContext.Provider value={{ mode, handleMode, user, setUser }}>
        <Helmet>
          <title>{COMPANY}</title>
        </Helmet>
        <SpeedDial
          sx={{ position: "fixed", bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
          direction={"up"}
          ariaLabel="SpeedDial playground example"
        >
          <SpeedDialAction
            onClick={handleMode}
            icon={mode === "light" ? <LightMode /> : <DarkMode />}
            tooltipTitle={"Switch to " + (mode === "light" ? "Dark" : "Light") + " Theme"}
          />
        </SpeedDial>
        <Box sx={{ display: "flex" }}>
          <NavBar open={open} toggleDrawer={toggleDrawer} />
          <SideBar open={open} toggleDrawer={toggleDrawer} />
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) => (theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[900]),
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
            }}
          >
            <Toolbar sx={{ mb: 3 }} />
            <Suspense fallback={<Loader />}>
              <Routes>
                {user && user.email ? (
                  <>
                    <Route path="/:id" element={<Home />} />
                    <Route path="/*" element={<Home />} />
                  </>
                ) : (
                  <>
                    <Route path="/auth/*" element={<Auth />} />
                    <Route path="/*" element={<Home />} />
                  </>
                )}
              </Routes>
            </Suspense>
          </Box>
        </Box>
      </AppContext.Provider>
    </ThemeProvider>
  );
};

export default Dashboard;
