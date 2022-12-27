import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import "./App.css";

import UsersList from "./components/users/UsersList";
import Home from "./components/common/Home";
import Register from "./components/common/Register";
import Login from "./components/common/Login";
import Statistics from "./components/common/Statistics";
import Wallet from "./components/common/wallet";
import BuyerDashboard from "./components/common/BuyerDashBoard";
import VendorDashboard from "./components/common/VendorDashBoard";
import Favourites from "./components/common/Favourites";
import BuyersOrders from "./components/common/BuyersOrders";
import VendorsOrders from "./components/common/VendorsOrders";
import Navbar from "./components/templates/Navbar";
import Profile from "./components/users/Profile";

const Layout = () => {
  return (
    <div>
      <Navbar />
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="users" element={<UsersList />} />
          <Route path="register" element={<Register />} />
          <Route path="BuyerDashboard" element={<BuyerDashboard />} />
          <Route path="VendorDashboard" element={<VendorDashboard />} />
          <Route path="Favourites" element={<Favourites />} />
          <Route path="BuyersOrders" element={<BuyersOrders/>} />
          <Route path="VendorsOrders" element={<VendorsOrders/>} />
          <Route path="login" element={<Login />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="profile" element={<Profile />} />
          <Route path="statistics" element={<Statistics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
