import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import Overview from "./pages/Overview";
import ApiKey from "./pages/ApiKey";
import AccountSettings from "./pages/AccountSetting";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/dashboard" element={<DashboardPage />}>
          <Route index element={<Navigate to="overview" />} /> 
          <Route path="overview" element={<Overview />} />
          <Route path="apikeylist" element={<ApiKey />} />
          <Route path="account" element={<AccountSettings />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;