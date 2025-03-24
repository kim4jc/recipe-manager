import './App.css';
import { Route, Routes } from "react-router-dom";
import Layout from './layout';
import LoginPage from "./pages/LoginPage/LoginPage.js";
import RegisterPage from "./pages/RegisterPage/RegisterPage.js";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path={'/login'} element={<LoginPage />}/>
        <Route path={'/register'} element={<RegisterPage />}/>
      </Route>
    </Routes>
  );
}

export default App;
