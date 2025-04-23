import { useState, useContext } from "react";
import { Navigate } from 'react-router-dom';
import UserContext from '../../UserContext.js';


const REACT_APP_BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL || "";


export default function RegisterPage(){
    const {redirect, setRedirect } = useContext(UserContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    async function register(ev){
        ev.preventDefault();
        try{
            const response = await fetch(`${REACT_APP_BACKEND_API_URL}/api/register`, {
                method: 'POST',
                headers:{
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                })
            });
            if (response.ok) {
                alert('Registration successful!');
                setRedirect(true);
            } else {
                alert('Registration failed');
            }
        }
        catch(e){
            console.log("Error: ", e);
        }
    }

    if (redirect){
        setRedirect(false);
        return <Navigate to={'/login'} />
    }
    return(
        <div className='h-screen w-full flex'>
        <form className="max-w-xl w-full border-2 bg-gray-300 rounded p-4 m-auto mt-[12%]" onSubmit={register}>
            <h1 className="text-center mb-2">Register</h1>
            <input className="w-full block py-1 px-1 border-2 border-gray-100 rounded bg-white mb-1"
                type="text" 
                placeholder="Enter Username"
                value={username}
                onChange={ev => setUsername(ev.target.value)}/>
            <input className="w-full block py-1 px-1 border-2 border-gray-100 rounded bg-white mb-1"
                type="password" 
                placeholder="Enter Password"
                value={password}
                onChange={ev => setPassword(ev.target.value)}/>
            <button className="block mb-1 w-full py-1 px-2 border-2 rounded bg-gray-600 text-white"
                type="submit">
                Register
            </button>
        </form>
        </div>
    );
}