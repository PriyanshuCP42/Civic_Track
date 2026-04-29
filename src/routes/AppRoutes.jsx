import { lazy, Suspense, useMemo } from "react";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import { useAuth } from "../context/useAuth";
import { ROLES } from "../data/roleConstants";
import RoleRoute from "./RoleRoute";

const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));
const CitizenDashboard = lazy(() => import("../pages/citizen/CitizenDashboard"));
const NewComplaintPage = lazy(() => import("../pages/citizen/NewComplaintPage"));
const ComplaintDetailPage = lazy(() => import("../pages/citizen/ComplaintDetailPage"));
const MyComplaintsPage = lazy(() => import("../pages/citizen/MyComplaintsPage"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const AllComplaintsPage = lazy(() => import("../pages/admin/AllComplaintsPage"));
const EmployeeManagementPage = lazy(
  () => import("../pages/admin/EmployeeManagementPage"),
);
const AdminMetricsPage = lazy(() => import("../pages/admin/AdminMetricsPage"));
const EmployeeDashboard = lazy(() => import("../pages/employee/EmployeeDashboard"));
const AssignedComplaintsPage = lazy(
  () => import("../pages/employee/AssignedComplaintsPage"),
);
const ProfilePage = lazy(() => import("../pages/shared/ProfilePage"));

/**
 * Redirect root path according to authenticated role.
 * @returns {JSX.Element}
 */
function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-slate-500">Loading session...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={`/${user.role}`} replace />;
}

/**
 * Application route tree.
 * @returns {JSX.Element}
 */
export default function AppRoutes() {
  const callbackElement = useMemo(
    () => (
      <AuthenticateWithRedirectCallback
        signInFallbackRedirectUrl="/"
        signUpFallbackRedirectUrl="/citizen"
      />
    ),
    [],
  );

  return (
    <Suspense fallback={<div className="p-8 text-slate-500">Loading session...</div>}>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/sso-callback" element={callbackElement} />

        <Route
          path="/citizen"
          element={
            <RoleRoute role={ROLES.CITIZEN}>
              <AppLayout />
            </RoleRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<CitizenDashboard />} />
          <Route path="complaints" element={<MyComplaintsPage />} />
          <Route path="complaints/new" element={<NewComplaintPage />} />
          <Route path="complaints/:id" element={<ComplaintDetailPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route
          path="/admin"
          element={
            <RoleRoute role={ROLES.ADMIN}>
              <AppLayout />
            </RoleRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="complaints" element={<AllComplaintsPage />} />
          <Route path="employees" element={<EmployeeManagementPage />} />
          <Route path="metrics" element={<AdminMetricsPage />} />
          <Route path="complaints/:id" element={<ComplaintDetailPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route
          path="/employee"
          element={
            <RoleRoute role={ROLES.EMPLOYEE}>
              <AppLayout />
            </RoleRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<EmployeeDashboard />} />
          <Route path="tasks" element={<AssignedComplaintsPage />} />
          <Route path="tasks/:id" element={<ComplaintDetailPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
