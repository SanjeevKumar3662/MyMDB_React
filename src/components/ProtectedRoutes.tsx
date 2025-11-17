import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { JSX } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!isAuthenticated) return <Navigate to="/auth" replace />;

  return children;
}
