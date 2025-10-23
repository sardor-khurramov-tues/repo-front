import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRouteComp from "./ProtectedRouteComp";
import NavBarComp from "../NavBarComp";
import Home from "../../pages/Home";
import Login from "../../pages/Login";
import AdminDashboard from "../../pages/AdminDashboard";
import DepartmentDashboard from "../../pages/DepartmentDashboard";
import StaffDashboard from "../../pages/StaffDashboard";
import AuthorDashboard from "../../pages/AuthorDashboard";
import UserPage from "../../pages/UserPage";
import NotFound from "../../pages/NotFound";
import RegisterAthor from "../../pages/RegisterAthor";
import AdminUserDashboard from "../../pages/AdminUserDashboard";

export default function RouterComp() {
  return (
    <BrowserRouter>
      <NavBarComp />
      <hr />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register-author" element={<RegisterAthor />} />

        <Route
          path="/admin"
          element={
            <ProtectedRouteComp roles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRouteComp>
          }
        />
        <Route
          path="/admin/department"
          element={
            <ProtectedRouteComp roles={["ADMIN"]}>
              <DepartmentDashboard />
            </ProtectedRouteComp>
          }
        />
        <Route
          path="/admin/user"
          element={
            <ProtectedRouteComp roles={["ADMIN"]}>
              <AdminUserDashboard />
            </ProtectedRouteComp>
          }
        />
        <Route
          path="/staff"
          element={
            <ProtectedRouteComp roles={["STAFF"]}>
              <StaffDashboard />
            </ProtectedRouteComp>
          }
        />
        <Route
          path="/author"
          element={
            <ProtectedRouteComp roles={["AUTHOR"]}>
              <AuthorDashboard />
            </ProtectedRouteComp>
          }
        />
        <Route
          path="/user"
          element={
            <ProtectedRouteComp roles={["ADMIN", "STAFF", "AUTHOR"]}>
              <UserPage />
            </ProtectedRouteComp>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
