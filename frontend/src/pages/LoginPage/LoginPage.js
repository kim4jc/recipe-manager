import { useState } from 'react';
import { Navigate } from 'react-router-dom';
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const BACKEND_PORT = process.env.BACKEND_PORT;

export default function LoginPage( { setHeaderUsername }){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState('');

    async function login(ev){
        ev.preventDefault();
        try{
            console.log("before fetch on login");
            const response = await fetch(`http://localhost:${BACKEND_PORT}/login`, {
                method: 'POST',
                headers:{
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
                credentials: 'include',
            });
            if(response.ok){
                const resData = await response.json();
                console.log("before setHeaderUsername on login");
                setHeaderUsername(resData.username);
                setRedirect(true);
            }
            else{
                alert("Incorrect username or password");
            }

        }
        catch(err){

        }
    }
    
    if (redirect){
        return <Navigate to={'/'} />
    }
    return(
        <form className="max-w-xl m-auto" onSubmit={login}>
            <h1 className="text-center">Login</h1>
            <input  type="text" className="w-full block py-1 px-1 border-2 border-gray-100 rounded bg-white mb-1"
                    placeholder="Enter Username" 
                    value={username} 
                    onChange={ev => {setUsername(ev.target.value)}}/>
            <input  type="password" className="w-full block py-1 px-1 border-2 border-gray-100 rounded bg-white mb-1"
                    placeholder="Enter Password"
                    value={password}
                    onChange={ev => {setPassword(ev.target.value)}}/>
            <button className="block mb-1 w-full py-1 px-2 border-2 rounded bg-gray-600 text-white">Login</button>
        </form>
    );
}