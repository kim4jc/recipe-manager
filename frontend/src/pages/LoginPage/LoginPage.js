import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import './LoginPage.css';

export default function LoginPage(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState('');

    async function login(ev){
        ev.preventDefault();
        try{
            const response = await fetch('http://localhost:4000/login', {
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
        <form className="login" onSubmit={login}>
            <h1>Login</h1>
            <input  type="text" 
                    placeholder="Enter Username" 
                    value={username} 
                    onChange={ev => {setUsername(ev.target.value)}}/>
            <input  type="password" 
                    placeholder="Enter Password"
                    value={password}
                    onChange={ev => {setPassword(ev.target.value)}}/>
            <button>Login</button>
        </form>
    );
}