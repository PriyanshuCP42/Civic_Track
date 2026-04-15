import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import RoleRoute from "./routes/RoleRoute";
import AppLayout from "./components/layout/AppLayout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import NewComplaintPage from "./pages/citizen/NewComplaintPage";
import ComplaintDetailPage from "./pages/citizen/ComplaintDetailPage";
import MyComplaintsPage from "./pages/citizen/MyComplaintsPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AllComplaintsPage from "./pages/admin/AllComplaintsPage";
import EmployeeManagementPage from "./pages/admin/EmployeeManagementPage";
import AdminMetricsPage from "./pages/admin/AdminMetricsPage";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import AssignedComplaintsPage from "./pages/employee/AssignedComplaintsPage";
import ProfilePage from "./pages/shared/ProfilePage";

const HomeRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-slate-500">Loading session...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={`/${user.role}`} replace />;
};

const App = () => (
  <Routes>
    <Route path="/" element={<HomeRedirect />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback signInFallbackRedirectUrl="/" signUpFallbackRedirectUrl="/citizen" />} />

    <Route path="/citizen" element={<RoleRoute role="citizen"><AppLayout /></RoleRoute>}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<CitizenDashboard />} />
      <Route path="complaints" element={<MyComplaintsPage />} />
      <Route path="complaints/new" element={<NewComplaintPage />} />
      <Route path="complaints/:id" element={<ComplaintDetailPage />} />
      <Route path="profile" element={<ProfilePage />} />
    </Route>

    <Route path="/admin" element={<RoleRoute role="admin"><AppLayout /></RoleRoute>}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="complaints" element={<AllComplaintsPage />} />
      <Route path="employees" element={<EmployeeManagementPage />} />
      <Route path="metrics" element={<AdminMetricsPage />} />
      <Route path="complaints/:id" element={<ComplaintDetailPage />} />
      <Route path="profile" element={<ProfilePage />} />
    </Route>

    <Route path="/employee" element={<RoleRoute role="employee"><AppLayout /></RoleRoute>}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<EmployeeDashboard />} />
      <Route path="tasks" element={<AssignedComplaintsPage />} />
      <Route path="tasks/:id" element={<ComplaintDetailPage />} />
      <Route path="profile" element={<ProfilePage />} />
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
