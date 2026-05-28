import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import "./AuthenticatedLayout.css";

const AuthenticatedLayout = () => {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-layout__content">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthenticatedLayout;
