import './LoginPage.css';

export default function LoginPage(){
    return(
        <form className="login">
            <h1>Login</h1>
            <input type="text" placeholder="Enter Username"/>
            <input type="password" placeholder="Enter Password"/>
            <button>Login</button>
        </form>
    );
}