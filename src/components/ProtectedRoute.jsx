import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, user, loading }) {
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-luxury-black"><div className="w-8 h-8 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" /></div>;
  if (!user) return <Navigate to="/" />;
  return children;
}

export default ProtectedRoute;
