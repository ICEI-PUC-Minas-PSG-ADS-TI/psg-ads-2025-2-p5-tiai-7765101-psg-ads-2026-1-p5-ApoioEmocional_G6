import { useState, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./contexts/theme-context";
import AuthLayout from "./pages/AuthLayout";
import AuthenticatedLayout from "./pages/AuthenticatedLayout";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import { getToken, getUserIdFromToken, tokenExpired } from "./services/auth";
import "react-toastify/dist/ReactToastify.css";
import Timeline from "./pages/Timeline";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import { toast } from "react-toastify";
import type { OnboardingResponses } from "./types/onboarding";
import {
  createUserOnboarding,
  getUserOnboarding,
  updateUserOnboarding,
} from "./services/onboarding";
import { mapOnboardingResponsesToRequest } from "./utils/mapOnboardingResponses";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState("/home");

  useEffect(() => {
    const checkToken = async () => {
      if (await tokenExpired()) {
        setLoggedIn(false);
        localStorage.removeItem("userToken");
      } else {
        setLoggedIn(true);
      }
    };
    void checkToken();
  }, []);

  const handleLogin = (onboardingCompleted?: boolean) => {
    setLoggedIn(true);
    if (onboardingCompleted === false) {
      setRedirectAfterLogin("/onboarding");
      return;
    }
    setRedirectAfterLogin("/home");
  };


  return (
    <ThemeProvider>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={loggedIn ? <Navigate to="/home" replace /> : <AuthLayout />}>
            <Route index element={<LoginForm onLogin={handleLogin} />} />
            <Route path="/register" element={<RegisterForm onLogin={handleLogin} />}
            />
          </Route>
          <Route element={<AuthenticatedLayout/>}>
            <Route path="/onboarding" element={loggedIn ? (<Onboarding/>) : (<Navigate to="/" replace />)}/>
            <Route path="/home" element={loggedIn ? <Home /> : <Navigate to="/" replace />} />
            <Route path="/chat" element={loggedIn ? <Chat /> : <Navigate to="/" replace />} />
            <Route path="/timeline" element={loggedIn ? <Timeline /> : <Navigate to="/" replace />} />
            <Route path="/profile" element={loggedIn ? <Profile /> : <Navigate to="/" replace />} />
            <Route
              path="/redirect-after-login"
              element={loggedIn ? <Navigate to={redirectAfterLogin} replace /> : <Navigate to="/" replace />}
            />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
