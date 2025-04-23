import { Link } from "react-router-dom";
import { useEffect, useContext } from "react";
import UserContext from "./UserContext.js";

const REACT_APP_BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL || "";

export default function Header(){

  const {headerUsername, setHeaderUsername} = useContext(UserContext);

  useEffect(() => {
      //async function to receive jwt payload
      const resInfo = async () => {
        try{
          const response = await fetch(`${REACT_APP_BACKEND_API_URL}/api/profile`, {
          credentials: 'include',
          });

          const resData = await response.json();
          console.log(resData, "from profile");
          //set username to username in jwt payload
          setHeaderUsername(resData?.user?.username);
        }
        catch(err){
          console.error("Error fetching profile:", err);
        }
    };
    resInfo();
  }, []);

  async function logout(){
    await fetch(`${REACT_APP_BACKEND_API_URL}/api/logout`, {
      method: 'POST',
      credentials: 'include',
    })
    setHeaderUsername('');
  }

    return(
      <header className="flex justify-between mb-5">
        <Link to="/" className="font-bold">Recipe Manager</Link>
          <nav className="flex gap-4">
            {/*If username in jwt payload (logged in) display links to create, search, and logout*/}
            {headerUsername && (
              <>
              <Link to="/create">Create New Recipe</Link>
              <Link to="/search">Search</Link>
              <button onClick={logout}>Logout</button>
              </>
            )}
            {/*If !username in jwt payload (not logged in) display links to login and register*/}
            {!headerUsername && (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
          </nav>
      </header>
    );
}