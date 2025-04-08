import { Route, Routes } from "react-router-dom";
import Layout from './layout';
import LoginPage from "./pages/LoginPage/LoginPage.js";
import RegisterPage from "./pages/RegisterPage/RegisterPage.js";
import CreateRecipePage from "./pages/CreateRecipePage/CreateRecipePage.js";
import UserContext from "./UserContext.js";
import { useState } from "react";

function App() {
  const [headerUsername, setHeaderUsername] = useState('');
  const [redirect, setRedirect] = useState(false);
  return (
    <UserContext.Provider value={{ headerUsername, setHeaderUsername, redirect, setRedirect }}>
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route path={'/login'} element={<LoginPage/> }/>
        <Route path={'/register'} element={<RegisterPage />}/>
        <Route path={'/create'} element={<CreateRecipePage />}/>
      </Route>
    </Routes>
    </UserContext.Provider>
  );
}

export default App;
