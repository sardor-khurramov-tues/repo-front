import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PATHS, USER_ROLES } from "@/configs/constants";

import ProtectedRouteComp from "./ProtectedRouteComp";
import NavBarComp from "@/components/NavBarComp";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminDepartmentDashboard from "@/pages/AdminDepartmentDashboard";
import StaffDashboard from "@/pages/StaffDashboard";
import AuthorDashboard from "@/pages/AuthorDashboard";
import UserPage from "@/pages/UserPage";
import NotFound from "@/pages/NotFound";
import RegisterAthor from "@/pages/RegisterAthor";
import AdminUserDashboard from "@/pages/AdminUserDashboard";
import DocumentSubmissionPage from "@/pages/DocumentSubmissionPage";
import AuthorDocumentDetailPage from "@/pages/AuthorDocumentDetailPage";
import StaffDocumentView from "../pages/StaffDocumentView";

export default function RouterComp() {
  return (
    <BrowserRouter>
      <NavBarComp />
      <hr />
      <Routes>
        <Route path={PATHS.HOME} element={<Home />} />
        <Route path={PATHS.LOGIN} element={<Login />} />
        <Route path={PATHS.REGISTER_AUTHOR} element={<RegisterAthor />} />

        <Route
          path={PATHS.ADMIN}
          element={
            <ProtectedRouteComp roles={[USER_ROLES.ADMIN]}>
              <AdminDashboard />
            </ProtectedRouteComp>
          }
        />
        <Route
          path={PATHS.ADMIN + PATHS.DEPARTMENT}
          element={
            <ProtectedRouteComp roles={[USER_ROLES.ADMIN]}>
              <AdminDepartmentDashboard />
            </ProtectedRouteComp>
          }
        />
        <Route
          path={PATHS.ADMIN + PATHS.USER}
          element={
            <ProtectedRouteComp roles={[USER_ROLES.ADMIN]}>
              <AdminUserDashboard />
            </ProtectedRouteComp>
          }
        />
        <Route
          path={PATHS.STAFF}
          element={
            <ProtectedRouteComp roles={[USER_ROLES.STAFF]}>
              <StaffDashboard />
            </ProtectedRouteComp>
          }
        />
        <Route
          path={PATHS.STAFF + PATHS.DOCUMENT + PATHS.ID_PATH_VARIABLE}
          element={
            <ProtectedRouteComp roles={[USER_ROLES.STAFF]}>
              <StaffDocumentView />
            </ProtectedRouteComp>
          }
        />
        <Route
          path={PATHS.AUTHOR}
          element={
            <ProtectedRouteComp roles={[USER_ROLES.AUTHOR]}>
              <AuthorDashboard />
            </ProtectedRouteComp>
          }
        />
        <Route
          path={PATHS.AUTHOR + PATHS.DOCUMENT + PATHS.SUBMISSION}
          element={
            <ProtectedRouteComp roles={[USER_ROLES.AUTHOR]}>
              <DocumentSubmissionPage />
            </ProtectedRouteComp>
          }
        />
        <Route
          path={PATHS.AUTHOR + PATHS.DOCUMENT + PATHS.ID_PATH_VARIABLE}
          element={
            <ProtectedRouteComp roles={[USER_ROLES.AUTHOR]}>
              <AuthorDocumentDetailPage />
            </ProtectedRouteComp>
          }
        />
        <Route
          path={PATHS.USER}
          element={
            <ProtectedRouteComp roles={[USER_ROLES.ADMIN, USER_ROLES.STAFF, USER_ROLES.AUTHOR]}>
              <UserPage />
            </ProtectedRouteComp>
          }
        />

        <Route path={PATHS.ALL} element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
