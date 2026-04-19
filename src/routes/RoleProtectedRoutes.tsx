import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  allowedRoles: string[];
}

const RoleProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center py-10">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/signup" replace />;
  }

  if (!userRole) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleProtectedRoute;
