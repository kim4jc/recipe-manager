import { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../../UserContext.js';

const REACT_APP_BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;

export default function LoginPage(){
    const {setHeaderUsername} = useContext(UserContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState('');

    async function login(ev){
        ev.preventDefault();
        try{
            const response = await fetch(`${REACT_APP_BACKEND_API_URL}/login`, {
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
                console.log(resData);
                setHeaderUsername(resData.user.username);
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