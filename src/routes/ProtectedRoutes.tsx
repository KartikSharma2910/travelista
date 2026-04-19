import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center py-10">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/signup" replace />;
  }

  return children;
};

export default ProtectedRoute;
