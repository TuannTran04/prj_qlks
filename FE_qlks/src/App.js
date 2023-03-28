import logo from "./logo.svg";
import "./App.css";
import Header from "./components/layout/Header/Header";
import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import HomePage from "./pages/HomePage/HomePage";
import ProductPage from "./pages/ProductPage/Index";
import LoginPage from "./pages/LoginPage/Index";
import RegisterPage from "./pages/RegisterPage/Index";
import DetailPage from "./pages/DetailPage/Index";
import BookingPage from "./pages/BookingPage/Index";
import ImageUploader from "./features/TestUpload/TestUpload";
import AdminDashboard from "./admin/pages/AdminDashboard/AdminDashboard";
import AdminLogin from "./admin/pages/AdminLogin/AdminLogin";
import AdminRegister from "./admin/pages/AdminRegister/AdminRegister";
import AdminRoom from "./admin/pages/AdminRoom/AdminRoom";
import AdminBooking from "./admin/pages/AdminBooking/AdminBooking";
import AdminCustomer from "./admin/pages/AdminCustomer/AdminCustomer";

function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  const [isAdminLoggedIn, setAdminIsLoggedIn] = useState(
    JSON.parse(localStorage.getItem("is-Admin-LoggedIn") || false)
  );

  const handleAdminLogin = () => {
    setAdminIsLoggedIn(true);
    localStorage.setItem("is-Admin-LoggedIn", true);
  };

  const handleAdminLogout = () => {
    setAdminIsLoggedIn(false);
    localStorage.removeItem("is-Admin-LoggedIn");
  };

  return (
    <div className="App">
      <Routes>
        {/* Các route user */}
        <Route path="/" element={<HomePage />} />
        <Route path="/rooms" element={<ProductPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/detail/:name/:id" element={<DetailPage />} />
        <Route path="/booking" element={<BookingPage />} />

        {/* Các route admin */}
        <Route
          exact
          path="/admin/login"
          element={
            isAdminLoggedIn ? (
              <Navigate to="/admin" />
            ) : (
              <AdminLogin onLogin={handleAdminLogin} />
            )
          }
        />

        <Route
          exact
          path="/admin/register"
          element={
            isAdminLoggedIn ? <Navigate to="/admin" /> : <AdminRegister />
          }
        />

        <Route
          exact
          path="/admin"
          element={
            isAdminLoggedIn ? (
              <AdminDashboard onLogout={handleAdminLogout} />
            ) : (
              <Navigate to="/admin/login" />
            )
          }
        >
          <Route path="/admin/admin-room" element={<AdminRoom />} />
          <Route path="/admin/admin-booking" element={<AdminBooking />} />
          <Route path="/admin/admin-customer" element={<AdminCustomer />} />
        </Route>

        {/* DEFAULT ROUTE */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* <ImageUploader /> */}
    </div>
  );
}

export default App;
