import { useState, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./contexts/theme-context";
import AuthLayout from "./pages/AuthLayout";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import { tokenExpired } from "./services/auth";
import "react-toastify/dist/ReactToastify.css";
import Timeline from "./pages/Timeline";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      if (await tokenExpired()) {
        setLoggedIn(false);
        localStorage.removeItem('userToken');
      }
      else {
        setLoggedIn(true);
      }
    };
    checkToken();
  }, []);

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
        <Navbar />
        <Routes>
          <Route path="/" element={loggedIn ? <Home /> : <AuthLayout />}>
            <Route index element={<LoginForm onLogin={() => setLoggedIn(true)} />} />
            <Route path="register" element={<RegisterForm />} />
          </Route>
          <Route path="/chat" element={loggedIn ? <Chat /> : <Navigate to="/" replace />} />
          <Route path="/timeline" element={loggedIn ? <Timeline /> : <Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
