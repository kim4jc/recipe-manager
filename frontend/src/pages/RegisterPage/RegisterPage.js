import { useState } from "react";

const REACT_APP_BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;


export default function RegisterPage(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    async function register(ev){
        ev.preventDefault();
        try{
            const response = await fetch(`${REACT_APP_BACKEND_API_URL}/register`, {
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
            } else {
                alert('Registration failed');
            }
        }
        catch(e){
            console.log("Error: ", e);
        }
    }

    return(
        <form className="max-w-xl m-auto" onSubmit={register}>
            <h1 className="text-center">Register</h1>
            <input type="text" className="w-full block py-1 px-1 border-2 border-gray-100 rounded bg-white mb-1"
                    placeholder="Enter Username"
                    value={username}
                    onChange={ev => setUsername(ev.target.value)}/>
            <input type="password" className="w-full block py-1 px-1 border-2 border-gray-100 rounded bg-white mb-1"
                    placeholder="Enter Password"
                    value={password}
                    onChange={ev => setPassword(ev.target.value)}/>
            <button  className="block mb-1 w-full py-1 px-2 border-2 rounded bg-gray-600 text-white">Register</button>
        </form>
    );
}