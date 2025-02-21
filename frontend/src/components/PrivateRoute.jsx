import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const auth = useSelector((state) => state.auth);

  if (!auth.token) {
    return <Navigate to="/sign-in" />;
  }

  return children;
};

export default ProtectedRoute;
