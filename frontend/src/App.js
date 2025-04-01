import { Route, Routes } from "react-router-dom";
import Layout from './layout';
import LoginPage from "./pages/LoginPage/LoginPage.js";
import RegisterPage from "./pages/RegisterPage/RegisterPage.js";
import CreateRecipePage from "./pages/CreateRecipePage/CreateRecipePage.js";

import { useState } from "react";

function App() {
  const [headerUsername, setHeaderUsername] = useState('');

  return (
    <Routes>
      <Route path="/" element={<Layout headerUsername={headerUsername} setHeaderUsername={setHeaderUsername}/>}>
        <Route path={'/login'} element={<LoginPage setHeaderUsername={setHeaderUsername}/> }/>
        <Route path={'/register'} element={<RegisterPage />}/>
        <Route path={'/create'} element={<CreateRecipePage />}/>
      </Route>
    </Routes>
  );
}

export default App;
