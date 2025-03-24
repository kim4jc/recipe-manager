import './RegisterPage.css';

export default function RegisterPage(){
    return(
        <form className="register">
            <h1>Register</h1>
            <input type="text" placeholder="Enter Username"/>
            <input type="password" placeholder="Enter Password"/>
            <button>Register</button>
        </form>
    );
}