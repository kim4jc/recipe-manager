import './RegisterPage.css';
import { useState } from "react";

export default function RegisterPage(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    async function register(ev){
        ev.preventDefault();
        try{
            const response = await fetch('http://localhost:4000/register', {
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
        <form className="register" onSubmit={register}>
            <h1>Register</h1>
            <input type="text"
                    placeholder="Enter Username"
                    value={username}
                    onChange={ev => setUsername(ev.target.value)}/>
            <input type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={ev => setPassword(ev.target.value)}/>
            <button>Register</button>
        </form>
    );
}