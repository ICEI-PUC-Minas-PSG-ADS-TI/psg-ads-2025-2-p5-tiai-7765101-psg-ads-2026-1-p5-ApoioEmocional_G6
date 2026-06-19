import { useState, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./contexts/theme-context";
import AuthLayout from "./pages/AuthLayout";
import AuthenticatedLayout from "./pages/AuthenticatedLayout";
import PublicLayout from "./pages/PublicLayout";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import About from "./pages/About";
import { tokenExpired } from "./services/auth";
import "react-toastify/dist/ReactToastify.css";
import Timeline from "./pages/Timeline";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";

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
          <Route
            path="/"
            element={loggedIn ? <Navigate to="/home" replace /> : <PublicLayout />}
          >
            <Route index element={<Landing />} />
          </Route>

          <Route
            path="/login"
            element={loggedIn ? <Navigate to="/home" replace /> : <AuthLayout />}
          >
            <Route index element={<LoginForm onLogin={handleLogin} />} />
          </Route>

          <Route
            path="/register"
            element={loggedIn ? <Navigate to="/home" replace /> : <AuthLayout />}
          >
            <Route index element={<RegisterForm onLogin={handleLogin} />} />
          </Route>

          <Route
            path="/sobre"
            element={loggedIn ? <AuthenticatedLayout /> : <PublicLayout />}
          >
            <Route
              index
              element={<About variant={loggedIn ? "authenticated" : "public"} />}
            />
          </Route>

          <Route element={<AuthenticatedLayout />}>
            <Route
              path="/onboarding"
              element={loggedIn ? <Onboarding /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/home"
              element={loggedIn ? <Home /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/chat"
              element={loggedIn ? <Chat /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/timeline"
              element={loggedIn ? <Timeline /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/profile"
              element={loggedIn ? <Profile /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/redirect-after-login"
              element={
                loggedIn ? (
                  <Navigate to={redirectAfterLogin} replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
