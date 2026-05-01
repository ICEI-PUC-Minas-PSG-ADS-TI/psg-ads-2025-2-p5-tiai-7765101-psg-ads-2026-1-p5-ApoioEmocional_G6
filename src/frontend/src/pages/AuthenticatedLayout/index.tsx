import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";

const AuthenticatedLayout = () => {
  return (
    <div className="page-full">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default AuthenticatedLayout;
