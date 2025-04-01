import { Link } from "react-router-dom";
import { useEffect } from "react";
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const BACKEND_PORT = process.env.BACKEND_PORT;


export default function Header( { headerUsername, setHeaderUsername }){

  useEffect(() => {
    try{
      //async function to receive jwt payload
      const resInfo = async () => {

        console.log("before fetch on profile");
        const response = await fetch(`http://localhost:${BACKEND_PORT}/profile`, {
        credentials: 'include',
        })

        const resData = await response.json();
        console.log(resData.user.username);
        //set username to username in jwt payload
        console.log("before setHeaderUsername on header.js");
        setHeaderUsername(resData.user.username);
      };
  

      //call async function
      resInfo();
    }
    catch(err){
      console.error(err);
    }
  }, [headerUsername]);

  async function logout(){
    await fetch(`http://localhost:${BACKEND_PORT}/logout`, {
      method: 'POST',
      credentials: 'include',
    })
    setHeaderUsername('');
  }

    return(
      <header className="flex justify-between mb-12">
        <Link to="/" className="font-bold">Recipe Manager</Link>
          <nav className="flex gap-4">
            {/*If username in jwt payload (logged in) display links to create, search, and logout*/}
            {headerUsername && (
              <>
              <Link to="/create">Create New Recipe</Link>
              <Link to="/search">Search</Link>
              <a onClick={logout}>Logout</a>
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