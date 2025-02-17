import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store"; 
import { JSX } from "react";

const RedirectIfLoggedIn = ({ children }: { children: JSX.Element }) => {
  const { token } = useSelector((state: RootState) => state.auth);

  if (token) {
    return <Navigate to="/profile" />;
  }

  return children; 
};

export default RedirectIfLoggedIn;
