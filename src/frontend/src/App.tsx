import { useState, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./contexts/theme-context";
import AuthLayout from "./pages/AuthLayout";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import { getToken, getUserIdFromToken, tokenExpired } from "./services/auth";
import {
  createUserOnboarding,
  getUserOnboarding,
  updateUserOnboarding,
} from "./services/onboarding";
import { mapOnboardingResponsesToRequest } from "./utils/mapOnboardingResponses";
import type {
  OnboardingResponses,
  UserOnboardingResponseDto,
} from "./types/onboarding";
import "react-toastify/dist/ReactToastify.css";
import Onboarding from "./components/Onboarding";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  /** `undefined` = ainda carregando onboarding; `null` = sem registro (404) */
  const [onboardingRow, setOnboardingRow] = useState<
    UserOnboardingResponseDto | null | undefined
  >(undefined);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setAuthChecking(true);
      try {
        if (await tokenExpired()) {
          if (!cancelled) setLoggedIn(false);
        } else {
          if (!cancelled) setLoggedIn(true);
        }
      } catch {
        if (!cancelled) setLoggedIn(false);
      } finally {
        if (!cancelled) setAuthChecking(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!loggedIn) {
      setOnboardingRow(undefined);
      return;
    }
    let cancelled = false;
    (async () => {
      setOnboardingRow(undefined);
      const token = getToken();
      const userId = getUserIdFromToken(token);
      if (!userId) {
        if (!cancelled) {
          setOnboardingRow(null);
          toast.error("Não foi possível identificar o usuário. Faça login novamente.");
        }
        return;
      }
      try {
        const row = await getUserOnboarding(userId);
        if (!cancelled) setOnboardingRow(row);
      } catch {
        if (!cancelled) {
          setOnboardingRow(null);
          toast.warn("Não foi possível verificar o onboarding. Você pode tentar salvar ao final.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loggedIn]);

  const handleOnboardingComplete = useCallback(
    async (responses: OnboardingResponses) => {
      const token = getToken();
      const userId = getUserIdFromToken(token);
      if (!userId) {
        throw new Error("Sessão inválida. Faça login novamente.");
      }
      const body = mapOnboardingResponsesToRequest(responses, userId, true);
      const saved =
        onboardingRow != null
          ? await updateUserOnboarding(userId, body)
          : await createUserOnboarding(body);
      setOnboardingRow(saved);
      toast.success("Perfil salvo com sucesso!");
    },
    [onboardingRow]
  );

  const showSessionLoading = authChecking || (loggedIn && onboardingRow === undefined);

  const needsOnboarding =
    loggedIn &&
    onboardingRow !== undefined &&
    (onboardingRow === null || !onboardingRow.completed);

  const showHome =
    loggedIn &&
    onboardingRow !== undefined &&
    onboardingRow !== null &&
    onboardingRow.completed;

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
          <Route path="/" element={loggedIn ? <Home /> : <AuthLayout />}>
            <Route index element={<LoginForm onLogin={() => setLoggedIn(true)} />} />
            <Route path="register" element={<RegisterForm />} />
          </Route>
          <Route path="/chat" element={loggedIn ? <Chat /> : <Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
