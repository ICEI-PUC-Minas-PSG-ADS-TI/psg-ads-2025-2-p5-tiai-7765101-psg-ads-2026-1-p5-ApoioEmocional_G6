import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AuthLayout from "./pages/AuthLayout";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const token = localStorage.getItem('token');

  if (token && !loggedIn) {
    setLoggedIn(true);
  }

  return (
    <>
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
          <Route path="/" element={loggedIn ? <Home /> : <AuthLayout />}>
            <Route index element={<LoginForm onLogin={() => setLoggedIn(true)} />} />
            <Route path="register" element={<RegisterForm />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
