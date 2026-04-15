import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

const RoleRoute = ({ role, children }) => {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      {user?.role === role ? (
        children
      ) : (
        <Navigate to="/" replace />
      )}
    </ProtectedRoute>
  );
};

export default RoleRoute;
