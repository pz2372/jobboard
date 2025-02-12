import React from 'react';
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const ProtectedRoute = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);

  if (!token) {
    return <Navigate to="/login" />;
  } 

  return <Outlet />; // This will render child routes inside ProtectedRoute
};

export default ProtectedRoute;
